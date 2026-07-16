-- Schema for the "Bobby AI" persona chatbot.
-- Run this once in the Supabase SQL Editor (SQL Editor -> New query -> paste -> Run).
-- Safe to re-run: everything uses "if not exists" / "or replace".
--
-- Embedding size 768 matches Gemini's text-embedding-004 default output.
-- All access is server-side via the service_role key (which bypasses RLS),
-- so the tables stay locked to the public anon key.

-- 1. pgvector extension (vector similarity search)
create extension if not exists vector;

-- 2. Knowledge base: chunks of bio / projects / resume / persona, each with an embedding
create table if not exists documents (
  id          bigint generated always as identity primary key,
  content     text not null,
  metadata    jsonb not null default '{}'::jsonb,
  embedding   vector(768),
  created_at  timestamptz not null default now()
);

-- Approximate-nearest-neighbour index for cosine distance
create index if not exists documents_embedding_idx
  on documents using hnsw (embedding vector_cosine_ops);

-- 3. Conversation log: session-only memory + analytics
--    country:     ISO country code from Vercel's geo header (null under local dev).
--    device_hash: one-way HMAC hash of the client device id (raw id is never stored).
create table if not exists conversations (
  id             bigint generated always as identity primary key,
  created_at     timestamptz not null default now(),
  session_id     text,
  question       text not null,
  answer         text,
  input_tokens   int,
  output_tokens  int,
  model          text,
  country        text,
  device_hash    text,
  flagged        boolean not null default false
);

-- If the table predates the country/device_hash columns, add them in place:
alter table conversations add column if not exists country     text;
alter table conversations add column if not exists device_hash text;

create index if not exists conversations_session_idx
  on conversations (session_id, created_at desc);

-- 4. Lock both tables. service_role bypasses RLS, so the server still has full access;
--    the public anon key gets nothing (no policies are defined).
alter table documents      enable row level security;
alter table conversations  enable row level security;

-- 5. Similarity search RPC. Returns the top matches above a cosine-similarity threshold.
create or replace function match_documents (
  query_embedding  vector(768),
  match_count      int default 5,
  match_threshold  float default 0.3
)
returns table (
  id          bigint,
  content     text,
  metadata    jsonb,
  similarity  float
)
language sql stable
as $$
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where documents.embedding is not null
    and 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
$$;

-- 6. Grants for the backend secret key (maps to the service_role role).
--    Required because "Automatically expose new tables" was disabled at project
--    creation, so new tables get NO privileges by default. We grant only to
--    service_role; anon/authenticated get nothing, so the tables stay locked to the public.
grant usage on schema public to service_role;
grant select, insert, update, delete on public.documents      to service_role;
grant select, insert, update, delete on public.conversations  to service_role;
grant usage, select on all sequences in schema public         to service_role;
grant execute on all functions in schema public               to service_role;
