# AUREA — Founder's Hosting Guide

## You Own This Entirely

Every file in this repository is yours. No vendor lock-in, no SaaS dependency.
You control the code, the data, the domain, and the IP.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  FRONTEND (Next.js on Vercel)                   │
│  ├── Landing Page (/)                           │
│  ├── Diagnostic Form (/diagnostic)              │
│  ├── Dashboard (/dashboard)                     │
│  ├── Integration Letter (/letter/[id])          │
│  ├── Practice Suite (/practice)                 │
│  └── Return Map (/return)                       │
├─────────────────────────────────────────────────┤
│  API LAYER (Next.js API Routes)                 │
│  ├── POST /api/diagnostic  (save responses)     │
│  ├── POST /api/analyze     (run AI pipeline)    │
│  └── GET  /api/cycle/[id]  (fetch results)      │
├─────────────────────────────────────────────────┤
│  AI ENGINE (Anthropic Claude API)               │
│  ├── Semantic Scoring (Sonnet)                  │
│  ├── Lexicon Detection (Sonnet)                 │
│  ├── Integration Letter (Opus for premium)      │
│  ├── Practice Suite (Sonnet)                    │
│  └── Recalibration Rhythm (Sonnet)              │
├─────────────────────────────────────────────────┤
│  DATABASE (Supabase — PostgreSQL)               │
│  ├── Users, Cycles, Station Responses           │
│  ├── Coherence Scores, Compass Analytics        │
│  ├── Integration Letters, Practice Cards        │
│  └── Row-Level Security (user data isolation)   │
└─────────────────────────────────────────────────┘
```

---

## Step 1: Set Up Supabase (Database)

1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project**. Name it `aurea`. Choose a strong database password.
3. Wait for the project to provision (~2 minutes).
4. Go to **SQL Editor** in the left sidebar.
5. Paste the entire contents of `sql/migration.sql` and click **Run**.
6. Go to **Settings → API** and copy:
   - `Project URL` → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → this is your `SUPABASE_SERVICE_ROLE_KEY`

**Important:** The service role key has full database access. Never expose it client-side.

---

## Step 2: Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com).
2. Create an account and add billing.
3. Go to **API Keys** and create a new key.
4. Copy it → this is your `ANTHROPIC_API_KEY`.

**Cost estimate per diagnostic:**
- Scoring (Sonnet): ~$0.05
- Lexicon (Sonnet): ~$0.02
- Integration Letter (Sonnet): ~$0.08 (Opus: ~$0.50)
- Practice Suite (Sonnet): ~$0.05
- Recalibration (Sonnet): ~$0.02
- **Total: ~$0.22/diagnostic (Sonnet) or ~$0.65 (with Opus letter)**

---

## Step 3: Deploy to Vercel

### Option A: One-Click Deploy (Recommended)

1. Push this code to a GitHub repository:
   ```bash
   cd cosmic-os
   git init
   git add .
   git commit -m "Initial Aurea deployment"
   gh repo create aurea --private --push
   ```

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New → Project** and import your `aurea` repo.
4. In the **Environment Variables** section, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ANTHROPIC_API_KEY=sk-ant-...
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_APP_NAME=Aurea
   ```
5. Click **Deploy**. Vercel will build and deploy automatically.
6. Your app will be live at `your-project.vercel.app`.

### Option B: Custom Domain

1. In Vercel dashboard, go to **Settings → Domains**.
2. Add your domain (e.g., `aurea.app` or `app.aurea.co`).
3. Update your DNS:
   - Add a CNAME record: `app` → `cname.vercel-dns.com`
   - Or an A record to Vercel's IP (shown in dashboard).
4. SSL is automatic.

---

## Step 4: Local Development

```bash
# Clone and install
git clone https://github.com/your-org/aurea.git
cd aurea
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your actual keys

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
# → Open http://localhost:3000
```

---

## Step 5: Authentication (Production)

The MVP uses a demo user. For production, enable Supabase Auth:

