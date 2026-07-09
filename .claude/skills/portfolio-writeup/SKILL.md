---
name: portfolio-writeup
description: >-
  Write or rework an impactful work/project showcase for Bobby's portfolio site
  (bobbymuljono.github.io). Use this whenever Bobby wants to turn a piece of work,
  a project, rough notes, or a lived experience into a portfolio case-study write-up,
  or wants an existing write-up made sharper, warmer, or less bloated. Trigger on
  phrases like "write up my [project]", "add a project", "help me showcase this work",
  "draft a case study", "turn these notes into a write-up", or when working on files
  under src/content/projects/. Built for work showcases today; the same voice and
  anti-bloat craft extend to later writing (blog, thoughts) as that ships.
---

# Portfolio write-up

Turn Bobby's work into a portfolio write-up that is **impactful, lean, and illustrative**:
warm and personal in voice, but never padded. The failure mode to avoid is a write-up that
sounds like a company About page: confident-sounding but vague, adjective-heavy, and
forgettable. The win condition is a reader finishing it thinking *"that person clearly did
the thing, thought hard about it, and I'd want them on my team."*

This is Bobby's own portfolio, so the writing is **first person** and it's his career on the
page. Take it seriously: be honest, be specific, and don't inflate.

## The two ways in

Bobby drives this skill in one of two ways. Figure out which from how he opens, and don't
force the other. He may also combine them ("let me brain-dump first, then interview me"): take
the dump, then interview the gaps.

### Interview me, then draft
He wants you to pull the story out of him. Most work has one genuinely interesting thing in
it that the person won't think to volunteer; your job in the interview is to find it.

Ask in **small batches (2-3 questions at a time)**, conversationally, not as a form. Follow
the thread that gets interesting rather than marching through a checklist. Aim to leave with:

- **The real problem and its stakes.** Not "I built an X". What was broken or slow or
  painful, and who felt it? What was the metric nobody could move?
- **What he actually built**, at a level a technical reader can picture.
- **The hardest call.** The trade-off or decision that wasn't obvious, where he could have
  gone another way and had a reason not to.
- **The non-obvious insight.** The thing he knows now that he didn't before, that a smart
  outsider wouldn't guess. This is usually the beating heart of a good write-up.
- **What changed** because the work existed: impact he can point to (see Confidentiality
  for how to handle numbers), including what he'd do differently.

If an answer is thin or generic, gently push once ("what did that actually look like day to
day?") before moving on. Don't interrogate.

### I dump rough notes → it drafts
He pastes bullets, a brain-dump, a Slack message, résumé lines, whatever. Read it, map it
onto a structure (below), and **draft**. Ask follow-ups **only where there's a real gap** the
draft can't honestly fill (usually the insight or the impact). Don't hold the draft hostage to
a full interview when he's chosen the fast path: send a solid draft with your open questions
listed beneath it.

## Structure: fit it to the story

There is **no fixed template**. Pick the shape that serves each piece. A rigid four-header
skeleton on every project makes them blur together. Let the interesting part drive the form.

Reliable shapes to draw from:

- **Case study (the workhorse).** Problem → Approach → the hard technical decision → What I
  learned. Best when there's a clear before/after and a shipped thing. This is a safe default
  when nothing else fits.
- **0→1 / experiment.** The itch → what I tried → what worked and what flopped → where it went
  next. Best for prototypes, pilots, MVPs, things you handed off.
- **Tooling / adoption.** What people were doing the hard way → what I built → how it spread →
  what it taught me about getting people to adopt AI. Best for internal tools and enablement.
- **Journey / evolution.** The problem → v1 → what replaced it → what carried over. Best when
  the story spans several tools or phases over time. This one legitimately runs longer than the
  others; 5 tight sections is fine as long as each still does one job.
- **Insight-led.** Open on the surprising lesson, then earn it by telling the story backwards.
  Use sparingly, when the insight is strong enough to carry the opening.

Whatever the shape: **short sections, each doing one job** (3-4 for most pieces, up to ~5 for a
journey). If two sections are making the same point, merge them. Headings should signal content,
not ceremony: prefer a specific heading ("The eval loop was the real work") over a generic one
("Results") when it earns it, but don't force cleverness.

**Open with a lead, not a heading.** Put the hook in one or two paragraphs *before* the first
`##` heading, sitting right under the title: a concrete, recent, first-person moment (what
happened, what it felt like) and the stakes. Then every `##` heading must accurately describe
the paragraphs directly beneath it. A common failure is a heading whose idea only surfaces two
or three paragraphs later; when that happens, move the heading down to where its point lands, or
rename it to match what's actually there. (In the reference piece, the "3 minutes vs half a day"
moment and the "adapt or fall behind" stakes are the lead; the first heading only starts once
the writing turns to what the job actually was.)

## Voice: warm & personal, still lean

Warm means **a person is talking**, not a case-study generator. First person, plain language,
a little of *why he cared* and what it felt like to be in it. The site's whole brand is
warm-neutral and professional-but-friendly, and the copy is where that warmth lives.

