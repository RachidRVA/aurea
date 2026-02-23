import { NextRequest, NextResponse } from 'next/server';
import { createAuthClient, createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
          const authClient = createAuthClient();
          const { data: { user }, error: authError } = await authClient.auth.getUser();

          if (authError || !user) {
                  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
          }

          const supabase = createServerClient();
          const body = await request.json();
          const { responses, integrationMeta, lifeArc } = body;
          const userId = user.id;

      // Find or create user
      const { data: existingUser } = await supabase.from('users').select('*').eq('id', userId).single();
          if (!existingUser) {
                  await supabase.from('users').insert({ id: userId, email: 'demo@aurea.app', name: 'Demo User' });
          }

      // Determine cycle number
      const { data: lastCycle } = await supabase.from('cycles').select('cycle_number').eq('user_id', userId).order('cycle_number', { ascending: false }).limit(1).single();
          const cycleNumber = (lastCycle?.cycle_number ?? 0) + 1;

      // Create cycle
      const { data: cycle, error: cycleError } = await supabase.from('cycles').insert({ user_id: userId, cycle_number: cycleNumber, status: 'SUBMITTED' }).select().single();
          if (cycleError || !cycle) throw new Error('Failed to create cycle: ' + cycleError?.message);

      // Insert station responses
      const stationRows = Object.values(responses).map((r: any) => ({ cycle_id: cycle.id, station: r.station, primary: r.primary, secondary: r.secondary, reflection: r.reflection }));
          await supabase.from('station_responses').insert(stationRows);

      // Insert integration meta
      await supabase.from('integration_meta').insert({ cycle_id: cycle.id, feeling: integrationMeta?.feeling || '', os_name: integrationMeta?.osName || '', lexicon_choice: integrationMeta?.lexiconChoice || '' });

      // Insert life arc
      await supabase.from('life_arcs').insert({ cycle_id: cycle.id, short_term: lifeArc?.shortTerm || '', mid_term: lifeArc?.midTerm || '', long_term: lifeArc?.longTerm || '' });

      // Trigger analysis asynchronously
      triggerAnalysis(cycle.id).catch(console.error);

      return NextResponse.json({ success: true, cycleId: cycle.id, message: 'Diagnostic submitted. Analysis will begin shortly.' });
    } catch (error) {
          console.error('[API] Diagnostic submission error:', error);
          return NextResponse.json({ success: false, error: 'Failed to submit diagnostic' }, { status: 500 });
    }
}

async function triggerAnalysis(cycleId: string) {
    const supabase = createServerClient();
    await supabase.from('cycles').update({ status: 'PROCESSING' }).eq('id', cycleId);
    try {
          const baseUrl = process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
          await fetch(baseUrl + '/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cycleId }) });
    } catch (error) {
          console.error('[API] Analysis trigger failed:', error);
    }
}
