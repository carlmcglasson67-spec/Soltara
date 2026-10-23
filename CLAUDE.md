# CLAUDE.md — Soltara Energy

Read before any work. The build spec is the doc "Soltara Energy — Build Spec"
(https://claude.ai/artifact/7h5kmez8onLZJH4aHdK5gi). If a request conflicts with it, say so first.

## What this is
A UK Home Energy Marketplace: honest home assessment → recommended system → comparable quotes
from vetted installers → installation → Home Energy Planner. Solar + batteries first, then EV,
heat pumps, tariffs. Built and maintained by Pervonio; owned by Soltara Energy.

## Standing rules
- Plan/spec before code. Small, reviewable changes. Verify before saying done (tests, typecheck, build, screenshots).
- Push back on wrong-shaped requests instead of complying quietly.
- Phases ship live and complete before the next starts — no 90% phases.
- Honesty is the product: every saving, payback or price is a RANGE with its assumptions shown.
  Never "save £X guaranteed". Placeholder data (price book, example tariffs) is labelled as such.
- Grid energy stored in a battery never counts as the home's own solar.
- Privacy promise: a homeowner's details go to at most three installers they choose; no calls before they choose.
- No finance arranging (FCA) and no grant eligibility promises until Phase 4.
- UK English in all customer-facing copy.

## Design doctrine (from day one, not fixed after)
- Banned: hero/text squashed into a narrow centred column with dead space either side; content tight under the header.
- Required: generous editorial full-width layout, asymmetry, real scale in type and imagery, varied section pacing.
  Benchmarks: DEPT, AKQA, ustwo, Code and Theory. Trust register: Which?, MoneySuperMarket, Rightmove — clean, data-led, no hype.
- Real photography only for homes and installers; no AI-generated imagery presented as real.

## Layout
- `packages/engine` — assessment engine (pure TypeScript, Vitest). Every number shown to a customer comes from here.
- `apps/web` — Next.js App Router site (Phase 1).
- `assets/stock` — licensed Adobe Stock images (Standard licence).

## Commands
- `npm test` · `npm run typecheck` · `npm run assess:samples`
