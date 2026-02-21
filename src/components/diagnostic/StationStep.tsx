'use client';

import { StationConfig } from '@/lib/types';
import { useDiagnosticStore } from '@/lib/store';

interface StationStepProps {
  config: StationConfig;
}

export function StationStep({ config }: StationStepProps) {
  const { session, setStationResponse } = useDiagnosticStore();
  const response = session.responses[config.station] || { primary: '', secondary: '', reflection: '' };

  const isHinge = config.hingeWeight > 1.0;

  return (
    <div className={`station-enter max-w-2xl mx-auto space-y-8 ${isHinge ? 'hinge-glow rounded-3xl p-8' : ''}`}>
      {/* Station header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-sans tracking-[0.2em] uppercase text-gold-600/70">
            Station {config.station > 0 ? `+${config.station}` : config.station}
          </span>
          {isHinge && (
            <span className="text-xs px-2 py-0.5 bg-gold-100 text-gold-700 rounded-full">
              Core Compass
            </span>
          )}
        </div>
        <h2 className="font-serif text-3xl text-gray-900">{config.name}</h2>
        <p className="text-sm text-gray-500 font-sans">{config.arcName}</p>
      </div>

      {/* Reflection prompt */}
      <p className="font-serif text-lg text-gray-600 italic leading-relaxed">
        {config.reflectionPrompt}
      </p>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Primary choice */}
        <div className="space-y-2">
          <label className="text-xs font-sans tracking-wider uppercase text-gold-600">
            Primary — Most Real
          </label>
          <select
            value={response.primary}
            onChange={(e) => setStationResponse(config.station, { primary: e.target.value })}
            className="w-full p-3 bg-white border border-gold-200/50 rounded-xl font-sans text-gray-800
                       focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200/50
                       transition-all appearance-none cursor-pointer"
          >
            <option value="">Select...</option>
            {config.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Secondary choice */}
        <div className="space-y-2">
          <label className="text-xs font-sans tracking-wider uppercase text-gray-400">
            Secondary — Second Pulse
          </label>
          <select
            value={response.secondary}
            onChange={(e) => setStationResponse(config.station, { secondary: e.target.value })}
            className="w-full p-3 bg-white border border-gray-200/50 rounded-xl font-sans text-gray-800
                       focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200/50
                       transition-all appearance-none cursor-pointer"
          >
            <option value="">Select...</option>
            {config.options.filter(o => o !== response.primary).map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reflection textarea */}
      <div className="space-y-2">
        <label className="text-xs font-sans tracking-wider uppercase text-gray-400">
          Reflection
        </label>
        <textarea
          value={response.reflection}
          onChange={(e) => setStationResponse(config.station, { reflection: e.target.value })}
          placeholder="Speak freely. Sentences, fragments, or metaphors — there is no correct way to answer."
          rows={5}
          className="w-full p-4 bg-white border border-gray-200/30 rounded-xl font-serif text-gray-800
                     leading-relaxed placeholder:text-gray-300 placeholder:italic
                     focus:outline-none focus:border-gold-300 focus:ring-2 focus:ring-gold-100/50
                     transition-all resize-none"
        />
        <p className="text-xs text-gray-300 font-sans text-right">
          {response.reflection.split(/\s+/).filter(Boolean).length} words
        </p>
      </div>
    </div>
  );
}
