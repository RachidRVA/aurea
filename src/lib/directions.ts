import Anthropic from '@anthropic-ai/sdk';
import { StationResponse, CoherenceScore, CompassAnalytics, BlindSpotFlag, SynergyPair, LexiconProfile } from './types';
import { STATIONS } from '@/config/stations';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface DirectionCard {
  title: string;
  confidence: 'gold' | 'emerald' | 'teal';
  whyThisFits: string;
  whereThisLives: string[];
  entryPoints: string[];
  yourEdge: string;
  evidenceStations: number[];
}

export interface DirectionMap {
  directions: DirectionCard[];
  summary: string;
  generatedAt: string;
}

export async function generateDirectionMap(
  responses: StationResponse[],
  scores: CoherenceScore[],
  compass: CompassAnalytics,
  blindSpots: BlindSpotFlag[],
  synergyPairs: SynergyPair[],
  lexicon: LexiconProfile,
  lifeArc: { shortTerm: string; midTerm: string; longTerm: string },
  userName: string,
): Promise<DirectionMap> {
  const stationSummary = responses.map(r => {
    const config = STATIONS.find(s => s.station === r.station);
    const score = scores.find(s => s.station === r.station);
    return `Station ${r.station} (${config?.name}): Primary: ${r.primary}, Secondary: ${r.secondary}, Score: ${score?.weighted?.toFixed(2)}, Reflection: "${r.reflection.slice(0, 150)}"`;
  }).join('\n');

  const blindSpotSummary = blindSpots.map(b =>
    `${b.flagType}: ${STATIONS.find(s => s.station === b.stationA)?.name} ↔ ${STATIONS.find(s => s.station === b.stationB)?.name} (delta: ${b.delta})`
  ).join('\n');

  const synergySummary = synergyPairs.map(sp =>
    `${STATIONS.find(s => s.station === sp.stationA)?.name} + ${STATIONS.find(s => s.station === sp.stationB)?.name} (harmonic: ${sp.correlationR})`
  ).join('\n');

  const prompt = `You are a career intelligence analyst specializing in translating personal coherence profiles into professional directions. You have access to a 12-station coherence profile that reveals deep professional signals.

You are NOT a generic career advisor. Your directions must be grounded in specific station evidence, not platitudes. Every recommendation must cite at least two specific stations and their data as evidence.

PROFILE FOR ${userName}:

STATION DATA:
${stationSummary}

COMPASS ANALYTICS:
- Gravity Index: ${compass.gravityIndex} (depth/structure)
- Grace Index: ${compass.graceIndex} (flow/expression)
- Balance Ratio: ${compass.balanceRatio}
- Quadrant: ${compass.quadrant}
- Vector: ${compass.vectorDirection}

BLIND SPOTS (misalignment signals):
${blindSpotSummary || 'None detected'}

SYNERGY PAIRS (natural strength channels):
${synergySummary || 'None above threshold'}

IMAGERY FAMILY: ${lexicon.primaryFamily}
TOP METAPHORS: ${lexicon.topMetaphors.join(', ')}

LIFE ARC:
- Short-term (12 months): ${lifeArc.shortTerm}
- Mid-term (2-3 years): ${lifeArc.midTerm}
- Long-term (10+ years): ${lifeArc.longTerm}

INSTRUCTIONS:
Generate 3-5 professional direction cards. Each direction is a professional ORIENTATION, not a job title.

Rules:
1. Each direction MUST cite at least 2 specific stations with their primary/secondary choices as evidence
2. Weight directions toward the user's stated life arc — if their short-term goal is stability, don't lead with "start a nonprofit"
3. Include a mix of confidence levels: at least one gold (high-confidence, multiple stations converge), one emerald (solid fit), and optionally one teal (exploratory, surprising)
4. "Where This Lives" should name specific industries, sectors, and organization types
5. "Entry Points" should name specific roles, functions, or positions
6. "Your Edge" should explain what makes THIS person's specific profile distinctive — not generic strengths
7. NEVER give generic advice like "consider a career in leadership" or "explore your passions"
8. Each direction should feel genuinely different from the others — different industries, different functions, different scales

Return ONLY valid JSON:
{
  "directions": [
    {
      "title": "Direction orientation name (not a job title)",
      "confidence": "gold" | "emerald" | "teal",
      "whyThisFits": "2-3 sentences referencing specific station data",
      "whereThisLives": ["industry/sector 1", "industry/sector 2", "industry/sector 3"],
      "entryPoints": ["specific role 1", "specific role 2", "specific role 3"],
      "yourEdge": "What makes this person's profile distinctive here",
      "evidenceStations": [0, 1, 2]
    }
  ],
  "summary": "2-3 sentence overall direction narrative"
}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    system: 'You are the Aurea Direction Map Engine — a precision instrument for translating coherence profiles into professional directions. Your mandate: Specificity over generality. Evidence over intuition. Dignity over prescription. You always return valid JSON.',
    messages: [{ role: 'user', content: prompt }],
  });

  const block = message.content[0];
  if (block.type !== 'text') throw new Error('Unexpected response format');

  const jsonMatch = block.text.match(/```json\s*([\s\S]*?)```/) || block.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in Direction Map response');
  const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);

  return {
    directions: parsed.directions,
    summary: parsed.summary,
    generatedAt: new Date().toISOString(),
  };
}
