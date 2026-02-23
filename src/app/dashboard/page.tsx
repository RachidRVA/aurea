'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { HeatmapRing } from '@/components/visualizations/HeatmapRing';
import { CompassQuadrant } from '@/components/visualizations/CompassQuadrant';
import { BRAND } from '@/config/brand';
import { STATIONS } from '@/config/stations';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fallback demo data
const DEMO_DATA = {
  stationValues: {
    '-6': 0.82, '-5': 0.78, '-4': 0.85, '-3': 0.88,
    '-2': 0.86, '-1': 0.90, '0': 0.88, '1': 0.84,
    '2': 0.82, '3': 0.72, '4': 0.68, '5': 0.75, '6': 0.80,
  },
  colorBands: {
    '-6': 'emerald', '-5': 'emerald', '-4': 'gold', '-3': 'gold',
    '-2': 'gold', '-1': 'gold', '0': 'gold', '1': 'emerald',
    '2': 'emerald', '3': 'emerald', '4': 'teal', '5': 'emerald', '6': 'emerald',
  },
  compass: { gravityIndex: 0.88, graceIndex: 0.84, balanceRatio: 0.95, quadrant: 'equilibrium' },
  letter: { title: 'Your Integration Letter', signatureMoment: 'Coherence is not perfection; it is rhythm.' },
  directions: [] as any[],
  cycleId: 'demo',
  userName: 'User',
  cycleDate: 'February 2026',
  compassNarrative: 'Your system stands in dynamic equilibrium — gravity and grace moving in near-perfect rhythm.',
};

