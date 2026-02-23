'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { BRAND } from '@/config/brand';
import type { DirectionCard } from '@/lib/types';
import { createBrowserClient } from '@/lib/supabase-browser';

const DEMO_DIRECTIONS: DirectionCard[] = [
  {
    title: 'Structural Leadership',
    confidence: 'gold',
    whyThisFits: 'Your natural ability to see patterns and organize complexity into elegant frameworks makes you exceptionally suited to roles where coherence is the deliverable.',
    whereThisLives: ['Organizational Design', 'Systems Architecture', 'Strategic Planning'],
    entryPoints: ['Lead a cross-functional initiative to redesign team workflows', 'Consult on organizational restructuring for growth', 'Build frameworks that scale without losing coherence'],
    yourEdge: 'Where others see chaos, you see latent structure. You can hold contradictions in balance and translate them into systems people actually want to inhabit.',
    evidenceStations: [-6, -5, -4, -3, 0],
  },
  {
    title: 'Contemplative Innovation',
    confidence: 'emerald',
    whyThisFits: 'Your capacity to pair deep reflection with practical execution creates a rare form of innovation — one rooted in clarity rather than haste.',
    whereThisLives: ['Product Strategy', 'User Experience Design', 'Educational Program Development'],
    entryPoints: ['Facilitate design sprints grounded in user empathy and coherence', 'Build products that ask better questions, not just faster answers', 'Create learning systems that respect how people actually grow'],
    yourEdge: 'You refuse shallow solutions. Your innovation is contemplative — it honors the full human in the equation.',
    evidenceStations: [1, 2, 3, 4, 5],
  },
  {
    title: 'Transmitter & Teacher',
    confidence: 'teal',
    whyThisFits: 'You have a gift for translating complexity into clarity. Teaching is not your side practice — it is your highest calling.',
    whereThisLives: ['Curriculum Design', 'Executive Coaching', 'Thought Leadership', 'Writing & Publishing'],
    entryPoints: ['Write or teach about the systems you understand most deeply', 'Create a signature methodology for translating complexity', 'Build a learning platform that scales your perspective'],
    yourEdge: `Your words don't just explain — they transform how people see. Coherence becomes contagious when you articulate it.`,
    evidenceStations: [5, 6, -1, -2],
  },
];

interface DirectionCardComponentProps {
  card: DirectionCard;
  isExpanded: boolean;
  onToggle: () => void;
}

