import { GraphOptimizer } from '../app/graph-optimizer';
import { malawiDistrictsData } from '../data/malawi-districts';
import { Node, Edge } from '../data/malawi-districts';

describe('GraphOptimizer', () => {
  let optimizer: GraphOptimizer;

  beforeEach(() => {
    optimizer = new GraphOptimizer();
  });

  describe('optimizeGraph', () => {
    it('should optimize the Malawi districts graph', () => {
      const result = optimizer.optimizeGraph(malawiDistrictsData);
      
      expect(result).toBeDefined();
      expect(result.originalNodes).toHaveLength(malawiDistrictsData.nodes.length);
      expect(result.optimizedNodes).toHaveLength(malawiDistrictsData.nodes.length);
      expect(result.edges).toHaveLength(malawiDistrictsData.edges.length);
      expect(result.metrics).toBeDefined();
    });

    it('should preserve all node IDs', () => {
      const result = optimizer.optimizeGraph(malawiDistrictsData);
      const originalIds = result.originalNodes.map(n => n.id);
      const optimizedIds = result.optimizedNodes.map(n => n.id);
      
      expect(optimizedIds).toEqual(originalIds);
    });

    it('should ensure optimized coordinates are within bounds', () => {
      const result = optimizer.optimizeGraph(malawiDistrictsData);
      
      result.optimizedNodes.forEach(node => {
        expect(node.x).toBeGreaterThanOrEqual(0);
        expect(node.x).toBeLessThanOrEqual(1);
        expect(node.y).toBeGreaterThanOrEqual(0);
        expect(node.y).toBeLessThanOrEqual(1);
      });
    });

    it('should calculate meaningful metrics', () => {
      const result = optimizer.optimizeGraph(malawiDistrictsData);
      
      expect(result.metrics.originalCrossings).toBeGreaterThanOrEqual(0);
      expect(result.metrics.optimizedCrossings).toBeGreaterThanOrEqual(0);
      expect(result.metrics.originalAverageDistance).toBeGreaterThanOrEqual(0);
      expect(result.metrics.optimizedAverageDistance).toBeGreaterThanOrEqual(0);
      expect(result.metrics.originalMinDistance).toBeGreaterThanOrEqual(0);
      expect(result.metrics.optimizedMinDistance).toBeGreaterThanOrEqual(0);
    });
  });

  describe('validateCoordinates', () => {
    it('should validate coordinates within bounds', () => {
      const validNodes: Node[] = [
        { id: 'A', x: 0.0, y: 0.0 },
        { id: 'B', x: 0.5, y: 0.5 },
        { id: 'C', x: 1.0, y: 1.0 }
      ];
      
      expect(optimizer.validateCoordinates(validNodes)).toBe(true);
    });

    it('should reject coordinates outside bounds', () => {
      const invalidNodes: Node[] = [
        { id: 'A', x: -0.1, y: 0.5 },
        { id: 'B', x: 0.5, y: 1.1 },
        { id: 'C', x: 1.5, y: 0.5 }
      ];
      
      expect(optimizer.validateCoordinates(invalidNodes)).toBe(false);
    });

    it('should handle empty node array', () => {
      expect(optimizer.validateCoordinates([])).toBe(true);
    });
  });

  describe('compareLayouts', () => {
    it('should compare two layouts correctly', () => {
      const originalNodes: Node[] = [
        { id: 'A', x: 0.0, y: 0.0 },
        { id: 'B', x: 1.0, y: 1.0 }
      ];
      
      const optimizedNodes: Node[] = [
        { id: 'A', x: 0.2, y: 0.2 },
        { id: 'B', x: 0.8, y: 0.8 }
      ];
      
      const edges: Edge[] = [
        { source: 'A', target: 'B' }
      ];
      
      const comparison = optimizer.compareLayouts(originalNodes, optimizedNodes, edges);
      
      expect(comparison.crossingReduction).toBeDefined();
      expect(comparison.distanceImprovement).toBeDefined();
      expect(comparison.minDistanceImprovement).toBeDefined();
    });
  });

  describe('formatResults', () => {
    it('should format results as string', () => {
      const result = optimizer.optimizeGraph(malawiDistrictsData);
      const formatted = optimizer.formatResults(result);
      
      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('Graph Optimization Results');
      expect(formatted).toContain('Edge Crossings');
      expect(formatted).toContain('Average Distance');
      expect(formatted).toContain('Minimum Distance');
      expect(formatted).toContain('Coordinate Validation');
    });

    it('should include percentage reduction for crossings', () => {
      const result = optimizer.optimizeGraph(malawiDistrictsData);
      const formatted = optimizer.formatResults(result);
      
      expect(formatted).toContain('%');
    });
  });

  describe('exportOptimizedLayout', () => {
    it('should export layout as JSON string', () => {
      const result = optimizer.optimizeGraph(malawiDistrictsData);
      const exported = optimizer.exportOptimizedLayout();
      
      expect(typeof exported).toBe('string');
      
      const parsed = JSON.parse(exported);
      expect(parsed.nodes).toBeDefined();
      expect(parsed.edges).toBeDefined();
      expect(parsed.metrics).toBeDefined();
    });
  });
}); 