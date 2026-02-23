import Anthropic from '@anthropic-ai/sdk';
import { StationResponse, CoherenceScore, CompassAnalytics, BlindSpotFlag, SynergyPair, LexiconProfile, IntegrationLetter } from './types';
import { DirectionCard } from './directions';
import { STATIONS } from '@/config/stations';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface PodcastScript {
  title: string;
  script: string;
  chapters: { name: string; startWord: number }[];
  wordCount: number;
  estimatedDurationSeconds: number;
}

export async function generatePodcastScript(
  responses: StationResponse[],
  scores: CoherenceScore[],
  compass: CompassAnalytics,
  blindSpots: BlindSpotFlag[],
  synergyPairs: SynergyPair[],
  lexicon: LexiconProfile,
  letter: IntegrationLetter,
  directions: DirectionCard[],
  lifeArc: { shortTerm: string; midTerm: string; longTerm: string },
  userName: string,
): Promise<PodcastScript> {
  const stationSummary = responses.map(r => {
    const config = STATIONS.find(s => s.station === r.station);
    const score = scores.find(s => s.station === r.station);
    return `${config?.name} (${r.station}): ${r.primary}/${r.secondary} — ${score?.weighted?.toFixed(2)} — "${r.reflection.slice(0, 100)}"`;
  }).join('\n');

  const directionSummary = directions.map((d, i) =>
    `Direction ${i + 1}: ${d.title} (${d.confidence}) — ${d.whyThisFits.slice(0, 100)}`
  ).join('\n');

  const prompt = `Write a spoken narrative podcast script for ${userName}'s Aurea coherence story.

This podcast weaves together everything from their diagnostic into one continuous, intimate narrative. It should feel like a wise friend who has read their entire profile with care and is now sitting across from them, telling them what they see.

PROFILE DATA:
${stationSummary}

COMPASS: ${compass.quadrant} quadrant, Gravity ${compass.gravityIndex}, Grace ${compass.graceIndex}, Balance ${compass.balanceRatio}
IMAGERY FAMILY: ${lexicon.primaryFamily} (secondary: ${lexicon.secondaryAccent || 'none'})
TOP METAPHORS: ${lexicon.topMetaphors.join(', ')}

LETTER TITLE: "${letter.title}"
SIGNATURE MOMENT: "${letter.signatureMoment}"

DIRECTIONS:
${directionSummary}

LIFE ARC:
- Short-term: ${lifeArc.shortTerm.slice(0, 200)}
- Mid-term: ${lifeArc.midTerm.slice(0, 200)}
- Long-term: ${lifeArc.longTerm.slice(0, 200)}

BLIND SPOTS: ${blindSpots.map(b => `${b.narrative.slice(0, 80)}`).join('; ') || 'None'}
SYNERGIES: ${synergyPairs.map(s => s.narrative.slice(0, 80)).join('; ') || 'None'}

STRUCTURE (5 chapters, ~2000 words total):

CHAPTER 1 — THE ORIGIN ARC (~400 words)
Draw from stations -6 through -1. Begin with a grounding image from their imagery family. Introduce who they are at their foundation. Name their covenant, their archetype, their origin imprints. Make it feel like the opening of a documentary about a person you deeply respect.

CHAPTER 2 — THE PRESENT COHERENCE (~400 words)
Draw from stations 0 through +4. How their core expresses itself now. Where they are aligned (gold zones), where there is growth (emerald), where there is quiet waiting (teal). Use the compass data — are they in equilibrium, compression, expansion, or latency? What does that feel like in daily life?

CHAPTER 3 — THE INTEGRATION MOMENT (~400 words)
The moment when all 12 stations are seen together. Reference the blind spots (what they might not see about themselves) and the synergy pairs (where their natural strengths flow). Weave in themes from the integration letter without reading it verbatim. This is the "aha" chapter.

CHAPTER 4 — THE DIRECTION FORWARD (~500 words)
Narrate the Direction Map. Don't list cards — tell a story. "Given everything we've just walked through — your [covenant] combined with your [core skill] and your [field effect] — there are paths ahead where all of this would breathe." Walk through each direction with warmth and specificity.

CHAPTER 5 — THE CLOSING (~300 words)
Tie the life arc goals back to the directions. Deliver the signature moment from the integration letter as a spoken gift. Close with an invitation to return in six months. End on a breath word from their imagery family.

WRITING RULES:
- Use ${userName}'s name 3-4 times throughout (not in every paragraph)
- Write for spoken cadence: short sentences, no complex subordinate clauses
- Mark pauses with [pause]
- Use the ${lexicon.primaryFamily} imagery family as the governing metaphor throughout
- Include 2-3 rhetorical questions
- Never say "your score was 0.85" — translate numbers into feeling
- The tone should be serene, warm, and gently catalytic
- Total: approximately 2000 words

Return ONLY valid JSON:
{
  "title": "Podcast episode title in the imagery family (e.g., 'The Geometry of Light and Flow')",
  "script": "The full script text with [pause] markers",
  "chapters": [
    { "name": "The Origin Arc", "startWord": 0 },
    { "name": "The Present Coherence", "startWord": 400 },
    { "name": "The Integration Moment", "startWord": 800 },
    { "name": "The Direction Forward", "startWord": 1200 },
    { "name": "The Closing", "startWord": 1700 }
  ],
  "wordCount": 2000,
  "estimatedDurationSeconds": 780
}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 8192,
    system: 'You are the Aurea Podcast Narrator — a warm, contemplative voice that weaves personal coherence data into intimate spoken narrative. You speak like a wise friend, not a clinical analyst. You always return valid JSON.',
    messages: [{ role: 'user', content: prompt }],
  });

  const block = message.content[0];
  if (block.type !== 'text') throw new Error('Unexpected response format');

  const jsonMatch = block.text.match(/```json\s*([\s\S]*?)```/) || block.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in podcast script response');
  return JSON.parse(jsonMatch[1] || jsonMatch[0]);
}
