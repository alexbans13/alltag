# Journal & Learn

Journal about your day in your native language, then practice expressing it in your
target language (German first) at your current CEFR level. Personal-use MVP — see
the PRD for the full spec.

## Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend/data**: Supabase (Postgres + email/password auth)
- **LLM**: Anthropic API (`claude-opus-5` by default), called only from server-side
  route handlers under `src/app/api/practice/*` — never from the client directly
- **Deployment**: Vercel

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a Supabase project** at [supabase.com](https://supabase.com), then open
   the SQL editor and run the migration in `supabase/migrations/0001_init.sql`. It
   creates `entries` and `user_language_levels` with row-level security so users only
   ever see their own rows.

3. **Configure environment variables** — copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase
     Project Settings → API
   - `ANTHROPIC_API_KEY` — from console.anthropic.com
   - `ANTHROPIC_MODEL` (optional) — overrides the default `claude-opus-5`

4. **Email confirmation**: by default Supabase requires confirming sign-up emails.
   For solo/local use you can disable that in Authentication → Providers → Email, or
   just click the confirmation link it sends.

5. **Run the dev server**

   ```bash
   npm run dev
   ```

## How it maps to the PRD

- `entries` table = the single source of truth (`src/lib/database.types.ts`,
  `supabase/migrations/0001_init.sql`). Practice output is generated on demand and
  never persisted (no `practice_sessions` table).
- `user_language_levels` stores the self-reported CEFR level per language
  (Settings page), and doubles as the default level pre-filled on a new entry.
- The four practice modes live in `src/components/practice/*`, calling
  `src/app/api/practice/*` route handlers, which call `src/lib/llm/practice.ts`
  (prompt templates + Anthropic calls). Every route re-checks that the entry
  belongs to the authenticated user before generating anything.
- Dialect mode is gated to German only (`hasDialectMode` in `src/lib/languages.ts`)
  since it's Austrian-German specific per the PRD.
- Streak/level-progress indicators were left out per the PRD's "nice-to-have, can be
  deferred" note.

## Project structure

```
src/app/(app)/...          Authenticated pages (dashboard, entries, settings)
src/app/login, /signup      Auth pages
src/app/api/practice/...    Server-only LLM route handlers
src/lib/supabase/           Browser/server Supabase clients + session-refresh proxy
src/lib/llm/                Anthropic client + per-mode prompt templates
src/components/practice/    Client components for each practice mode
supabase/migrations/        SQL schema
```
