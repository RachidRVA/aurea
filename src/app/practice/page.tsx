'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BRAND } from '@/config/brand';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SENSE_ICONS: Record<string, string> = {
  mind: '◇',
  body: '△',
  heart: '○',
  intuition: '☆',
  eye_ear: '◐',
  spirit: '✦',
};

interface PracticeCard {
  slot: number;
  senseAxis: string;
  title: string;
  movementLine: string;
  ritualPosture: string;
  bespokeParagraph: string;
}

const DEMO_CARDS: PracticeCard[] = [
  {
    slot: 1, senseAxis: 'mind', title: 'Preserve Harmony',
    movementLine: 'Let proportion become prayer.',
    ritualPosture: 'Sit before your workspace as if it were an altar. Trace the lines of any plan until your breath matches its geometry. Notice where structure steadies your pulse.',
    bespokeParagraph: 'Your mind builds sanctuaries of order. Yet mastery\'s danger is excess tightening. Each morning, before diving into architecture or deal flow, enter the sacred pause. Between thought and motion lies the hinge where design listens to divinity. Protect it fiercely; it is the silence that keeps your brilliance porous.',
  },
  {
    slot: 2, senseAxis: 'body', title: 'Enter the Structure',
    movementLine: 'Step into what you once only drafted.',
    ritualPosture: 'Walk through a room you designed — literal or imagined. Let your hand glide along surfaces; feel where tension lives. Breathe into those corners until ease returns.',
    bespokeParagraph: 'You often hover above your creations, perfecting their coherence from altitude. This practice brings you back into contact. Once a week, choose one venture, one team, one environment — enter it physically or sensorially. Listen for the hum of what you built. Embodiment grounds insight; the body is the first blueprint.',
  },
  {
    slot: 3, senseAxis: 'heart', title: 'Yield the Center',
    movementLine: 'Grace enters through surrendered mastery.',
    ritualPosture: 'Stand at the midpoint of a circle, then step aside. Watch how others fill the space you once held. Let gratitude, not critique, be your instrument.',
    bespokeParagraph: 'Leadership for you has long meant holding coherence. Now, yielding becomes the higher craft. In your alliances, allow another to lead a design you conceived. Observe how proportion sustains itself without your constant calibration. Yielding is not withdrawal — it is trust made visible.',
  },
  {
    slot: 4, senseAxis: 'intuition', title: 'Tend the Axis',
    movementLine: 'Balance gravity and grace before deciding.',
    ritualPosture: 'Close your eyes; imagine a column of light through your spine. On inhale, feel weight anchor downward; on exhale, radiance rise. Stay until both currents equalize.',
    bespokeParagraph: 'Your intuition is an engineer disguised as mystic. It knows when to act and when to wait. Before major pivots or new ventures, tend your axis first — walk, breathe, or pray until body and insight share tempo.',
  },
  {
    slot: 5, senseAxis: 'eye_ear', title: 'Radiate Stillness',
    movementLine: 'Teach by presence, not persuasion.',
    ritualPosture: 'Light a single lamp; sit without agenda. Notice how silence rearranges the room. Let perception itself become offering.',
    bespokeParagraph: 'Your words already build architectures in others. The next evolution is transmission through stillness. Host fewer meetings; hold more presence. When you walk into a room, coherence should precede language.',
  },
  {
    slot: 6, senseAxis: 'spirit', title: 'Return to Proportion',
    movementLine: 'Every cycle completes by softening.',
    ritualPosture: 'Review your week; trace where tension exceeded purpose. Exhale the lines that grew too rigid. Whisper thanks for the design that remains.',
    bespokeParagraph: 'Your covenant has always been to make clarity inhabitable. The return is your proof of devotion. At week\'s end, close the ledger, step back, and remember: structure was never the goal — coherence was. Let stillness redraw the blueprint. Then begin again, lighter.',
  },
];

export default function PracticePage() {
  const [activeCard, setActiveCard] = useState(0);
  const [cards, setCards] = useState<PracticeCard[]>(DEMO_CARDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCards() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data: cycle } = await supabase
          .from('cycles')
          .select('id')
          .eq('user_id', user.id)
          .in('status', ['DELIVERED', 'PROCESSING'])
          .order('cycle_number', { ascending: false })
          .limit(1)
          .single();

        if (!cycle) { setLoading(false); return; }

        const { data: practiceCards } = await supabase
          .from('practice_cards')
          .select('slot, sense_axis, title, movement_line, ritual_posture, bespoke_paragraph')
          .eq('cycle_id', cycle.id)
          .order('slot', { ascending: true });

        if (practiceCards && practiceCards.length > 0) {
          setCards(practiceCards.map((c: any) => ({
            slot: c.slot,
            senseAxis: c.sense_axis,
            title: c.title,
            movementLine: c.movement_line,
            ritualPosture: c.ritual_posture,
            bespokeParagraph: c.bespoke_paragraph,
          })));
        }
      } catch (err) {
        console.error('[Practice] Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
  }, []);

  const card = cards[activeCard];

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="border-b border-gold-200/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-sans text-gray-400 hover:text-gray-600 transition-colors">
            &larr; Dashboard
          </Link>
          <span className="font-serif text-sm text-gold-600/50">Practice Suite</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Card selector */}
        <div className="flex justify-center gap-3 mb-12">
          {cards.map((c, i) => (
            <button
              key={c.slot}
              onClick={() => setActiveCard(i)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-all duration-300 ${
                i === activeCard
                  ? 'bg-gold-100 border-2 border-gold-400/50 text-gold-700 scale-110'
                  : 'bg-white border border-gray-200/50 text-gray-400 hover:border-gold-200/50'
              }`}
              title={c.title}
            >
              {SENSE_ICONS[c.senseAxis] || '◇'}
            </button>
          ))}
        </div>

        {/* Active card */}
        <div key={card.slot} className="station-enter max-w-xl mx-auto space-y-8">
          {/* Card header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-sans tracking-[0.2em] uppercase text-gold-600/70">
              Card {card.slot} · {card.senseAxis.replace('_', ' / ')}
            </span>
            <h1 className="font-serif text-4xl text-gray-900">{card.title}</h1>
            <p className="font-serif text-lg text-gold-600 italic">{card.movementLine}</p>
          </div>

          {/* Ritual posture */}
          <div className="bg-white/60 border border-gold-200/30 rounded-2xl p-8 space-y-1">
            <p className="text-xs font-sans tracking-wider uppercase text-gray-400 mb-3">Ritual Posture</p>
            {card.ritualPosture.split('. ').filter(Boolean).map((line, i) => (
              <p key={i} className="font-serif text-base text-gray-600 leading-relaxed pl-4 border-l-2 border-gold-200/30">
                {line.trim()}{line.endsWith('.') ? '' : '.'}
              </p>
            ))}
          </div>

          {/* Bespoke paragraph */}
          <div className="space-y-2">
            <p className="text-xs font-sans tracking-wider uppercase text-gray-400">For You</p>
            <p className="font-serif text-lg text-gray-700 leading-[1.8]">
              {card.bespokeParagraph}
            </p>
          </div>

          {/* Navigation hint */}
          <div className="text-center pt-8">
            <p className="text-xs text-gray-300 font-sans italic">
              Read one per day. Let it breathe in the background of your life.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
