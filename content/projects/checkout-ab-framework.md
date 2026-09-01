---
title: "Checkout A/B framework"
description: "A sequential-testing harness for high-traffic checkout that shipped 12 wins in a year."
kind: "Experimentation"
date: 2025-11-08
techStack: ["Experimentation", "Stats", "Python"]
status: "live"
draft: true
---

## Problem

Checkout is the highest-traffic, highest-stakes surface there is, and the team wanted to
iterate on it quickly. Fixed-horizon A/B tests fought that: you either waited two weeks
for every idea or peeked early and fooled yourself. We needed to move fast without lying
to ourselves about significance.

## Approach

I built a sequential-testing harness — always-valid inference that lets you stop as soon
as the evidence is there, without inflating false positives from peeking. It handles
assignment, guardrail metrics, and the stats, so a product engineer can launch a checkout
experiment and read the result honestly without being a statistician.

## Technical decisions

The core choice was sequential over fixed-horizon: on high traffic it turns "wait two
weeks" into "wait until the data decides," which is where the velocity came from. I paired
every primary metric with guardrails — latency, error rate, revenue-per-session — so a
"win" that quietly broke something else couldn't ship. The framework refuses to call a
result the design doesn't support, which matters more than any single win.

## What I learned

Twelve wins in a year came less from cleverer variants than from a testing loop people
trusted enough to actually use. The best experimentation work is invisible: it makes the
honest path the easy path, so the team stops arguing about whether a result is real and
starts shipping the ones that are.
