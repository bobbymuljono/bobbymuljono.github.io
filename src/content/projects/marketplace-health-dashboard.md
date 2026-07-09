---
title: "Marketplace health dashboard"
description: "A self-serve metrics layer that replaced 30+ ad-hoc queries and got adopted by 4 regional teams."
kind: "Analytics"
date: 2026-01-18
techStack: ["SQL", "dbt", "Dashboards"]
status: "live"
draft: true
---

## Problem

Four regional teams were each maintaining their own copy of "marketplace health" — 30+
ad-hoc queries with quietly different definitions of the same metric. Every cross-market
conversation started with reconciling whose number was right, which is a terrible place
to start a conversation.

## Approach

I built a modelled metrics layer in dbt: one definition per metric, tested, documented,
and materialised for the dashboards to read. The dashboard on top is deliberately boring —
the point was that everyone pulls from the same source, so a number means the same thing
in Jakarta as it does in São Paulo.

## Technical decisions

The hard calls were about definitions, not tooling. Standardising a metric means telling
some team their historical number was subtly wrong, so I versioned the changes and wrote
down the reasoning for each one. dbt tests encode the invariants — no negative counts, no
gaps in the date spine — so drift gets caught in CI instead of in a stakeholder meeting.

## What I learned

The engineering was the small half. Getting four teams to adopt one definition was the
real work, and it only happened because the layer was transparent — anyone could read the
model and see exactly how a number was built. Trust in a metric comes from being able to
trace it, not from asserting it.
