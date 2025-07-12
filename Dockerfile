# Development Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY jest.config.js ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/

# Expose port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "react:dev"] 