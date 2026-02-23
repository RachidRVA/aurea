import { NextRequest, NextResponse } from 'next/server';
import { createAuthClient, createServerClient } from '@/lib/supabase';
import { runFullAnalysis } from '@/lib/analyzer';
import { generateDirectionMap } from '@/lib/directions';
import { generatePodcastScript } from '@/lib/podcast';
import { StationResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
    try {
          const authClient = createAuthClient();
          const { data: { user }, error: authError } = await authClient.auth.getUser();

          if (authError || !user) {
                  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
          }

          const supabase = createServerClient();
          const { cycleId } = await request.json();
          const { data: cycle, error: cycleError } = await supabase.from('cycles').select('*').eq('id', cycleId).single();
          if (cycleError || !cycle) return NextResponse.json({ error: 'Cycle not found' }, { status: 404 });

          // Verify the cycle belongs to the authenticated user
          if (cycle.user_id !== user.id) {
                  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
          }
          const { data: userRecord } = await supabase.from('users').select('*').eq('id', cycle.user_id).single();
          const { data: stationResponses } = await supabase.from('station_responses').select('*').eq('cycle_id', cycleId);
          const { data: integrationMetaRow } = await supabase.from('integration_meta').select('*').eq('cycle_id', cycleId).single();
          const { data: lifeArcRow } = await supabase.from('life_arcs').select('*').eq('cycle_id', cycleId).single();
          const responses: StationResponse[] = (stationResponses || []).map((sr: any) => ({ station: sr.station, primary: sr.primary, secondary: sr.secondary, reflection: sr.reflection }));
          const integrationMeta = { feeling: integrationMetaRow?.feeling || '', osName: integrationMetaRow?.os_name || '', lexiconChoice: integrationMetaRow?.lexicon_choice || '' };
          const lifeArc = { shortTerm: lifeArcRow?.short_term || '', midTerm: lifeArcRow?.mid_term || '', longTerm: lifeArcRow?.long_term || '' };
          const result = await runFullAnalysis(responses, integrationMeta, lifeArc, userRecord?.name || 'User');
          for (const score of result.coherenceScores) { await supabase.from('coherence_scores').insert({ cycle_id: cycleId, station: score.station, clarity: score.clarity, consistency: score.consistency, coherence: score.coherence, weighted: score.weighted }); }
          await supabase.from('compass_analytics').insert({ cycle_id: cycleId, gravity_index: result.compassAnalytics.gravityIndex, grace_index: result.compassAnalytics.graceIndex, balance_ratio: result.compassAnalytics.balanceRatio, hcr: result.compassAnalytics.hcr, quadrant: result.compassAnalytics.quadrant, vector_direction: result.compassAnalytics.vectorDirection });
          for (const bs of result.blindSpots) { await supabase.from('blind_spot_flags').insert({ cycle_id: cycleId, flag_type: bs.flagType, station_a: bs.stationA, station_b: bs.stationB, delta: bs.delta, narrative: bs.narrative, movement: bs.movement }); }
          for (const sp of result.synergyPairs) { await supabase.from('synergy_pairs').insert({ cycle_id: cycleId, station_a: sp.stationA, station_b: sp.stationB, correlation_r: sp.correlationR, narrative: sp.narrative }); }
          await supabase.from('lexicon_profiles').insert({ cycle_id: cycleId, primary_family: result.lexiconProfile.primaryFamily, secondary_accent: result.lexiconProfile.secondaryAccent, tone_ratio: result.lexiconProfile.toneRatio, color_cue: result.lexiconProfile.colorCue, top_metaphors: result.lexiconProfile.topMetaphors, top_verbs: result.lexiconProfile.topVerbs });
          await supabase.from('heatmap_data').insert({ cycle_id: cycleId, station_values: result.heatmapData.stationValues, color_bands: result.heatmapData.colorBands, peak_zone: result.heatmapData.peakZone, waiting_zone: result.heatmapData.waitingZone });
          await supabase.from('integration_letters').insert({ cycle_id: cycleId, title: result.integrationLetter.title, acknowledgement: result.integrationLetter.acknowledgement, key_pattern: result.integrationLetter.keyPattern, invitation: result.integrationLetter.invitation, core_compass: result.integrationLetter.coreCompass, geometry_of_flow: result.integrationLetter.geometryOfFlow, signature_moment: result.integrationLetter.signatureMoment, continuation: result.integrationLetter.continuation, full_markdown: result.integrationLetter.fullMarkdown, status: 'draft' });
          for (const card of result.practiceCards) { const c = card as any; await supabase.from('practice_cards').insert({ cycle_id: cycleId, slot: c.slot, sense_axis: c.senseAxis, title: c.title, movement_line: c.movementLine, ritual_posture: c.ritualPosture, bespoke_paragraph: c.bespokeParagraph }); }
          await supabase.from('recalibration_rhythms').insert({ cycle_id: cycleId, natural_tempo: result.recalibration.naturalTempo, gravity_phase: result.recalibration.gravityPhase, grace_phase: result.recalibration.gracePhase, rhythm_band: result.recalibration.rhythmBand, guidance: result.recalibration.guidance });
          await supabase.from('users').update({ lexicon_lock: { primaryFamily: result.lexiconProfile.primaryFamily, secondaryAccent: result.lexiconProfile.secondaryAccent, toneDna: result.lexiconProfile.toneRatio, emotionalCadence: result.lexiconProfile.colorCue } }).eq('id', cycle.user_id);
          // Step 6: Generate Direction Map
          console.log('[Aurea] Step 6: Direction Map generation...');
          try {
            const directionMap = await generateDirectionMap(
              responses, result.coherenceScores, result.compassAnalytics,
              result.blindSpots, result.synergyPairs, result.lexiconProfile,
              lifeArc, userRecord?.name || 'User'
            );
            await supabase.from('direction_maps').insert({
              cycle_id: cycleId, user_id: cycle.user_id,
              directions: directionMap.directions, summary: directionMap.summary,
              model_used: 'claude-sonnet-4-5-20250929'
            });
          } catch (dirErr) {
            console.error('[Aurea] Direction Map generation failed (non-fatal):', dirErr);
          }

          // Step 7: Generate Podcast Script
          console.log('[Aurea] Step 7: Podcast script generation...');
          try {
            const podcastScript = await generatePodcastScript(
              responses, result.coherenceScores, result.compassAnalytics,
              result.blindSpots, result.synergyPairs, result.lexiconProfile,
              result.integrationLetter, [], lifeArc, userRecord?.name || 'User'
            );
            await supabase.from('podcast_scripts').insert({
              cycle_id: cycleId, user_id: cycle.user_id,
              title: podcastScript.title, script_text: podcastScript.script,
              chapter_markers: podcastScript.chapters,
              word_count: podcastScript.wordCount
            });
          } catch (podErr) {
            console.error('[Aurea] Podcast script generation failed (non-fatal):', podErr);
          }

          await supabase.from('cycles').update({ status: 'DELIVERED', processed_at: new Date().toISOString() }).eq('id', cycleId);
          return NextResponse.json({ success: true, cycleId });
    } catch (error) {
          console.error('[API] Analysis error:', error);
          return NextResponse.json({ success: false, error: 'Analysis failed' }, { status: 500 });
    }
}
