#!/bin/bash

# CMS Docker Setup Script
set -e

echo "🚀 Setting up Architect CMS with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env files if they don't exist
echo "📝 Setting up environment files..."

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your production values"
fi

if [ ! -f backend/.env ]; then
    echo "Creating backend/.env from backend/.env.example..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your values (AWS credentials, JWT secret, etc.)"
fi

if [ ! -f frontend/.env ]; then
    echo "Creating frontend/.env from frontend/.env.example..."
    cp frontend/.env.example frontend/.env
fi

echo ""
echo "✅ Environment files created!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your AWS credentials and JWT secret"
echo "2. Run 'docker-compose up' to start all services"
echo "3. Access the frontend at http://localhost:3000"
echo "4. Access the backend API at http://localhost:5000"
echo ""
echo "For production deployment, use: docker-compose -f docker-compose.prod.yml up -d"
