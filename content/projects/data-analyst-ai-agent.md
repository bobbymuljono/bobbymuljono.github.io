---
title: "AI did half a day of my analyst work in 3 minutes"
description: "The data analyst role is changing fast. Three tools, one I built and two that beat it, and what I learned about staying useful."
kind: "AI Analytics"
date: 2026-07-09
techStack: ["RAG", "LangChain", "Automated Analytics", "Presto SQL"]
featured: true
status: "live"
draft: false
---

<style>
.arch { margin: var(--space-6) 0; font-family: var(--font-body); }
.arch__flow { display: flex; flex-direction: column; align-items: center; gap: var(--space-2); }
.arch__node {
  width: fit-content; max-width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  text-align: center;
}
.arch__node--accent { border-color: var(--color-accent); background: var(--color-surface-accent); }
.arch__node--store { background: var(--color-surface-sunk); }
.arch__title { font-weight: var(--weight-semibold); color: var(--color-text); line-height: var(--leading-snug); }
.arch__sub { color: var(--color-text-muted); font-size: var(--text-sm); margin-top: 2px; }
.arch__tag {
  display: inline-block; margin-top: var(--space-2);
  font-family: var(--font-mono); font-size: var(--text-xs);
  color: var(--color-accent-deep); background: var(--color-bg);
  border: 1px solid var(--color-border); border-radius: var(--radius-sm);
  padding: 2px 7px;
}
.arch__arrow { color: var(--color-accent); font-size: 1.25rem; line-height: 1; }
.arch__note { color: var(--color-text-muted); font-size: var(--text-xs); font-style: italic; font-family: var(--font-label); text-align: center; }
.arch__row { display: flex; flex-wrap: wrap; gap: var(--space-2); justify-content: center; align-items: stretch; }
.arch__group {
  border: 1px solid var(--color-border); border-radius: var(--radius-md);
  padding: var(--space-4); background: color-mix(in oklab, var(--color-surface) 55%, transparent);
}
.arch__grouplabel {
  display: block; text-align: center; margin-bottom: var(--space-3);
  font-family: var(--font-label); font-style: italic; color: var(--color-accent); font-size: var(--text-sm);
}
.arch__cross {
  text-align: center; margin-top: var(--space-3); padding: var(--space-2) var(--space-3);
  font-family: var(--font-label); font-style: italic; font-size: var(--text-sm); color: var(--color-accent-deep);
}
.arch figcaption {
  margin-top: var(--space-3); text-align: center;
  font-family: var(--font-label); font-style: italic; font-size: var(--text-sm); color: var(--color-text-muted);
}
@media (max-width: 560px) { .arch__node { width: 100%; } }
</style>

A few weeks ago I pasted a stakeholder's question into a powerful internal data analytics
agent and watched it hand back a full report in under three minutes. Writing that SQL and
Python by hand would have cost me half a day. I felt two things at once: how good this is, and
a small cold drop of *what does this mean for me?*

I've done this job for years, and I've come to believe it's changing faster than most of us
want to admit. The analysts who learn to work with these tools are about to pull well ahead of
the ones who don't. That belief is why I'm writing this. What follows is the honest version
from the inside: three tools, one I built, two that beat it, and what I learned about staying
useful while the work gets automated out from under me.

## The bottleneck was never SQL

Start with what the job actually was, because it isn't what people picture. The hard part was
never writing SQL. In a warehouse with thousands of tables, the hard part is knowing which one
truly answers the question, then trusting it once you've found it. Every request runs the same
quiet gauntlet: hunt down a candidate table, validate it for nulls and duplicates, sanity-check
that the values even make sense (you expect an order count near a thousand, you sum the column,
you get ten thousand, and now you have a mystery on your hands), and only then write the query
with the right filters and join keys and build a pivot to see whether the numbers follow the
business story. A pull I knew well took minutes. One where I didn't know the table could eat
the better part of a day.

## Five steps, and AI is coming for four

Every ad-hoc data request runs through the same five steps. Only the first is truly human:
turning a vague business ask into the real question, often from a stakeholder who can't quite
tell you which number they need. The other four are pattern work, and pattern work is exactly
what these tools have gotten good at. Four of the five steps are already automatable. Step one
holds, for now, and only until the context in people's heads gets written down.

