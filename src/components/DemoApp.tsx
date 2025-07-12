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

export const DemoApp: React.FC = () => {
  const [originalNodes, setOriginalNodes] = useState<Node[]>(malawiDistrictsData.nodes);
  const [optimizedNodes, setOptimizedNodes] = useState<Node[]>([]);
  const [currentNodes, setCurrentNodes] = useState<Node[]>(malawiDistrictsData.nodes);
  const [metrics, setMetrics] = useState<OptimizationMetrics | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [isOptimized, setIsOptimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

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

  const optimizeGraph = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = optimizer.optimizeGraph(malawiDistrictsData);
      setOptimizedNodes(result.optimizedNodes);
      setMetrics(result.metrics);
      setIsOptimized(true);
    } catch (err) {
      setError('Failed to optimize graph layout. Please try again.');
      console.error('Optimization error:', err);
    } finally {
      setIsLoading(false);
    }
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

  const getImprovementColor = (original: number, optimized: number) => {
    const improvement = optimized - original;
    if (improvement > 0) return '#4CAF50'; // Green for improvement
    if (improvement < 0) return '#f44336'; // Red for degradation
    return '#666'; // Gray for no change
  };

  return (
    <div className="malawi-graph-app">
      <div className="header">
        <h1>Malawi Districts Graph Visualization</h1>
        <p>Interactive visualization of Malawi's district connections using force-directed layout optimization</p>
      </div>

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="controls">
        <button 
          onClick={optimizeGraph} 
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Optimizing...' : 'Optimize Layout'}
        </button>
        <button 
          onClick={toggleView} 
          className="btn btn-secondary"
          disabled={!optimizedNodes.length}
        >
          {isOptimized ? 'Show Original' : 'Show Optimized'}
        </button>
        <button 
          onClick={() => setShowComparison(!showComparison)} 
          className="btn btn-secondary"
          disabled={!metrics}
        >
          {showComparison ? 'Hide Comparison' : 'Show Comparison'}
        </button>
      </div>

      {showComparison && metrics && (
        <div className="comparison-panel">
          <h3>Layout Comparison</h3>
          <div className="comparison-grid">
            <div className="comparison-item">
              <h4>Edge Crossings</h4>
              <div className="metric-display">
                <span className="metric-value">{metrics.originalCrossings}</span>
                <span className="metric-label">Original</span>
              </div>
              <div className="metric-display">
                <span 
                  className="metric-value" 
                  style={{ color: getImprovementColor(metrics.originalCrossings, metrics.optimizedCrossings) }}
                >
                  {metrics.optimizedCrossings}
                </span>
                <span className="metric-label">Optimized</span>
              </div>
            </div>
            <div className="comparison-item">
              <h4>Average Distance</h4>
              <div className="metric-display">
                <span className="metric-value">{metrics.originalAverageDistance.toFixed(4)}</span>
                <span className="metric-label">Original</span>
              </div>
              <div className="metric-display">
                <span 
                  className="metric-value" 
                  style={{ color: getImprovementColor(metrics.originalAverageDistance, metrics.optimizedAverageDistance) }}
                >
                  {metrics.optimizedAverageDistance.toFixed(4)}
                </span>
                <span className="metric-label">Optimized</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="visualization-container">
        {isLoading ? (
          <div className="loading">
            <div>Optimizing graph layout...</div>
          </div>
        ) : (
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
        )}
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
              <p><strong>Status:</strong> {isOptimized ? 'Optimized Layout' : 'Original Layout'}</p>
            </div>
          )}
          {hoveredNode && !selectedNode && (
            <div>
              <p><strong>Hovered:</strong> {hoveredNode.id}</p>
              <p><strong>Position:</strong> ({hoveredNode.x.toFixed(4)}, {hoveredNode.y.toFixed(4)})</p>
              <p><strong>Status:</strong> {isOptimized ? 'Optimized Layout' : 'Original Layout'}</p>
            </div>
          )}
          {!selectedNode && !hoveredNode && (
            <div>
              <p>Click or hover over a node to see details</p>
              <p><small>Use mouse wheel to zoom, drag to pan</small></p>
            </div>
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
          <li>Interactive zoom and pan with smooth transitions</li>
          <li>Node hover and click interactions with detailed information</li>
          <li>Toggle between original and optimized layouts</li>
          <li>Real-time optimization metrics and comparison</li>
          <li>Edge crossing minimization using force-directed layout</li>
          <li>Responsive design that works on all devices</li>
          <li>Professional-grade D3.js visualization</li>
        </ul>
        <p>
          <strong>Technical Implementation:</strong>
        </p>
        <ul>
          <li>TypeScript for type safety and modern development</li>
          <li>React for component-based UI architecture</li>
          <li>D3.js for advanced data visualization</li>
          <li>Force-directed layout algorithm for optimal positioning</li>
          <li>Comprehensive testing with Jest</li>
          <li>Docker containerization for easy deployment</li>
        </ul>
      </div>
    </div>
  );
}; 