---
title: "One-click magic: a multi-agent item recommendation copilot for chat support"
description: "Ops wanted to hard-code product suggestions. I pitched an AI that reads the buyer's question instead, and built the PoC in under three weeks."
kind: "AI agents · PoC"
date: 2026-07-14
techStack: ["Multi-agent orchestration", "LLM intent routing", "Prompt engineering"]
featured: false
status: "live"
draft: false
---

Shop chat is the one place in the marketplace where a buyer, standing in a shop and looking at an item, asks a question before they buy. That makes it the rare support surface that can actually drive presales revenue, and ops wanted more out of it. Their first plan was to hard-code it: peg every item to one fixed upsell item (higher-priced item) and one fixed substitute-sell, by hand. For a catalog that size it did not scale, and it ignored the one thing that decides whether a suggestion lands, which is what the buyer just asked.

I pitched the alternative: let an AI read the actual question and decide. I showed them a working feasibility demo on our internal low-code AI-builder (think Coze), they bought in, and I went straight to building it with a PM. What we shipped was a small panel inside the agent's chat window. The agent reads the buyer's chat, and if they think the AI can help, they press a sell button. Within 20 to 30 seconds the panel fills in up to three suggestions, each a product card with a short reply written in the buyer's language. The agent scans them, presses send on the one that fits, and the card drops straight into the chat.

## Intent is the whole game

The system does not recommend a product to everyone. Pressing the sell button feeds the buyer's transcript to a supervisor agent whose only job is to read intent and route, and almost all of the usefulness lives in getting that routing right.

There are four real cases and one honest non-answer:

- **Same item.** The buyer wants to know something about the product in front of them ("is there a warranty for this?"). This routes to an agent that reads the item's own description and writes a contextual answer. No recommendation, just a good reply.
- **Upsell.** They are circling a better version of the same thing. For an iPhone 16, it surfaces the iPhone 17 as the higher-value step up.
- **Cross-sell.** They ask for something that completes the purchase ("do you have a charging brick for this?"), and it suggests up to three complementary items with a short reason for each.
- **Substitute sell.** They are looking at one option, but a close alternative at a similar price might suit them better. Looking at a $1,000 fridge with a top freezer, it can surface a $1,000 fridge with a bottom freezer: same budget, different form.
- **Unclear.** If it cannot tell what the buyer wants, it tells the agent no recommendation was found and gets out of the way.

That last case mattered more than it looks. The easy version of this tool recommends *something* every time, and agents quickly learn to ignore it. Returning nothing on a weak signal is what kept the panel worth glancing at.

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
.arch__split { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; column-gap: var(--space-2); width: 100%; }
.arch__split > .arch__node { grid-column: 2; }
.arch__exit { grid-column: 3; display: flex; align-items: center; gap: var(--space-2); justify-self: start; }
.arch__exitnote { color: var(--color-text-muted); font-size: var(--text-xs); font-style: italic; font-family: var(--font-label); text-align: left; max-width: 150px; }
.arch__row { display: flex; flex-wrap: wrap; gap: var(--space-2); justify-content: center; align-items: stretch; }
.arch__group {
  border: 1px solid var(--color-border); border-radius: var(--radius-md);
  padding: var(--space-4); background: color-mix(in oklab, var(--color-surface) 55%, transparent);
}
.arch__row > .arch__group { flex: 1 1 220px; min-width: 0; }
.arch__row > .arch__group .arch__node { width: 100%; }
.arch__grouplabel {
  display: block; text-align: center; margin-bottom: var(--space-3);
  font-family: var(--font-label); font-style: italic; color: var(--color-accent); font-size: var(--text-sm);
}
.arch figcaption {
  margin-top: var(--space-3); text-align: center;
  font-family: var(--font-label); font-style: italic; font-size: var(--text-sm); color: var(--color-text-muted);
}
@media (max-width: 560px) {
  .arch__node { width: 100%; }
  .arch__split { grid-template-columns: 1fr; }
  .arch__split > .arch__node, .arch__exit { grid-column: 1; }
  .arch__exit { justify-self: center; }
}
</style>

