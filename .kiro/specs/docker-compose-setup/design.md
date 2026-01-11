# Design Document: Docker Compose Setup

## Overview

This design document describes the Docker Compose configuration for the Architect CMS system. The solution provides two compose configurations: one for development with hot-reload capabilities, and one for production with security hardening and performance optimization. The system orchestrates three main services: a MongoDB database, a Node.js/Express backend API, and a React/Vite frontend admin panel.

## Architecture

### Service Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Host Machine                         │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │         Docker Compose Network (cms-network)       │ │
│  │                                                    │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────┐ │ │
│  │  │   Frontend   │  │   Backend    │  │ MongoDB │ │ │
│  │  │   (React)    │──│  (Express)   │──│         │ │ │
│  │  │   Port 3000  │  │   Port 5000  │  │ Port    │ │ │
│  │  │              │  │              │  │ 27017   │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────┘ │ │
│  │         │                 │                │      │ │
│  └─────────┼─────────────────┼────────────────┼──────┘ │
│            │                 │                │        │
│       Port 3000         Port 5000      (internal only) │
└─────────────────────────────────────────────────────────┘
```

### File Structure

```
cms/
├── docker-compose.yml           # Development configuration
├── docker-compose.prod.yml      # Production configuration
├── .env.example                 # Example environment variables
├── backend/
│   ├── Dockerfile              # Development Dockerfile
│   ├── Dockerfile.prod         # Production Dockerfile
│   ├── .env
│   └── src/
└── frontend/
    ├── Dockerfile              # Development Dockerfile
    ├── Dockerfile.prod         # Production Dockerfile
    ├── .env
    └── src/
```

## Components and Interfaces

### 1. MongoDB Service

**Purpose:** Provides persistent data storage for the CMS.

**Configuration:**
- Image: `mongo:7`
- Container name: `cms-mongodb`
- Internal port: 27017
- Exposed port (dev only): 27017
- Authentication: Username/password from environment variables
- Data persistence: Named volume `mongodb-data`

**Environment Variables:**
- `MONGO_INITDB_ROOT_USERNAME`: Admin username
- `MONGO_INITDB_ROOT_PASSWORD`: Admin password
- `MONGO_INITDB_DATABASE`: Initial database name

**Health Check:**
```yaml
test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
interval: 10s
timeout: 5s
retries: 5
start_period: 10s
```

### 2. Backend Service

**Purpose:** Provides REST API for content management and authentication.

**Development Configuration:**
- Build context: `./backend`
- Dockerfile: `Dockerfile`
- Container name: `cms-backend`
- Port mapping: `5000:5000`
- Volumes:
  - `./backend/src:/app/src` (source code hot-reload)
  - `backend-node-modules:/app/node_modules` (preserve dependencies)
- Depends on: `mongodb`

**Production Configuration:**
- Build context: `./backend`
- Dockerfile: `Dockerfile.prod`
- Container name: `cms-backend`
- Port mapping: `5000:5000`
- No source volumes (code baked into image)
- Resource limits: 512MB memory, 0.5 CPU
- Restart policy: `unless-stopped`

**Environment Variables:**
- `PORT`: 5000
- `NODE_ENV`: development | production
- `MONGODB_URI`: mongodb://username:password@mongodb:27017/architect-cms
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: Token expiration time
- `AWS_ACCESS_KEY_ID`: AWS credentials for S3
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_BUCKET_NAME`: S3 bucket name
- `AWS_REGION`: AWS region
- `CORS_ORIGIN`: Allowed CORS origins

**Health Check:**
```yaml
test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
interval: 30s
timeout: 10s
retries: 3
start_period: 40s
```

### 3. Frontend Service

**Purpose:** Provides admin interface for content management.

**Development Configuration:**
- Build context: `./frontend`
- Dockerfile: `Dockerfile`
- Container name: `cms-frontend`
- Port mapping: `3000:3000`
- Volumes:
  - `./frontend/src:/app/src` (source code hot-reload)
  - `./frontend/public:/app/public` (static assets)
  - `frontend-node-modules:/app/node_modules` (preserve dependencies)
- Depends on: `backend`

**Production Configuration:**
- Build context: `./frontend`
- Dockerfile: `Dockerfile.prod`
- Build args: `VITE_API_URL`
- Container name: `cms-frontend`
- Port mapping: `80:80`
- No source volumes (code baked into image)
- Resource limits: 256MB memory, 0.25 CPU
- Restart policy: `unless-stopped`

