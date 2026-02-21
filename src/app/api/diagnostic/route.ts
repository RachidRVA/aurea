import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/diagnostic
 *
 * Receives the completed diagnostic form and stores it in the database.
 * Creates a new Cycle with all station responses, integration meta, and life arc.
 * Triggers the analysis pipeline asynchronously.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { responses, integrationMeta, lifeArc } = body;

    // For MVP: use a fixed demo user or create one
    // In production, extract from auth session
    const userId = 'demo-user';

    // Find or create user
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: 'demo@aurea.app',
          name: 'Demo User',
        },
      });
    }

    // Determine cycle number
    const lastCycle = await prisma.cycle.findFirst({
      where: { userId },
      orderBy: { cycleNumber: 'desc' },
    });
    const cycleNumber = (lastCycle?.cycleNumber ?? 0) + 1;

    // Create the cycle with all data
    const cycle = await prisma.cycle.create({
      data: {
        userId,
        cycleNumber,
        status: 'SUBMITTED',
        stationResponses: {
          create: Object.values(responses).map((r: any) => ({
            station: r.station,
            primary: r.primary,
            secondary: r.secondary,
            reflection: r.reflection,
          })),
        },
        integrationMeta: {
          create: {
            feeling: integrationMeta.feeling || '',
            osName: integrationMeta.osName || '',
            lexiconChoice: integrationMeta.lexiconChoice || '',
          },
        },
        lifeArc: {
          create: {
            shortTerm: lifeArc.shortTerm || '',
            midTerm: lifeArc.midTerm || '',
            longTerm: lifeArc.longTerm || '',
          },
        },
      },
    });

    // Trigger analysis pipeline asynchronously
    // In production, this would be a background job (e.g., Inngest, Bull, or Supabase Edge Function)
    triggerAnalysis(cycle.id).catch(console.error);

    return NextResponse.json({
      success: true,
      cycleId: cycle.id,
      message: 'Diagnostic submitted. Analysis will begin shortly.',
    });
  } catch (error) {
    console.error('[API] Diagnostic submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit diagnostic' },
      { status: 500 }
    );
  }
}

async function triggerAnalysis(cycleId: string) {
  // Update status
  await prisma.cycle.update({
    where: { id: cycleId },
    data: { status: 'PROCESSING' },
  });

  try {
    // Call the analysis endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cycleId }),
    });
  } catch (error) {
    console.error('[API] Analysis trigger failed:', error);
  }
}
