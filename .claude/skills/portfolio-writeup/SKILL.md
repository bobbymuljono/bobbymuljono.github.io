---
name: portfolio-writeup
description: >-
  Write or rework an impactful work/project showcase for Bobby's portfolio site
  (bobbymuljono.github.io). Use this whenever Bobby wants to turn a piece of work,
  a project, rough notes, or a lived experience into a portfolio case-study write-up —
  or wants an existing write-up made sharper, warmer, or less bloated. Trigger on
  phrases like "write up my [project]", "add a project", "help me showcase this work",
  "draft a case study", "turn these notes into a write-up", or when working on files
  under src/content/projects/. Built for work showcases today; the same voice and
  anti-bloat craft extend to later writing (blog, thoughts) as that ships.
---

# Portfolio write-up

Turn Bobby's work into a portfolio write-up that is **impactful, lean, and illustrative** —
warm and personal in voice, but never padded. The failure mode to avoid is a write-up that
sounds like a company About page: confident-sounding but vague, adjective-heavy, and
forgettable. The win condition is a reader finishing it thinking *"that person clearly did
the thing, thought hard about it, and I'd want them on my team."*

This is Bobby's own portfolio, so the writing is **first person** and it's his career on the
page. Take it seriously: be honest, be specific, and don't inflate.

## The two ways in

Bobby drives this skill in one of two ways. Figure out which from how he opens, and don't
force the other.

### Interview me, then draft
He wants you to pull the story out of him. Most work has one genuinely interesting thing in
it that the person won't think to volunteer — your job in the interview is to find it.

Ask in **small batches (2–3 questions at a time)**, conversationally, not as a form. Follow
the thread that gets interesting rather than marching through a checklist. Aim to leave with:

- **The real problem and its stakes.** Not "I built an X" — what was broken or slow or
  painful, and who felt it? What was the metric nobody could move?
- **What he actually built**, at a level a technical reader can picture.
- **The hardest call.** The trade-off or decision that wasn't obvious — where he could have
  gone another way and had a reason not to.
- **The non-obvious insight.** The thing he knows now that he didn't before, that a smart
  outsider wouldn't guess. This is usually the beating heart of a good write-up.
- **What changed** because the work existed — impact he can point to (see Confidentiality
  for how to handle numbers), including what he'd do differently.

