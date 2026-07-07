---
title: "Support RAG chatbot"
description: "A retrieval-augmented assistant over 40k help articles that cut first-response time 40% across 8 markets."
kind: "AI agent · case study"
date: 2026-05-20
techStack: ["RAG", "Python", "LangChain"]
featured: true
status: "live"
draft: false
---

## Problem

Support agents across 8 markets were answering the same questions by hand, digging
through a help centre of ~40k articles that had grown faster than anyone could keep
organised. First-response time was the metric everyone watched and no one could move —
the bottleneck wasn't effort, it was finding the right article quickly in the right
language.

## Approach

I built a retrieval-augmented assistant that sits beside the agent: it takes the
customer's question, retrieves the most relevant help content, and drafts a grounded
reply the agent can send or edit. Retrieval is the front half — embeddings over the
article corpus with a reranking pass — and a tight generation prompt does the rest,
always citing the source article so agents can verify before sending.

## Technical decisions

The biggest lever was **eval, not retrieval**. Standing up a vector search was a day;
building a trustworthy eval loop — a labelled set of real questions, a rubric for
"grounded and correct," and a regression check on every prompt change — was the work
that actually moved the number. I kept a human in the loop by design: the model drafts,
the agent approves. That made the rollout safe to ship market-by-market instead of all
at once.

## What I learned

Retrieval is the easy part; the eval loop is where the real wins live. Shipping to 8
markets also forced a discipline I now reach for everywhere — never trust an aggregate
metric until you've seen it hold per-market, because a 40% average can hide a market
where it made things worse.
