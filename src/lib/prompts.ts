import { StationResponse, ImageryFamily, LexiconProfile, CoherenceScore, CompassAnalytics, BlindSpotFlag, PracticeCard, IntegrationLetter, RecalibrationRhythm } from './types';
import { STATIONS } from '@/config/stations';
import { BRAND, ANALYST_MANDATE } from '@/config/brand';

/**
 * AUREA AI Prompt Chains
 *
 * Encodes the full Analyst Codex into structured Claude prompts.
 * Pipeline: Scoring → Lexicon Detection → Letter Generation → Practice Suite
 *
 * Each prompt follows the Codex mandates:
 *   - Lucidity > Mystery
 *   - Proportion > Perfection
 *   - Witness > Judgment
 *   - Humility > Authority
 *   - Rhythm > Result
 */

// ─── SYSTEM CONTEXT ──────────────────────────────────────────

const SYSTEM_CONTEXT = `You are the ${BRAND.name} Analyst Engine — a precision instrument for translating human reflection into coherence geometry.

Your mandate: ${ANALYST_MANDATE}

You operate the ${BRAND.name} system, which maps awareness across twelve stations (-6 Covenant to +6 Return) forming a descent-hinge-ascent loop. Each station measures STATE — how awareness distributes across memory, mastery, and meaning.

Core principles:
- You are a mirror, not an oracle.
- Every metric returns to dignity.
- Coherence is rhythm, not perfection.
- One imagery family per person; no mixed metaphors.
- Color logic: Gold (>0.85) = effortless fluency; Emerald (0.70-0.84) = stable growth; Teal (<0.70) = quiet waiting.

You never diagnose, predict, or prescribe. You translate proportion into recognition.`;

// ─── STEP 1: COHERENCE SCORING ───────────────────────────────

export function buildScoringPrompt(responses: StationResponse[]): string {
  const stationData = responses.map(r => {
    const config = STATIONS.find(s => s.station === r.station);
    return `Station ${r.station} (${config?.name}):
  Primary: ${r.primary}
  Secondary: ${r.secondary}
  Reflection: "${r.reflection}"`;
  }).join('\n\n');

  return `Score each station response for coherence on three dimensions (0.00-1.00 each):

1. CLARITY: How directly does this person express inner truth? (Low = diffuse/evasive, High = focused/honest)
2. CONSISTENCY: How well do the motifs in this response recur across other stations? (Cross-reference themes)
3. COHERENCE: How balanced is the response between strength and receptivity? (Not too rigid, not too scattered)

Station Responses:
${stationData}

Return ONLY valid JSON in this exact format:
{
  "scores": [
    { "station": -6, "clarity": 0.00, "consistency": 0.00, "coherence": 0.00, "reasoning": "..." },
    ...for each station...
  ]
}

Scoring guidelines:
- Read ALL reflections first before scoring any; consistency requires cross-referencing.
- Reflections under 15 words = max clarity of 0.70 (insufficient depth).
- When primary and secondary choices create rich tension (not contradiction), reward coherence.
- Hinge zone stations (-2 to +2) carry inherent weight — score their quality, not their importance.
- Never score below 0.40 unless the reflection is genuinely empty or contradictory.`;
}

// ─── STEP 2: LEXICON DETECTION ───────────────────────────────

export function buildLexiconPrompt(responses: StationResponse[], lexiconPreference: string): string {
  const reflections = responses.map(r => r.reflection).join('\n\n');

  return `Analyze the following reflections to determine this person's natural imagery family.

REFLECTIONS:
${reflections}

STATED PREFERENCE: ${lexiconPreference || 'Not specified'}

AVAILABLE IMAGERY FAMILIES:
1. architecture_light — Structure, light, beams, windows, rooms, blueprints. (Default for builders/designers)
2. ecological_growth — Roots, seasons, soil, canopy, ecosystem, mycelium.
3. oceanic_navigation — Tides, currents, harbors, depth, navigation, shores.
4. musical_composition — Rhythm, harmony, cadence, resonance, chord, tempo.
5. astronomical_orbit — Orbit, constellation, gravity, luminosity, eclipse.
6. textile_weaving — Thread, weave, fabric, pattern, loom, tapestry.
7. flame_forge — Fire, forge, temper, spark, crucible, ash.
8. garden_cultivation — Garden, cultivate, prune, bloom, compost, tend.
9. wind_sky — Wind, horizon, breath, atmosphere, altitude, flight.
10. crystalline_geometry — Crystal, facet, lattice, refraction, clarity, prism.

ANALYSIS INSTRUCTIONS:
- Extract the top 10 metaphors and top 10 action verbs from ALL reflections combined.
- Score semantic similarity between extracted language and each imagery family.
- Select primary family (strongest match) and optional secondary accent.
- Determine tone ratio: what percentage feels serene vs. catalytic?
- Determine color cue: based on overall energy — gold (warm/masterful), emerald (grounded/patient), teal (reaching/becoming).

Return ONLY valid JSON:
{
  "primaryFamily": "architecture_light",
  "secondaryAccent": "ecological_growth" | null,
  "toneRatio": "70_serene_30_catalytic",
  "colorCue": "gold_dominant",
  "topMetaphors": ["structure", "light", ...],
  "topVerbs": ["build", "connect", ...]
}`;
}