<figure class="arch">
<div class="arch__flow">
<div class="arch__node"><div class="arch__title">Buyer question</div><div class="arch__sub">asked in shop chat · the agent taps the sell button</div></div>
<div class="arch__arrow">↓</div>
<div class="arch__node arch__node--accent"><div class="arch__title">Supervisor agent</div><div class="arch__sub">receives the question · orchestrates the crew</div><span class="arch__tag">lightweight model</span></div>
<div class="arch__arrow">↓</div>
<div class="arch__split">
<div class="arch__node arch__node--accent"><div class="arch__title">Sales agent</div><div class="arch__sub">is it a good time to sell? · decides the path</div><span class="arch__tag">lightweight model</span></div>
<div class="arch__exit"><span class="arch__arrow">→</span><span class="arch__exitnote">exit and return nothing if intent is unclear</span></div>
</div>
<div class="arch__note">two paths, depending on what the buyer wants</div>
<div class="arch__arrow">↓</div>
<div class="arch__row">
<div class="arch__group">
<span class="arch__grouplabel">asking about the current item</span>
<div class="arch__flow">
<div class="arch__node"><div class="arch__title">Base item agent</div><div class="arch__sub">pulls the key points from the product's description · writes a contextual answer</div><span class="arch__tag">frontier model</span></div>
</div>
</div>
<div class="arch__group">
<span class="arch__grouplabel">a good time to sell</span>
<div class="arch__flow">
<div class="arch__node"><div class="arch__title">Recommendation agent</div><div class="arch__sub">handed the sell type (upsell · cross-sell · substitute, or a mix) · returns the top 3 relevant items with descriptions</div><span class="arch__tag">frontier model</span></div>
<div class="arch__note">only when relevance clears a high bar; otherwise nothing</div>
</div>
</div>
</div>
<div class="arch__arrow">↓</div>
<div class="arch__node arch__node--accent"><div class="arch__title">Panel output</div><div class="arch__sub">a contextual answer, or up to 3 product cards + replies · the agent sends what fits</div></div>
</div>
<figcaption>The sales agent decides whether it's a selling moment, then routes to the base-item or recommendation path.</figcaption>
</figure>

## Why 30 seconds of latency was fine

The full chain runs in about 20 to 30 seconds. For a system a person waits on, that would be a dealbreaker. The decision that made it work was to make it something the agent does *not* wait on.

The sell button is fire-and-forget. The moment an agent taps it, they are free to switch to another chat, and the draft is ready when they circle back. So the thing that would normally be a latency problem became the exact behavior we wanted to encourage: less time parked on one conversation, more chats handled in parallel. I was braced for latency to be the hard constraint. Framing the tool as asynchronous made the constraint irrelevant.

Under the hood this is a small crew of models rather than one big prompt. A lightweight model does the routing, since it is cheap and runs on every click. One of the leading frontier models handles the work that needs judgment: writing the same-item answers, and scoring candidate items for relevance against the product's description so it only recommends, up to three, when that relevance clears a high bar. Splitting it this way kept each prompt narrow enough to be reliable, kept the per-click cost sane, and meant a weak match produced nothing rather than a bad suggestion.

## The friction was human, not technical

The models behaved. People needed a beat to learn the tool. The sell button is meant to be pressed *at the buyer's question*, so the AI drafts the reply the agent then sends. Early on, agents would read the question, type their own reply, and *then* press the button, which is backwards: they had already answered, so the draft had nothing useful to add. There was real confusion in the first few days. It cleared up within about a week once people understood the AI's draft was meant to be the reply, not a second opinion on one they had already written.

The build itself was fast in a way that surprised people. My half was the agents: the supervisor that reads intent and routes, and the two task agents. The PM, who came from a software-engineering background, built the backend around it, the button and the Chrome plugin that calls the agentic workflow. We had it working in roughly a week and a half, plus about a week of testing and grading responses alongside the ops team. A two-person build with no formal sprint cycle turning something around that quickly was not the normal shape of a project here, and the speed was part of why it got taken seriously.

## What it moved, and where I stopped

The point of a PoC is to earn the next conversation, and this one did. With the copilot in the loop, agents handled meaningfully more chats without a drop in order conversion, a productivity lift in the low single digits across multiple regions. The "no conversion hit" half was as important as the productivity half: a tool that makes agents faster but quietly costs sales is not worth scaling, and being able to say it did neither is what made the result credible.

When ops asked us to build the full production feature, we said no. Getting the latency from 20-30 seconds down to a couple, and pushing response accuracy higher, is failsafe engineering work that belongs with a proper software team, not a two-person PoC. So the promising numbers became the justification for a proposal to the feature PM who owns scaling it. Knowing where the PoC ended and the real build began was its own kind of result.