**Environment Variables:**
- `VITE_API_URL`: Backend API URL (http://localhost:5000 for dev, configurable for prod)

**Health Check (Production):**
```yaml
test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:80"]
interval: 30s
timeout: 10s
retries: 3
start_period: 5s
```

### 4. Network Configuration

**Network Name:** `cms-network`

**Type:** Bridge network

**Purpose:** Enables service-to-service communication using DNS resolution. Services can reference each other by service name (e.g., `mongodb`, `backend`, `frontend`).

### 5. Volume Configuration

**Named Volumes:**

1. `mongodb-data`
   - Purpose: Persist MongoDB database files
   - Mount point: `/data/db` in MongoDB container

2. `backend-node-modules` (dev only)
   - Purpose: Preserve npm dependencies across container rebuilds
   - Mount point: `/app/node_modules` in backend container

3. `frontend-node-modules` (dev only)
   - Purpose: Preserve npm dependencies across container rebuilds
   - Mount point: `/app/node_modules` in frontend container

## Data Models

### Docker Compose Configuration Schema

**Development (docker-compose.yml):**
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: cms-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
      MONGO_INITDB_DATABASE: architect-cms
    ports:
      - "27017:27017"
    volumes:
      - mongodb-data:/data/db
    networks:
      - cms-network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: cms-backend
    environment:
      PORT: 5000
      NODE_ENV: development
      MONGODB_URI: mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongodb:27017/architect-cms
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN}
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      AWS_BUCKET_NAME: ${AWS_BUCKET_NAME}
      AWS_REGION: ${AWS_REGION}
      CORS_ORIGIN: http://localhost:3000
    ports:
      - "5000:5000"
    volumes:
      - ./backend/src:/app/src
      - backend-node-modules:/app/node_modules
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - cms-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: cms-frontend
    environment:
      VITE_API_URL: http://localhost:5000
    ports:
      - "3000:3000"
    volumes:
      - ./frontend/src:/app/src
      - ./frontend/public:/app/public
      - frontend-node-modules:/app/node_modules
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - cms-network

networks:
  cms-network:
    driver: bridge

volumes:
  mongodb-data:
  backend-node-modules:
  frontend-node-modules:
```

**Production (docker-compose.prod.yml):**
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: cms-mongodb-prod
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
      MONGO_INITDB_DATABASE: architect-cms
    volumes:
      - mongodb-data:/data/db
    networks:
      - cms-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: cms-backend-prod
    environment:
      PORT: 5000
      NODE_ENV: production
      MONGODB_URI: mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongodb:27017/architect-cms
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN}
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      AWS_BUCKET_NAME: ${AWS_BUCKET_NAME}
      AWS_REGION: ${AWS_REGION}
      AWS_CLOUDFRONT_URL: ${AWS_CLOUDFRONT_URL}
      CORS_ORIGIN: ${CORS_ORIGIN}
    ports:
      - "5000:5000"
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - cms-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
      args:
        VITE_API_URL: ${VITE_API_URL}
    container_name: cms-frontend-prod
    ports:
      - "80:80"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - cms-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '0.25'
          memory: 256M
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s

networks:
  cms-network:
    driver: bridge

volumes:
  mongodb-data:
```

### Environment Variables Schema

