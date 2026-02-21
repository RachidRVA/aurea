-- ╔══════════════════════════════════════════════════════════════╗
-- ║  AUREA — Database Migration (Supabase / PostgreSQL)       ║
-- ║  Run this in your Supabase SQL editor or via psql          ║
-- ╚══════════════════════════════════════════════════════════════╝

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── ENUMS ────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('CLIENT', 'ANALYST', 'ADMIN');
CREATE TYPE cycle_status AS ENUM ('INTAKE', 'SUBMITTED', 'PROCESSING', 'REVIEW', 'DELIVERED', 'ARCHIVED');

-- ─── USERS ────────────────────────────────────────────────────

CREATE TABLE users (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  role          user_role DEFAULT 'CLIENT',
  lexicon_lock  JSONB,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CYCLES ───────────────────────────────────────────────────

CREATE TABLE cycles (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cycle_number    INT DEFAULT 1,
  status          cycle_status DEFAULT 'INTAKE',
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  processed_at    TIMESTAMPTZ,
  UNIQUE(user_id, cycle_number)
);

CREATE INDEX idx_cycles_user ON cycles(user_id);
CREATE INDEX idx_cycles_status ON cycles(status);

-- ─── STATION RESPONSES ────────────────────────────────────────

CREATE TABLE station_responses (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycle_id    TEXT NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  station     INT NOT NULL CHECK (station >= -6 AND station <= 6),
  "primary"   TEXT NOT NULL,
  secondary   TEXT NOT NULL,
  reflection  TEXT NOT NULL,
  UNIQUE(cycle_id, station)
);

CREATE INDEX idx_station_cycle ON station_responses(cycle_id);

-- ─── INTEGRATION META ─────────────────────────────────────────

CREATE TABLE integration_meta (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycle_id        TEXT UNIQUE NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  feeling         TEXT,
  os_name         TEXT,
  lexicon_choice  TEXT
);

-- ─── LIFE ARCS ────────────────────────────────────────────────

CREATE TABLE life_arcs (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycle_id    TEXT UNIQUE NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  short_term  TEXT,
  mid_term    TEXT,
  long_term   TEXT
);

-- ─── COHERENCE SCORES ─────────────────────────────────────────

CREATE TABLE coherence_scores (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycle_id    TEXT NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  station     INT NOT NULL,
  clarity     FLOAT NOT NULL CHECK (clarity >= 0 AND clarity <= 1),
  consistency FLOAT NOT NULL CHECK (consistency >= 0 AND consistency <= 1),
  coherence   FLOAT NOT NULL CHECK (coherence >= 0 AND coherence <= 1),
  weighted    FLOAT NOT NULL CHECK (weighted >= 0 AND weighted <= 1.2),
  raw_text    TEXT,
  UNIQUE(cycle_id, station)
);

-- ─── COMPASS ANALYTICS ────────────────────────────────────────

CREATE TABLE compass_analytics (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycle_id          TEXT UNIQUE NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  gravity_index     FLOAT NOT NULL,
  grace_index       FLOAT NOT NULL,
  balance_ratio     FLOAT NOT NULL,
  hcr               FLOAT,
  quadrant          TEXT NOT NULL,
  vector_direction  TEXT,
  delta_previous    FLOAT
);

-- ─── BLIND SPOT FLAGS ─────────────────────────────────────────

CREATE TABLE blind_spot_flags (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycle_id    TEXT NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  flag_type   TEXT NOT NULL CHECK (flag_type IN ('OVER_ACTIVE', 'UNDER_ACTIVE')),
  station_a   INT NOT NULL,
  station_b   INT NOT NULL,
  delta       FLOAT NOT NULL,
  narrative   TEXT NOT NULL,
  movement    TEXT NOT NULL
);

-- ─── SYNERGY PAIRS ────────────────────────────────────────────

CREATE TABLE synergy_pairs (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycle_id        TEXT NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  station_a       INT NOT NULL,
  station_b       INT NOT NULL,
  correlation_r   FLOAT NOT NULL,
  narrative       TEXT NOT NULL
);

-- ─── LEXICON PROFILES ─────────────────────────────────────────

CREATE TABLE lexicon_profiles (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycle_id          TEXT UNIQUE NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  primary_family    TEXT NOT NULL,
  secondary_accent  TEXT,
  tone_ratio        TEXT NOT NULL,
  color_cue         TEXT NOT NULL,
  top_metaphors     JSONB NOT NULL DEFAULT '[]',
  top_verbs         JSONB NOT NULL DEFAULT '[]'
);

-- ─── HEATMAP DATA ─────────────────────────────────────────────

CREATE TABLE heatmap_data (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycle_id        TEXT UNIQUE NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  station_values  JSONB NOT NULL,
  color_bands     JSONB NOT NULL,
  peak_zone       TEXT NOT NULL,
  waiting_zone    TEXT
);

-- ─── INTEGRATION LETTERS ──────────────────────────────────────

CREATE TABLE integration_letters (
  id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycle_id            TEXT UNIQUE NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  acknowledgement     TEXT NOT NULL,
  key_pattern         TEXT NOT NULL,
  invitation          TEXT NOT NULL,
  core_compass        TEXT NOT NULL,
  geometry_of_flow    TEXT NOT NULL,
  signature_moment    TEXT NOT NULL,
  continuation        TEXT NOT NULL,
  full_markdown       TEXT NOT NULL,
  status              TEXT DEFAULT 'draft',
  analyst_edits       JSONB
);

-- ─── PRACTICE CARDS ───────────────────────────────────────────

CREATE TABLE practice_cards (
  id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycle_id            TEXT NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  slot                INT NOT NULL CHECK (slot >= 1 AND slot <= 6),
  sense_axis          TEXT NOT NULL,
  title               TEXT NOT NULL,
  movement_line       TEXT NOT NULL,
  ritual_posture      TEXT NOT NULL,
  bespoke_paragraph   TEXT NOT NULL,
  resonance_score     FLOAT,
  UNIQUE(cycle_id, slot)
);

-- ─── RECALIBRATION RHYTHMS ────────────────────────────────────

CREATE TABLE recalibration_rhythms (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycle_id        TEXT UNIQUE NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  natural_tempo   TEXT NOT NULL,
  gravity_phase   TEXT NOT NULL,
  grace_phase     TEXT NOT NULL,
  next_review_at  TIMESTAMPTZ,
  rhythm_band     TEXT NOT NULL,
  guidance        TEXT NOT NULL
);

-- ─── ANALYST NOTES ────────────────────────────────────────────

CREATE TABLE analyst_notes (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  note_type   TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────
-- Enable RLS on all tables for Supabase auth

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE station_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_arcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE coherence_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE compass_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE blind_spot_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE synergy_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lexicon_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE heatmap_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE recalibration_rhythms ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyst_notes ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users read own data" ON users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users read own cycles" ON cycles FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users read own responses" ON station_responses FOR SELECT
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()::text));
CREATE POLICY "Users read own letters" ON integration_letters FOR SELECT
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()::text));
CREATE POLICY "Users read own cards" ON practice_cards FOR SELECT
  USING (cycle_id IN (SELECT id FROM cycles WHERE user_id = auth.uid()::text));

-- Service role (backend) has full access via SUPABASE_SERVICE_ROLE_KEY
-- No additional policies needed for server-side operations
