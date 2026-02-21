import { StationConfig } from '@/lib/types';

/**
 * COSMIC OS — 12-Station Diagnostic Configuration
 *
 * Stations -6 to +6 form a loop (not a ladder):
 *   Descent (-6 to -1): Integration through depth
 *   Hinge  (-2 to +2):  Core Compass Zone (1.2x weight)
 *   Ascent (+1 to +6):  Expression through expansion
 *
 * Each station has dropdown options for Primary (Most Real) and Secondary (Second Pulse).
 */

export const STATIONS: StationConfig[] = [
  // ─── DESCENT ARC ────────────────────────────────────────────
  {
    station: -6,
    name: 'Covenant',
    arcName: 'Origin (Root Memory)',
    arc: 'descent',
    primaryLabel: 'Primary Covenant',
    secondaryLabel: 'Secondary Covenant',
    options: [
      'Justice', 'Freedom', 'Truth', 'Mercy', 'Beauty',
      'Service', 'Knowledge', 'Unity', 'Courage', 'Love',
      'Harmony', 'Integrity',
    ],
    reflectionPrompt: 'What vow did your soul make before you had words for it? Describe the non-negotiable principle that anchors everything.',
    hingeWeight: 1.0,
  },
  {
    station: -5,
    name: 'Core Qualities',
    arcName: 'Tension',
    arc: 'descent',
    primaryLabel: 'Primary Quality',
    secondaryLabel: 'Secondary Quality',
    options: [
      'Discipline', 'Joy', 'Patience', 'Resilience', 'Curiosity',
      'Devotion', 'Clarity', 'Warmth', 'Precision', 'Generosity',
      'Boldness', 'Stillness',
    ],
    reflectionPrompt: 'Which quality keeps you steady when everything else shakes? And which one lights you up when you let it run freely?',
    hingeWeight: 1.0,
  },
  {
    station: -4,
    name: 'Cosmic Role',
    arcName: 'Commitment',
    arc: 'descent',
    primaryLabel: 'Primary Role',
    secondaryLabel: 'Secondary Role',
    options: [
      'Warrior', 'Healer', 'Builder', 'Guardian', 'Teacher',
      'Artist', 'Diplomat', 'Visionary', 'Keeper', 'Reformer',
      'Witness', 'Conductor',
    ],
    reflectionPrompt: 'If the universe assigned you a role — not a job, but a cosmic function — what would it be? How does this show up, and what happens when it goes quiet?',
    hingeWeight: 1.0,
  },
  {
    station: -3,
    name: 'Archetype',
    arcName: 'Refinement',
    arc: 'descent',
    primaryLabel: 'Primary Archetype',
    secondaryLabel: 'Secondary Archetype',
    options: [
      'Sentinel', 'Rebel', 'Sage', 'Alchemist', 'Weaver',
      'Mystic', 'Pioneer', 'Shepherd', 'Strategist', 'Torchbearer',
      'Oracle', 'Craftsman',
    ],
    reflectionPrompt: 'What inner character drives your pattern? How does this archetype express through you — and where is its shadow?',
    hingeWeight: 1.0,
  },
  // ─── HINGE ZONE (-2 to +2) ─ CORE COMPASS ──────────────────
  {
    station: -2,
    name: 'Origin Imprints',
    arcName: 'Yielding',
    arc: 'descent',
    primaryLabel: 'Primary Imprint',
    secondaryLabel: 'Secondary Imprint',
    options: [
      'Injustice', 'Belonging', 'Displacement', 'Awakening', 'Silence',
      'Loss', 'Discovery', 'Rupture', 'Grace', 'Solitude',
      'Migration', 'Revelation',
    ],
    reflectionPrompt: 'What early experience broke you open? What origin imprint — the moment that shaped your lens on the world — still echoes in you?',
    hingeWeight: 1.2,
  },
  {
    station: -1,
    name: 'Drivers',
    arcName: 'Hinge (Threshold)',
    arc: 'descent',
    primaryLabel: 'Primary Driver',
    secondaryLabel: 'Secondary Driver',
    options: [
      'Connecting', 'Organizing', 'Creating', 'Protecting', 'Teaching',
      'Healing', 'Building', 'Translating', 'Reforming', 'Nurturing',
      'Curating', 'Pioneering',
    ],
    reflectionPrompt: 'What drives you at your most alive? And when does that drive burn too hot or too cold?',
    hingeWeight: 1.2,
  },
  {
    station: 0,
    name: 'Core Skills',
    arcName: 'Re-Alignment',
    arc: 'hinge',
    primaryLabel: 'Primary Skill',
    secondaryLabel: 'Secondary Skill',
    options: [
      'Design', 'Listening', 'Synthesis', 'Negotiation', 'Writing',
      'Facilitation', 'Analysis', 'Storytelling', 'Mediation', 'Curation',
      'Strategy', 'Mentoring',
    ],
    reflectionPrompt: 'What skill feels most like breathing — effortless and essential? And which secondary skill enriches it?',
    hingeWeight: 1.2,
  },
  // ─── ASCENT ARC ─────────────────────────────────────────────
  {
    station: 1,
    name: 'Applied Shell',
    arcName: 'Emergence',
    arc: 'ascent',
    primaryLabel: 'Primary Shell',
    secondaryLabel: 'Secondary Shell',
    options: [
      'Platform', 'Company', 'Studio', 'Practice', 'Movement',
      'Foundation', 'Collective', 'Laboratory', 'Academy', 'Network',
      'Publication', 'Commons',
    ],
    reflectionPrompt: 'What outer form best houses your inner architecture? How does your work show up in the world?',
    hingeWeight: 1.2,
  },
  {
    station: 2,
    name: 'Field Effect',
    arcName: 'Expansion',
    arc: 'ascent',
    primaryLabel: 'Primary Field',
    secondaryLabel: 'Secondary Field',
    options: [
      'People', 'Networks', 'Resources', 'Systems', 'Culture',
      'Capital', 'Knowledge', 'Technology', 'Community', 'Policy',
      'Land', 'Energy',
    ],
    reflectionPrompt: 'What gathers around your work naturally? What resources, people, or energies tend to orbit your purpose?',
    hingeWeight: 1.2,
  },
  {
    station: 3,
    name: 'Civilizational Lever',
    arcName: 'Translation',
    arc: 'ascent',
    primaryLabel: 'Primary Lever',
    secondaryLabel: 'Secondary Lever',
    options: [
      'Education', 'Finance', 'Governance', 'Health', 'Technology',
      'Agriculture', 'Arts', 'Infrastructure', 'Trade', 'Justice',
      'Environment', 'Media',
    ],
    reflectionPrompt: 'If your work scaled to civilizational impact, which lever would it pull? What systemic change does your architecture point toward?',
    hingeWeight: 1.0,
  },
  {
    station: 4,
    name: 'Transcendent Echo',
    arcName: 'Transmission',
    arc: 'ascent',
    primaryLabel: 'Primary Echo',
    secondaryLabel: 'Secondary Echo',
    options: [
      'Community', 'Legacy', 'Lineage', 'Culture', 'Tradition',
      'Institution', 'Movement', 'Archive', 'Ritual', 'Commons',
      'Song', 'Story',
    ],
    reflectionPrompt: 'What do you hope outlives you? What echo of your work reverberates beyond your presence?',
    hingeWeight: 1.0,
  },
  {
    station: 5,
    name: 'Final Return',
    arcName: 'Stewardship',
    arc: 'ascent',
    primaryLabel: 'Primary Return',
    secondaryLabel: 'Secondary Return',
    options: [
      'Love', 'Impact', 'Peace', 'Truth', 'Service',
      'Joy', 'Wisdom', 'Unity', 'Grace', 'Clarity',
      'Presence', 'Silence',
    ],
    reflectionPrompt: 'When the arc completes — what do you want to have been true about how you lived and worked?',
    hingeWeight: 1.0,
  },
  {
    station: 6,
    name: 'Eschatological Return',
    arcName: 'Continuation (Return)',
    arc: 'ascent',
    primaryLabel: 'Primary Continuation',
    secondaryLabel: 'Secondary Continuation',
    options: [
      'Wholeness', 'Compassion', 'Transcendence', 'Harmony', 'Surrender',
      'Light', 'Return', 'Devotion', 'Integration', 'Renewal',
      'Proportion', 'Breath',
    ],
    reflectionPrompt: 'At the very end — what single quality defines the soul that showed up? What is the final word your geometry speaks?',
    hingeWeight: 1.0,
  },
];

