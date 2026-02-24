'use client';

import { useMemo } from 'react';
import { DIAGNOSTIC_ORDER } from '@/config/stations';

interface CompassProgressProps {
  currentStation: number; // index in DIAGNOSTIC_ORDER
  completedStations: Set<number>; // station numbers that have responses
}

/**
 * Layer 3: Golden Compass Rose Progress
 *
 * Replaces the simple dot indicators with an SVG compass rose.
 * Each station is a petal/segment that fills with gold when completed.
 * The three arcs (center, ascent, descent) are visually distinct.
 * Integration steps shown as inner ring segments.
 */
export function CompassProgress({ currentStation, completedStations }: CompassProgressProps) {
  const segments = useMemo(() => {
    const cx = 50, cy = 50, r = 38;
    const totalStations = DIAGNOSTIC_ORDER.length; // 13
    const anglePerStation = 360 / totalStations;

    return DIAGNOSTIC_ORDER.map((stationNum, index) => {
      const startAngle = index * anglePerStation - 90; // Start from top
      const endAngle = startAngle + anglePerStation - 2; // 2deg gap
      const isCompleted = completedStations.has(stationNum);
      const isCurrent = index === currentStation;

      // Determine arc color
      let arcType: 'hinge' | 'ascent' | 'descent';
      if (stationNum >= -2 && stationNum <= 2) arcType = 'hinge';
      else if (stationNum > 0) arcType = 'ascent';
      else arcType = 'descent';

      // SVG arc path
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const innerR = r - 8;

      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      const x3 = cx + innerR * Math.cos(endRad);
      const y3 = cy + innerR * Math.sin(endRad);
      const x4 = cx + innerR * Math.cos(startRad);
      const y4 = cy + innerR * Math.sin(startRad);

      const largeArc = anglePerStation - 2 > 180 ? 1 : 0;

      const path = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;

      return { path, isCompleted, isCurrent, arcType, stationNum, index };
    });
  }, [currentStation, completedStations]);

  return (
    <div className="relative w-[72px] h-[72px]">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background circle */}
        <circle cx="50" cy="50" r="22" fill="none" stroke="rgba(255,215,0,0.1)" strokeWidth="0.5" />

        {/* Station segments */}
        {segments.map((seg) => {
          let fill: string;
          if (seg.isCompleted) {
            if (seg.arcType === 'hinge') fill = 'rgba(255, 215, 0, 0.8)';
            else if (seg.arcType === 'ascent') fill = 'rgba(80, 200, 120, 0.7)';
            else fill = 'rgba(0, 128, 128, 0.7)';
          } else if (seg.isCurrent) {
            fill = 'rgba(255, 215, 0, 0.3)';
          } else {
            fill = 'rgba(200, 200, 200, 0.15)';
          }

          return (
            <path
              key={seg.stationNum}
              d={seg.path}
              fill={fill}
              stroke={seg.isCurrent ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 255, 255, 0.3)'}
              strokeWidth={seg.isCurrent ? '1' : '0.3'}
              className="transition-all duration-500"
            >
              {seg.isCompleted && seg.isCurrent && (
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
              )}
            </path>
          );
        })}

        {/* Center icon */}
        <text x="50" y="53" textAnchor="middle" fontSize="10" fill="rgba(255, 215, 0, 0.6)" className="font-serif">
          ✦
        </text>

        {/* Completion count */}
        <text x="50" y="47" textAnchor="middle" fontSize="6" fill="rgba(100, 100, 100, 0.6)" className="font-sans">
          {completedStations.size}/13
        </text>
      </svg>

      {/* Shimmer effect when a new station is completed */}
      {completedStations.size > 0 && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none compass-shimmer"
          key={completedStations.size}
        />
      )}
    </div>
  );
}
