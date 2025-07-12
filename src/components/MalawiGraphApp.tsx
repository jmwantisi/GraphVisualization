import React, { useState, useEffect } from 'react';
import { GraphVisualization } from './GraphVisualization';
import { GraphOptimizer } from '../app/graph-optimizer';
import { malawiDistrictsData, Node } from '../data/malawi-districts';

interface OptimizationMetrics {
  originalCrossings: number;
  optimizedCrossings: number;
  originalAverageDistance: number;
  optimizedAverageDistance: number;
  originalMinDistance: number;
  optimizedMinDistance: number;
}

export const MalawiGraphApp: React.FC = () => {
  const [originalNodes, setOriginalNodes] = useState<Node[]>(malawiDistrictsData.nodes);
  const [optimizedNodes, setOptimizedNodes] = useState<Node[]>([]);
  const [currentNodes, setCurrentNodes] = useState<Node[]>(malawiDistrictsData.nodes);
  const [metrics, setMetrics] = useState<OptimizationMetrics | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [isOptimized, setIsOptimized] = useState(false);

  const optimizer = new GraphOptimizer({
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

  useEffect(() => {
    // Run initial optimization
    optimizeGraph();
  }, []);

  const optimizeGraph = () => {
    const result = optimizer.optimizeGraph(malawiDistrictsData);
    setOptimizedNodes(result.optimizedNodes);
    setMetrics(result.metrics);
    setIsOptimized(true);
  };

  const toggleView = () => {
    if (isOptimized) {
      setCurrentNodes(originalNodes);
      setIsOptimized(false);
    } else {
      setCurrentNodes(optimizedNodes);
      setIsOptimized(true);
    }
  };

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
  };

  const handleNodeHover = (node: Node | null) => {
    setHoveredNode(node);
  };

  const formatMetrics = () => {
    if (!metrics) return '';
    
    const crossingReduction = metrics.originalCrossings - metrics.optimizedCrossings;
    const crossingReductionPercent = metrics.originalCrossings > 0 
      ? (crossingReduction / metrics.originalCrossings * 100).toFixed(1)
      : '0';

    return `
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
    `.trim();
  };

  return (
    <div className="malawi-graph-app">
      <div className="header">
        <h1>Malawi Districts Graph Visualization</h1>
        <p>Interactive visualization of Malawi's district connections using force-directed layout optimization</p>
      </div>

      <div className="controls">
        <button onClick={optimizeGraph} className="btn btn-primary">
          Optimize Layout
        </button>
        <button onClick={toggleView} className="btn btn-secondary">
          {isOptimized ? 'Show Original' : 'Show Optimized'}
        </button>
      </div>

      <div className="visualization-container">
        <GraphVisualization
          nodes={currentNodes}
          edges={malawiDistrictsData.edges}
          width={800}
          height={600}
          nodeRadius={10}
          nodeColor="#4CAF50"
          edgeColor="#666"
          edgeWidth={2}
          backgroundColor="#f5f5f5"
          showLabels={true}
          labelFontSize={10}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
        />
      </div>

      <div className="info-panels">
        <div className="metrics-panel">
          <h3>Optimization Metrics</h3>
          <pre>{formatMetrics()}</pre>
        </div>

        <div className="node-info-panel">
          <h3>Node Information</h3>
          {selectedNode && (
            <div>
              <p><strong>Selected:</strong> {selectedNode.id}</p>
              <p><strong>Position:</strong> ({selectedNode.x.toFixed(4)}, {selectedNode.y.toFixed(4)})</p>
            </div>
          )}
          {hoveredNode && !selectedNode && (
            <div>
              <p><strong>Hovered:</strong> {hoveredNode.id}</p>
              <p><strong>Position:</strong> ({hoveredNode.x.toFixed(4)}, {hoveredNode.y.toFixed(4)})</p>
            </div>
          )}
          {!selectedNode && !hoveredNode && (
            <p>Click or hover over a node to see details</p>
          )}
        </div>
      </div>

      <div className="description">
        <h3>About This Visualization</h3>
        <p>
          This application demonstrates graph layout optimization for Malawi's 28 districts. 
          The force-directed algorithm uses D3.js to minimize edge crossings and improve 
          visual clarity by positioning connected districts closer together while spreading 
          unconnected districts apart.
        </p>
        <p>
          <strong>Features:</strong>
        </p>
        <ul>
          <li>Interactive zoom and pan</li>
          <li>Node hover and click interactions</li>
          <li>Toggle between original and optimized layouts</li>
          <li>Real-time optimization metrics</li>
          <li>Edge crossing minimization</li>
        </ul>
      </div>
    </div>
  );
}; 