<figure class="arch">
<div class="arch__flow">
<div class="arch__node arch__node--accent"><div class="arch__title">1 · Understand the business need</div><div class="arch__sub">turn a vague ask into the real question</div><span class="arch__tag">human edge</span></div>
<div class="arch__note">the rest is pattern work ↓</div>
<div class="arch__group">
<span class="arch__grouplabel">what AI is now good at</span>
<div class="arch__flow">
<div class="arch__node"><div class="arch__title">2 · Find the table</div><div class="arch__sub">the right source among thousands</div></div>
<div class="arch__arrow">↓</div>
<div class="arch__node"><div class="arch__title">3 · Validate it</div><div class="arch__sub">nulls, dupes, does the column mean what you think</div></div>
<div class="arch__arrow">↓</div>
<div class="arch__node"><div class="arch__title">4 · Write the SQL</div><div class="arch__sub">filters, join keys, the query itself</div></div>
<div class="arch__arrow">↓</div>
<div class="arch__node"><div class="arch__title">5 · Package it</div><div class="arch__sub">charts, pivots, then a first-pass insight</div></div>
</div>
</div>
</div>
<figcaption>An ad-hoc data request, start to finish. Only step 1 is safe from AI, for now.</figcaption>
</figure>

## Boko: a bot that knew where things were

