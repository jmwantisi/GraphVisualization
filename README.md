# Malawi Districts Graph Visualization

A comprehensive solution for visualizing and optimizing the layout of Malawi's district connections using force-directed graph algorithms and D3.js.

## Objective

Create a visualization of Malawi's district connections using a graph layout algorithm. Given an adjacency list representing district connections and initial (non-optimized) node positions, produce an optimized layout where nodes (districts) are positioned to minimize edge crossings and ensure clear visualization.

## Problem Description

You are provided with an adjacency list representing an undirected graph of Malawi's districts and their connections. Each district (node) has an initial (X, Y) position with coordinates as decimals between 0 and 1. These positions are not optimized, often leading to overlapping nodes or cluttered edges. Your task is to reposition the nodes to create a visually clear layout, ensuring nodes are spread out, connected nodes are closer together, and edge crossings are minimized.

### Provided Data
- **Nodes**: 28 districts of Malawi, each with an initial (X, Y) position (decimals between 0 and 1)
- **Edges**: Adjacency list representing connections between districts
- **Constraints**: Final positions should remain within a 1x1 unit square (X, Y coordinates between 0 and 1). Edges are undirected and unweighted.

## Architecture

The solution is built with a modular architecture:

```
src/
├── data/                    # Data models and Malawi districts data
├── algorithms/              # Graph layout algorithms
├── visualization/           # D3.js visualization components
├── app/                     # Main application logic
├── components/              # React components
└── __tests__/              # Comprehensive test suite
```

## Features

### Core Functionality
- **Force-Directed Layout**: Uses D3.js force simulation for optimal node positioning
- **Edge Crossing Minimization**: Calculates and reduces edge crossings
- **Coordinate Validation**: Ensures all positions stay within 1x1 unit square
- **Interactive Visualization**: Zoom, pan, hover, and click interactions
- **Metrics Calculation**: Real-time comparison of original vs optimized layouts

### Technical Features
- **TypeScript**: Full type safety and modern JavaScript features
- **D3.js**: Professional-grade data visualization
- **React**: Component-based UI (optional)
- **Docker**: Containerized development
- **Comprehensive Testing**: Jest test suite with high coverage
- **Modular Design**: Clean separation of concerns

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GraphVisualization
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

### React Demo

1. **Quick setup with script**
   ```bash
   chmod +x setup-demo.sh
   ./setup-demo.sh
   ```

2. **Manual setup**
   ```bash
   npm install
   npm run react:dev
   ```

### Docker Development

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Or build manually**
   ```bash
   docker build -t malawi-graph-app:dev .
   docker run -p 3000:3000 malawi-graph-app:dev
   ```

## Problem Analysis

### Challenges Identified
1. **Node Overlap**: Initial positions may cause nodes to overlap, making the graph cluttered
2. **Edge Crossings**: Many edge crossings reduce readability and make connections unclear
3. **Unbalanced Distribution**: Nodes may be clustered in certain areas, leaving empty space
4. **Coordinate Constraints**: All final positions must remain within 1x1 unit square
5. **Connection Clarity**: Connected districts should be positioned closer together

## Algorithm Identification

### Force-Directed Layout (D3.js)
The solution uses D3.js force simulation with multiple forces:

- **Link Force**: Attracts connected nodes together
- **Charge Force**: Repels nodes from each other
- **Center Force**: Keeps nodes centered in the layout area
- **Collision Force**: Prevents node overlap

### Algorithm Benefits
- **Iterative Optimization**: Runs simulation for multiple iterations
- **Coordinate Normalization**: Ensures all positions stay within 1x1 square
- **Edge Crossing Detection**: Calculates and minimizes edge crossings
- **Balanced Distribution**: Spreads nodes evenly across the available space

## Approach Explanation

1. **Data Processing**: Load adjacency list and initial positions
2. **Force Simulation**: Apply D3 force-directed algorithm
3. **Coordinate Scaling**: Scale positions to fit 1x1 unit square
4. **Validation**: Ensure all coordinates are within bounds
5. **Metrics Calculation**: Compare original vs optimized layouts
6. **Visualization**: Render interactive graph using D3.js

## Performance Metrics

The application calculates and displays:

- **Edge Crossings**: Number of edge intersections (minimized)
- **Average Distance**: Average distance between connected nodes
- **Minimum Distance**: Minimum distance between any two nodes
- **Coordinate Validation**: Ensures all positions are within bounds

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
- **Force-Directed Layout**: Algorithm correctness and edge cases
- **Graph Optimizer**: Main application logic
- **Edge Crossing Detection**: Accurate intersection calculation
- **Coordinate Validation**: Boundary checking
- **Metrics Calculation**: Performance measurement accuracy

## Docker Configuration

### Development Setup
The Dockerfile is configured for development:
1. **Dependencies**: Install all dependencies including dev dependencies
2. **Source Code**: Mount source code for hot reloading
3. **Development Server**: Runs Vite development server

## API Reference

### Core Classes

#### `ForceDirectedLayout`
```typescript
class ForceDirectedLayout {
  optimizeLayout(graphData: GraphData): Node[]
  calculateEdgeCrossings(nodes: Node[], edges: Edge[]): number
  calculateAverageDistance(nodes: Node[], edges: Edge[]): number
  calculateMinimumNodeDistance(nodes: Node[]): number
}
```

#### `GraphOptimizer`
```typescript
class GraphOptimizer {
  optimizeGraph(graphData: GraphData): OptimizationResult
  validateCoordinates(nodes: Node[]): boolean
  compareLayouts(original: Node[], optimized: Node[], edges: Edge[]): ComparisonMetrics
}
```

#### `GraphVisualizer`
```typescript
class GraphVisualizer {
  render(nodes: Node[], edges: Edge[]): void
  update(nodes: Node[], edges: Edge[]): void
  exportSVG(): string
}
```

## React Components

### `GraphVisualization`
Interactive D3.js visualization component with:
- Zoom and pan functionality
- Node hover and click interactions
- Customizable styling
- Real-time updates

### `MalawiGraphApp`
Complete React application featuring:
- Toggle between original and optimized layouts
- Real-time metrics display
- Interactive node information
- Responsive design

## Development

### Development Setup
```bash
# Build development image
docker build -t malawi-graph-app:dev .

# Run with Docker Compose
docker-compose up

# Or run standalone
docker run -p 3000:3000 malawi-graph-app:dev
```

### Environment Variables
- `NODE_ENV`: Development mode (default)
- `PORT`: Application port (default: 3000)

## Usage Examples

### Basic Usage
```typescript
import { GraphOptimizer } from './app/graph-optimizer';
import { malawiDistrictsData } from './data/malawi-districts';

const optimizer = new GraphOptimizer();
const result = optimizer.optimizeGraph(malawiDistrictsData);

console.log(result.metrics);
console.log(result.optimizedNodes);
```

### React Integration
```typescript
import { MalawiGraphApp } from './components/MalawiGraphApp';

function App() {
  return <MalawiGraphApp />;
}
```
