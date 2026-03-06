#!/bin/bash

# CMS Backend Deployment Script
# This script rebuilds and deploys the Lambda function to AWS
set -e  # Exit on error

echo "🚀 Starting CMS Backend Deployment..."
echo ""
npm run build:lambda
# Check if we're in the right directory
if [ ! -f "samconfig.toml" ]; then
    echo "❌ Error: samconfig.toml not found. Please run this script from cms/backend directory"
    exit 1
fi

# Step 1: Build
echo "📦 Building Lambda function..."
sam build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""

# Step 2: Deploy
echo "🌐 Deploying to AWS Lambda..."
sam deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment completed successfully"
    echo ""
    echo "🎉 Backend is now live!"
    echo ""
    echo "API Endpoint: https://szlvt92np8.execute-api.us-east-1.amazonaws.com"
    echo ""
    echo "New endpoints available:"
    echo "  - GET  /api/admin/faq"
    echo "  - PUT  /api/admin/faq"
    echo "  - GET  /api/admin/about"
    echo "  - PUT  /api/admin/about"
    echo "  - GET  /api/admin/contact"
    echo "  - PUT  /api/admin/contact"
else
    echo "❌ Deployment failed"
    exit 1
fi
