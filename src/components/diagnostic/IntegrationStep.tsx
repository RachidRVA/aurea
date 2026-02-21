'use client';

import { useDiagnosticStore } from '@/lib/store';
import { LEXICON_OPTIONS } from '@/config/stations';

type IntegrationPhase = 'lexicon' | 'life-arc' | 'feeling' | 'os-name';

interface IntegrationStepProps {
  phase: IntegrationPhase;
}

export function IntegrationStep({ phase }: IntegrationStepProps) {
  const { session, setIntegrationMeta, setLifeArc } = useDiagnosticStore();

  if (phase === 'lexicon') {
    return (
      <div className="station-enter max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-sans tracking-[0.2em] uppercase text-teal-600/70">
            Calibration
          </span>
          <h2 className="font-serif text-3xl text-gray-900">Spiritual or Philosophical Lexicon</h2>
        </div>
        <p className="font-serif text-lg text-gray-600 italic leading-relaxed">
          If you carry a particular spiritual or philosophical language, share it here.
          This helps us calibrate the tone of your report — your geometry remains the same regardless.
        </p>
        <div className="space-y-3">
          {LEXICON_OPTIONS.map(opt => (
            <label key={opt} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gold-50/50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="lexicon"
                value={opt}
                checked={session.integrationMeta.lexiconChoice === opt}
                onChange={(e) => setIntegrationMeta({ lexiconChoice: e.target.value })}
                className="w-4 h-4 text-gold-500 focus:ring-gold-300"
              />
              <span className="font-sans text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'life-arc') {
    return (
      <div className="station-enter max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-sans tracking-[0.2em] uppercase text-emerald-600/70">
            Integration Layer
          </span>
          <h2 className="font-serif text-3xl text-gray-900">Your Life Arc</h2>
        </div>
        <p className="font-serif text-lg text-gray-600 italic leading-relaxed">
          Describe your trajectory across three horizons. Include outcomes, constraints, and first signals.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-sans tracking-wider uppercase text-gold-600">
              Short Term — Next 12 Months
            </label>
            <textarea
              value={session.lifeArc.shortTerm}
              onChange={(e) => setLifeArc({ shortTerm: e.target.value })}
              placeholder="What do you want to set in motion within the next year?"
              rows={4}
              className="w-full p-4 bg-white border border-gray-200/30 rounded-xl font-serif text-gray-800
                         leading-relaxed placeholder:text-gray-300 placeholder:italic
                         focus:outline-none focus:border-gold-300 focus:ring-2 focus:ring-gold-100/50
                         transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-sans tracking-wider uppercase text-emerald-600">
              Mid Term — 1 to 3 Years
            </label>
            <textarea
              value={session.lifeArc.midTerm}
              onChange={(e) => setLifeArc({ midTerm: e.target.value })}
              placeholder="Where do you see this arc leading over the next few years?"
              rows={4}
              className="w-full p-4 bg-white border border-gray-200/30 rounded-xl font-serif text-gray-800
                         leading-relaxed placeholder:text-gray-300 placeholder:italic
                         focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100/50
                         transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-sans tracking-wider uppercase text-teal-600">
              Long Term — 3 to 10 Years
            </label>
            <textarea
              value={session.lifeArc.longTerm}
              onChange={(e) => setLifeArc({ longTerm: e.target.value })}
              placeholder="What is the full vision — the architecture you are building toward?"
              rows={4}
              className="w-full p-4 bg-white border border-gray-200/30 rounded-xl font-serif text-gray-800
                         leading-relaxed placeholder:text-gray-300 placeholder:italic
                         focus:outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100/50
                         transition-all resize-none"
            />
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'feeling') {
    return (
      <div className="station-enter max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-sans tracking-[0.2em] uppercase text-gold-600/70">
            Closing Reflection
          </span>
          <h2 className="font-serif text-3xl text-gray-900">How Did This Feel?</h2>
        </div>
        <p className="font-serif text-lg text-gray-600 italic leading-relaxed">
          Before we close, take a moment to notice what this journey surfaced.
          What surprised you? What confirmed what you already knew?
        </p>
        <textarea
          value={session.integrationMeta.feeling}
          onChange={(e) => setIntegrationMeta({ feeling: e.target.value })}
          placeholder="Share how this reflection journey felt..."
          rows={6}
          className="w-full p-4 bg-white border border-gold-200/30 rounded-xl font-serif text-gray-800
                     leading-relaxed placeholder:text-gray-300 placeholder:italic
                     focus:outline-none focus:border-gold-300 focus:ring-2 focus:ring-gold-100/50
                     transition-all resize-none"
        />
      </div>
    );
  }

  // os-name
  return (
    <div className="station-enter max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-sans tracking-[0.2em] uppercase text-gold-600/70">
          Final Touch
        </span>
        <h2 className="font-serif text-3xl text-gray-900">Name Your Architecture</h2>
      </div>
      <p className="font-serif text-lg text-gray-600 italic leading-relaxed">
        If your inner system had a name — a title for the geometry you carry — what would it be?
        This is optional but helps personalize your Integration Letter.
      </p>
      <input
        type="text"
        value={session.integrationMeta.osName}
        onChange={(e) => setIntegrationMeta({ osName: e.target.value })}
        placeholder="e.g., The Geometry of Light, Sofia Partners, The Living Commons..."
        className="w-full p-4 bg-white border border-gold-200/30 rounded-xl font-serif text-gray-800
                   placeholder:text-gray-300 placeholder:italic
                   focus:outline-none focus:border-gold-300 focus:ring-2 focus:ring-gold-100/50
                   transition-all"
      />
    </div>
  );
}