// ─── STATION ORDER (Diagnostic flow) ─────────────────────────
// The diagnostic presents stations in a specific order:
// 0 (Core Skills) first, then descent (-1 to -6), then ascent (+1 to +6)
// This mirrors the original form structure observed in the JSON data.

export const DIAGNOSTIC_ORDER: number[] = [
  0,   // Core Skills (center)
  1,   // Applied Shell
  2,   // Field Effect
  3,   // Civilizational Lever
  4,   // Transcendent Echo
  5,   // Final Return
  6,   // Eschatological Return
  -1,  // Drivers
  -2,  // Origin Imprints
  -3,  // Archetype
  -4,  // Cosmic Role
  -5,  // Core Qualities
  -6,  // Covenant
];

export const LEXICON_OPTIONS = [
  'Prefer not to specify',
  'Islamic / Quranic',
  'Christian / Biblical',
  'Buddhist / Dharmic',
  'Hindu / Vedic',
  'Jewish / Kabbalistic',
  'Indigenous / Ancestral',
  'Secular / Humanist',
  'Sufi / Mystical',
  'Philosophical / Stoic',
  'Ecological / Animist',
];

export function getStation(num: number): StationConfig | undefined {
  return STATIONS.find(s => s.station === num);
}

export function getStationByOrder(index: number): StationConfig | undefined {
  const stationNum = DIAGNOSTIC_ORDER[index];
  if (stationNum === undefined) return undefined;
  return getStation(stationNum);
}

export const TOTAL_STATIONS = STATIONS.length; // 13 stations (-6 to +6)
// Plus 4 integration steps: lexicon, life-arc-short, life-arc-mid, life-arc-long, integration-feeling, os-name
export const TOTAL_STEPS = TOTAL_STATIONS + 4; // 17 total steps