**.env.example:**
```bash
# MongoDB Configuration
MONGO_USERNAME=admin
MONGO_PASSWORD=change-this-password

# Backend Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=architect-cms-images
AWS_REGION=us-east-1
AWS_CLOUDFRONT_URL=

# Production CORS (comma-separated origins)
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com

# Frontend API URL (for production build)
VITE_API_URL=http://localhost:5000
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Service Startup Order

*For any* Docker Compose execution, MongoDB must be healthy before the backend starts, and the backend must be healthy before the frontend starts.

**Validates: Requirements 1.2, 1.3**

### Property 2: Volume Persistence

*For any* data written to MongoDB, stopping and restarting containers should preserve that data.

**Validates: Requirements 4.2**

### Property 3: Network Isolation

*For any* service-to-service communication, services should be able to resolve each other by service name within the cms-network.

**Validates: Requirements 7.2**

### Property 4: Environment Variable Propagation

*For any* required environment variable, it should be correctly passed from the .env file to the appropriate service container.

**Validates: Requirements 5.1, 5.3, 5.4**

### Property 5: Health Check Validation

*For any* service with a health check, the service should report healthy status when the application is running correctly.

**Validates: Requirements 6.1, 6.2**

### Property 6: Hot Reload Functionality (Development)

*For any* source code change in development mode, the change should be reflected in the running application without container restart.

**Validates: Requirements 2.1, 2.2**

### Property 7: Port Exposure

*For any* service requiring external access, the correct ports should be exposed to the host machine (3000 for frontend, 5000 for backend).

**Validates: Requirements 1.4**

### Property 8: Resource Limits (Production)

*For any* production service, resource limits should be enforced to prevent resource exhaustion.

**Validates: Requirements 3.4**

## Error Handling

### Service Startup Failures

**Scenario:** A service fails to start due to missing environment variables or configuration errors.

**Handling:**
- Docker Compose will display error logs from the failing service
- Dependent services will not start if dependencies fail health checks
- Use `docker-compose logs <service-name>` to diagnose issues

### Database Connection Failures

**Scenario:** Backend cannot connect to MongoDB.

**Handling:**
- Backend health check will fail
- Frontend will not start due to backend dependency
- Check MongoDB health status and connection string
- Verify MongoDB credentials match between services

### Port Conflicts

**Scenario:** Required ports (3000, 5000, 27017) are already in use on the host.

**Handling:**
- Docker Compose will fail with port binding error
- User must stop conflicting services or modify port mappings in docker-compose.yml
- Alternative: Use different external ports (e.g., `3001:3000`)

### Volume Permission Issues

**Scenario:** Container cannot write to mounted volumes.

**Handling:**
- Ensure proper file permissions on host directories
- In production, services run as non-root users with appropriate permissions
- Use `chown` to fix permission issues if needed

### Health Check Failures

**Scenario:** Service starts but fails health checks.

**Handling:**
- Service marked as unhealthy in `docker-compose ps`
- Dependent services will not start
- Check service logs for application errors
- Verify health check endpoint is accessible

## Testing Strategy

### Unit Tests

Unit tests will verify specific configuration scenarios:

1. **Environment Variable Loading**
   - Test that .env file is correctly parsed
   - Test default values are applied when variables are missing
   - Test variable substitution in docker-compose.yml

2. **Service Configuration**
   - Test that each service has correct image/build configuration
   - Test that port mappings are correctly defined
   - Test that volume mounts are correctly specified

3. **Network Configuration**
   - Test that custom network is created
   - Test that all services are attached to the network

### Property-Based Tests

Property-based tests will verify universal behaviors across all configurations:

1. **Service Dependency Order (Property 1)**
   - Generate random service start sequences
   - Verify MongoDB always starts before backend
   - Verify backend always starts before frontend

2. **Volume Persistence (Property 2)**
   - Generate random data writes to MongoDB
   - Stop and restart containers
   - Verify all data is preserved

3. **Network Resolution (Property 3)**
   - Generate random service-to-service requests
   - Verify services can resolve each other by name
   - Verify requests succeed within the network

4. **Environment Propagation (Property 4)**
   - Generate random environment variable sets
   - Verify all variables are accessible in containers
   - Verify MongoDB URI is correctly constructed

5. **Health Check Validation (Property 5)**
   - Start services and wait for health checks
   - Verify all services report healthy status
   - Verify health check endpoints return expected responses

6. **Hot Reload (Property 6)**
   - Generate random source code changes
   - Verify changes are reflected without restart
   - Verify application continues running

7. **Port Accessibility (Property 7)**
   - Test connections to exposed ports from host
   - Verify services are accessible on correct ports
   - Verify internal ports are not exposed in production

8. **Resource Limits (Property 8)**
   - Monitor container resource usage
   - Verify limits are enforced
   - Verify services operate within limits

### Integration Tests

Integration tests will verify end-to-end workflows:

1. **Full Stack Startup**
   - Run `docker-compose up`
   - Verify all services start successfully
   - Verify frontend can communicate with backend
   - Verify backend can communicate with MongoDB

2. **Development Workflow**
   - Start development environment
   - Make code changes to backend and frontend
   - Verify hot-reload works for both services
   - Verify changes are reflected in running application

3. **Production Deployment**
   - Build production images
   - Start production environment
   - Verify services run with production configurations
   - Verify resource limits are applied
   - Verify health checks pass

4. **Data Persistence**
   - Start environment and create test data
   - Stop all containers
   - Restart environment
   - Verify test data is still present

5. **Cleanup**
   - Run `docker-compose down`
   - Verify all containers are stopped and removed
   - Run `docker-compose down -v`
   - Verify all volumes are removed

### Manual Testing Checklist

- [ ] Clone repository and navigate to cms directory
- [ ] Copy .env.example to .env and configure variables
- [ ] Run `docker-compose up` and verify all services start
- [ ] Access frontend at http://localhost:3000
- [ ] Access backend at http://localhost:5000/health
- [ ] Make a code change and verify hot-reload
- [ ] Stop containers with Ctrl+C
- [ ] Run `docker-compose down` to clean up
- [ ] Run `docker-compose -f docker-compose.prod.yml up` for production
- [ ] Verify production services start with correct configurations
- [ ] Run `docker-compose down -v` to remove volumes

## Notes

- The design assumes existing Dockerfiles are functional and tested
- MongoDB 7 is used for compatibility with modern features
- Development mode prioritizes developer experience with hot-reload
- Production mode prioritizes security and resource efficiency
- Health checks ensure services are truly ready before dependent services start
- Named volumes prevent data loss during container lifecycle operations
