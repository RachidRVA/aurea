'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { STATIONS } from '@/config/stations';

interface HeatmapRingProps {
  stationValues: Record<string, number>;
  colorBands: Record<string, string>;
  width?: number;
  height?: number;
}

const COLOR_MAP = {
  gold: '#FFD700',
  emerald: '#50C878',
  teal: '#008080',
};

/**
 * Circular Heatmap Ring Visualization
 *
 * Displays the 12-station coherence scores as a glowing ring,
 * with color bands (gold/emerald/teal) indicating fluency levels.
 * The center shows the Core Compass Zone (hinge).
 */
export function HeatmapRing({ stationValues, colorBands, width = 500, height = 500 }: HeatmapRingProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const cx = width / 2;
    const cy = height / 2;
    const outerR = Math.min(width, height) / 2 - 40;
    const innerR = outerR * 0.45;

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`);

    // Sort stations for continuous ring
    const stations = STATIONS.map(s => ({
      station: s.station,
      name: s.name,
      value: stationValues[String(s.station)] || 0,
      color: COLOR_MAP[(colorBands[String(s.station)] || 'teal') as keyof typeof COLOR_MAP],
      isHinge: s.hingeWeight > 1.0,
    }));

    const angleStep = (2 * Math.PI) / stations.length;

    // Draw arcs for each station
    const arc = d3.arc<any>()
      .innerRadius(innerR)
      .outerRadius((d: any) => innerR + (outerR - innerR) * d.value)
      .startAngle((d: any, i: number) => i * angleStep - Math.PI / 2)
      .endAngle((d: any, i: number) => (i + 1) * angleStep - Math.PI / 2)
      .padAngle(0.02)
      .cornerRadius(4);

    // Glow filter
    const defs = svg.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Draw segments
    g.selectAll('.segment')
      .data(stations)
      .enter()
      .append('path')
      .attr('class', 'segment')
      .attr('d', (d, i) => arc({ ...d, index: i }, i) as string)
      .attr('fill', d => d.color)
      .attr('opacity', 0.8)
      .attr('filter', 'url(#glow)')
      .style('transition', 'all 0.3s ease')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1).attr('stroke', '#fff').attr('stroke-width', 2);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.8).attr('stroke', 'none');
      })
      .append('title')
      .text(d => `${d.name} (${d.station > 0 ? '+' : ''}${d.station}): ${(d.value * 100).toFixed(0)}%`);

    // Station labels around the ring
    g.selectAll('.label')
      .data(stations)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d, i) => {
        const angle = i * angleStep - Math.PI / 2 + angleStep / 2;
        return Math.cos(angle) * (outerR + 20);
      })
      .attr('y', (d, i) => {
        const angle = i * angleStep - Math.PI / 2 + angleStep / 2;
        return Math.sin(angle) * (outerR + 20);
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '10px')
      .attr('font-family', 'Inter, sans-serif')
      .attr('fill', '#999')
      .text(d => `${d.station > 0 ? '+' : ''}${d.station}`);

    // Center text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-family', 'EB Garamond, serif')
      .attr('font-size', '16px')
      .attr('fill', '#B8860B')
      .text('Core');

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('y', 20)
      .attr('font-family', 'EB Garamond, serif')
      .attr('font-size', '12px')
      .attr('fill', '#DAA520')
      .text('Compass');

  }, [stationValues, colorBands, width, height]);

  return (
    <div className="heatmap-ring flex justify-center">
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}
