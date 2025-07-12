import { ForceDirectedLayout } from '../algorithms/force-directed-layout';
import { Node, Edge, GraphData } from '../data/malawi-districts';

describe('ForceDirectedLayout', () => {
  let layout: ForceDirectedLayout;
  let testGraphData: GraphData;

  beforeEach(() => {
    layout = new ForceDirectedLayout();
    
    testGraphData = {
      nodes: [
        { id: 'A', x: 0.1, y: 0.1 },
        { id: 'B', x: 0.9, y: 0.9 },
        { id: 'C', x: 0.5, y: 0.5 },
        { id: 'D', x: 0.2, y: 0.8 }
      ],
      edges: [
        { source: 'A', target: 'B' },
        { source: 'B', target: 'C' },
        { source: 'C', target: 'D' },
        { source: 'A', target: 'D' }
      ]
    };
  });

  describe('optimizeLayout', () => {
    it('should return optimized node positions', () => {
      const optimizedNodes = layout.optimizeLayout(testGraphData);
      
      expect(optimizedNodes).toBeDefined();
      expect(optimizedNodes).toHaveLength(testGraphData.nodes.length);
      
      optimizedNodes.forEach(node => {
        expect(node.x).toBeGreaterThanOrEqual(0);
        expect(node.x).toBeLessThanOrEqual(1);
        expect(node.y).toBeGreaterThanOrEqual(0);
        expect(node.y).toBeLessThanOrEqual(1);
        expect(node.id).toBeDefined();
      });
    });

    it('should preserve node IDs', () => {
      const optimizedNodes = layout.optimizeLayout(testGraphData);
      const originalIds = testGraphData.nodes.map(n => n.id);
      const optimizedIds = optimizedNodes.map(n => n.id);
      
      expect(optimizedIds).toEqual(originalIds);
    });

    it('should work with custom options', () => {
      const customLayout = new ForceDirectedLayout({
        width: 1000,
        height: 800,
        iterations: 100,
        alpha: 0.5,
        chargeStrength: -50
      });
      
      const optimizedNodes = customLayout.optimizeLayout(testGraphData);
      expect(optimizedNodes).toHaveLength(testGraphData.nodes.length);
    });
  });

  describe('calculateEdgeCrossings', () => {
    it('should calculate correct number of edge crossings', () => {
      const nodes = [
        { id: 'A', x: 0.1, y: 0.1 },
        { id: 'B', x: 0.9, y: 0.1 },
        { id: 'C', x: 0.1, y: 0.9 },
        { id: 'D', x: 0.9, y: 0.9 }
      ];
      
      const edges = [
        { source: 'A', target: 'D' }, // diagonal
        { source: 'B', target: 'C' }  // diagonal (crosses first edge)
      ];
      
      const crossings = layout.calculateEdgeCrossings(nodes, edges);
      expect(crossings).toBe(1);
    });

    it('should return 0 for non-crossing edges', () => {
      const nodes = [
        { id: 'A', x: 0.1, y: 0.1 },
        { id: 'B', x: 0.9, y: 0.1 },
        { id: 'C', x: 0.1, y: 0.9 },
        { id: 'D', x: 0.9, y: 0.9 }
      ];
      
      const edges = [
        { source: 'A', target: 'B' },
        { source: 'C', target: 'D' }
      ];
      
      const crossings = layout.calculateEdgeCrossings(nodes, edges);
      expect(crossings).toBe(0);
    });

    it('should handle edges with shared endpoints', () => {
      const nodes = [
        { id: 'A', x: 0.1, y: 0.1 },
        { id: 'B', x: 0.9, y: 0.1 },
        { id: 'C', x: 0.5, y: 0.5 }
      ];
      
      const edges = [
        { source: 'A', target: 'B' },
        { source: 'A', target: 'C' },
        { source: 'B', target: 'C' }
      ];
      
      const crossings = layout.calculateEdgeCrossings(nodes, edges);
      expect(crossings).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateAverageDistance', () => {
    it('should calculate correct average distance', () => {
      const nodes = [
        { id: 'A', x: 0.0, y: 0.0 },
        { id: 'B', x: 1.0, y: 0.0 },
        { id: 'C', x: 0.0, y: 1.0 }
      ];
      
      const edges = [
        { source: 'A', target: 'B' },
        { source: 'A', target: 'C' }
      ];
      
      const avgDistance = layout.calculateAverageDistance(nodes, edges);
      expect(avgDistance).toBeCloseTo(1.0, 2);
    });

    it('should return 0 for empty edge list', () => {
      const nodes = [
        { id: 'A', x: 0.0, y: 0.0 },
        { id: 'B', x: 1.0, y: 1.0 }
      ];
      
      const edges: Edge[] = [];
      
      const avgDistance = layout.calculateAverageDistance(nodes, edges);
      expect(avgDistance).toBe(0);
    });
  });

  describe('calculateMinimumNodeDistance', () => {
    it('should find the minimum distance between any two nodes', () => {
      const nodes = [
        { id: 'A', x: 0.0, y: 0.0 },
        { id: 'B', x: 0.5, y: 0.5 },
        { id: 'C', x: 1.0, y: 1.0 }
      ];
      
      const minDistance = layout.calculateMinimumNodeDistance(nodes);
      const expectedMinDistance = Math.sqrt(0.5 * 0.5 + 0.5 * 0.5);
      
      expect(minDistance).toBeCloseTo(expectedMinDistance, 4);
    });

    it('should handle single node', () => {
      const nodes = [{ id: 'A', x: 0.5, y: 0.5 }];
      
      const minDistance = layout.calculateMinimumNodeDistance(nodes);
      expect(minDistance).toBe(Infinity);
    });
  });

  describe('edge crossing detection', () => {
    it('should correctly detect crossing edges', () => {
      const node1 = { id: 'A', x: 0.0, y: 0.0 };
      const node2 = { id: 'B', x: 1.0, y: 1.0 };
      const node3 = { id: 'C', x: 0.0, y: 1.0 };
      const node4 = { id: 'D', x: 1.0, y: 0.0 };

      const crossings = layout.calculateEdgeCrossings([node1, node2, node3, node4], [
        { source: 'A', target: 'B' },
        { source: 'C', target: 'D' }
      ]);
      
      expect(crossings).toBe(1);
    });

    it('should not detect crossing for parallel edges', () => {
      const node1 = { id: 'A', x: 0.0, y: 0.0 };
      const node2 = { id: 'B', x: 1.0, y: 0.0 };
      const node3 = { id: 'C', x: 0.0, y: 1.0 };
      const node4 = { id: 'D', x: 1.0, y: 1.0 };
      
      const crossings = layout.calculateEdgeCrossings([node1, node2, node3, node4], [
        { source: 'A', target: 'B' },
        { source: 'C', target: 'D' }
      ]);
      
      expect(crossings).toBe(0);
    });
  });
}); 