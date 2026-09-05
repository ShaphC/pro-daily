# Pro Daily

A focused daily work page built around **Priorities → Tasks → Notes → Next Day**.

## Setup

1. Copy `.env.example` to `.env.local` and add your Supabase project URL + publishable key.
2. Run `supabase/migrations/202609040001_foundation.sql` in the Supabase SQL editor (or with the Supabase CLI).
3. Install and run:

```bash
npm install
npm run dev
```

## Core invariants

- Every app table uses the `pro_` prefix.
- RLS is enabled on every application table.
- One daily row per authenticated user/date.
- Priorities have a hard maximum of seven per day, enforced in PostgreSQL with a transaction advisory lock.
- Top-three accomplishment is derived from current priority order.
- New days deterministically carry incomplete priorities/tasks from the latest prior daily page.
- Priority `chain_id` is preserved during carry-forward.
- Completing a historical priority removes future incomplete instances from the same priority chain.
- Digital and future Paper views can share the same rows; no parallel model is introduced.
