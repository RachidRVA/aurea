'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CompassQuadrantProps {
  gravityIndex: number;
  graceIndex: number;
  quadrant: string;
  width?: number;
  height?: number;
}

/**
 * Grace-Gravity Compass Quadrant
 *
 * A two-axis scatter showing the user's position in the
 * Equilibrium / Compression / Expansion / Latency matrix.
 */
export function CompassQuadrant({
  gravityIndex,
  graceIndex,
  quadrant,
  width = 400,
  height = 400,
}: CompassQuadrantProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = 60;
    const w = width - margin * 2;
    const h = height - margin * 2;
    const g = svg.append('g').attr('transform', `translate(${margin},${margin})`);

    // Scales
    const x = d3.scaleLinear().domain([0, 1]).range([0, w]);
    const y = d3.scaleLinear().domain([0, 1]).range([h, 0]);

    // Quadrant backgrounds
    const quadrants = [
      { x: 0, y: 0, w: w/2, h: h/2, label: 'Expansion', color: '#008080', opacity: 0.05 },
      { x: w/2, y: 0, w: w/2, h: h/2, label: 'Equilibrium', color: '#FFD700', opacity: 0.08 },
      { x: 0, y: h/2, w: w/2, h: h/2, label: 'Latency', color: '#DDD', opacity: 0.05 },
      { x: w/2, y: h/2, w: w/2, h: h/2, label: 'Compression', color: '#50C878', opacity: 0.05 },
    ];

    quadrants.forEach(q => {
      g.append('rect')
        .attr('x', q.x).attr('y', q.y).attr('width', q.w).attr('height', q.h)
        .attr('fill', q.color).attr('opacity', q.opacity);

      g.append('text')
        .attr('x', q.x + q.w / 2).attr('y', q.y + q.h / 2)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('font-size', '11px').attr('font-family', 'Inter, sans-serif')
        .attr('fill', '#BBB')
        .text(q.label);
    });

    // Axes
    g.append('line').attr('x1', 0).attr('y1', h/2).attr('x2', w).attr('y2', h/2)
      .attr('stroke', '#E5E5E5').attr('stroke-width', 1);
    g.append('line').attr('x1', w/2).attr('y1', 0).attr('x2', w/2).attr('y2', h)
      .attr('stroke', '#E5E5E5').attr('stroke-width', 1);

    // Axis labels
    svg.append('text')
      .attr('x', width / 2).attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px').attr('font-family', 'Inter, sans-serif')
      .attr('fill', '#999')
      .text('Grace →');

    svg.append('text')
      .attr('x', 15).attr('y', height / 2)
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
      .attr('font-size', '11px').attr('font-family', 'Inter, sans-serif')
      .attr('fill', '#999')
      .attr('transform', `rotate(-90, 15, ${height / 2})`)
      .text('Gravity →');

    // User point
    const glow = svg.append('defs').append('filter').attr('id', 'point-glow');
    glow.append('feGaussianBlur').attr('stdDeviation', '6').attr('result', 'coloredBlur');
    const merge = glow.append('feMerge');
    merge.append('feMergeNode').attr('in', 'coloredBlur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    g.append('circle')
      .attr('cx', x(graceIndex)).attr('cy', y(gravityIndex))
      .attr('r', 10)
      .attr('fill', '#FFD700')
      .attr('filter', 'url(#point-glow)')
      .attr('opacity', 0.9);

    g.append('circle')
      .attr('cx', x(graceIndex)).attr('cy', y(gravityIndex))
      .attr('r', 4)
      .attr('fill', '#B8860B');

    // Label
    g.append('text')
      .attr('x', x(graceIndex) + 14).attr('y', y(gravityIndex) + 4)
      .attr('font-size', '11px').attr('font-family', 'EB Garamond, serif')
      .attr('fill', '#B8860B')
      .text(`G: ${gravityIndex.toFixed(2)} / R: ${graceIndex.toFixed(2)}`);

  }, [gravityIndex, graceIndex, quadrant, width, height]);

  return (
    <div className="flex justify-center">
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}
