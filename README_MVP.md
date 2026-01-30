# Nudge MVP (Stripe wager)

## MVP rules (locked)
- 2 participants.
- Both must accept terms before any money is captured.
- Funding can be: one-sided (sponsor) or two-sided (wager).
- Outcome is decided by mutual confirmation within a 24h window after deadline.
- If disagreement or no-response within 24h: **100% forfeited to platform balance**.
- If completed: **winner takes all** (wager).
- Each payer chooses their own fail policy for their own contribution; **but note**: the global rule above overrides on dispute/timeout.

## Build plan
- Next.js app (mobile-first, single scroll).
- Stripe (test mode first).
- Minimal DB for:
  - proposals, acceptances, payments, outcome votes, final state.

## TODO decisions
- "winner" definition per nudge (who is expected to do the action) — store as role.
