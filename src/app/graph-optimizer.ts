import { GraphData, Node, Edge, malawiDistrictsData } from '../data/malawi-districts';
import { ForceDirectedLayout, LayoutOptions } from '../algorithms/force-directed-layout';
import { GraphVisualizer, VisualizationOptions } from '../visualization/graph-visualizer';

export interface OptimizationResult {
  originalNodes: Node[];
  optimizedNodes: Node[];
  edges: Edge[];
  metrics: {
    originalCrossings: number;
    optimizedCrossings: number;
    originalAverageDistance: number;
    optimizedAverageDistance: number;
    originalMinDistance: number;
    optimizedMinDistance: number;
  };
}

export class GraphOptimizer {
  private layout: ForceDirectedLayout;
  private visualizer?: GraphVisualizer;
  private visualizerOptions?: Partial<VisualizationOptions>;

  constructor(
    layoutOptions?: Partial<LayoutOptions>,
    visualizerOptions?: Partial<VisualizationOptions>
  ) {
    this.layout = new ForceDirectedLayout(layoutOptions);
    
    if (visualizerOptions) {
      this.visualizerOptions = visualizerOptions;
    }
  }

  public optimizeGraph(graphData: GraphData): OptimizationResult {
    const originalCrossings = this.layout.calculateEdgeCrossings(graphData.nodes, graphData.edges);
    const originalAverageDistance = this.layout.calculateAverageDistance(graphData.nodes, graphData.edges);
    const originalMinDistance = this.layout.calculateMinimumNodeDistance(graphData.nodes);

    const optimizedNodes = this.layout.optimizeLayout(graphData);

    const optimizedCrossings = this.layout.calculateEdgeCrossings(optimizedNodes, graphData.edges);
    const optimizedAverageDistance = this.layout.calculateAverageDistance(optimizedNodes, graphData.edges);
    const optimizedMinDistance = this.layout.calculateMinimumNodeDistance(optimizedNodes);

    return {
      originalNodes: [...graphData.nodes],
      optimizedNodes,
      edges: [...graphData.edges],
      metrics: {
        originalCrossings,
        optimizedCrossings,
        originalAverageDistance,
        optimizedAverageDistance,
        originalMinDistance,
        optimizedMinDistance,
      }
    };
  }

  public render(
    container: string | HTMLElement,
    nodes: Node[],
    edges: Edge[],
    options?: Partial<VisualizationOptions>
  ): void {
    const mergedOptions = { ...this.visualizerOptions, ...options };
    this.visualizer = new GraphVisualizer(container, mergedOptions);
    this.visualizer.render(nodes, edges);
  }

  public updateVisualization(nodes: Node[], edges: Edge[]): void {
    if (this.visualizer) {
      this.visualizer.update(nodes, edges);
    }
  }

  public exportVisualization(): string {
    return this.visualizer?.exportSVG() || '';
  }

  public compareLayouts(
    originalNodes: Node[],
    optimizedNodes: Node[],
    edges: Edge[]
  ): {
    crossingReduction: number;
    distanceImprovement: number;
    minDistanceImprovement: number;
  } {
    const originalCrossings = this.layout.calculateEdgeCrossings(originalNodes, edges);
    const optimizedCrossings = this.layout.calculateEdgeCrossings(optimizedNodes, edges);
    
    const originalAvgDistance = this.layout.calculateAverageDistance(originalNodes, edges);
    const optimizedAvgDistance = this.layout.calculateAverageDistance(optimizedNodes, edges);
    
    const originalMinDistance = this.layout.calculateMinimumNodeDistance(originalNodes);
    const optimizedMinDistance = this.layout.calculateMinimumNodeDistance(optimizedNodes);

    return {
      crossingReduction: originalCrossings - optimizedCrossings,
      distanceImprovement: optimizedAvgDistance - originalAvgDistance,
      minDistanceImprovement: optimizedMinDistance - originalMinDistance,
    };
  }

  public validateCoordinates(nodes: Node[]): boolean {
    return nodes.every(node => 
      node.x >= 0 && node.x <= 1 && 
      node.y >= 0 && node.y <= 1
    );
  }

    public formatResults(result: OptimizationResult): string {
    const { metrics } = result;
    const crossingReduction = metrics.originalCrossings - metrics.optimizedCrossings;
    const crossingReductionPercent = metrics.originalCrossings > 0 
      ? (crossingReduction / metrics.originalCrossings * 100).toFixed(1)
      : '0';

    return `
Graph Optimization Results:
==========================

Edge Crossings:
- Original: ${metrics.originalCrossings}
- Optimized: ${metrics.optimizedCrossings}
- Reduction: ${crossingReduction} (${crossingReductionPercent}%)

Average Distance Between Connected Nodes:
- Original: ${metrics.originalAverageDistance.toFixed(4)}
- Optimized: ${metrics.optimizedAverageDistance.toFixed(4)}
- Change: ${(metrics.optimizedAverageDistance - metrics.originalAverageDistance).toFixed(4)}

Minimum Distance Between Any Two Nodes:
- Original: ${metrics.originalMinDistance.toFixed(4)}
- Optimized: ${metrics.optimizedMinDistance.toFixed(4)}
- Change: ${(metrics.optimizedMinDistance - metrics.originalMinDistance).toFixed(4)}

Coordinate Validation: ${this.validateCoordinates(result.optimizedNodes) ? 'PASS' : 'FAIL'}
    `.trim();
  }

  /**
   * Exports the optimized layout as JSON string
   */
  public exportOptimizedLayout(): string {
    const result = this.optimizeGraph(malawiDistrictsData);
    
    return JSON.stringify({
      nodes: result.optimizedNodes,
      edges: result.edges,
      metrics: result.metrics
    }, null, 2);
  }
} 