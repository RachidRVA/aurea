'use client';

import { useState } from 'react';
import { useDiagnosticStore } from '@/lib/store';
import { StationStep } from '@/components/diagnostic/StationStep';
import { IntegrationStep } from '@/components/diagnostic/IntegrationStep';
import { DIAGNOSTIC_ORDER, getStation, TOTAL_STEPS } from '@/config/stations';
import { BRAND } from '@/config/brand';

/**
 * AUREA Diagnostic Page
 *
 * A contemplative, full-screen multi-step form.
 * Flow: 13 station steps → lexicon → life arc → feeling → os name → submit
 */

// Steps beyond the 13 stations
const INTEGRATION_STEPS = ['lexicon', 'life-arc', 'feeling', 'os-name'] as const;

export default function DiagnosticPage() {
  const { session, nextStation, prevStation, setSubmitting, isSubmitting } = useDiagnosticStore();
  const { currentStation, completionPercent, responses } = session;
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = DIAGNOSTIC_ORDER.length + INTEGRATION_STEPS.length;
  const isStationStep = currentStation < DIAGNOSTIC_ORDER.length;
  const integrationIndex = currentStation - DIAGNOSTIC_ORDER.length;

  // Current step info
  const currentStationConfig = isStationStep
    ? getStation(DIAGNOSTIC_ORDER[currentStation])
    : null;

  const canGoNext = () => {
    if (isStationStep && currentStationConfig) {
      const r = responses[currentStationConfig.station];
      return r && r.primary && r.secondary && r.reflection.length >= 8;
    }
    return true; // Integration steps are optional
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const isLastStep = currentStation >= totalSteps - 1;

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-cream-50">
        <div className="max-w-lg text-center space-y-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold-100 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gold-400/50 animate-breathe" />
          </div>
          <h1 className="font-serif text-4xl text-gray-900">Signal Transmitted</h1>
          <p className="font-serif text-lg text-gray-500 italic">
            Your reflections have been received. Within a few days, your Integration Letter,
            Heatmap, and Practice Suite will be prepared.
          </p>
          <p className="font-sans text-sm text-gray-400">
            Coherence is not perfection; it is rhythm.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream-50 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-cream-50/90 backdrop-blur-md border-b border-gold-200/20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-serif text-lg text-gray-800">{BRAND.name}</span>
          <span className="text-xs font-sans text-gray-400 tracking-wider">
            {currentStation + 1} / {totalSteps}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-gray-100">
          <div className="progress-gold" style={{ width: `${completionPercent}%` }} />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        {isStationStep && currentStationConfig ? (
          <StationStep key={currentStationConfig.station} config={currentStationConfig} />
        ) : (
          <IntegrationStep key={INTEGRATION_STEPS[integrationIndex]} phase={INTEGRATION_STEPS[integrationIndex]} />
        )}
      </div>

      {/* Navigation footer */}
      <footer className="sticky bottom-0 bg-cream-50/90 backdrop-blur-md border-t border-gold-200/20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={prevStation}
            disabled={currentStation === 0}
            className="text-sm font-sans text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            &larr; Previous
          </button>

          <div className="flex items-center gap-2">
            {/* Station dots */}
            {Array.from({ length: Math.min(totalSteps, 17) }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStation
                    ? 'bg-gold-500 w-3'
                    : i < currentStation
                    ? 'bg-gold-300'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-cream-50/30 border-t-cream-50 rounded-full animate-spin" />
                  Transmitting...
                </>
              ) : (
                'Submit · Transmit Signal ✦'
              )}
            </button>
          ) : (
            <button
              onClick={nextStation}
              disabled={!canGoNext()}
              className="text-sm font-sans text-gold-700 hover:text-gold-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Continue &rarr;
            </button>
          )}
        </div>
      </footer>
    </main>
  );
}
