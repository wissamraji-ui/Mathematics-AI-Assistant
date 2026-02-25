# Mathematics AI Assistant Platform

Proof-oriented math tutor with a hint ladder (Hint 1 → Hint 2 → Outline → Full solution if allowed), rigor control, and citations to your course notes via RAG.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres + Storage + pgvector)
- OpenAI (chat + embeddings)
- Stripe (subscriptions)

## Local setup

1. Install dependencies
   - `npm install`
2. Create a Supabase project
   - Enable `pgvector` (migration includes it)
3. Apply database schema
   - Run the SQL in `supabase/migrations/20260225_init.sql` in the Supabase SQL editor.
4. Create `.env.local`
   - Copy `.env.example` → `.env.local` and fill values.
5. Run dev server
   - `npm run dev`

## Admin access

- After you sign up, set your row in `public.users.role` to `admin` to access `/admin` and upload/ingest documents.

## Stripe webhooks (local)

- Forward webhooks to the dev server:
  - `stripe listen --forward-to http://localhost:3000/api/stripe/webhook`

## Notes

- The `chunks.embedding` column is defined as `vector(1536)` for `text-embedding-3-small`. If you change embedding models, update the dimension + index accordingly.
- Exam Practice generator (`/app/practice`) requires an active Student or Pro subscription (enforced by `/api/practice/generate`).
