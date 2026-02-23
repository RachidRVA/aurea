-- ╔══════════════════════════════════════════════════════════════╗
-- ║  AUREA — Migration V2: Direction Maps + Podcast Scripts    ║
-- ║  Adds tables for Direction Map and Podcast features        ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ─── DIRECTION MAPS ─────────────────────────────────────────
-- Stores AI-generated career/life direction recommendations

CREATE TABLE IF NOT EXISTS direction_maps (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycle_id        TEXT UNIQUE NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  directions      JSONB NOT NULL DEFAULT '[]',
  summary         TEXT,
  model_used      TEXT DEFAULT 'claude-sonnet-4-5-20250929',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_direction_maps_cycle ON direction_maps(cycle_id);
CREATE INDEX IF NOT EXISTS idx_direction_maps_user ON direction_maps(user_id);

-- ─── PODCAST SCRIPTS ────────────────────────────────────────
-- Stores AI-generated integrative podcast narrative scripts

CREATE TABLE IF NOT EXISTS podcast_scripts (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycle_id        TEXT UNIQUE NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  script_text     TEXT NOT NULL,
  chapter_markers JSONB NOT NULL DEFAULT '[]',
  word_count      INT,
  model_used      TEXT DEFAULT 'claude-sonnet-4-5-20250929',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_podcast_scripts_cycle ON podcast_scripts(cycle_id);
CREATE INDEX IF NOT EXISTS idx_podcast_scripts_user ON podcast_scripts(user_id);

-- ─── PODCAST AUDIO ──────────────────────────────────────────
-- Stores TTS-generated audio files (future: ElevenLabs/OpenAI)

CREATE TABLE IF NOT EXISTS podcast_audio (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cycle_id        TEXT UNIQUE NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  audio_url       TEXT,
  duration_sec    INT,
  voice_id        TEXT,
  tts_provider    TEXT DEFAULT 'elevenlabs',
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'ready', 'failed')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_podcast_audio_cycle ON podcast_audio(cycle_id);
CREATE INDEX IF NOT EXISTS idx_podcast_audio_user ON podcast_audio(user_id);

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────

ALTER TABLE direction_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcast_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcast_audio ENABLE ROW LEVEL SECURITY;

-- Users can read their own direction maps
CREATE POLICY "Users read own direction maps" ON direction_maps
  FOR SELECT USING (user_id = auth.uid()::text);

-- Users can read their own podcast scripts
CREATE POLICY "Users read own podcast scripts" ON podcast_scripts
  FOR SELECT USING (user_id = auth.uid()::text);

-- Users can read their own podcast audio
CREATE POLICY "Users read own podcast audio" ON podcast_audio
  FOR SELECT USING (user_id = auth.uid()::text);

-- Service role (backend) has full access via SUPABASE_SERVICE_ROLE_KEY
-- No additional INSERT/UPDATE policies needed for server-side operations