function DirectionCardComponent({ card, isExpanded, onToggle }: DirectionCardComponentProps) {
  const confidenceColors = {
    gold: 'bg-gold-100 text-gold-700 border-gold-300/50',
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300/50',
    teal: 'bg-teal-100 text-teal-700 border-teal-300/50',
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gold-200/50 rounded-2xl overflow-hidden transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full text-left px-8 py-6 space-y-4 hover:bg-gold-50/30 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <h3 className="font-serif text-2xl text-gray-900">{card.title}</h3>
            <p className="font-serif text-base text-gray-600 leading-relaxed">
              {card.whyThisFits}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className={`px-3 py-1 rounded-full border text-xs font-sans font-medium capitalize ${confidenceColors[card.confidence] || confidenceColors.emerald}`}>
              {card.confidence} confidence
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gold-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gold-200/30 px-8 py-6 space-y-8 bg-cream-50/50 animate-fade-in">
          {/* Where This Lives */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs uppercase tracking-[0.15em] text-gray-500 font-semibold">Where This Lives</h4>
            <div className="flex flex-wrap gap-2">
              {(card.whereThisLives || []).map((place) => (
                <span
                  key={place}
                  className="px-3 py-1.5 bg-gold-100/60 border border-gold-200/50 rounded-full text-sm font-sans text-gold-800"
                >
                  {place}
                </span>
              ))}
            </div>
          </div>

          {/* Entry Points */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs uppercase tracking-[0.15em] text-gray-500 font-semibold">Entry Points</h4>
            <ul className="space-y-2">
              {(card.entryPoints || []).map((point, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-gold-600 font-serif text-lg leading-none pt-0.5">✦</span>
                  <span className="font-sans text-gray-700 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Your Edge */}
          {card.yourEdge && (
            <div className="space-y-3">
              <h4 className="font-sans text-xs uppercase tracking-[0.15em] text-gray-500 font-semibold">Your Edge</h4>
              <div className="bg-gold-50/80 border border-gold-200/50 rounded-xl p-4">
                <p className="font-serif text-base text-gray-800 leading-relaxed italic">
                  {card.yourEdge}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DirectionsPage() {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [directions, setDirections] = useState<DirectionCard[]>(DEMO_DIRECTIONS);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDirections() {
      try {
        const supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        // Get latest delivered cycle
        const { data: cycle } = await supabase
          .from('cycles')
          .select('id')
          .eq('user_id', user.id)
          .in('status', ['DELIVERED', 'PROCESSING'])
          .order('cycle_number', { ascending: false })
          .limit(1)
          .single();

        if (!cycle) { setLoading(false); return; }

        const { data: dirMap } = await supabase
          .from('direction_maps')
          .select('directions, summary')
          .eq('cycle_id', cycle.id)
          .single();

        if (dirMap?.directions && Array.isArray(dirMap.directions) && dirMap.directions.length > 0) {
          setDirections(dirMap.directions.map((d: any) => ({
            title: d.title || '',
            confidence: d.confidence || 'emerald',
            whyThisFits: d.whyThisFits || '',
            whereThisLives: d.whereThisLives || [],
            entryPoints: d.entryPoints || [],
            yourEdge: d.yourEdge || '',
            evidenceStations: d.evidenceStations || [],
          })));
          if (dirMap.summary) setSummary(dirMap.summary);
        }
      } catch (err) {
        console.error('[Directions] Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDirections();
  }, []);

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="border-b border-gold-200/20 bg-cream-50/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-gray-800">{BRAND.name}</Link>
          <nav className="flex items-center gap-6 text-sm font-sans">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 transition-colors">Dashboard</Link>
            <Link href="/letter/latest" className="text-gray-500 hover:text-gray-700 transition-colors">Letter</Link>
            <Link href="/directions" className="text-gold-700">Directions</Link>
            <Link href="/podcast" className="text-gray-500 hover:text-gray-700 transition-colors">Podcast</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Hero section */}
        <section className="text-center space-y-4">
          <h1 className="font-serif text-5xl text-gray-900">Direction Map</h1>
          <p className="font-serif text-lg text-gray-500 italic max-w-2xl mx-auto">
            {summary || 'Five paths emerge from your geometry. Each is rooted in your actual strengths. Choose the one that calls.'}
          </p>
        </section>

        {/* Direction cards */}
        <section className="space-y-6">
          {directions.map((direction, index) => (
            <DirectionCardComponent
              key={index}
              card={direction}
              isExpanded={index === expandedIndex}
              onToggle={() => setExpandedIndex(index === expandedIndex ? -1 : index)}
            />
          ))}
        </section>

        {/* Guidance section */}
        <section className="max-w-2xl mx-auto text-center space-y-6 pt-8">
          <div className="bg-white/60 border border-gold-200/30 rounded-2xl p-8 space-y-4">
            <h2 className="font-serif text-2xl text-gray-900">How to Use These Directions</h2>
            <p className="font-serif text-base text-gray-700 leading-relaxed">
              These are not recommendations. They are reflections — patterns your responses revealed about where your coherence naturally extends.
            </p>
            <p className="font-serif text-base text-gray-600 leading-relaxed italic">
              Start with the direction that resonates most strongly. In the next 30 days, explore one Entry Point. Notice what becomes possible when you move toward your geometry rather than against it.
            </p>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center space-y-4 pt-8">
          <p className="font-sans text-sm text-gray-500">Ready to deepen your practice?</p>
          <Link href="/podcast" className="btn-primary inline-block">
            Listen to Your Personalized Podcast →
          </Link>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gold-200/20 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p className="text-xs text-gray-400 font-sans">{BRAND.footer}</p>
        </div>
      </footer>
    </main>
  );
}
