'use client';

import Link from 'next/link';
import { BRAND } from '@/config/brand';

/**
 * AUREA Integration Letter Viewer
 *
 * A beautifully typeset reading experience for the Integration Letter.
 * Designed for contemplative reading — EB Garamond serif, cream background,
 * narrow column width, generous line height.
 */

// Demo letter (replace with API fetch by cycleId in production)
const DEMO_LETTER = {
  title: 'The Geometry of Light and Flow',
  userName: 'Rachid "Sheed" Ndiaye',
  date: 'November 2025',
  sections: {
    acknowledgement: `There is a stillness that precedes design — the silence before the first line meets the page. You have lived inside that silence for years, listening for a geometry you could trust. Your present vessel — the venture studio you are building, the constellation of regenerative projects you steer across continents — exists to give that geometry language. What surrounds you is not empire but experiment: a living sketch where systems become prayers for coherence.

You are a steward of proportion. Even when the world felt unstructured, your instinct was to restore rhythm, not rule it. In this map, that quality registers as dignity of form: a refusal to abandon coherence, even in rupture.`,

    keyPattern: `When your stations aligned, a pattern emerged as clean as a blueprint under morning sun. You are a translator between conviction and form. Your Archetype — the tactician-builder — designs shelter out of paradox; your Applied Shell — the studio, the commons, the framework — is the outer skin of an inner vow that truth must be livable.

The hinge glows brightest when you stop managing coherence and start embodying it. The builder no longer draws the house; he walks into it, barefoot, and opens the windows. That is your revelation: light inhabits structure, not the other way around.`,

    invitation: `Every revelation risks paralysis unless it finds motion. Two forces now call for your attention: the ease that comes from mastery and the humility that keeps mastery porous. One is the zone where you already move like water — translation, synthesis, pattern recognition. The other is the edge that asks for practice — embodiment, allowing others to hold the tools.

Begin where energy gathers effortlessly; honour it as sacred fuel. Then turn toward the slower current; shape it through rhythm, not urgency. Choose one collaboration this quarter where you deliberately do not lead.`,

    coreCompass: `Every living architecture has a hinge — that quiet axis where everything breathes. Yours rests between roots and sky, between what shaped you and what you now shape. Below lies the ground line: memory, discipline, the lineage of builders before you. Above stretches the sky line: expression, mentorship, the translation of systems into legacy.

You need not fix anything here; only listen. When the ground grows heavy, loosen it with compassion. When the sky feels thin, widen it with curiosity.`,

    geometryOfFlow: `Beneath all these patterns runs one current — the Geometry of Flow. Gold marks the zones of effortless rhythm, where clarity moves cleanly through form. Emerald shows your grounding — patient, proportioned, faithful to slow coherence. Teal shimmers at the horizon, where influence begins to diffuse.

You no longer live in fragments. Your system circulates like breath: from knowing to giving, from design to transmission.`,

    signatureMoment: 'Light inhabits structure, not the other way around.',

    continuation: `This letter is not an ending; it is a doorway left ajar. Every six months, return to your map as one would revisit a home in shifting seasons. Notice what has settled, what echoes, what wants to be rebuilt in lighter material.

Your work, your faith, your return — all share one geometry: awareness, alignment, return. When the pattern feels heavy, remember: coherence is not perfection; it is rhythm. Breathe, redesign, and step again into the light.`,
  },
};

export default function LetterPage() {
  const letter = DEMO_LETTER;

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
