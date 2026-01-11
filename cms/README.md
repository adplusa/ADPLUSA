# Architect CMS - Docker Setup

This directory contains the complete CMS system with Docker Compose orchestration.

## Services

- **MongoDB**: Database service (port 27017)
- **Backend**: Node.js/Express API (port 5000)
- **Frontend**: React/Vite admin panel (port 3000)

## Quick Start

### Development

1. Copy environment files:
```bash
cd cms
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Update the environment variables in `backend/.env` and `frontend/.env`

3. Start all services:
```bash
docker-compose up
```

4. Access the services:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: mongodb://localhost:27017

### Production

1. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with production values
```

2. Start production services:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Commands

### Development
```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild services
docker-compose up --build

# Stop and remove volumes (WARNING: deletes database)
docker-compose down -v
```

### Production
```bash
# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Stop production services
docker-compose -f docker-compose.prod.yml down

# View production logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Individual Services
```bash
# Start only MongoDB
docker-compose up mongodb

# Restart backend
docker-compose restart backend

# View backend logs
docker-compose logs -f backend

# Execute commands in backend container
docker-compose exec backend npm run migrate
```

## Data Persistence

MongoDB data is persisted in Docker volumes:
- `mongodb_data`: Database files
- `mongodb_config`: MongoDB configuration

To backup MongoDB:
```bash
docker-compose exec mongodb mongodump --out=/data/backup
docker cp architect-cms-mongodb:/data/backup ./backup
```

To restore MongoDB:
```bash
docker cp ./backup architect-cms-mongodb:/data/backup
docker-compose exec mongodb mongorestore /data/backup
```

## Troubleshooting

### Port conflicts
If ports 3000, 5000, or 27017 are already in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change host port
```

### MongoDB connection issues
Check if MongoDB is healthy:
```bash
docker-compose ps
docker-compose logs mongodb
```

### Backend not starting
Check backend logs:
```bash
docker-compose logs backend
```

Verify environment variables in `backend/.env`

### Hot reload not working
Ensure volume mounts are correct in `docker-compose.yml`. On Windows, you may need to enable file sharing in Docker Desktop settings.

## Network

All services communicate through the `cms-network` bridge network. Services can reference each other by service name (e.g., `mongodb`, `backend`).
