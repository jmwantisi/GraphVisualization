import * as d3 from 'd3';
import { Node, Edge, GraphData } from '../data/malawi-districts';

export interface VisualizationOptions {
  width: number;
  height: number;
  nodeRadius: number;
  nodeColor: string;
  edgeColor: string;
  edgeWidth: number;
  backgroundColor: string;
  showLabels: boolean;
  labelFontSize: number;
}

export class GraphVisualizer {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private options: VisualizationOptions;

  constructor(
    container: string | HTMLElement,
    options: Partial<VisualizationOptions> = {}
  ) {
    this.options = {
      width: 800,
      height: 600,
      nodeRadius: 8,
      nodeColor: '#4CAF50',
      edgeColor: '#666',
      edgeWidth: 2,
      backgroundColor: '#f5f5f5',
      showLabels: true,
      labelFontSize: 12,
      ...options
    };

    this.svg = d3.select(container as any)
      .append('svg')
      .attr('width', this.options.width)
      .attr('height', this.options.height)
      .style('background-color', this.options.backgroundColor);
  }

  public render(nodes: Node[], edges: Edge[]): void {
    this.svg.selectAll('*').remove();

    const xScale = d3.scaleLinear()
      .domain([0, 1])
      .range([50, this.options.width - 50]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([50, this.options.height - 50]);

    const edgeGroup = this.svg.append('g').attr('class', 'edges');
    
    const edgeElements = edgeGroup.selectAll('line')
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
      .attr('stroke', this.options.edgeColor)
      .attr('stroke-width', this.options.edgeWidth)
      .attr('opacity', 0.6);

    const nodeGroup = this.svg.append('g').attr('class', 'nodes');
    
    const nodeElements = nodeGroup.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('cx', (d: Node) => xScale(d.x))
      .attr('cy', (d: Node) => yScale(d.y))
      .attr('r', this.options.nodeRadius)
      .attr('fill', this.options.nodeColor)
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', (event: MouseEvent, d: Node) => {
        d3.select(event.target as any)
          .attr('r', this.options.nodeRadius * 1.5)
          .attr('fill', '#FF5722');
      })
      .on('mouseout', (event: MouseEvent, d: Node) => {
        d3.select(event.target as any)
          .attr('r', this.options.nodeRadius)
          .attr('fill', this.options.nodeColor);
      });

    if (this.options.showLabels) {
      const labelGroup = this.svg.append('g').attr('class', 'labels');
      
      labelGroup.selectAll('text')
        .data(nodes)
        .enter()
        .append('text')
        .attr('x', (d: Node) => xScale(d.x))
        .attr('y', (d: Node) => yScale(d.y) - this.options.nodeRadius - 5)
        .text((d: Node) => d.id)
        .attr('text-anchor', 'middle')
        .attr('font-size', this.options.labelFontSize)
        .attr('font-family', 'Arial, sans-serif')
        .attr('fill', '#333')
        .style('pointer-events', 'none');
    }

    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event: any) => {
        this.svg.selectAll('g').attr('transform', event.transform);
      });

    this.svg.call(zoom as any);
  }

  public update(nodes: Node[], edges: Edge[]): void {
    const xScale = d3.scaleLinear()
      .domain([0, 1])
      .range([50, this.options.width - 50]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([50, this.options.height - 50]);

    this.svg.selectAll('.edges line')
      .data(edges)
      .transition()
      .duration(750)
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
      });

    this.svg.selectAll('.nodes circle')
      .data(nodes)
      .transition()
      .duration(750)
      .attr('cx', (d: Node) => xScale(d.x))
      .attr('cy', (d: Node) => yScale(d.y));

    if (this.options.showLabels) {
      this.svg.selectAll('.labels text')
        .data(nodes)
        .transition()
        .duration(750)
        .attr('x', (d: Node) => xScale(d.x))
        .attr('y', (d: Node) => yScale(d.y) - this.options.nodeRadius - 5);
    }
  }

  public clear(): void {
    this.svg.selectAll('*').remove();
  }

  public exportSVG(): string {
    return this.svg.node()?.outerHTML || '';
  }
} 