I started small. I built a lightweight assistant (I'll call it Boko) into our internal
chat app, on an internal low-code AI-builder (think Coze). It followed a LangChain
supervisor-subagent pattern: a cheap router model greeted you and handed off to a per-function
sub-agent (Customer Service, Return & Refunds, Seller Operations), and each sub-agent answered
only from its own function's documentation, retrieved from an enterprise vector database. Little
code; a lot of documentation.

The answering sub-agents ran on Claude Haiku, which made Boko cheap, light, and fast. It also
set the ceiling. Boko was great at "what does *user contact* actually mean?" or "what's the
calculation logic behind this OKR?" Those are the logic and discovery questions that used to
land in my DMs. It could even draft SQL for people to run themselves, though on a small model
that came with a real hallucination rate, so I never let it pretend to be authoritative on
queries it couldn't check.

It worked better than I expected. To date Boko has answered 400+ questions from 60+ people, and
at its peak it was clearing around a hundred a month. The reach was deliberately narrow (you
needed to be at least SQL-curious to get value), but it did something I didn't plan for: it made
the team better at documentation, because now the docs had a job. Other functions started handing
me their knowledge bases to onboard too.

<figure class="arch">
<div class="arch__flow">
<div class="arch__node"><div class="arch__title">User</div><div class="arch__sub">asks in the internal chat app</div></div>
<div class="arch__arrow">↓</div>
<div class="arch__node arch__node--accent"><div class="arch__title">Supervisor</div><div class="arch__sub">greets · routes · hands off</div><span class="arch__tag">GPT-mini</span></div>
<div class="arch__note">routes to the right business function ↓</div>
<div class="arch__row">
<div class="arch__node"><div class="arch__title">Customer Service</div><div class="arch__sub">sub-agent</div><span class="arch__tag">Claude Haiku</span></div>
<div class="arch__node"><div class="arch__title">Return &amp; Refunds</div><div class="arch__sub">sub-agent</div><span class="arch__tag">Claude Haiku</span></div>
<div class="arch__node"><div class="arch__title">Seller Operations</div><div class="arch__sub">sub-agent</div><span class="arch__tag">Claude Haiku</span></div>
<div class="arch__node"><div class="arch__title">…</div><div class="arch__sub">more functions</div></div>
</div>
<div class="arch__note">each sub-agent retrieves only from its own function's docs ↓</div>
<div class="arch__node arch__node--store"><div class="arch__title">Enterprise vector DB</div><div class="arch__sub">per-function documentation (knowledge base)</div></div>
<div class="arch__arrow">↓</div>
<div class="arch__node"><div class="arch__title">Grounded answer in chat</div></div>
</div>
<figcaption>Boko: a LangChain supervisor routing to per-function RAG sub-agents.</figcaption>
</figure>

## Then two better tools beat it, and I was glad

Around April 2026 our data infrastructure team shipped two tools that, frankly, ran circles around
Boko. Both used frontier models far better at tool-calling than Haiku, and both did the thing Boko
never safely could: run the query.

The first (call it Astro) let you upload the tables you already knew, then wrote and executed SQL
on the spot, generated charts, and explained the results in plain language. Watching it turn an
upload into a chart in seconds was the first time I really felt the ground move. Its catch was
structure: everything was siloed by topic, so a question spanning one person's tables and another's
meant standing up a whole new topic. Fine for a glimpse of the future; not how analytics actually
works day to day.

<figure class="arch">
<div class="arch__note">you upload tables you can already access into a topic ↓</div>
<div class="arch__row">
<div class="arch__group">
<span class="arch__grouplabel">Topic 1</span>
<div class="arch__flow">
<div class="arch__node"><div class="arch__title">Tables X · Y · Z</div><div class="arch__sub">+ business glossary &amp; rules</div></div>
<div class="arch__arrow">↓</div>
<div class="arch__node arch__node--accent"><div class="arch__title">Astro</div><div class="arch__sub">writes &amp; runs SQL · built-in charts</div><span class="arch__tag">frontier model</span></div>
<div class="arch__arrow">↓</div>
<div class="arch__node"><div class="arch__title">Chart + plain-language insight</div></div>
</div>
</div>
<div class="arch__group">
<span class="arch__grouplabel">Topic 2</span>
<div class="arch__flow">
<div class="arch__node"><div class="arch__title">Tables E · F · G</div><div class="arch__sub">+ its own glossary &amp; rules</div></div>
<div class="arch__arrow">↓</div>
<div class="arch__node"><div class="arch__title">the same loop</div><div class="arch__sub">in its own silo</div></div>
</div>
</div>
</div>
<div class="arch__cross">a question needing table X and table E can't cross topics, so you'd stand up a third</div>
<figcaption>Astro: fast inside a topic, but each topic's tables stay siloed.</figcaption>
</figure>

The second (Clyde) was copilot-style, like Cursor or Claude Code for the warehouse: you could
extend it with rules, skills, and MCP connectors. It explored the warehouse, recommended the right
table, and wrote and ran the query. It was Boko's job done properly. I could have felt precious
about being out-built. I didn't. I'd wanted a tool that could *execute* since the day I started
Boko. Its retirement was inevitable, and I was glad to see it come.

## What I actually built into Clyde

Here's the part that matters: Clyde was only as good as what you gave it, and for my users, what
it got was mine. I solo-built the skills and connectors that made it an expert on our data.

Four skills, each encoding a piece of that gauntlet from the top. One reads our documented table
catalogue *before* writing any SQL, so Clyde picks from vetted definitions instead of guessing. One
is a memory bank that records confirmed resolutions and reuses them, so a question solved once stays
solved. One renders our house-styled charts in matplotlib, collapsing what used to be a full day of
building a report by hand. And one makes Clyde interrogate the request before answering. That's the
oldest analyst instinct there is: make sure you understand the business question first. Two MCP
connectors let it read external context on demand: our shared spreadsheets and internal wiki pages.
I stopped writing most of my own SQL.

<figure class="arch">
<div class="arch__flow">
<div class="arch__node"><div class="arch__title">User</div><div class="arch__sub">asks in natural language</div></div>
<div class="arch__arrow">↓</div>
<div class="arch__group">
<span class="arch__grouplabel">what I built: skills fire on demand, auto or manual</span>
<div class="arch__row">
<div class="arch__node"><div class="arch__title">Clarify first</div><div class="arch__sub">pin down the real question</div></div>
<div class="arch__node"><div class="arch__title">Query support</div><div class="arch__sub">the right tables, filters, join keys</div></div>
<div class="arch__node"><div class="arch__title">Memory bank</div><div class="arch__sub">reuse solved questions (I curate)</div></div>
<div class="arch__node"><div class="arch__title">Charts</div><div class="arch__sub">matplotlib, house style</div></div>
</div>
<div class="arch__row">
<span class="arch__tag">Rules · grill-me on · get_xx CTEs · lowercase · t1…tn</span>
<span class="arch__tag">MCP · spreadsheets · internal wiki</span>
</div>
</div>
<div class="arch__note">my skills, rules &amp; connectors steer the copilot ↓</div>
<div class="arch__node arch__node--accent"><div class="arch__title">Clyde: the platform's copilot</div><div class="arch__sub">explores the warehouse · recommends the table · writes &amp; runs SQL</div><span class="arch__tag">frontier model · built by data infra</span></div>
<div class="arch__arrow">↓</div>
<div class="arch__node arch__node--store"><div class="arch__title">Data warehouse</div><div class="arch__sub">native access · real table discovery, no uploads</div></div>
<div class="arch__arrow">↓</div>
<div class="arch__node"><div class="arch__title">Answer + chart</div><div class="arch__sub">confirmed solutions saved back to the memory bank</div></div>
</div>
<figcaption>Clyde: the platform's copilot, made an expert by the skills, rules, and connectors I gave it.</figcaption>
</figure>

Notice what carried across all three tools. The models changed completely: a small one, then two
frontier ones. What stayed, and what made each one useful, was the documented knowledge and the
workflow I'd captured. The moat was never the bot. It was the structure.

## The hard part was people

The technology was the easy half. The hard half was getting people to use it, especially the less
technical folks and the old hands, who'd still rather DM me than ask a bot. I never fought it. I
answer them, and I answer by sending back the Clyde conversation link that already solved it, so
they get their number *and* they see, in one move, that the tool exists and does this well.

So is the data analyst finished? I don't think so, but the job is not the one I trained for. The
pull-the-numbers labour is going to AI, and it should. What survives is the analytical structure a
good analyst brings: knowing which table to trust, what to validate, how a metric is really
defined. That structure is exactly what these tools need to be any good, and it is portable
straight into them. The people who thrive will be the ones who stop guarding that structure and
start pouring it into the tools. I spent years being the person who knew where things were. Now I
spend it teaching the tools where to look, and honestly, that's a better job.
