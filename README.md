# Architect CMS

A full-stack Content Management System with MongoDB, Express.js, React, and Node.js.

## 🚀 Quick Start with Docker (Recommended)

The easiest way to run the entire stack:

```bash
# 1. Configure environment
cp .env .env.local
# Edit .env with your AWS credentials and JWT secret

# 2. Start all services
./start.sh
# or
make dev

# 3. Access applications
# Admin Panel: http://localhost:3000
# Backend API: http://localhost:5000
```

📖 **See [DOCKER_QUICK_START.md](DOCKER_QUICK_START.md) for detailed Docker instructions**

## 📦 What's Included

- **Backend API** (Express.js + TypeScript) - RESTful API with authentication
- **Admin Panel** (React + Vite) - Content management interface
- **MongoDB** - Database
- **Redis** - Caching and session storage
- **AWS S3** - Image storage
- **Docker** - Containerized development and deployment

## 🛠️ Manual Setup (Without Docker)

### Prerequisites
- Node.js 20+
- MongoDB 7.0+
- Redis 7+
- AWS S3 account

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Admin Setup
```bash
cd admin
npm install
cp .env.example .env
# Edit .env with backend API URL
npm run dev
```

## 📚 Documentation

- [Docker Quick Start](DOCKER_QUICK_START.md) - Get started with Docker
- [Docker Setup Guide](DOCKER_SETUP.md) - Detailed Docker documentation
- [Backend README](backend/README.md) - Backend API documentation
- [Admin README](admin/README.md) - Admin panel documentation
- [Migration Guide](backend/MIGRATION_GUIDE.md) - Sanity to MongoDB migration

## 🔧 Development

### Using Docker (Recommended)
```bash
make dev          # Start all services
make logs         # View logs
make down         # Stop services
make help         # Show all commands
```

### Using Docker Compose
```bash
docker-compose up -d              # Start services
docker-compose logs -f            # View logs
docker-compose down               # Stop services
```

### Manual Development
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Admin
cd admin && npm run dev

# Terminal 3 - MongoDB
mongod

# Terminal 4 - Redis
redis-server
```

## 🗄️ Database

### Migrations
```bash
# With Docker
make migrate

# Without Docker
cd backend && npm run migrate
```

### Backup & Restore
```bash
# Backup
make backup

# Restore
make restore
```

## 🚢 Production Deployment

```bash
# Configure production environment
nano .env.production

# Start production services
make prod
```

See [DOCKER_SETUP.md](DOCKER_SETUP.md) for production deployment details.

## 🏗️ Project Structure

```
.
├── backend/          # Express.js API
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── admin/            # React Admin Panel
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── Makefile
└── README.md
```

## 🔐 Environment Variables

### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT tokens
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_BUCKET_NAME` - S3 bucket name

### Admin (.env)
- `VITE_API_URL` - Backend API URL

## 🧪 Testing

```bash
# Backend tests
make test-backend

# Or without Docker
cd backend && npm test
```

## 📝 Available Scripts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run migrate` - Run migrations

### Admin
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 🆘 Support

- Check [DOCKER_SETUP.md](DOCKER_SETUP.md) for troubleshooting
- View logs: `make logs`
- Check health: `make health`