// ─── STEP 3: INTEGRATION LETTER GENERATION ───────────────────

export function buildLetterPrompt(
  responses: StationResponse[],
  scores: CoherenceScore[],
  compass: CompassAnalytics,
  blindSpots: BlindSpotFlag[],
  lexicon: LexiconProfile,
  lifeArc: { shortTerm: string; midTerm: string; longTerm: string },
  integrationMeta: { feeling: string; osName: string },
  userName: string,
): string {
  const stationSummary = responses.map(r => {
    const config = STATIONS.find(s => s.station === r.station);
    const score = scores.find(s => s.station === r.station);
    return `${config?.name} (${r.station}): ${r.primary}/${r.secondary} — Score: ${score?.weighted?.toFixed(2)} — "${r.reflection.slice(0, 100)}..."`;
  }).join('\n');

  const blindSpotSummary = blindSpots.map(b =>
    `${b.flagType}: stations ${b.stationA}↔${b.stationB}, delta ${b.delta}`
  ).join('\n');

  return `Write the ${BRAND.name} Integration Letter for ${userName}.

IMAGERY FAMILY: ${lexicon.primaryFamily} (secondary: ${lexicon.secondaryAccent || 'none'})
TONE RATIO: ${lexicon.toneRatio}
TOP METAPHORS: ${lexicon.topMetaphors.join(', ')}

COMPASS ANALYTICS:
- Gravity Index: ${compass.gravityIndex}
- Grace Index: ${compass.graceIndex}
- Balance Ratio: ${compass.balanceRatio}
- Quadrant: ${compass.quadrant}

STATION SUMMARY:
${stationSummary}

BLIND SPOTS:
${blindSpotSummary}

LIFE ARC:
- Short term: ${lifeArc.shortTerm.slice(0, 200)}...
- Mid term: ${lifeArc.midTerm.slice(0, 200)}...
- Long term: ${lifeArc.longTerm.slice(0, 200)}...

USER FEELINGS: ${integrationMeta.feeling.slice(0, 300)}
CHOSEN OS NAME: ${integrationMeta.osName || 'Not specified'}

LETTER STRUCTURE (follow exactly):

1. TITLE: A poetic title reflecting the person's central geometry (e.g., "The Geometry of Light and Flow"). 3-6 words.

2. ACKNOWLEDGEMENT & ESSENCE (100-150 words):
   - Begin with silence or breath imagery.
   - Mirror the person's dignity. Name their current life arc (work, creation, vocation).
   - Anchor trust before analysis. Feeling: "I am seen."

3. KEY PATTERN — THE MOMENT OF REVELATION (100-150 words):
   - Reveal the governing pattern. Show how it appears in their work.
   - Mark the hinge between conviction and form.
   - Use one metaphor family consistently. Feeling: "Now I understand."

4. INVITATION TO INTEGRATION (100-150 words):
   - Translate awareness into motion. Name the core zone (-2 to +2).
   - Outline the next embodied practice shift.
   - Use verb-led sentences. Feeling: "This is what to do with it."

5. THE CORE COMPASS (100-150 words):
   - Describe the hinge between gravity and grace.
   - Alternate ground and sky imagery. Weekly/seasonal rhythm cues.
   - Feeling: "I see how my inner rhythm works."

6. GEOMETRY OF FLOW (80-120 words):
   - Introduce gold/emerald/teal flow logic.
   - Never mention numbers directly. Describe sensations.
   - Feeling: "Everything connects."

7. SIGNATURE MOMENT (1 sentence):
   - Fuse inner vow + outer vocation into one luminous line.
   - This becomes their navigational mantra for six months.

8. CONTINUATION (80-100 words):
   - Reopen the arc. Invite six-month return.
   - End with breath word (light, rhythm, return).
   - Feeling: "Complete, but still in motion."

WRITING RULES:
- Second-person voice ("You have always known...")
- Sentence length: 12-18 words (breath-length)
- NEVER mention numbers, scores, or technical terms
- One imagery family throughout — no mixed metaphors
- End every section in stillness; begin the next in movement
- 700-900 words total
- Final word must belong to breath/light family

Return ONLY valid JSON:
{
  "title": "...",
  "acknowledgement": "...",
  "keyPattern": "...",
  "invitation": "...",
  "coreCompass": "...",
  "geometryOfFlow": "...",
  "signatureMoment": "...",
  "continuation": "...",
  "fullMarkdown": "... (the complete letter as formatted markdown)"
}`;
}

