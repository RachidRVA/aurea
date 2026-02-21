'use client';

import Link from 'next/link';
import { BRAND } from '@/config/brand';

/**
 * AUREA Return Page — Revisiting the Map
 *
 * Six-month recalibration interface.
 * Guides the user through: Remember → Review → Re-Interpret → Re-Commit → Release
 */

const RETURN_STEPS = [
  {
    title: 'Remember',
    question: 'What stayed luminous since your last reading?',
    action: 'Read your Integration Letter aloud. Underline the phrases still alive.',
    icon: '✦',
  },
  {
    title: 'Review',
    question: 'Where did rhythm strain or drift?',
    action: 'Compare your current Compass with the previous one. Notice shifts.',
    icon: '◈',
  },
  {
    title: 'Re-Interpret',
    question: 'What changed in meaning?',
    action: 'Rewrite one-line reflections per station, beginning with "Now, this means..."',
    icon: '◇',
  },
  {
    title: 'Re-Commit',
    question: 'What must you now vow again?',
    action: 'Compose a new Core Compass sentence — ten words that name your next vow.',
    icon: '○',
  },
  {
    title: 'Release',
    question: 'What can you finally let rest?',
    action: 'Archive completed arcs. Gratitude is a form of deletion.',
    icon: '△',
  },
];

export default function ReturnPage() {
  return (
    <main className="min-h-screen bg-cream-50">
      <header className="border-b border-gold-200/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-sans text-gray-400 hover:text-gray-600 transition-colors">
            &larr; Dashboard
          </Link>
          <span className="font-serif text-sm text-gold-600/50">Revisiting the Map</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16 space-y-16">
        {/* Intro */}
        <div className="text-center space-y-4">
          <h1 className="font-serif text-4xl text-gray-900">The Quiet Spiral</h1>
          <p className="font-serif text-lg text-gray-500 italic leading-relaxed max-w-lg mx-auto">
            Every map must learn to breathe. You return to the same coordinates,
            yet the light is different.
          </p>
        </div>

        {/* Five return steps */}
        <div className="space-y-8">
          {RETURN_STEPS.map((step, i) => (
            <div key={step.title} className="practice-card space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{step.icon}</span>
                <div>
                  <span className="text-xs font-sans tracking-wider uppercase text-gold-600/70">
                    Step {i + 1}
                  </span>
                  <h2 className="font-serif text-2xl text-gray-800">{step.title}</h2>
                </div>
              </div>
              <p className="font-serif text-lg text-gray-600 italic">{step.question}</p>
              <p className="font-sans text-sm text-gray-500">{step.action}</p>
              <textarea
                placeholder="Your reflection..."
                rows={3}
                className="w-full p-4 bg-cream-50/50 border border-gold-200/20 rounded-xl font-serif text-gray-700
                           placeholder:text-gray-300 placeholder:italic
                           focus:outline-none focus:border-gold-300 focus:ring-1 focus:ring-gold-100/50
                           transition-all resize-none"
              />
            </div>
          ))}
        </div>

        {/* Submit for new cycle */}
        <div className="text-center space-y-4">
          <Link href="/diagnostic" className="btn-primary inline-block">
            Begin New Cycle ↻
          </Link>
          <p className="text-xs text-gray-300 font-sans">
            Do this once every six months, not to track, but to tune.
          </p>
        </div>

        <div className="text-center pt-8 border-t border-gold-200/20">
          <p className="font-serif text-sm text-gray-400 italic">
            Growth is not linear; it spirals. Each return refines the rhythm of your architecture.
          </p>
        </div>
      </div>
    </main>
  );
}
