import { malawiDistrictsData } from './data/malawi-districts';
import { GraphOptimizer } from './app/graph-optimizer';

export class MalawiGraphApp {
  private optimizer: GraphOptimizer;

  constructor() {
    this.optimizer = new GraphOptimizer({
      width: 800,
      height: 600,
      iterations: 300,
      alpha: 0.3,
      alphaDecay: 0.0228,
      velocityDecay: 0.4,
      chargeStrength: -30,
      linkDistance: 100,
      linkStrength: 1,
    });
  }

  public async run(): Promise<void> {
    console.log('Malawi Districts Graph Visualization');
    console.log('===================================\n');

    this.analyzeProblem();

    this.explainAlgorithm();

    this.explainApproach();

    console.log('Optimizing graph layout...\n');
    const result = this.optimizer.optimizeGraph(malawiDistrictsData);

    console.log(this.optimizer.formatResults(result));

    const isValid = this.optimizer.validateCoordinates(result.optimizedNodes);
    console.log(`\nCoordinate validation: ${isValid ? 'PASS' : 'FAIL'}`);

    console.log('\nOptimized Node Positions:');
    console.log('==========================');
    result.optimizedNodes.forEach(node => {
      console.log(`${node.id}: (${node.x.toFixed(4)}, ${node.y.toFixed(4)})`);
    });
  }

  private analyzeProblem(): void {
    console.log('Problem Analysis:');
    console.log('=================');
    console.log('1. Node Overlap: Initial positions may cause nodes to overlap, making the graph cluttered');
    console.log('2. Edge Crossings: Many edge crossings reduce readability and make connections unclear');
    console.log('3. Unbalanced Distribution: Nodes may be clustered in certain areas, leaving empty space');
    console.log('4. Coordinate Constraints: All final positions must remain within 1x1 unit square');
    console.log('5. Connection Clarity: Connected districts should be positioned closer together');
    console.log('');
  }

  private explainAlgorithm(): void {
    console.log('Algorithm: Force-Directed Layout (D3.js)');
    console.log('========================================');
    console.log('1. Force Simulation: Uses D3.js force simulation with multiple forces:');
    console.log('   - Link Force: Attracts connected nodes together');
    console.log('   - Charge Force: Repels nodes from each other');
    console.log('   - Center Force: Keeps nodes centered in the layout area');
    console.log('   - Collision Force: Prevents node overlap');
    console.log('2. Iterative Optimization: Runs simulation for multiple iterations');
    console.log('3. Coordinate Normalization: Ensures all positions stay within 1x1 square');
    console.log('4. Edge Crossing Detection: Calculates and minimizes edge crossings');
    console.log('');
  }

  private explainApproach(): void {
    console.log('Approach:');
    console.log('=========');
    console.log('1. Data Processing: Load adjacency list and initial positions');
    console.log('2. Force Simulation: Apply D3 force-directed algorithm');
    console.log('3. Coordinate Scaling: Scale positions to fit 1x1 unit square');
    console.log('4. Validation: Ensure all coordinates are within bounds');
    console.log('5. Metrics Calculation: Compare original vs optimized layouts');
    console.log('6. Visualization: Render interactive graph using D3.js');
    console.log('');
  }

  public createWebVisualization(containerId: string): void {
    if (typeof window !== 'undefined') {
      const result = this.optimizer.optimizeGraph(malawiDistrictsData);
      
      this.optimizer.render(containerId, result.optimizedNodes, result.edges, {
        width: 800,
        height: 600,
        nodeRadius: 10,
        nodeColor: '#4CAF50',
        edgeColor: '#666',
        edgeWidth: 2,
        backgroundColor: '#f5f5f5',
        showLabels: true,
        labelFontSize: 10,
      });

      console.log('Web visualization created in container:', containerId);
    } else {
      console.log('Web visualization requires browser environment');
    }
  }

  public exportOptimizedLayout(): string {
    const result = this.optimizer.optimizeGraph(malawiDistrictsData);
    
    return JSON.stringify({
      nodes: result.optimizedNodes,
      edges: result.edges,
      metrics: result.metrics
    }, null, 2);
  }
}

export { malawiDistrictsData } from './data/malawi-districts';
export { GraphOptimizer } from './app/graph-optimizer';
export { ForceDirectedLayout } from './algorithms/force-directed-layout';
export { GraphVisualizer } from './visualization/graph-visualizer';

if (typeof require !== 'undefined' && require.main === module) {
  const app = new MalawiGraphApp();
  app.run().catch(console.error);
} 