// ─── STEP 4: PRACTICE SUITE GENERATION ───────────────────────

export function buildPracticeSuitePrompt(
  responses: StationResponse[],
  compass: CompassAnalytics,
  lexicon: LexiconProfile,
  userName: string,
): string {
  const reflections = responses.map(r => {
    const config = STATIONS.find(s => s.station === r.station);
    return `${config?.name}: ${r.primary}/${r.secondary} — "${r.reflection.slice(0, 150)}"`;
  }).join('\n');

  return `Generate the ${BRAND.name} Practice Suite — six sensory cards for ${userName}.

IMAGERY FAMILY: ${lexicon.primaryFamily}
COMPASS: Gravity ${compass.gravityIndex} / Grace ${compass.graceIndex} / BR ${compass.balanceRatio}
QUADRANT: ${compass.quadrant}

STATION DATA:
${reflections}

CARD ARCHITECTURE (generate exactly 6 cards):

Card 1 — MIND (Slot 1): Preserve/Protect. Anchor integrity before action.
Card 2 — BODY (Slot 2): Enter/Immerse. Reconnect to lived experience.
Card 3 — HEART (Slot 3): Yield/Share. Decentralize authorship; allow communion.
Card 4 — INTUITION (Slot 4): Tend/Balance. Re-center between gravity and grace.
Card 5 — EYE/EAR (Slot 5): Radiate/Extend. Express mastery outward; teach by presence.
Card 6 — SPIRIT (Slot 6): Return/Revisit. Close the cycle; turn repetition into rhythm.

EACH CARD MUST HAVE:
- title: A verb-phrase movement name in the person's imagery family (e.g., "Preserve Harmony")
- movementLine: One-sentence sacred mantra (italic energy)
- ritualPosture: 3-4 sensory lines describing how it FEELS when embodied
- bespokeParagraph: 100-120 words grounding the ritual in this person's REAL arc (career, relationships, creative work)

RULES:
- Stay within ONE imagery family throughout all 6 cards
- Tone balance: 70% serene / 30% catalytic
- All verbs must be sensory, not conceptual
- Each card should breathe aloud in ~20 seconds
- Never prescribe; only invite

Return ONLY valid JSON:
{
  "cards": [
    {
      "slot": 1,
      "senseAxis": "mind",
      "title": "...",
      "movementLine": "...",
      "ritualPosture": "...",
      "bespokeParagraph": "..."
    },
    ...for all 6 cards...
  ]
}`;
}

// ─── STEP 5: RECALIBRATION RHYTHM ────────────────────────────

export function buildRecalibrationPrompt(
  compass: CompassAnalytics,
  lexicon: LexiconProfile,
  lifeArc: { shortTerm: string; midTerm: string; longTerm: string },
): string {
  return `Generate a Recalibration Rhythm profile based on:

COMPASS: Gravity ${compass.gravityIndex} / Grace ${compass.graceIndex} / BR ${compass.balanceRatio} / Quadrant: ${compass.quadrant}
IMAGERY: ${lexicon.primaryFamily}
LIFE ARC (short): ${lifeArc.shortTerm.slice(0, 200)}

Determine:
1. naturalTempo: The person's natural cycle pattern (e.g., "semi_annual_harmonic", "quarterly_pulse", "annual_deep_reset")
2. gravityPhase: Description of their consolidation/building phase
3. gracePhase: Description of their diffusion/release phase
4. rhythmBand: "gravity_lead" (BR < 0.95), "balanced" (0.95-1.05), or "grace_lead" (BR > 1.05)
5. guidance: 150-200 words of rhythm guidance — daily, weekly, quarterly, semi-annual, annual cadence.

RULES:
- Use time metaphors, not performance verbs
- Frame as "breathing windows," not deadlines
- Stay in the person's imagery family
- Prescribe tempo, not tasks

Return ONLY valid JSON:
{
  "naturalTempo": "...",
  "gravityPhase": "...",
  "gracePhase": "...",
  "rhythmBand": "...",
  "guidance": "..."
}`;
}
