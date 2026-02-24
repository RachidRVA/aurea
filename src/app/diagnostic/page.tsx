'use client';

import { useState, useCallback, useMemo } from 'react';
import { useDiagnosticStore } from '@/lib/store';
import { StationStep } from '@/components/diagnostic/StationStep';
import { IntegrationStep } from '@/components/diagnostic/IntegrationStep';
import { MicroFeedback } from '@/components/diagnostic/MicroFeedback';
import { PulseReading } from '@/components/diagnostic/PulseReading';
import { CompassProgress } from '@/components/diagnostic/CompassProgress';
import { DIAGNOSTIC_ORDER, getStation, TOTAL_STEPS } from '@/config/stations';
import { getMicroFeedback } from '@/config/micro-feedback';
import { BRAND } from '@/config/brand';

/**
 * AUREA Diagnostic Page — Enhanced with 3-Layer Dopamine System
 *
 * Layer 1: Micro-feedback (poetic one-liner) after each station
 * Layer 2: Pulse Reading (AI-generated) at 3 arc boundaries
 * Layer 3: Compass Rose progress visualization + shimmer animations
 *
 * Flow: 13 station steps → lexicon → life arc → feeling → os name → submit
 */

const INTEGRATION_STEPS = ['lexicon', 'life-arc', 'feeling', 'os-name'] as const;

// Arc boundary indices — the step index AFTER which a pulse reading triggers
const ARC_BOUNDARIES: Record<number, 'ascent' | 'descent' | 'coherence'> = {
  6: 'ascent',    // After station +6 (end of ascent arc)
  12: 'descent',  // After station -6 (end of descent arc)
  16: 'coherence', // After os-name (end of integration, before submit)
};

type TransitionPhase =
  | { type: 'none' }
  | { type: 'micro'; feedback: string; stationName: string }
  | { type: 'pulse'; pulseType: 'ascent' | 'descent' | 'coherence' };

export default function DiagnosticPage() {
  const { session, nextStation, prevStation, setSubmitting, isSubmitting } = useDiagnosticStore();
  const { currentStation, completionPercent, responses } = session;
  const [submitted, setSubmitted] = useState(false);
  const [transition, setTransition] = useState<TransitionPhase>({ type: 'none' });
  const [pulseReading, setPulseReading] = useState<string | null>(null);
  const [pulseLoading, setPulseLoading] = useState(false);

  const totalSteps = DIAGNOSTIC_ORDER.length + INTEGRATION_STEPS.length;
  const isStationStep = currentStation < DIAGNOSTIC_ORDER.length;
  const integrationIndex = currentStation - DIAGNOSTIC_ORDER.length;

  const currentStationConfig = isStationStep
    ? getStation(DIAGNOSTIC_ORDER[currentStation])
    : null;

  // Set of completed station numbers for the compass progress
  const completedStations = useMemo(
    () => new Set(Object.keys(responses).map(Number)),
    [responses]
  );

  const canGoNext = () => {
    if (isStationStep && currentStationConfig) {
      const r = responses[currentStationConfig.station];
      return r && r.primary && r.secondary && r.reflection.length >= 8;
    }
    return true;
  };

  // Fetch AI pulse reading from the API
  const fetchPulseReading = useCallback(async (pulseType: 'ascent' | 'descent' | 'coherence') => {
    setPulseLoading(true);
    setPulseReading(null);
    try {
      const res = await fetch('/api/diagnostic/pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: pulseType,
          responses: session.responses,
          integrationMeta: session.integrationMeta,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPulseReading(data.reading);
      } else {
        // Fallback if API fails
        setPulseReading(
          pulseType === 'ascent'
            ? 'Your ascent arc reveals a pattern of expansion — a soul building outward with purpose and precision.'
            : pulseType === 'descent'
            ? 'Beneath your architecture, a deep covenant hums — the root memory that shapes every visible choice.'
            : 'The geometry of your coherence is becoming visible. What awaits you is a mirror shaped by your own signal.'
        );
      }
    } catch {
      setPulseReading('Your signal is strong. The pattern is emerging.');
    } finally {
      setPulseLoading(false);
    }
  }, [session.responses, session.integrationMeta]);

  // Enhanced next handler with transition logic
  const handleNext = useCallback(() => {
    const stepIndex = currentStation;

    // Check if this step is an arc boundary
    if (ARC_BOUNDARIES[stepIndex]) {
      const pulseType = ARC_BOUNDARIES[stepIndex];
      setTransition({ type: 'pulse', pulseType });
      fetchPulseReading(pulseType);
      return;
    }

    // If it's a station step (not integration), show micro-feedback
    if (isStationStep && currentStationConfig) {
      const r = responses[currentStationConfig.station];
      if (r && r.primary) {
        const feedback = getMicroFeedback(currentStationConfig.station, r.primary);
        setTransition({
          type: 'micro',
          feedback,
          stationName: currentStationConfig.name,
        });
        return;
      }
    }

    // Otherwise just advance
    nextStation();
  }, [currentStation, isStationStep, currentStationConfig, responses, nextStation, fetchPulseReading]);

  // Handle micro-feedback completion
  const handleMicroComplete = useCallback(() => {
    setTransition({ type: 'none' });
    nextStation();
  }, [nextStation]);

  // Handle pulse reading continue
  const handlePulseContinue = useCallback(() => {
    setTransition({ type: 'none' });
    setPulseReading(null);
    nextStation();
  }, [nextStation]);

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

  // ─── Submitted State ───────────────────────────────────────
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

  // ─── Main Diagnostic Flow ─────────────────────────────────
  return (
    <main className="min-h-screen bg-cream-50 flex flex-col">
      {/* Layer 1: Micro-feedback overlay */}
      {transition.type === 'micro' && (
        <MicroFeedback
          feedback={transition.feedback}
          stationName={transition.stationName}
          onComplete={handleMicroComplete}
        />
      )}

      {/* Layer 2: Pulse reading overlay */}
      {transition.type === 'pulse' && (
        <PulseReading
          type={transition.pulseType}
          reading={pulseReading}
          onContinue={handlePulseContinue}
          isLoading={pulseLoading}
        />
      )}

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

      {/* Navigation footer — Layer 3: Compass Progress */}
      <footer className="sticky bottom-0 bg-cream-50/90 backdrop-blur-md border-t border-gold-200/20">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={prevStation}
            disabled={currentStation === 0}
            className="text-sm font-sans text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            &larr; Previous
          </button>

          {/* Layer 3: Compass Rose Progress (replaces dots on wider screens) */}
          <div className="flex items-center gap-3">
            {/* Compass rose — visible on sm+ screens */}
            <div className="hidden sm:block">
              <CompassProgress
                currentStation={currentStation}
                completedStations={completedStations}
              />
            </div>
            {/* Simple dots — visible on small screens only */}
            <div className="flex items-center gap-1.5 sm:hidden">
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
              onClick={handleNext}
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
