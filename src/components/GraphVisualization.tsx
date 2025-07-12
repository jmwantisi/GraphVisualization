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
  console.log('GraphVisualization props:', {
    nodesCount: nodes?.length || 0,
    edgesCount: edges?.length || 0,
    width,
    height,
    backgroundColor
  });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    console.log('GraphVisualization: Rendering with', { nodes: nodes.length, edges: edges.length });

    try {
      d3.select(svgRef.current).selectAll('*').remove();

      console.log('GraphVisualization: SVG element found:', svgRef.current);

            const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .style('background-color', backgroundColor);

      console.log('GraphVisualization: SVG created:', svg.node());

    const xScale = d3.scaleLinear()
      .domain([0, 1])
      .range([50, width - 50]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([50, height - 50]);

    const edgeGroup = svg.append('g').attr('class', 'edges');
    
    console.log('GraphVisualization: Creating edges', edges.length);
    
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
    
    console.log('GraphVisualization: Creating nodes', nodes.length);
    
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

    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event: any) => {
        svg.selectAll('g').attr('transform', event.transform);
      });

    svg.call(zoom as any);

    } catch (error) {
      console.error('GraphVisualization: Error rendering graph', error);
    }

    return () => {
      if (svgRef.current) {
        d3.select(svgRef.current).selectAll('*').remove();
      }
    };

  }, [nodes, edges, width, height, nodeRadius, nodeColor, edgeColor, edgeWidth, backgroundColor, showLabels, labelFontSize, onNodeClick, onNodeHover]);

  return (
    <div className="graph-visualization" style={{ width: width, height: height }}>
      <svg 
        ref={svgRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          border: '1px solid #ccc',
          backgroundColor: backgroundColor 
        }}
      >
        {(!nodes || nodes.length === 0) && (
          <text 
            x="50%" 
            y="50%" 
            textAnchor="middle" 
            dominantBaseline="middle"
            fill="#666"
            fontSize="16"
          >
            No data to display
          </text>
        )}
      </svg>
    </div>
  );
}; 