export default function DashboardPage() {
  const [data, setData] = useState(DEMO_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        // Get latest delivered cycle
        const { data: cycle } = await supabase
          .from('cycles')
          .select('id, cycle_number, started_at, status')
          .eq('user_id', user.id)
          .in('status', ['DELIVERED', 'PROCESSING'])
          .order('cycle_number', { ascending: false })
          .limit(1)
          .single();

        if (!cycle) { setLoading(false); return; }

        const cycleId = cycle.id;
        const isProcessing = cycle.status === 'PROCESSING';

        // Fetch all data in parallel
        const [heatmapRes, compassRes, letterRes, directionsRes, userRes] = await Promise.all([
          supabase.from('heatmap_data').select('station_values, color_bands').eq('cycle_id', cycleId).single(),
          supabase.from('compass_analytics').select('*').eq('cycle_id', cycleId).single(),
          supabase.from('integration_letters').select('title, signature_moment').eq('cycle_id', cycleId).single(),
          supabase.from('direction_maps').select('directions, summary').eq('cycle_id', cycleId).single(),
          supabase.from('users').select('name').eq('id', user.id).single(),
        ]);

        const cycleDate = new Date(cycle.started_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        // Build directions preview (first 3)
        const directionsData = directionsRes.data?.directions || [];
        const directionsPreview = (Array.isArray(directionsData) ? directionsData : []).slice(0, 3).map((d: any) => ({
          title: d.title || '',
          confidence: d.confidence || 'emerald',
          whyThisFits: d.whyThisFits || '',
        }));

        // Determine compass narrative
        const quadrant = compassRes.data?.quadrant || 'equilibrium';
        const narratives: Record<string, string> = {
          equilibrium: 'Your system stands in dynamic equilibrium — gravity and grace moving in near-perfect rhythm. The architecture is tuned; the next evolution is transmission.',
          expansion: 'Your system is in active expansion — grace leading, gravity supporting. The reach is real, and the depth is quietly holding everything in place.',
          consolidation: 'Your system is consolidating — gravity leading, building deep foundations. The structures are forming; expression will follow.',
          emergence: 'Your system is in emergence — new patterns forming at the edges. Trust the process; coherence is assembling itself.',
        };

        setData({
          stationValues: heatmapRes.data?.station_values || DEMO_DATA.stationValues,
          colorBands: heatmapRes.data?.color_bands || DEMO_DATA.colorBands,
          compass: {
            gravityIndex: compassRes.data?.gravity_index ?? 0.88,
            graceIndex: compassRes.data?.grace_index ?? 0.84,
            balanceRatio: compassRes.data?.balance_ratio ?? 0.95,
            quadrant: quadrant,
          },
          letter: {
            title: letterRes.data?.title || (isProcessing ? 'Analysis in Progress...' : 'Your Integration Letter'),
            signatureMoment: letterRes.data?.signature_moment || (isProcessing ? 'Your results are being prepared. This usually takes 2-3 minutes.' : 'Coherence is not perfection; it is rhythm.'),
          },
          directions: directionsPreview,
          cycleId,
          userName: userRes.data?.name || 'User',
          cycleDate,
          compassNarrative: narratives[quadrant] || narratives.equilibrium,
        });
      } catch (err) {
        console.error('[Dashboard] Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();

    // Poll every 15s if still processing
    const interval = setInterval(fetchDashboard, 15000);
    return () => clearInterval(interval);
  }, []);

  const directions = data.directions.length > 0 ? data.directions : [
    { title: 'Structural Leadership', confidence: 'gold', whyThisFits: 'Your natural ability to see patterns and organize complexity makes you suited to roles where coherence is the deliverable.' },
    { title: 'Contemplative Innovation', confidence: 'emerald', whyThisFits: 'You pair deep reflection with practical execution, creating innovation rooted in clarity rather than haste.' },
    { title: 'Transmitter & Teacher', confidence: 'teal', whyThisFits: 'You have a gift for translating complexity into clarity. Teaching is not your side practice — it is your highest calling.' },
  ];

  return (
    <main className="min-h-screen bg-cream-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Featured Podcast Card */}
        <section className="bg-gradient-to-br from-gold-50 to-gold-100/50 border border-gold-200/50 rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-xs font-sans uppercase tracking-[0.15em] text-gold-700/70">Just for you</p>
              <h2 className="font-serif text-3xl text-gray-900">Your Personalized Podcast</h2>
              <p className="font-serif text-base text-gray-700 leading-relaxed">
                {data.letter.title}
              </p>
              <p className="font-sans text-sm text-gray-600">~15 minutes of contemplative reflection, synthesized from your diagnostic.</p>
              <Link href="/podcast" className="btn-primary inline-block mt-4">
                Listen Now →
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full bg-white/80 border-4 border-gold-300/50 flex items-center justify-center shadow-lg">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                  <div className="text-white text-4xl">♪</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero section */}
        <section className="text-center space-y-4">
          <h1 className="font-serif text-4xl text-gray-900">Your Living Architecture</h1>
          <p className="font-serif text-lg text-gray-500 italic">
            Cycle {data.cycleId === 'demo' ? '1' : ''} · {data.cycleDate} · {data.userName}
          </p>
        </section>

        {/* Signature moment */}
        <section className="text-center">
          <blockquote className="font-serif text-2xl text-gold-700 italic max-w-xl mx-auto leading-relaxed">
            &ldquo;{data.letter.signatureMoment}&rdquo;
          </blockquote>
        </section>

        {/* Two-column: Heatmap + Compass */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-800 text-center">Coherence Map</h2>
            <p className="text-sm text-gray-400 text-center font-sans">
              Gold = Effortless Fluency · Emerald = Stable Growth · Teal = Quiet Waiting
            </p>
            <HeatmapRing stationValues={data.stationValues} colorBands={data.colorBands} />
          </div>
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-800 text-center">Core Compass</h2>
            <p className="text-sm text-gray-400 text-center font-sans">
              Gravity {data.compass.gravityIndex} · Grace {data.compass.graceIndex} · Balance {data.compass.balanceRatio}
            </p>
            <CompassQuadrant
              gravityIndex={data.compass.gravityIndex}
              graceIndex={data.compass.graceIndex}
              quadrant={data.compass.quadrant}
            />
          </div>
        </section>

        {/* Compass interpretation */}
        <section className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100/50 rounded-full">
            <div className="w-2 h-2 rounded-full bg-gold-500" />
            <span className="text-sm font-sans text-gold-700 capitalize">{data.compass.quadrant}</span>
          </div>
          <p className="font-serif text-lg text-gray-600 leading-relaxed">
            {data.compassNarrative}
          </p>
        </section>

        {/* Directions Preview */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-gray-800">Your Directions</h2>
            <Link href="/directions" className="text-sm text-gold-700 hover:text-gold-900 font-sans">View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {directions.map((direction: any, i: number) => {
              const confidenceColors: Record<string, string> = {
                gold: 'bg-gold-100 text-gold-700 border-gold-300/50',
                emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300/50',
                teal: 'bg-teal-100 text-teal-700 border-teal-300/50',
              };
              return (
                <Link key={i} href="/directions" className="practice-card space-y-3 block">
                  <div className={`inline-flex px-3 py-1 rounded-full border text-xs font-sans font-medium capitalize ${confidenceColors[direction.confidence] || confidenceColors.emerald}`}>
                    {direction.confidence}
                  </div>
                  <h3 className="font-serif text-lg text-gray-800">{direction.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{direction.whyThisFits}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick access cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href={`/letter/${data.cycleId}`} className="practice-card text-center space-y-3 block">
            <div className="text-3xl">✦</div>
            <h3 className="font-serif text-xl text-gray-800">{data.letter.title}</h3>
            <p className="text-sm text-gray-500 font-sans">Read your Integration Letter</p>
          </Link>
          <Link href="/practice" className="practice-card text-center space-y-3 block">
            <div className="text-3xl">◈</div>
            <h3 className="font-serif text-xl text-gray-800">Practice Suite</h3>
            <p className="text-sm text-gray-500 font-sans">6 sensory cards for daily rhythm</p>
          </Link>
          <Link href="/return" className="practice-card text-center space-y-3 block">
            <div className="text-3xl">↻</div>
            <h3 className="font-serif text-xl text-gray-800">Revisit the Map</h3>
            <p className="text-sm text-gray-500 font-sans">Six-month recalibration</p>
          </Link>
        </section>

        {/* Station scores table */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl text-gray-800 text-center">Station Coherence</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-13 gap-1">
              {STATIONS.map(s => {
                const val = data.stationValues[String(s.station)] || 0;
                const band = data.colorBands[String(s.station)] || 'teal';
                const bgColor = band === 'gold' ? 'bg-gold-300/60' : band === 'emerald' ? 'bg-emerald-300/60' : 'bg-teal-300/60';
                return (
                  <div key={s.station} className="text-center space-y-1">
                    <div className={`h-16 rounded-lg ${bgColor} flex items-end justify-center pb-1`}
                      style={{ height: `${Math.max(20, val * 80)}px` }}>
                      <span className="text-xs font-sans text-gray-600">{(val * 100).toFixed(0)}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-sans">
                      {s.station > 0 ? '+' : ''}{s.station}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-gold-200/20 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p className="text-xs text-gray-400 font-sans">{BRAND.footer}</p>
          <p className="text-xs text-gray-300 font-serif italic mt-1">
            Coherence is not perfection; it is rhythm.
          </p>
        </div>
      </footer>
    </main>
  );
}
