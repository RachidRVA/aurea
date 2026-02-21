import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { runFullAnalysis } from '@/lib/analyzer';
import { StationResponse } from '@/lib/types';

const prisma = new PrismaClient();

/**
 * POST /api/analyze
 *
 * Runs the full AUREA analysis pipeline on a submitted cycle.
 * Called internally after diagnostic submission.
 *
 * Pipeline:
 *   1. Fetch raw responses from DB
 *   2. Run 5-step AI analysis (scoring → lexicon → letter → practice → recalibration)
 *   3. Store all outputs back to DB
 *   4. Update cycle status to DELIVERED
 */
export async function POST(request: NextRequest) {
  try {
    const { cycleId } = await request.json();

    // Fetch cycle with all related data
    const cycle = await prisma.cycle.findUnique({
      where: { id: cycleId },
      include: {
        user: true,
        stationResponses: true,
        integrationMeta: true,
        lifeArc: true,
      },
    });

    if (!cycle) {
      return NextResponse.json({ error: 'Cycle not found' }, { status: 404 });
    }

    // Transform DB records to analysis format
    const responses: StationResponse[] = cycle.stationResponses.map(sr => ({
      station: sr.station as any,
      primary: sr.primary,
      secondary: sr.secondary,
      reflection: sr.reflection,
    }));

    const integrationMeta = {
      feeling: cycle.integrationMeta?.feeling || '',
      osName: cycle.integrationMeta?.osName || '',
      lexiconChoice: cycle.integrationMeta?.lexiconChoice || '',
    };

    const lifeArc = {
      shortTerm: cycle.lifeArc?.shortTerm || '',
      midTerm: cycle.lifeArc?.midTerm || '',
      longTerm: cycle.lifeArc?.longTerm || '',
    };

    // Run full analysis pipeline
    console.log(`[Aurea] Starting analysis for cycle ${cycleId}...`);
    const result = await runFullAnalysis(
      responses,
      integrationMeta,
      lifeArc,
      cycle.user.name || 'User',
    );

    // Store all results in database
    await prisma.$transaction([
      // Coherence scores
      ...result.coherenceScores.map(score =>
        prisma.coherenceScore.create({
          data: {
            cycleId,
            station: score.station,
            clarity: score.clarity,
            consistency: score.consistency,
            coherence: score.coherence,
            weighted: score.weighted,
          },
        })
      ),

      // Compass analytics
      prisma.compassAnalytics.create({
        data: {
          cycleId,
          gravityIndex: result.compassAnalytics.gravityIndex,
          graceIndex: result.compassAnalytics.graceIndex,
          balanceRatio: result.compassAnalytics.balanceRatio,
          hcr: result.compassAnalytics.hcr,
          quadrant: result.compassAnalytics.quadrant,
          vectorDirection: result.compassAnalytics.vectorDirection,
        },
      }),

      // Blind spot flags
      ...result.blindSpots.map(bs =>
        prisma.blindSpotFlag.create({
          data: {
            cycleId,
            flagType: bs.flagType,
            stationA: bs.stationA,
            stationB: bs.stationB,
            delta: bs.delta,
            narrative: bs.narrative,
            movement: bs.movement,
          },
        })
      ),

      // Synergy pairs
      ...result.synergyPairs.map(sp =>
        prisma.synergyPair.create({
          data: {
            cycleId,
            stationA: sp.stationA,
            stationB: sp.stationB,
            correlationR: sp.correlationR,
            narrative: sp.narrative,
          },
        })
      ),

      // Lexicon profile
      prisma.lexiconProfile.create({
        data: {
          cycleId,
          primaryFamily: result.lexiconProfile.primaryFamily,
          secondaryAccent: result.lexiconProfile.secondaryAccent,
          toneRatio: result.lexiconProfile.toneRatio,
          colorCue: result.lexiconProfile.colorCue,
          topMetaphors: result.lexiconProfile.topMetaphors,
          topVerbs: result.lexiconProfile.topVerbs,
        },
      }),

      // Heatmap data
      prisma.heatmapData.create({
        data: {
          cycleId,
          stationValues: result.heatmapData.stationValues,
          colorBands: result.heatmapData.colorBands,
          peakZone: result.heatmapData.peakZone,
          waitingZone: result.heatmapData.waitingZone,
        },
      }),

      // Integration letter
      prisma.integrationLetter.create({
        data: {
          cycleId,
          title: result.integrationLetter.title,
          acknowledgement: result.integrationLetter.acknowledgement,
          keyPattern: result.integrationLetter.keyPattern,
          invitation: result.integrationLetter.invitation,
          coreCompass: result.integrationLetter.coreCompass,
          geometryOfFlow: result.integrationLetter.geometryOfFlow,
          signatureMoment: result.integrationLetter.signatureMoment,
          continuation: result.integrationLetter.continuation,
          fullMarkdown: result.integrationLetter.fullMarkdown,
          status: 'draft',
        },
      }),

      // Practice cards
      ...result.practiceCards.map((card: any) =>
        prisma.practiceCard.create({
          data: {
            cycleId,
            slot: card.slot,
            senseAxis: card.senseAxis,
            title: card.title,
            movementLine: card.movementLine,
            ritualPosture: card.ritualPosture,
            bespokeParagraph: card.bespokeParagraph,
          },
        })
      ),

      // Recalibration rhythm
      prisma.recalibrationRhythm.create({
        data: {
          cycleId,
          naturalTempo: result.recalibration.naturalTempo,
          gravityPhase: result.recalibration.gravityPhase,
          gracePhase: result.recalibration.gracePhase,
          rhythmBand: result.recalibration.rhythmBand,
          guidance: result.recalibration.guidance,
        },
      }),

      // Update lexicon lock on user (persists across cycles)
      prisma.user.update({
        where: { id: cycle.userId },
        data: {
          lexiconLock: {
            primaryFamily: result.lexiconProfile.primaryFamily,
            secondaryAccent: result.lexiconProfile.secondaryAccent,
            toneDna: result.lexiconProfile.toneRatio,
            emotionalCadence: result.lexiconProfile.colorCue,
          },
        },
      }),

      // Update cycle status
      prisma.cycle.update({
        where: { id: cycleId },
        data: {
          status: 'DELIVERED',
          processedAt: new Date(),
        },
      }),
    ]);

    console.log(`[Aurea] Analysis complete for cycle ${cycleId}`);

    return NextResponse.json({ success: true, cycleId });
  } catch (error) {
    console.error('[API] Analysis error:', error);

    // Mark cycle as failed
    try {
      const { cycleId } = await request.json().catch(() => ({ cycleId: null }));
      if (cycleId) {
        await prisma.cycle.update({
          where: { id: cycleId },
          data: { status: 'SUBMITTED' }, // Reset to submitted for retry
        });
      }
    } catch {}

    return NextResponse.json(
      { success: false, error: 'Analysis failed' },
      { status: 500 }
    );
  }
}
