import { StationResponse, CoherenceScore, CompassAnalytics, BlindSpotFlag, SynergyPair, HeatmapData, ColorBand } from './types';
import { STATIONS } from '@/config/stations';

/**
 * AUREA Scoring Engine
 *
 * Translates raw diagnostic responses into:
 * 1. Per-station coherence scores (Clarity, Consistency, Coherence)
 * 2. Compass Analytics (Gravity, Grace, Balance Ratio)
 * 3. Blind Spot Flags (over/under-activation)
 * 4. Synergy Pairs (harmonic correlations)
 * 5. Heatmap Data (color-banded coherence map)
 *
 * The AI layer (Claude) provides the semantic scoring.
 * This module handles the mathematical operations.
 */

// ─── COLOR BAND LOGIC ────────────────────────────────────────

export function getColorBand(score: number): ColorBand {
  if (score >= 0.85) return 'gold';
  if (score >= 0.70) return 'emerald';
  return 'teal';
}

export function getColorLabel(band: ColorBand): string {
  switch (band) {
    case 'gold': return 'Effortless Fluency';
    case 'emerald': return 'Stable Growth';
    case 'teal': return 'Quiet Waiting';
  }
}

// ─── COHERENCE SCORE COMPUTATION ─────────────────────────────

export function computeWeightedScore(
  clarity: number,
  consistency: number,
  coherence: number,
  station: number,
): number {
  const raw = (clarity + consistency + coherence) / 3;
  const config = STATIONS.find(s => s.station === station);
  const weight = config?.hingeWeight ?? 1.0;
  return Math.min(1.0, raw * weight);
}

// ─── COMPASS ANALYTICS ───────────────────────────────────────

export function computeCompassAnalytics(
  scores: CoherenceScore[],
  previousBalanceRatio?: number,
): CompassAnalytics {
  const getScore = (station: number) =>
    scores.find(s => s.station === station)?.weighted ?? 0;

  // Gravity Index: Mean of stations -2, -1, 0
  const gravityIndex = (getScore(-2) + getScore(-1) + getScore(0)) / 3;

  // Grace Index: Mean of stations 0, +1, +2
  const graceIndex = (getScore(0) + getScore(1) + getScore(2)) / 3;

  // Balance Ratio: Grace / Gravity (normalized toward 1.0)
  const balanceRatio = gravityIndex > 0 ? graceIndex / gravityIndex : 0;

  // Harmonic Coherence Ratio (global mean of all weighted scores)
  const allWeighted = scores.map(s => s.weighted);
  const hcr = allWeighted.reduce((a, b) => a + b, 0) / allWeighted.length;

  // Quadrant classification
  const quadrant = classifyQuadrant(gravityIndex, graceIndex);

  // Vector direction
  const vectorDirection = computeVectorDirection(gravityIndex, graceIndex, balanceRatio);

  return {
    gravityIndex: round(gravityIndex),
    graceIndex: round(graceIndex),
    balanceRatio: round(balanceRatio),
    hcr: round(hcr),
    quadrant,
    vectorDirection,
  };
}

function classifyQuadrant(
  gravity: number,
  grace: number,
): CompassAnalytics['quadrant'] {
  const gHigh = gravity >= 0.70;
  const rHigh = grace >= 0.70;

  if (gHigh && rHigh) return 'equilibrium';
  if (gHigh && !rHigh) return 'compression';
  if (!gHigh && rHigh) return 'expansion';
  return 'latency';
}

function computeVectorDirection(
  gravity: number,
  grace: number,
  ratio: number,
): string {
  if (ratio >= 0.95 && ratio <= 1.05) return 'Harmonic — balance between structure and flow';
  if (ratio < 0.95) return 'Gravity-bound — structure leading, flow catching up';
  return 'Grace-driven — flow leading, seeking anchor';
}

// ─── BLIND SPOT DETECTION ────────────────────────────────────