But warm is not the enemy of tight. Every sentence still earns its place. Warmth comes from
**honesty and specificity and the occasional human aside**, not from more words.

Do:
- Write like you're explaining it to a sharp friend over coffee.
- Let one real opinion or feeling through per piece ("I was sure retrieval was the hard part.
  I was wrong.").
- Use concrete nouns and real detail; they carry both warmth and credibility.
- Keep sentences varied and mostly short. Read it aloud; if you run out of breath, cut.

Don't:
- Reach for hype adjectives ("cutting-edge", "robust", "seamless", "powerful", "innovative").
  They're the sound of telling instead of showing.
- Write résumé-speak ("Spearheaded cross-functional initiatives to drive impact").
- Open with throat-clearing ("In today's fast-paced world of AI…"). Start in the middle of
  the real thing.
- Perform warmth with exclamation marks or forced quirk. Warmth is in the substance.

### Punctuation: no em-dashes (a hard rule)

**Never use em-dashes (—) anywhere:** not in prose, headings, frontmatter, figcaptions, or
diagram labels. Bobby dislikes them and they read as machine-written. Use a comma, a colon,
parentheses, or a full stop, whichever fits the sentence:

- Aside or interruption → parentheses or commas ("a lightweight assistant (I'll call it Boko)").
- Setup before a list or payoff → colon ("the hard part is knowing which table: and then trusting it"
  becomes two clauses with a comma, or a colon before an actual list).
- Dramatic beat → just start a new sentence ("I could have felt precious about it. I didn't.").

Also avoid **en-dashes (–)** as separators or ranges: use a hyphen for compounds
(`supervisor-subagent`) and write ranges in words ("two to three") or with a hyphen ("2-3").
The middot (`·`) and arrow (`→`) are fine as editorial flourish. **Before handing off, grep the
file for `—` and `–` and confirm zero hits.**

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
  mentioned", "Basically": delete on sight.
- **Prefer verbs to nominalizations.** "I decided" not "the decision was made"; "it cut
  first-response time" not "a reduction in first-response time was observed."

**Bloat smell test:** after drafting, scan for and cut sentences that could open any project
("This was a challenging and rewarding project"); lists of technologies with no reason given;
restating the heading in the first sentence; two adjectives where zero would do.

Length is a *result* of cutting, not a target. Most sections land at 2-4 tight paragraphs. If
it's longer, something is repeating or hedging.

## Illustrations & diagrams

When the story has a shape worth seeing (a pipeline, a multi-agent topology, a before/after,
a system's moving parts), a small diagram earns its place: it adds technical credibility and
breaks up the prose. Don't force one onto every piece, and don't let it replace the prose's job.

**Lock the architecture with Bobby first.** Never guess how a system works. Interview it one
component at a time and let him vet each before you draw. Getting a data flow subtly wrong is
worse than no diagram.

**Build diagrams as self-contained inline HTML/CSS in the `.md`, not as an image.** Reasons:
the site is Astro `.md` (not MDX) and static, so inline HTML renders straight through, inherits
the real self-hosted webfonts and design tokens, stays responsive, and ships zero JS. Image
generators (nanobanana and friends) mangle diagram text and can't hit the exact palette; only
reach for them if Bobby specifically wants a non-diagram illustration (a scene, a texture).

House rules for a diagram:
- **Use the design tokens** from `src/styles/global.css` (see `DESIGN_NOTES.md`): hairline
  borders (`--color-border`), one accent only (`--color-accent`, with `--color-surface-accent`
  sage wash for a highlighted node), `--color-surface` / `--color-surface-sunk` for fills,
  the `--font-*` families, `--radius-md`, and the `--space-*` scale. No shadows, no gradients,
  no second colour.
- Put **one namespaced `<style>` block** (e.g. `.arch`) at the top of the file, then semantic
  HTML `<figure class="arch">…<figcaption>…</figcaption></figure>` blocks. Keep node labels
  terse. Use `↓` and `·` for flow and separators (never dashes).
- **Keep glyphs gentle and on-brand.** Only `·`, `→`, and `↓`. No heavy or aggressive symbols
  (`╳`, `✕`, `⚠`, `⛔`, and the like): they read as harsh against the warm palette. To convey a
  negative or "these don't connect", say it in the muted caption text, don't reach for a big X.
- **Escape `&` as `&amp;` inside the diagram HTML** (it is raw HTML, so an unescaped `&` is
  invalid), even though prose uses the literal `&`. Keep the block contiguous (no blank lines
  inside a `<figure>`) so the markdown parser leaves it as a raw HTML block.
- **Placement:** put each diagram right after the prose that introduces it.
- **Reference implementation:** `src/content/projects/data-analyst-ai-agent.md` has the `.arch`
  style block and three architecture diagrams (supervisor/subagent, siloed-topics, copilot +
  skills). Copy that pattern rather than reinventing it.

**Verify it renders.** The file starts at `draft: true`, so it won't route in the dev server.
To preview: temporarily set `draft: false`, start the dev server, open `/projects/<slug>/`,
screenshot desktop and mobile, check the browser console is clean, inspect one node to confirm
the tokens resolved, then **set `draft` back to `true`**. Never leave it `false` before the
confidentiality gate clears.

## Confidentiality (safe by default, flag for review)

Most of Bobby's work is Shopee/internal. **Default to safe, and surface anything borderline
for his call.** Never publish something sensitive silently.

Safe-by-default rules while drafting:
- **Round or soften internal metrics** ("~30 team-hours a month", "dozens of users") rather
  than precise internal figures, unless Bobby confirms a number is public/OK.
- **No internal system names, team names, codenames, or unreleased strategy.** Describe the
  function ("an internal recommendation assistant"), not the internal label. If a story needs
  to name several internal tools, use **stand-in names** (e.g. Boko / Astro / Clyde) and note
  on the confidentiality list that they are pseudonyms with the real names withheld.
- **Frame representative specifics as such** when unsure.
- **Never invent metrics.** If there's no honest number, describe the change qualitatively.

**Deriving a number for the hook.** When Bobby wants impact as the hook, don't fabricate a
figure and don't demand a precise internal one. Show your math from his rough inputs (volume ×
time saved, with your assumptions stated) and let him correct it. If there's no clean single
number, use a **compression framing** instead ("work that ran from five minutes to a full day
now takes minutes"). Flag whatever you land on as an estimate on the confidentiality list.

Then, at the end of the draft, add a short **"Confidentiality (please check)"** list calling
out every specific that could be sensitive (each number, any named or stand-in system, any
claim about scale), so Bobby can approve, soften, or cut it before `draft: false`. This is a
hard gate: the write-up ships only after he clears that list *and* has read the copy.

## Output: a ready-to-commit content file

Write-ups live in the Astro `projects` content collection. Produce a complete file at
`src/content/projects/<slug>.md` where `<slug>` is short and kebab-case (it becomes the URL).
Files starting with `_` are excluded, so never prefix with `_`.

**Replacing an existing write-up:** if the new story outgrows the old slug (the placeholder was
"support chatbot" but the real story is a multi-tool journey), rename the slug to fit the story,
delete the old file, and warn Bobby the URL changed so any shared links break.

Frontmatter must satisfy the schema in `src/content.config.ts`:

```yaml
---
title: "Short, concrete title"
description: "One-sentence hook: the problem plus the result. Max 160 characters."
kind: "AI agent · case study"   # editorial eyebrow; optional
date: 2026-07-08                 # when the work/write-up is dated
techStack: ["RAG", "Python", "LangChain"]  # a few real tools, not a kitchen sink
featured: false                 # true only for the strongest 1-2
status: "live"                  # live | wip | archived
draft: true                     # START true; flip to false only after the confidentiality check clears
---
```

Rules that trip people up:
- **Title: concrete and strong, never vague.** Give it headline / thumbnail energy plus the
  words someone would actually search. Lead with the striking specific (a number, a sharp
  before/after) or the stakes; avoid abstract phrasings like "Distilling a day into minutes".
  It also becomes the SEO `<title>` tag, so real keywords ("AI", "data analyst") earn their
  place. Pair it with a `description` that adds the concrete detail the title implies.
- `description` is hard-capped at **160 characters** and shows on cards and in OG/meta. Make
  it a real hook, not a summary of a summary.
- The detail template renders the `date` (formatted, e.g. "July 9, 2026") directly under the
  title, so set an honest, sensible date.
- `techStack` should be a **short, honest** list: the tools that actually mattered.
- Keep `draft: true` until Bobby has reviewed the copy *and* cleared the confidentiality list.
- Write **literal characters** in prose and frontmatter, never HTML-escape: use `&`, not
  `&amp;`; use `·` / `→`, not entities. (The one exception is inside a raw-HTML diagram block,
  where `&` must be `&amp;`.) Astro renders these strings as-is.
- `kind` currently shows only on the Work **listing cards**, not the detail-page header (the
  eyebrow there was removed), so keep it short and card-appropriate. The middot style is
  `AI agent · case study`.
- Match the house prose style: `##` section headings, tight paragraphs, `**bold**` for the one
  or two phrases that carry the point. No emoji (the site bans them; `·` and `→` are fine).

After writing the file, tell Bobby the slug, show the confidentiality list, and remind him it's
`draft: true` until he clears it.

## Before you hand it off (quick self-check)

- Would this opening make someone keep reading, or could it head any project?
- Is the hook a lead *before* the first heading, and does every heading match the section
  directly beneath it?
- Is the title concrete, searchable, and strong (not vague), with a description that adds detail?
- Is the one non-obvious insight in here, stated plainly?
- Did I show the impact with something concrete (and safe), or just assert it?
- Is there a real point of view / a bit of Bobby in it, or does it read machine-generated?
- Can I cut 15% without losing anything? (Usually yes. Do it.)
- Is every sensitive specific on the confidentiality list?
- **Zero em-dashes and en-dashes?** Grep the file for `—` and `–`; there should be no hits.
- If there's a diagram: is the architecture Bobby-vetted, token-styled, and rendered-checked?
