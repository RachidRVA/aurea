'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeatmapRing } from '@/components/visualizations/HeatmapRing';
import { CompassQuadrant } from '@/components/visualizations/CompassQuadrant';
import { BRAND } from '@/config/brand';
import { STATIONS } from '@/config/stations';

/**
 * AUREA Dashboard
 *
 * The user's home base after analysis. Shows:
 * - Heatmap Ring (coherence overview)
 * - Compass Quadrant (Gravity/Grace)
 * - Quick links to Integration Letter, Practice Suite
 * - Cycle history for return visits
 */

// Demo data for visualization (replace with API fetch in production)
const DEMO_DATA = {
  stationValues: {
    '-6': 0.82, '-5': 0.78, '-4': 0.85, '-3': 0.88,
    '-2': 0.86, '-1': 0.90, '0': 0.88, '1': 0.84,
    '2': 0.82, '3': 0.72, '4': 0.68, '5': 0.75, '6': 0.80,
  },
  colorBands: {
    '-6': 'emerald', '-5': 'emerald', '-4': 'gold', '-3': 'gold',
    '-2': 'gold', '-1': 'gold', '0': 'gold', '1': 'emerald',
    '2': 'emerald', '3': 'emerald', '4': 'teal', '5': 'emerald', '6': 'emerald',
  },
  compass: {
    gravityIndex: 0.88,
    graceIndex: 0.84,
    balanceRatio: 0.95,
    quadrant: 'equilibrium',
  },
  letter: {
    title: 'The Geometry of Light and Flow',
    signatureMoment: 'Light inhabits structure, not the other way around.',
  },
  practiceCards: [
    { slot: 1, title: 'Preserve Harmony', senseAxis: 'Mind' },
    { slot: 2, title: 'Enter the Structure', senseAxis: 'Body' },
    { slot: 3, title: 'Yield the Center', senseAxis: 'Heart' },
    { slot: 4, title: 'Tend the Axis', senseAxis: 'Intuition' },
    { slot: 5, title: 'Radiate Stillness', senseAxis: 'Eye/Ear' },
    { slot: 6, title: 'Return to Proportion', senseAxis: 'Spirit' },
  ],
};

export default function DashboardPage() {
  const [data] = useState(DEMO_DATA);

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="border-b border-gold-200/20 bg-cream-50/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-gray-800">{BRAND.name}</Link>
          <nav className="flex items-center gap-6 text-sm font-sans">
            <Link href="/dashboard" className="text-gold-700">Dashboard</Link>
            <Link href="/letter/demo" className="text-gray-500 hover:text-gray-700 transition-colors">Letter</Link>
            <Link href="/practice" className="text-gray-500 hover:text-gray-700 transition-colors">Practice</Link>
            <Link href="/return" className="text-gray-500 hover:text-gray-700 transition-colors">Return</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Hero section */}
        <section className="text-center space-y-4">
          <h1 className="font-serif text-4xl text-gray-900">Your Living Architecture</h1>
          <p className="font-serif text-lg text-gray-500 italic">Cycle 1 · November 2025</p>
        </section>

        {/* Signature moment */}
        <section className="text-center">
          <blockquote className="font-serif text-2xl text-gold-700 italic max-w-xl mx-auto leading-relaxed">
            &ldquo;{data.letter.signatureMoment}&rdquo;
          </blockquote>
        </section>

        {/* Two-column: Heatmap + Compass */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-800 text-center">Coherence Map</h2>
            <p className="text-sm text-gray-400 text-center font-sans">
              Gold = Effortless Fluency · Emerald = Stable Growth · Teal = Quiet Waiting
            </p>
            <HeatmapRing
              stationValues={data.stationValues}
              colorBands={data.colorBands}
            />
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-800 text-center">Core Compass</h2>
            <p className="text-sm text-gray-400 text-center font-sans">
              Gravity {data.compass.gravityIndex} · Grace {data.compass.graceIndex} · Balance {data.compass.balanceRatio}
            </p>
            <CompassQuadrant
              gravityIndex={data.compass.gravityIndex}
              graceIndex={data.compass.graceIndex}
              quadrant={data.compass.quadrant}
            />
          </div>
        </section>

        {/* Compass interpretation */}
        <section className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100/50 rounded-full">
            <div className="w-2 h-2 rounded-full bg-gold-500" />
            <span className="text-sm font-sans text-gold-700 capitalize">{data.compass.quadrant}</span>
          </div>
          <p className="font-serif text-lg text-gray-600 leading-relaxed">
            Your system stands in dynamic equilibrium — gravity and grace moving in near-perfect rhythm.
            The architecture is tuned; the next evolution is transmission.
          </p>
        </section>

        {/* Quick access cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/letter/demo" className="practice-card text-center space-y-3 block">
            <div className="text-3xl">✦</div>
            <h3 className="font-serif text-xl text-gray-800">{data.letter.title}</h3>
            <p className="text-sm text-gray-500 font-sans">Read your Integration Letter</p>
          </Link>

          <Link href="/practice" className="practice-card text-center space-y-3 block">
            <div className="text-3xl">◈</div>
            <h3 className="font-serif text-xl text-gray-800">Practice Suite</h3>
            <p className="text-sm text-gray-500 font-sans">6 sensory cards for daily rhythm</p>
          </Link>

          <Link href="/return" className="practice-card text-center space-y-3 block">
            <div className="text-3xl">↻</div>
            <h3 className="font-serif text-xl text-gray-800">Revisit the Map</h3>
            <p className="text-sm text-gray-500 font-sans">Six-month recalibration</p>
          </Link>
        </section>

        {/* Station scores table */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl text-gray-800 text-center">Station Coherence</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-13 gap-1">
              {STATIONS.map(s => {
                const val = data.stationValues[String(s.station)] || 0;
                const band = data.colorBands[String(s.station)] || 'teal';
                const bgColor = band === 'gold' ? 'bg-gold-300/60' : band === 'emerald' ? 'bg-emerald-300/60' : 'bg-teal-300/60';

                return (
                  <div key={s.station} className="text-center space-y-1">
                    <div className={`h-16 rounded-lg ${bgColor} flex items-end justify-center pb-1`}
                      style={{ height: `${Math.max(20, val * 80)}px` }}>
                      <span className="text-xs font-sans text-gray-600">{(val * 100).toFixed(0)}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-sans">
                      {s.station > 0 ? '+' : ''}{s.station}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gold-200/20 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p className="text-xs text-gray-400 font-sans">{BRAND.footer}</p>
          <p className="text-xs text-gray-300 font-serif italic mt-1">
            Coherence is not perfection; it is rhythm.
          </p>
        </div>
      </footer>
    </main>
  );
}
