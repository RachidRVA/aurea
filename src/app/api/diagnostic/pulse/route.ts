import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { STATIONS } from '@/config/stations';

/**
 * POST /api/diagnostic/pulse
 *
 * Generates an AI-powered "Pulse Reading" at arc boundaries.
 * Called at 3 points during the diagnostic:
 *   1. After Station +6 (end of ascent) → "Ascent Signal"
 *   2. After Station -6 (end of descent) → "Descent Signal"
 *   3. After integration steps → "Coherence Preview"
 */

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface PulseRequest {
  type: 'ascent' | 'descent' | 'coherence';
  responses: Record<string, { primary: string; secondary: string; reflection: string }>;
  integrationMeta?: { feeling: string; osName: string; lexiconChoice: string };
}

function getStationName(num: number): string {
  return STATIONS.find(s => s.station === num)?.name || `Station ${num}`;
}

function buildPrompt(req: PulseRequest): string {
  if (req.type === 'ascent') {
    // Summarize stations 0 through +6
    const stationSummary = [0, 1, 2, 3, 4, 5, 6]
      .map(n => {
        const r = req.responses[n];
        if (!r) return null;
        return `${getStationName(n)}: chose "${r.primary}" (secondary: "${r.secondary}")`;
      })
      .filter(Boolean)
      .join('\n');

    return `You are a poetic-analytical voice inside Aurea, a personal coherence diagnostic.

The user just completed the ASCENT ARC of their diagnostic journey — 7 stations mapping their outward expression, from core skills to eschatological return.

Here are their choices:
${stationSummary}

Write a 3-4 sentence "Ascent Signal" — a warm, poetic summary of the outward-facing pattern you see. What are they building toward? What systemic role is emerging? What is the shape of their expansion?

Rules:
- Write in second person ("You...")
- Be specific to their actual choices — reference at least 2 of their selections
- Tone: warm, perceptive, slightly luminous — like a trusted mirror
- Do NOT use clinical language. This is poetic insight, not analysis.
- Do NOT use bullet points or headers. Just flowing prose.
- Keep it under 60 words.`;
  }

  if (req.type === 'descent') {
    // Summarize stations -1 through -6
    const stationSummary = [-1, -2, -3, -4, -5, -6]
      .map(n => {
        const r = req.responses[n];
        if (!r) return null;
        return `${getStationName(n)}: chose "${r.primary}" (secondary: "${r.secondary}")`;
      })
      .filter(Boolean)
      .join('\n');

    // Also include ascent choices for contrast
    const ascentSummary = [0, 1, 2, 3]
      .map(n => {
        const r = req.responses[n];
        if (!r) return null;
        return `${getStationName(n)}: "${r.primary}"`;
      })
      .filter(Boolean)
      .join(', ');

    return `You are a poetic-analytical voice inside Aurea, a personal coherence diagnostic.

The user just completed the DESCENT ARC — 6 stations mapping their inner depth, from drivers to root covenant.

Descent choices:
${stationSummary}

For contrast, their ascent arc included: ${ascentSummary}

Write a 3-4 sentence "Descent Signal" — a warm, poetic summary of the inward pattern. What lives beneath their architecture? What root covenant drives them? How does this inner geometry relate to their outward expansion?

Rules:
- Write in second person ("You...")
- Be specific — reference at least 2 of their descent choices
- Briefly contrast with one ascent choice to show the inner-outer interplay
- Tone: deep, reverent, intimate — like a letter from the self to the self
- No bullet points, no headers. Flowing prose only.
- Keep it under 70 words.`;
  }

  // Coherence preview
  const allChoices = Object.entries(req.responses)
    .map(([num, r]) => `${getStationName(Number(num))}: "${r.primary}"`)
    .join(', ');

  return `You are a poetic-analytical voice inside Aurea, a personal coherence diagnostic.

The user has completed all 13 stations and the integration steps. Before they submit, give them a preview of their coherence shape.

All their primary choices: ${allChoices}
${req.integrationMeta?.osName ? `They named their architecture: "${req.integrationMeta.osName}"` : ''}

Write a 3-4 sentence "Coherence Preview" — a luminous glimpse of the overall pattern. What compass quadrant might they be in? What is the dominant frequency? What makes their geometry distinctive?

Rules:
- Write in second person ("You...")
- Reference their OS name if they provided one
- Mention 2-3 of their choices that form a striking pattern together
- Tone: celebratory but grounded — like seeing a mosaic from above for the first time
- No bullet points, no headers. Flowing prose.
- Keep it under 70 words.
- End with something that builds anticipation for the full analysis.`;
}

export async function POST(request: NextRequest) {
  try {
    const body: PulseRequest = await request.json();

    if (!body.type || !body.responses) {
      return NextResponse.json({ error: 'Missing type or responses' }, { status: 400 });
    }

    const prompt = buildPrompt(body);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    const reading = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ reading, type: body.type });
  } catch (error) {
    console.error('Pulse reading error:', error);
    return NextResponse.json(
      { error: 'Failed to generate pulse reading' },
      { status: 500 }
    );
  }
}
