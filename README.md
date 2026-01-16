# ADPL Consulting Website

A full-stack architecture consulting website with a custom CMS built on MongoDB, Express.js, React, and Node.js.

## 🏗️ Architecture Overview

This project consists of three main components:

- **Main Frontend** (`src/app/`) - Next.js public website
- **CMS Backend** (`cms/backend/`) - Express.js API with MongoDB
- **CMS Admin Panel** (`cms/frontend/`) - React admin dashboards

```
┌─────────────────────────────────────────────────────────────────┐
│                     Main Frontend (Next.js)                      │
│                        http://localhost:3001                     │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ HTTP/REST
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CMS Backend (Express)                        │
│                        http://localhost:8000                     │
│                                                                  │
│  Public API: /api/public/*    Admin API: /api/* (authenticated) │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MongoDB                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- MongoDB 7.0+ (or Docker)
- npm or yarn

### 1. Start the CMS Backend

```bash
# Navigate to CMS backend
cd cms/backend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and AWS credentials

# Start the backend server
npm run dev
# Backend runs on http://localhost:8000
```

### 2. Start the CMS Admin Panel (Optional)

```bash
# In a new terminal, navigate to CMS frontend
cd cms/frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start the admin panel
npm run dev
# Admin panel runs on http://localhost:5173
```

### 3. Start the Main Frontend

```bash
# In a new terminal, from the project root
# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env.local
# Edit .env.local if needed (defaults to localhost:8000)

# Start the Next.js development server
npm run dev
# Main site runs on http://localhost:3000
```

## 🔐 Environment Variables

### Main Frontend (.env.local)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_CMS_API_URL` | URL of the CMS backend API | `http://localhost:8000` |

### CMS Backend (cms/backend/.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `PORT` | Server port | No (default: 8000) |
| `AWS_ACCESS_KEY_ID` | AWS access key for S3 | For image uploads |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | For image uploads |
| `AWS_BUCKET_NAME` | S3 bucket name | For image uploads |
| `AWS_REGION` | AWS region | For image uploads |

### CMS Admin Panel (cms/frontend/.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | CMS backend API URL | `http://localhost:8000` |

## 🐳 Running with Docker

For a containerized setup:

```bash
cd cms

# Start all CMS services (MongoDB, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Then start the main frontend separately:

```bash
# From project root
npm run dev
```

## 📁 Project Structure

```
.
├── src/                      # Main Next.js Frontend
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.js          # Homepage
│   │   ├── projects/        # Projects pages
│   │   ├── services/        # Services pages
│   │   ├── about/           # About page
│   │   ├── contact/         # Contact page
│   │   └── faq/             # FAQ page
│   └── lib/
│       ├── cms-client.ts    # CMS API client
│       └── cms-types.ts     # TypeScript types
│
├── cms/                      # Custom CMS
│   ├── backend/             # Express.js API
│   │   ├── src/
│   │   │   ├── routes/      # API routes
│   │   │   ├── controllers/ # Route handlers
│   │   │   └── database/    # MongoDB schemas
│   │   └── package.json
│   │
│   ├── frontend/            # React Admin Panel
│   │   ├── src/
│   │   └── package.json
│   │
│   └── docker-compose.yml   # Docker configuration
│
├── public/                   # Static assets
├── .env.example             # Environment template
├── .env.local               # Local environment (git-ignored)
└── package.json
```

## 🔌 CMS API Endpoints

### Public Endpoints (No Authentication)

| Endpoint | Description |
|----------|-------------|
| `GET /api/public/homepage` | Homepage content |
| `GET /api/public/projects` | List all projects |
| `GET /api/public/projects/:slug` | Single project by slug |
| `GET /api/public/services` | List all services |
| `GET /api/public/services/:slug` | Single service by slug |
| `GET /api/public/about` | About page content |
| `GET /api/public/contact` | Contact page content |
| `GET /api/public/faq` | FAQ content |

### Admin Endpoints (Authentication Required)

See `cms/backend/README.md` for full API documentation.

## 🛠️ Development Workflow

### Running All Services

For full development, you need three terminals:

```bash
# Terminal 1: CMS Backend
cd cms/backend && npm run dev

# Terminal 2: CMS Admin (optional, for content editing)
cd cms/frontend && npm run dev

# Terminal 3: Main Frontend
npm run dev
```

### Content Management

1. Access the CMS Admin Panel at `http://localhost:5173`
2. Log in with your admin credentials
3. Create/edit content (projects, services, pages)
4. Changes appear on the main frontend after page refresh (ISR: 60s)

### Adding New Content Types

1. Create schema in `cms/backend/src/database/schemas/`
2. Add routes in `cms/backend/src/routes/`
3. Add types in `src/lib/cms-types.ts`
4. Add fetch functions in `src/lib/cms-client.ts`

## 🧪 Testing

```bash
# Run main frontend tests
npm test

# Run CMS backend tests
cd cms/backend && npm test
```

## 🚢 Production Deployment

### Environment Setup

1. Set `NEXT_PUBLIC_CMS_API_URL` to your production CMS API URL
2. Configure CMS backend with production MongoDB and AWS credentials
3. Build and deploy each component:

```bash
# Build main frontend
npm run build

# Build CMS backend
cd cms/backend && npm run build

# Build CMS admin
cd cms/frontend && npm run build
```

### Deployment Options

- **Vercel**: Deploy main frontend to Vercel
- **AWS/GCP/Azure**: Deploy CMS backend as a container or VM
- **Docker**: Use `cms/docker-compose.prod.yml` for production

## 📝 Available Scripts

### Main Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### CMS Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations

### CMS Admin
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🆘 Troubleshooting

### CMS Connection Issues

1. Verify CMS backend is running: `curl http://localhost:8000/api/health`
2. Check `NEXT_PUBLIC_CMS_API_URL` in `.env.local`
3. Ensure MongoDB is running and accessible

### Image Upload Issues

1. Verify AWS credentials in CMS backend `.env`
2. Check S3 bucket permissions
3. Ensure CORS is configured on S3 bucket

### Build Errors

1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`

## 📄 License

ISC
