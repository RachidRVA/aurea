'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BRAND } from '@/config/brand';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const DEMO_LETTER = {
  title: 'The Geometry of Light and Flow',
  userName: 'User',
  date: 'February 2026',
  sections: {
    acknowledgement: 'There is a stillness that precedes design — the silence before the first line meets the page. You have lived inside that silence for years, listening for a geometry you could trust.',
    keyPattern: 'When your stations aligned, a pattern emerged as clean as a blueprint under morning sun. You are a translator between conviction and form.',
    invitation: 'Every revelation risks paralysis unless it finds motion. Two forces now call for your attention: the ease that comes from mastery and the humility that keeps mastery porous.',
    coreCompass: 'Every living architecture has a hinge — that quiet axis where everything breathes. Yours rests between roots and sky, between what shaped you and what you now shape.',
    geometryOfFlow: 'Beneath all these patterns runs one current — the Geometry of Flow. Gold marks the zones of effortless rhythm, where clarity moves cleanly through form.',
    signatureMoment: 'Coherence is not perfection; it is rhythm.',
    continuation: 'This letter is not an ending; it is a doorway left ajar. Every six months, return to your map as one would revisit a home in shifting seasons.',
  },
};

export default function LetterPage() {
  const params = useParams();
  const cycleId = params.cycleId as string;
  const [letter, setLetter] = useState(DEMO_LETTER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLetter() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        // If cycleId is 'demo' or 'latest', find the latest cycle
        let resolvedCycleId = cycleId;
        if (cycleId === 'demo' || cycleId === 'latest') {
          const { data: cycle } = await supabase
            .from('cycles')
            .select('id, started_at')
            .eq('user_id', user.id)
            .in('status', ['DELIVERED', 'PROCESSING'])
            .order('cycle_number', { ascending: false })
            .limit(1)
            .single();
          if (!cycle) { setLoading(false); return; }
          resolvedCycleId = cycle.id;
        }

        const [letterRes, cycleRes, userRes] = await Promise.all([
          supabase.from('integration_letters').select('*').eq('cycle_id', resolvedCycleId).single(),
          supabase.from('cycles').select('started_at').eq('id', resolvedCycleId).single(),
          supabase.from('users').select('name').eq('id', user.id).single(),
        ]);

        if (letterRes.data) {
          const d = letterRes.data;
          const cycleDate = cycleRes.data
            ? new Date(cycleRes.data.started_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : 'February 2026';

          setLetter({
            title: d.title || DEMO_LETTER.title,
            userName: userRes.data?.name || 'User',
            date: cycleDate,
            sections: {
              acknowledgement: d.acknowledgement || DEMO_LETTER.sections.acknowledgement,
              keyPattern: d.key_pattern || DEMO_LETTER.sections.keyPattern,
              invitation: d.invitation || DEMO_LETTER.sections.invitation,
              coreCompass: d.core_compass || DEMO_LETTER.sections.coreCompass,
              geometryOfFlow: d.geometry_of_flow || DEMO_LETTER.sections.geometryOfFlow,
              signatureMoment: d.signature_moment || DEMO_LETTER.sections.signatureMoment,
              continuation: d.continuation || DEMO_LETTER.sections.continuation,
            },
          });
        }
      } catch (err) {
        console.error('[Letter] Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLetter();
  }, [cycleId]);

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Minimal header */}
      <header className="border-b border-gold-200/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-sans text-gray-400 hover:text-gray-600 transition-colors">
            &larr; Dashboard
          </Link>
          <span className="font-serif text-sm text-gold-600/50">{BRAND.name}</span>
        </div>
      </header>

      {/* Letter */}
      <article className="max-w-[680px] mx-auto px-6 py-16 space-y-12">
        {/* Title block */}
        <div className="text-center space-y-6 pb-8 border-b border-gold-200/20">
          <h1 className="font-serif text-4xl md:text-5xl text-gray-900 leading-tight">
            {letter.title}
          </h1>
          <p className="font-sans text-sm text-gray-400 tracking-wider">
            Integration Letter &middot; Prepared for {letter.userName}
          </p>
          <p className="font-sans text-xs text-gold-600/50 tracking-wider uppercase">
            {BRAND.name} Analyst Engine v1.1 &middot; {letter.date}
          </p>
        </div>

        {/* Letter body */}
        <div className="letter-body space-y-10">
          {/* Acknowledgement & Essence */}
          <section className="animate-fade-in">
            {letter.sections.acknowledgement.split('\n\n').map((p, i) => (
              <p key={i} className="font-serif text-lg text-gray-700 leading-[1.8]">{p}</p>
            ))}
          </section>

          {/* Key Pattern */}
          <section>
            <div className="w-8 h-px bg-gold-300/50 mx-auto mb-8" />
            {letter.sections.keyPattern.split('\n\n').map((p, i) => (
              <p key={i} className="font-serif text-lg text-gray-700 leading-[1.8]">{p}</p>
            ))}
          </section>

          {/* Invitation to Integration */}
          <section>
            <div className="w-8 h-px bg-gold-300/50 mx-auto mb-8" />
            {letter.sections.invitation.split('\n\n').map((p, i) => (
              <p key={i} className="font-serif text-lg text-gray-700 leading-[1.8]">{p}</p>
            ))}
          </section>

          {/* Core Compass */}
          <section>
            <div className="w-8 h-px bg-gold-300/50 mx-auto mb-8" />
            {letter.sections.coreCompass.split('\n\n').map((p, i) => (
              <p key={i} className="font-serif text-lg text-gray-700 leading-[1.8]">{p}</p>
            ))}
          </section>

          {/* Geometry of Flow */}
          <section>
            <div className="w-8 h-px bg-emerald-300/30 mx-auto mb-8" />
            {letter.sections.geometryOfFlow.split('\n\n').map((p, i) => (
              <p key={i} className="font-serif text-lg text-gray-700 leading-[1.8]">{p}</p>
            ))}
          </section>

          {/* Signature Moment */}
          <section className="py-8">
            <blockquote className="text-center font-serif text-2xl text-gold-700 italic leading-relaxed">
              {letter.sections.signatureMoment}
            </blockquote>
          </section>

          {/* Continuation */}
          <section>
            <div className="w-8 h-px bg-teal-300/30 mx-auto mb-8" />
            {letter.sections.continuation.split('\n\n').map((p, i) => (
              <p key={i} className="font-serif text-lg text-gray-700 leading-[1.8]">{p}</p>
            ))}
          </section>
        </div>

        {/* Footer */}
        <div className="text-center pt-12 border-t border-gold-200/20 space-y-2">
          <p className="font-serif text-sm text-gray-400 italic">
            Coherence is not perfection; it is rhythm.
          </p>
          <p className="font-sans text-xs text-gold-600/40 tracking-wider">
            {BRAND.footer}
          </p>
        </div>
      </article>
    </main>
  );
}
