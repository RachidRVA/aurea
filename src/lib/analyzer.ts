import Anthropic from '@anthropic-ai/sdk';
import { StationResponse, CoherenceScore, CompassAnalytics, LexiconProfile, DeliverablePackage } from './types';
import { computeWeightedScore, computeCompassAnalytics, detectBlindSpots, detectSynergyPairs, generateHeatmapData } from './scoring';
import { buildScoringPrompt, buildLexiconPrompt, buildLetterPrompt, buildPracticeSuitePrompt, buildRecalibrationPrompt } from './prompts';

/**
 * AUREA Analysis Pipeline
 *
 * Orchestrates the 5-step AI analysis:
 *   1. Semantic Scoring (Claude scores each station)
 *   2. Lexicon Detection (identify imagery family)
 *   3. Mathematical Processing (local: compass, blind spots, synergy, heatmap)
 *   4. Integration Letter (Claude generates narrative)
 *   5. Practice Suite + Recalibration (Claude generates cards + rhythm)
 */

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function callClaude(systemPrompt: string, userPrompt: string, model = 'claude-sonnet-4-5-20250929'): Promise<string> {
  const message = await anthropic.messages.create({
    model,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const block = message.content[0];
  if (block.type === 'text') return block.text;
  throw new Error('Unexpected response format from Claude');
}

function parseJSON<T>(raw: string): T {
  // Extract JSON from potential markdown code blocks
  const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) || raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in response');
  const jsonStr = jsonMatch[1] || jsonMatch[0];
  return JSON.parse(jsonStr);
}

const SYSTEM = `You are the Aurea Analyst Engine — a precision instrument for translating human reflection into coherence geometry. Your mandate: Lucidity before speed · Translation before theology · Humility before certainty. You always return valid JSON.`;

// ─── FULL PIPELINE ───────────────────────────────────────────

export async function runFullAnalysis(
  responses: StationResponse[],
  integrationMeta: { feeling: string; osName: string; lexiconChoice: string },
  lifeArc: { shortTerm: string; midTerm: string; longTerm: string },
  userName: string,
): Promise<DeliverablePackage> {
  // Step 1: AI Scoring
  console.log('[Aurea] Step 1: Semantic scoring...');
  const scoringResult = await callClaude(SYSTEM, buildScoringPrompt(responses));
  const rawScores = parseJSON<{ scores: Array<{ station: number; clarity: number; consistency: number; coherence: number; reasoning: string }> }>(scoringResult);

  const coherenceScores: CoherenceScore[] = rawScores.scores.map(s => ({
    station: s.station as any,
    clarity: s.clarity,
    consistency: s.consistency,
    coherence: s.coherence,
    weighted: computeWeightedScore(s.clarity, s.consistency, s.coherence, s.station),
  }));

  // Step 2: Lexicon Detection
  console.log('[Aurea] Step 2: Lexicon detection...');
  const lexiconResult = await callClaude(SYSTEM, buildLexiconPrompt(responses, integrationMeta.lexiconChoice));
  const lexiconProfile = parseJSON<LexiconProfile>(lexiconResult);

  // Step 3: Mathematical Processing (local, no AI needed)
  console.log('[Aurea] Step 3: Mathematical processing...');
  const compassAnalytics = computeCompassAnalytics(coherenceScores);
  const blindSpots = detectBlindSpots(coherenceScores);
  const synergyPairs = detectSynergyPairs(coherenceScores);
  const heatmapData = generateHeatmapData(coherenceScores);

  // Step 4: Integration Letter (uses Opus for premium narrative quality)
  console.log('[Aurea] Step 4: Integration Letter generation...');
  const letterResult = await callClaude(
    SYSTEM,
    buildLetterPrompt(responses, coherenceScores, compassAnalytics, blindSpots, lexiconProfile, lifeArc, integrationMeta, userName),
    'claude-sonnet-4-5-20250929', // Use Opus for letter: 'claude-opus-4-5-20251101'
  );
  const integrationLetter = parseJSON<typeof import('./types').IntegrationLetter extends new () => infer T ? T : never>(letterResult) as any;

  // Step 5: Practice Suite + Recalibration
  console.log('[Aurea] Step 5: Practice Suite & Recalibration...');
  const [practiceResult, recalResult] = await Promise.all([
    callClaude(SYSTEM, buildPracticeSuitePrompt(responses, compassAnalytics, lexiconProfile, userName)),
    callClaude(SYSTEM, buildRecalibrationPrompt(compassAnalytics, lexiconProfile, lifeArc)),
  ]);

  const practiceCards = parseJSON<{ cards: typeof import('./types').PracticeCard[] }>(practiceResult).cards as any[];
  const recalibration = parseJSON<any>(recalResult);

  console.log('[Aurea] Analysis complete.');

  return {
    coherenceScores,
    compassAnalytics,
    blindSpots,
    synergyPairs,
    lexiconProfile,
    heatmapData,
    integrationLetter,
    practiceCards,
    recalibration,
  };
}
