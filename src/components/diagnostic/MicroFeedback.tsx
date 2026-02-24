'use client';

import { useEffect, useState } from 'react';

interface MicroFeedbackProps {
  feedback: string;
  stationName: string;
  onComplete: () => void;
  duration?: number; // ms
}

/**
 * Layer 1: Station-level micro-feedback
 *
 * Shows a poetic one-liner after each station is completed.
 * Auto-dismisses after duration, or user can tap to skip.
 */
export function MicroFeedback({ feedback, stationName, onComplete, duration = 3500 }: MicroFeedbackProps) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    // Enter phase
    const enterTimer = setTimeout(() => setPhase('hold'), 100);
    // Exit phase
    const exitTimer = setTimeout(() => setPhase('exit'), duration - 500);
    // Complete
    const completeTimer = setTimeout(onComplete, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  const handleSkip = () => {
    setPhase('exit');
    setTimeout(onComplete, 400);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-cream-50/95 backdrop-blur-sm cursor-pointer"
      onClick={handleSkip}
    >
      <div
        className={`max-w-lg mx-6 text-center space-y-6 transition-all duration-500 ease-out ${
          phase === 'enter'
            ? 'opacity-0 scale-95 translate-y-4'
            : phase === 'hold'
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-4'
        }`}
      >
        {/* Gold pulse dot */}
        <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center animate-breathe">
          <div className="w-4 h-4 rounded-full bg-white/40" />
        </div>

        {/* Station name */}
        <p className="text-xs font-sans tracking-[0.25em] uppercase text-gold-600/60">
          {stationName}
        </p>

        {/* The feedback line */}
        <p className="font-serif text-xl md:text-2xl text-gray-800 leading-relaxed italic px-4">
          &ldquo;{feedback}&rdquo;
        </p>

        {/* Tap hint */}
        <p className="text-xs font-sans text-gray-300 mt-8">
          tap to continue
        </p>
      </div>
    </div>
  );
}