If an answer is thin or generic, gently push once ("what did that actually look like day to
day?") before moving on. Don't interrogate.

### I dump rough notes → it drafts
He pastes bullets, a brain-dump, a Slack message, résumé lines — whatever. Read it, map it
onto a structure (below), and **draft**. Ask follow-ups **only where there's a real gap** the
draft can't honestly fill (usually the insight or the impact). Don't hold the draft hostage to
a full interview when he's chosen the fast path — send a solid draft with your open questions
listed beneath it.

## Structure: fit it to the story

There is **no fixed template** — pick the shape that serves each piece. A rigid four-header
skeleton on every project makes them blur together. Let the interesting part drive the form.

Reliable shapes to draw from:

- **Case study (the workhorse).** Problem → Approach → the hard technical decision → What I
  learned. Best when there's a clear before/after and a shipped thing. This is a safe default
  when nothing else fits.
- **0→1 / experiment.** The itch → what I tried → what worked and what flopped → where it went
  next. Best for prototypes, pilots, MVPs, things you handed off.
- **Tooling / adoption.** What people were doing the hard way → what I built → how it spread →
  what it taught me about getting people to adopt AI. Best for internal tools and enablement.
- **Insight-led.** Open on the surprising lesson, then earn it by telling the story backwards.
  Use sparingly, when the insight is strong enough to carry the opening.

Whatever the shape: **3–4 short sections, each doing one job.** If two sections are making the
same point, merge them. Headings should signal content, not ceremony — prefer a specific
heading ("The eval loop was the real work") over a generic one ("Results") when it earns it,
but don't force cleverness.

## Voice: warm & personal, still lean

Warm means **a person is talking**, not a case-study generator. First person, plain language,
a little of *why he cared* and what it felt like to be in it. The site's whole brand is
warm-neutral and professional-but-friendly — the copy is where that warmth lives.

But warm is not the enemy of tight. Every sentence still earns its place. Warmth comes from
**honesty and specificity and the occasional human aside**, not from more words.

Do:
- Write like you're explaining it to a sharp friend over coffee.
- Let one real opinion or feeling through per piece ("I was sure retrieval was the hard part.
  I was wrong.").
- Use concrete nouns and real detail — they carry both warmth and credibility.
- Keep sentences varied and mostly short. Read it aloud; if you run out of breath, cut.

Don't:
- Reach for hype adjectives ("cutting-edge", "robust", "seamless", "powerful", "innovative").
  They're the sound of telling instead of showing.
- Write résumé-speak ("Spearheaded cross-functional initiatives to drive impact").
- Open with throat-clearing ("In today's fast-paced world of AI…"). Start in the middle of
  the real thing.
- Perform warmth with exclamation marks or forced quirk. Warmth is in the substance.

**Before → after (the target shift):**

> Before: *"I spearheaded the development of a robust, cutting-edge RAG solution that
> leveraged state-of-the-art retrieval to seamlessly empower support agents and drive
> significant efficiency gains across the organization."*

> After: *"Support agents were answering the same questions by hand, digging through 40k
> help articles nobody could keep tidy. I built an assistant that reads the customer's
> question, finds the right article, and drafts a reply the agent can send or fix. The
> surprise: standing up the search took a day; making it trustworthy took the rest of the
> project."*

Same facts. The second one shows, has a point of view, and sounds like a human who was there.

## Illustrative, not bloated

"Illustrative but not bloated" is the core craft. Some levers:

- **Show through specifics, not adjectives.** "40k articles across 8 markets" beats "a
  large-scale, multi-market corpus." Concrete detail is what makes a reader believe you.
- **One insight per section.** Name the non-obvious lever plainly ("the biggest lever was
  eval, not retrieval") and let it land.
- **Include what didn't work.** A dead end you explain is more convincing than an unbroken
  string of wins, and it's rare enough to stand out. Frame it as learning, not confession.
- **Cut the connective throat-clearing.** "It's worth noting that", "In order to", "As
  mentioned", "Basically" — delete on sight.
- **Prefer verbs to nominalizations.** "I decided" not "the decision was made"; "it cut
  first-response time" not "a reduction in first-response time was observed."

**Bloat smell test** — after drafting, scan for and cut: sentences that could open any
project ("This was a challenging and rewarding project"); lists of technologies with no
reason given; restating the heading in the first sentence; two adjectives where zero would do.

Length is a *result* of cutting, not a target. Most sections land at 2–4 tight paragraphs. If
it's longer, something is repeating or hedging.

## Confidentiality (safe by default, flag for review)

Most of Bobby's work is Shopee/internal. **Default to safe, and surface anything borderline
for his call** — never publish something sensitive silently.

Safe-by-default rules while drafting:
- **Round or soften internal metrics** ("~30 team-hours a month", "dozens of users") rather
  than precise internal figures, unless Bobby confirms a number is public/OK.
- **No internal system names, team names, codenames, or unreleased strategy.** Describe the
  function ("an internal recommendation assistant"), not the internal label.
- **Frame representative specifics as such** when unsure.
- **Never invent metrics.** If there's no honest number, describe the change qualitatively.

Then, at the end of the draft, add a short **"Confidentiality — please check"** list calling
out every specific that could be sensitive (each number, any named system, any claim about
scale), so Bobby can approve, soften, or cut it before `draft: false`. This is a hard gate:
the write-up ships only after he clears that list.

## Output: a ready-to-commit content file

Write-ups live in the Astro `projects` content collection. Produce a complete file at
`src/content/projects/<slug>.md` where `<slug>` is short and kebab-case (it becomes the URL).
Files starting with `_` are excluded, so never prefix with `_`.

Frontmatter must satisfy the schema in `src/content.config.ts`:

```yaml
---
title: "Short, concrete title"
description: "One-sentence hook — the problem + the result. Max 160 characters."
kind: "AI agent · case study"   # editorial eyebrow; optional but nice
date: 2026-07-08                 # when the work/write-up is dated
techStack: ["RAG", "Python", "LangChain"]  # a few real tools, not a kitchen sink
featured: false                 # true only for the strongest 1–2
status: "live"                  # live | wip | archived
draft: true                     # START true — flip to false only after the confidentiality check clears
---
```

Rules that trip people up:
- `description` is hard-capped at **160 characters** and shows on cards and in OG/meta — make
  it a real hook, not a summary of a summary.
- `techStack` should be a **short, honest** list — the tools that actually mattered.
- Keep `draft: true` until Bobby has reviewed the copy *and* cleared the confidentiality list.
- Write **literal characters** in both frontmatter and prose — never HTML-escape. Use `&`, not
  `&amp;`; use `·`/`→`, not entities. Astro renders these strings as-is, so an escaped entity
  shows up verbatim on the page. (The house `kind` style is middot-separated, e.g.
  `AI agent · case study`.)
- Match the house prose style: `##` section headings, tight paragraphs, `**bold**` for the one
  or two phrases that carry the point. No emoji (the site bans them; `·` and `→` are fine).

After writing the file, tell Bobby the slug, show the confidentiality list, and remind him it's
`draft: true` until he clears it.

## Before you hand it off — quick self-check

- Would this opening make someone keep reading, or could it head any project?
- Is the one non-obvious insight in here, stated plainly?
- Did I show the impact with something concrete (and safe), or just assert it?
- Is there a real point of view / a bit of Bobby in it — or does it read machine-generated?
- Can I cut 15% without losing anything? (Usually yes. Do it.)
- Is every sensitive specific on the confidentiality list?
