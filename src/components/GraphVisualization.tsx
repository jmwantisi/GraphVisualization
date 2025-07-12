import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Node, Edge } from '../data/malawi-districts';

interface GraphVisualizationProps {
  nodes: Node[];
  edges: Edge[];
  width?: number;
  height?: number;
  nodeRadius?: number;
  nodeColor?: string;
  edgeColor?: string;
  edgeWidth?: number;
  backgroundColor?: string;
  showLabels?: boolean;
  labelFontSize?: number;
  onNodeClick?: (node: Node) => void;
  onNodeHover?: (node: Node | null) => void;
}

export const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  nodes,
  edges,
  width = 800,
  height = 600,
  nodeRadius = 8,
  nodeColor = '#4CAF50',
  edgeColor = '#666',
  edgeWidth = 2,
  backgroundColor = '#f5f5f5',
  showLabels = true,
  labelFontSize = 12,
  onNodeClick,
  onNodeHover
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', backgroundColor);

    // Create scales for coordinate transformation
    const xScale = d3.scaleLinear()
      .domain([0, 1])
      .range([50, width - 50]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([50, height - 50]);

    // Create edges
    const edgeGroup = svg.append('g').attr('class', 'edges');
    
    edgeGroup.selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .attr('x1', (d: Edge) => {
        const sourceNode = nodes.find(n => n.id === d.source);
        return sourceNode ? xScale(sourceNode.x) : 0;
      })
      .attr('y1', (d: Edge) => {
        const sourceNode = nodes.find(n => n.id === d.source);
        return sourceNode ? yScale(sourceNode.y) : 0;
      })
      .attr('x2', (d: Edge) => {
        const targetNode = nodes.find(n => n.id === d.target);
        return targetNode ? xScale(targetNode.x) : 0;
      })
      .attr('y2', (d: Edge) => {
        const targetNode = nodes.find(n => n.id === d.target);
        return targetNode ? yScale(targetNode.y) : 0;
      })
      .attr('stroke', edgeColor)
      .attr('stroke-width', edgeWidth)
      .attr('opacity', 0.6);

    // Create nodes
    const nodeGroup = svg.append('g').attr('class', 'nodes');
    
    const nodeElements = nodeGroup.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('cx', (d: Node) => xScale(d.x))
      .attr('cy', (d: Node) => yScale(d.y))
      .attr('r', nodeRadius)
      .attr('fill', nodeColor)
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', (event: MouseEvent, d: Node) => {
        d3.select(event.target as any)
          .attr('r', nodeRadius * 1.5)
          .attr('fill', '#FF5722');
        onNodeHover?.(d);
      })
      .on('mouseout', (event: MouseEvent, d: Node) => {
        d3.select(event.target as any)
          .attr('r', nodeRadius)
          .attr('fill', nodeColor);
        onNodeHover?.(null);
      })
      .on('click', (event: MouseEvent, d: Node) => {
        onNodeClick?.(d);
      });

    // Add labels if enabled
    if (showLabels) {
      const labelGroup = svg.append('g').attr('class', 'labels');
      
      labelGroup.selectAll('text')
        .data(nodes)
        .enter()
        .append('text')
        .attr('x', (d: Node) => xScale(d.x))
        .attr('y', (d: Node) => yScale(d.y) - nodeRadius - 5)
        .text((d: Node) => d.id)
        .attr('text-anchor', 'middle')
        .attr('font-size', labelFontSize)
        .attr('font-family', 'Arial, sans-serif')
        .attr('fill', '#333')
        .style('pointer-events', 'none');
    }

    // Add zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event: any) => {
        svg.selectAll('g').attr('transform', event.transform);
      });

    svg.call(zoom as any);

  }, [nodes, edges, width, height, nodeRadius, nodeColor, edgeColor, edgeWidth, backgroundColor, showLabels, labelFontSize, onNodeClick, onNodeHover]);

  return (
    <div className="graph-visualization">
      <svg ref={svgRef}></svg>
    </div>
  );
}; 