export function detectBlindSpots(scores: CoherenceScore[]): BlindSpotFlag[] {
  const flags: BlindSpotFlag[] = [];
  const pairs: [number, number][] = [
    [-3, 1],  // Archetype ↔ Applied Shell
    [-2, 2],  // Origin Imprints ↔ Field Effect
    [-1, 3],  // Drivers ↔ Civilizational Lever
    [-4, 4],  // Cosmic Role ↔ Transcendent Echo
    [-5, 5],  // Core Qualities ↔ Final Return
    [-6, 6],  // Covenant ↔ Eschatological Return
    [0, 3],   // Core Skills ↔ Translation
  ];

  for (const [a, b] of pairs) {
    const scoreA = scores.find(s => s.station === a)?.weighted ?? 0;
    const scoreB = scores.find(s => s.station === b)?.weighted ?? 0;
    const delta = Math.abs(scoreA - scoreB);

    if (delta >= 0.15) {
      const higher = scoreA > scoreB ? a : b;
      const lower = scoreA > scoreB ? b : a;
      const stationHigh = STATIONS.find(s => s.station === higher);
      const stationLow = STATIONS.find(s => s.station === lower);

      flags.push({
        flagType: 'OVER_ACTIVE',
        stationA: higher as any,
        stationB: lower as any,
        delta: round(delta),
        narrative: `${stationHigh?.name} is significantly more activated than ${stationLow?.name}. ` +
          `Energy concentrated in ${stationHigh?.name} may need diffusion toward ${stationLow?.name}.`,
        movement: delta >= 0.25 ? 'Urgent rebalance needed' : 'Gentle recalibration suggested',
      });

      flags.push({
        flagType: 'UNDER_ACTIVE',
        stationA: lower as any,
        stationB: higher as any,
        delta: round(delta),
        narrative: `${stationLow?.name} awaits activation. ` +
          `This zone holds potential that can be unlocked through intentional attention.`,
        movement: `Invite energy from ${stationHigh?.name} toward ${stationLow?.name}`,
      });
    }
  }

  return flags;
}

// ─── SYNERGY PAIR DETECTION ──────────────────────────────────

export function detectSynergyPairs(scores: CoherenceScore[]): SynergyPair[] {
  const pairs: SynergyPair[] = [];
  const adjacentPairs: [number, number][] = [
    [-6, -5], [-5, -4], [-4, -3], [-3, -2],
    [-2, -1], [-1, 0], [0, 1], [1, 2],
    [2, 3], [3, 4], [4, 5], [5, 6],
  ];

  for (const [a, b] of adjacentPairs) {
    const scoreA = scores.find(s => s.station === a)?.weighted ?? 0;
    const scoreB = scores.find(s => s.station === b)?.weighted ?? 0;

    // Simple correlation proxy: both scores high AND close together
    const mean = (scoreA + scoreB) / 2;
    const proximity = 1 - Math.abs(scoreA - scoreB);
    const harmonic = mean * proximity;

    if (harmonic >= 0.70) {
      const stA = STATIONS.find(s => s.station === a);
      const stB = STATIONS.find(s => s.station === b);

      pairs.push({
        stationA: a as any,
        stationB: b as any,
        correlationR: round(harmonic),
        narrative: `${stA?.name} and ${stB?.name} move in harmonic resonance — ` +
          `a natural channel of coherence that supports your system's flow.`,
      });
    }
  }

  return pairs.sort((a, b) => b.correlationR - a.correlationR).slice(0, 5);
}

// ─── HEATMAP GENERATION ──────────────────────────────────────

export function generateHeatmapData(scores: CoherenceScore[]): HeatmapData {
  const stationValues: Record<string, number> = {};
  const colorBands: Record<string, ColorBand> = {};

  for (const score of scores) {
    stationValues[String(score.station)] = score.weighted;
    colorBands[String(score.station)] = getColorBand(score.weighted);
  }

  // Find peak zone (highest consecutive gold stations)
  const sorted = scores.sort((a, b) => a.station - b.station);
  let peakStart = sorted[0]?.station ?? 0;
  let peakEnd = peakStart;
  let bestPeakLength = 0;
  let bestPeakStart = peakStart;
  let bestPeakEnd = peakEnd;
  let currentLength = 0;

  for (const score of sorted) {
    if (score.weighted >= 0.80) {
      if (currentLength === 0) peakStart = score.station;
      peakEnd = score.station;
      currentLength++;
      if (currentLength > bestPeakLength) {
        bestPeakLength = currentLength;
        bestPeakStart = peakStart;
        bestPeakEnd = peakEnd;
      }
    } else {
      currentLength = 0;
    }
  }

  // Find waiting zone (lowest teal stations)
  const tealStations = sorted.filter(s => s.weighted < 0.70);
  const waitingZone = tealStations.length > 0
    ? `${tealStations[0].station} to ${tealStations[tealStations.length - 1].station}`
    : null;

  return {
    stationValues,
    colorBands,
    peakZone: `${bestPeakStart} to ${bestPeakEnd}`,
    waitingZone,
  };
}

// ─── RECALIBRATION LOGIC ─────────────────────────────────────

export function computeRecalibrationBand(
  balanceRatio: number,
): 'gravity_lead' | 'balanced' | 'grace_lead' {
  if (balanceRatio < 0.95) return 'gravity_lead';
  if (balanceRatio > 1.05) return 'grace_lead';
  return 'balanced';
}

// ─── UTILITIES ───────────────────────────────────────────────

function round(n: number, decimals = 2): number {
  return Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