1. In Supabase dashboard, go to **Authentication → Providers**.
2. Enable **Email** (magic link — passwordless, matches the product's serene UX).
3. Optionally enable **Google** or **Apple** OAuth.
4. The RLS policies in the migration already enforce user-level data isolation.
5. Add auth middleware to your API routes (see Supabase Next.js docs).

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/config/brand.ts` | **Change the app name here.** One constant controls everything. |
| `src/config/stations.ts` | The 12-station diagnostic configuration. Add/modify options here. |
| `src/lib/scoring.ts` | Mathematical scoring engine (local, no AI). |
| `src/lib/prompts.ts` | AI prompt chains encoding the Analyst Codex. |
| `src/lib/analyzer.ts` | Orchestrates the 5-step analysis pipeline. |
| `src/lib/store.ts` | Client-side state management (Zustand). |
| `sql/migration.sql` | Complete database schema (run once in Supabase). |
| `prisma/schema.prisma` | ORM schema (alternative to raw SQL). |

---

## Customization Guide

### Changing the Brand Name
Edit `src/config/brand.ts`:
```ts
export const BRAND = {
  name: 'Your Name Here',
  tagline: 'Your tagline',
  // ...
};
```
Every UI surface references this config.

### Modifying Station Options
Edit `src/config/stations.ts`. Each station has an `options` array.
You can add, remove, or rename options without code changes elsewhere.

### Adjusting Scoring Weights
Edit `src/lib/scoring.ts`:
- `hingeWeight` in station config controls the 1.2x multiplier for core compass zone.
- `getColorBand()` controls the gold/emerald/teal thresholds.
- `detectBlindSpots()` controls the delta threshold (currently 0.15).

### Switching AI Models
In `src/lib/analyzer.ts`, the `callClaude()` function accepts a model parameter.
- Use `claude-sonnet-4-5-20250929` for speed and cost efficiency.
- Use `claude-opus-4-5-20251101` for the Integration Letter (premium quality).

### Adding Cultural Coatings
The lexicon detection system supports this natively. To add a new coating:
1. Add the option to `LEXICON_OPTIONS` in `stations.ts`.
2. The AI prompt already handles cultural adaptation through the lexicon preference.
3. Optionally add imagery family mappings in `prompts.ts`.

---

## Scaling Roadmap

### Phase 1: MVP (You are here)
- Single-user diagnostic flow
- AI-generated deliverables
- Demo data for visualization testing

### Phase 2: Multi-User Platform
- Supabase Auth integration
- User accounts with cycle history
- Payment integration (Stripe) for per-cycle billing

### Phase 3: Analyst Dashboard
- Admin panel for human analysts to review/edit AI outputs
- "Breath Audit" workflow (analyst reviews before delivery)
- Analyst assignment and queue management

### Phase 4: Enterprise / Cohort
- Team diagnostics with anonymized pattern atlas
- Cross-user trend analysis (Expansion Slot A from your roadmap)
- Cultural Coating Index (Expansion Slot B)
- Algorithmic Companion Sheet for auditability (Expansion Slot C)

---

## Security Checklist

- [ ] Never expose `SUPABASE_SERVICE_ROLE_KEY` client-side
- [ ] Never expose `ANTHROPIC_API_KEY` client-side
- [ ] Enable RLS on all Supabase tables (migration does this)
- [ ] Use Supabase Auth for production (not demo user)
- [ ] Set up rate limiting on API routes
- [ ] Enable Vercel's DDoS protection (automatic on Pro plan)

---

## Cost Structure (Monthly Estimates)

| Service | Free Tier | Growth |
|---------|-----------|--------|
| Vercel | 100GB bandwidth, unlimited deploys | $20/mo Pro |
| Supabase | 500MB DB, 50K auth users | $25/mo Pro |
| Anthropic API | Pay-per-use (~$0.22/diagnostic) | ~$22/100 users |
| Domain | — | ~$12/year |
| **Total (100 users/mo)** | **~$0** | **~$60/mo** |

---

## Support

This is your IP. You own every line.
The architecture was designed to be modular — swap any layer without touching others.
The Analyst Codex lives in `src/lib/prompts.ts` — your years of work, encoded.

*Coherence is not perfection; it is rhythm.*

— Aurea Analyst Engine v1.1
