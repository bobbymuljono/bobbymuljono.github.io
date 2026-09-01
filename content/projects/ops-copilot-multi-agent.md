---
title: "Ops copilot (multi-agent)"
description: "A planner–executor agent team that drafts SQL, runs checks, and writes the weekly ops readout."
kind: "Multi-agent · production"
date: 2026-03-12
techStack: ["Multi-agent", "SQL", "Tooling"]
status: "live"
draft: true
---

## Problem

The weekly ops readout was a standing tax: pull the same dozen metrics, sanity-check
them, notice what moved, and write it up. It ate an afternoon and the writing was the
easy part — the tedious, error-prone bit was getting the SQL right and catching the one
number that looked off.

## Approach

I split the job across two roles. A **planner** turns the readout brief into a set of
concrete questions and the queries to answer them; an **executor** runs each query
against real tools, checks the results against guardrails (row counts, null spikes,
week-over-week sanity), and hands back a draft narrative for a human to finish. The
split mirrors how the task actually decomposes — decide what to ask, then go get it.

## Technical decisions

I only reached for multi-agent where it earned its keep. A single well-prompted model
is plenty for most of this; the planner–executor split paid off specifically because
the checking step benefits from being its own agent with its own tools and its own
failure modes. Every query the executor runs is logged and re-runnable, so a wrong
number is debuggable rather than mysterious.

## What I learned

Multi-agent is a tool, not a default. The value showed up at the seam between planning
and verified execution — not from adding more agents, but from giving the checking step
somewhere to live. When the checks are first-class, you trust the readout enough to
actually ship it unattended.
