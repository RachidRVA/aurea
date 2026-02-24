'use client';

import { useEffect, useState } from 'react';

interface PulseReadingProps {
  type: 'ascent' | 'descent' | 'coherence';
  reading: string | null; // AI-generated text, null = loading
  onContinue: () => void;
  isLoading?: boolean;
}

const PULSE_CONFIG = {
  ascent: {
    title: 'Your Ascent Signal',
    subtitle: 'What you are building toward',
    icon: '↑',
    gradient: 'from-gold-400 to-emerald-400',
    accentColor: 'text-gold-600',
    bgGlow: 'rgba(255, 215, 0, 0.08)',
  },
  descent: {
    title: 'Your Descent Signal',
    subtitle: 'What lives beneath the architecture',
    icon: '↓',
    gradient: 'from-teal-400 to-gold-400',
    accentColor: 'text-teal-600',
    bgGlow: 'rgba(0, 128, 128, 0.08)',
  },
  coherence: {
    title: 'Your Coherence Preview',
    subtitle: 'The shape emerging from your geometry',
    icon: '◎',
    gradient: 'from-gold-400 via-emerald-400 to-teal-400',
    accentColor: 'text-emerald-600',
    bgGlow: 'rgba(80, 200, 120, 0.08)',
  },
};

/**
 * Layer 2: Arc-level Pulse Reading
 *
 * A richer interstitial shown at the 3 arc boundaries.
 * Fetches AI-generated insight from /api/diagnostic/pulse
 */
export function PulseReading({ type, reading, onContinue, isLoading }: PulseReadingProps) {
  const [phase, setPhase] = useState<'enter' | 'visible'>('enter');
  const config = PULSE_CONFIG[type];

  useEffect(() => {
    const timer = setTimeout(() => setPhase('visible'), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-cream-50/98 backdrop-blur-md">
      <div
        className={`max-w-xl mx-6 text-center space-y-8 transition-all duration-700 ease-out ${
          phase === 'enter'
            ? 'opacity-0 scale-95 translate-y-8'
            : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {/* Arc icon with gradient ring */}
        <div className="relative w-20 h-20 mx-auto">
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.gradient} opacity-20 animate-breathe`}
          />
          <div className="absolute inset-2 rounded-full bg-cream-50 flex items-center justify-center">
            <span className={`text-2xl ${config.accentColor}`}>{config.icon}</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="font-serif text-3xl text-gray-900">{config.title}</h2>
          <p className="text-sm font-sans text-gray-400 tracking-wider">{config.subtitle}</p>
        </div>

        {/* Divider */}
        <div className={`w-16 h-0.5 mx-auto bg-gradient-to-r ${config.gradient} rounded-full`} />

        {/* Reading content */}
        <div className="min-h-[120px] flex items-center justify-center">
          {isLoading || !reading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-sm font-sans text-gray-300 italic">Reading your signal...</p>
            </div>
          ) : (
            <p className="font-serif text-lg text-gray-700 leading-relaxed px-4">
              {reading}
            </p>
          )}
        </div>

        {/* Continue button */}
        {reading && !isLoading && (
          <button
            onClick={onContinue}
            className={`mt-4 animate-fade-in ${type === 'coherence' ? 'btn-primary' : 'btn-serene'}`}
          >
            {type === 'coherence' ? 'Transmit Signal ✦' : 'Continue Journey →'}
          </button>
        )}
      </div>
    </div>
  );
}
