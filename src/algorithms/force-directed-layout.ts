import * as d3 from 'd3';
import { Node, Edge, GraphData } from '../data/malawi-districts';

export interface LayoutOptions {
  width: number;
  height: number;
  iterations: number;
  alpha: number;
  alphaDecay: number;
  velocityDecay: number;
  chargeStrength: number;
  linkDistance: number;
  linkStrength: number;
}

export class ForceDirectedLayout {
  private options: LayoutOptions;

  constructor(options: Partial<LayoutOptions> = {}) {
    this.options = {
      width: 800,
      height: 600,
      iterations: 300,
      alpha: 0.3,
      alphaDecay: 0.0228,
      velocityDecay: 0.4,
      chargeStrength: -30,
      linkDistance: 100,
      linkStrength: 1,
      ...options
    };
  }


  public optimizeLayout(graphData: GraphData): Node[] {
    const nodes = graphData.nodes.map(node => ({
      id: node.id,
      x: node.x * this.options.width,
      y: node.y * this.options.height
    }));

    const links = graphData.edges.map(edge => ({
      source: edge.source,
      target: edge.target
    }));

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id)
        .distance(this.options.linkDistance)
        .strength(this.options.linkStrength))
      .force('charge', d3.forceManyBody().strength(this.options.chargeStrength))
      .force('center', d3.forceCenter(this.options.width / 2, this.options.height / 2))
      .force('collision', d3.forceCollide().radius(20))
      .alpha(this.options.alpha)
      .alphaDecay(this.options.alphaDecay)
      .velocityDecay(this.options.velocityDecay);

    for (let i = 0; i < this.options.iterations; i++) {
      simulation.tick();
    }

    return nodes.map(node => ({
      id: node.id,
      x: Math.max(0, Math.min(1, node.x / this.options.width)),
      y: Math.max(0, Math.min(1, node.y / this.options.height))
    }));
  }

  public calculateEdgeCrossings(nodes: Node[], edges: Edge[]): number {
    let crossings = 0;
    const nodeMap = new Map(nodes.map(node => [node.id, node]));

    for (let i = 0; i < edges.length; i++) {
      for (let j = i + 1; j < edges.length; j++) {
        const edge1 = edges[i];
        const edge2 = edges[j];

        const node1 = nodeMap.get(edge1.source);
        const node2 = nodeMap.get(edge1.target);
        const node3 = nodeMap.get(edge2.source);
        const node4 = nodeMap.get(edge2.target);

        if (node1 && node2 && node3 && node4) {
          if (this.doEdgesCross(node1, node2, node3, node4)) {
            crossings++;
          }
        }
      }
    }

    return crossings;
  }

  private doEdgesCross(
    node1: Node,
    node2: Node,
    node3: Node,
    node4: Node
  ): boolean {

    if (node1.id === node3.id || node1.id === node4.id ||
        node2.id === node3.id || node2.id === node4.id) {
      return false;
    }

    const x1 = node1.x, y1 = node1.y;
    const x2 = node2.x, y2 = node2.y;
    const x3 = node3.x, y3 = node3.y;
    const x4 = node4.x, y4 = node4.y;

    const det1 = (x1 - x3) * (y4 - y3) - (y1 - y3) * (x4 - x3);
    const det2 = (x2 - x3) * (y4 - y3) - (y2 - y3) * (x4 - x3);
    const det3 = (x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1);
    const det4 = (x4 - x1) * (y2 - y1) - (y4 - y1) * (x2 - x1);

    return (det1 * det2 < 0) && (det3 * det4 < 0);
  }

  public calculateAverageDistance(nodes: Node[], edges: Edge[]): number {
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    let totalDistance = 0;
    let edgeCount = 0;

    for (const edge of edges) {
      const source = nodeMap.get(edge.source);
      const target = nodeMap.get(edge.target);

      if (source && target) {
        const distance = Math.sqrt(
          Math.pow(source.x - target.x, 2) + Math.pow(source.y - target.y, 2)
        );
        totalDistance += distance;
        edgeCount++;
      }
    }

    return edgeCount > 0 ? totalDistance / edgeCount : 0;
  }

  public calculateMinimumNodeDistance(nodes: Node[]): number {
    let minDistance = Infinity;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = Math.sqrt(
          Math.pow(nodes[i].x - nodes[j].x, 2) + Math.pow(nodes[i].y - nodes[j].y, 2)
        );
        minDistance = Math.min(minDistance, distance);
      }
    }

    return minDistance;
  }
} 