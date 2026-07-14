---
title: "The heart button: a multi-agent recommendation copilot for chat support"
description: "Ops wanted to hard-code product suggestions. I pitched an AI that reads the buyer's question instead, and built the PoC in under three weeks."
kind: "AI agent · PoC"
date: 2026-07-14
techStack: ["Multi-agent orchestration", "LLM intent routing", "GPT-4.1 / 4.1-mini", "Prompt engineering"]
featured: false
status: "archived"
draft: true
---

Shop chat is the one place in the marketplace where a buyer, standing in a shop and looking at an item, asks a question before they buy. That makes it the rare support surface that can actually drive presales revenue, and ops wanted more out of it. Their first plan was to hard-code it: peg every item to one fixed upsell and one fixed cross-sell, by hand. For a catalog that size it did not scale, and it ignored the one thing that decides whether a suggestion lands, which is what the buyer just asked.

I pitched the alternative: let an AI read the actual question and decide. I showed them a working feasibility demo on our internal agent-builder, they bought in, and I went straight to building it with a PM. What we shipped was a small panel inside the agent's chat window: a product card and a suggested reply, already written in the buyer's language and aimed at what they asked. One click on a heart button sends both, and the agent moves on to the next conversation.

## Intent is the whole game

The system does not recommend a product to everyone. Pressing the heart button feeds the buyer's transcript to a supervisor agent whose only job is to read intent and route, and almost all of the usefulness lives in getting that routing right.

There are three real cases and one honest non-answer:

- **Same item.** The buyer wants to know something about the product in front of them ("is there a warranty for this?"). This routes to an agent that reads the item's own description and writes a contextual answer. No recommendation, just a good reply.
- **Upsell.** They are circling a better version of the same thing. For an iPhone 16, it surfaces the iPhone 17 as a higher-value anchor.
- **Cross-sell.** They ask for something that completes the purchase ("do you have a charging brick for this?"), and it suggests up to three complementary items with a short reason for each.
- **Unclear.** If it cannot tell what the buyer wants, it tells the agent no recommendation was found and gets out of the way.

That last case mattered more than it looks. The easy version of this tool recommends *something* every time, and agents quickly learn to ignore it. Returning nothing on a weak signal is what kept the panel worth glancing at.

[DIAGRAM: buyer transcript → Supervisor agent (routes on intent) → Suitable-selling agent (decides same-item vs upsell vs cross-sell) → one of {Anchor-item agent: contextual answer on the same product} or {Recommendation agent: top 3 upsell/complementary items}. Output: a product card + a suggested reply the agent sends with one click.]

## Why 30 seconds of latency was fine

The full chain runs in about 20 to 30 seconds. For a system a person waits on, that would be a dealbreaker. The decision that made it work was to make it something the agent does *not* wait on.

The heart button is fire-and-forget. The moment an agent taps it, they are free to switch to another chat, and the draft is ready when they circle back. So the thing that would normally be a latency problem became the exact behavior we wanted to encourage: less time parked on one conversation, more chats handled in parallel. I was braced for latency to be the hard constraint. Framing the tool as asynchronous made the constraint irrelevant.

Under the hood this is a small crew of models rather than one big prompt. A lightweight model handles routing and the item-level work, since it is cheap and runs on every click, and a stronger model does the intent read where the extra judgment earns its cost. Splitting it this way kept each prompt narrow enough to be reliable and kept the per-click cost sane.

## The friction was human, not technical

The models behaved. People needed a beat to learn the tool. The button is meant to be pressed *at the buyer's question*, so the AI can answer it. Early on, agents would read the question, type their own reply, and *then* press the button, which is backwards: the buyer's question was already answered, so the draft had nothing useful to add. There was real confusion in the first few days. It cleared up within about a week once people understood the button was the answer, not a second opinion on their answer.

The build itself was fast in a way that surprised people. My half was the agents: the supervisor, the intent read, and the two task agents. The PM, who came from a software-engineering background, built the backend around it, the button and the Chrome plugin that calls the agentic workflow. We had it working in roughly a week and a half, plus about a week of testing and grading responses alongside the ops team. A two-person build with no formal sprint cycle turning something around that quickly was not the normal shape of a project here, and the speed was part of why it got taken seriously.

## What it moved, and where I stopped

The point of a PoC is to earn the next conversation, and this one did. With the copilot in the loop, agents handled meaningfully more chats without a drop in order conversion, a productivity lift in the low double digits. The "no conversion hit" half was as important as the productivity half: a tool that makes agents faster but quietly costs sales is not worth scaling, and being able to say it did neither is what made the result credible.

When ops asked us to build the full production feature, we said no. Getting the latency from 20-30 seconds down to a couple, and pushing response accuracy higher, is failsafe engineering work that belongs with a proper software team, not a two-person PoC. So the promising numbers became the justification for a proposal to the feature PM who owns scaling it. Knowing where the PoC ended and the real build began was its own kind of result.

---

## Confidentiality (please check)

- **Productivity lift.** You told me the real figure and that it is confidential. I softened it to "a productivity lift in the low double digits" and "meaningfully more chats." Confirm you are OK publishing even that soft version, or I can go fully qualitative ("a clear productivity lift").
- **"No impact on order conversion."** You flagged this as confidential. I kept the claim but no number. OK to keep, or soften to "without hurting sales outcomes"?
- **Internal AI builder platform.** I described it as "our internal agent-builder" without naming it. Confirm that is the right level of generic, or whether even that reference should go.
- **Shop chat / product surface.** I used "shop chat" and described it plainly as the in-shop buyer chat. If that product name is sensitive, I can genericize to "the marketplace's in-shop buyer chat."
- **Model names.** I named GPT-4.1 / 4.1-mini (third-party, visible in your screenshots). Fine to keep, or stay generic ("a lightweight model" / "a stronger model")?
- **Screenshots.** Your two uploads show a real buyer chat (username, order details, a real product) and the agent-builder canvas. If either goes on the page, redact PII / order data first.
- **status.** Set to `"archived"` since the PoC concluded and scaling moved to the feature PM. Use `"wip"` if you'd rather frame it as ongoing.

## For Claude Code

- **Diagram.** Style the single `[DIAGRAM: ...]` sketch in "Intent is the whole game" with real tokens from `src/styles/global.css` (see `DESIGN_NOTES.md`), following the pattern in `src/content/projects/data-analyst-ai-agent.md`. It is a routing tree; the source screenshot (image 1) shows the exact topology and node labels.
- **Frontmatter.** Confirm fields match the live `src/content.config.ts` schema exactly (especially `kind`, `status`, `techStack`).
- **Placement.** Save as `src/content/projects/chat-recommendation-copilot.md`. No old slug to replace.
- **Image assets.** If including either screenshot, redact buyer PII / order data first (see confidentiality note).
- **Render check.** Temporarily set `draft: false`, run the dev server, view `/projects/chat-recommendation-copilot/`, screenshot desktop and mobile, confirm the diagram tokens resolved and the console is clean, then set `draft` back to `true` until the confidentiality list is cleared and Bobby gives the final go.
