#!/bin/bash

echo "🚀 SkillSync Deployment Script"
echo "================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if all dependencies are installed
echo "📦 Checking dependencies..."

# Check root dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    npm install
fi

# Check frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Check backend dependencies
if [ ! -d "server/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd server && npm install && cd ..
fi

echo "✅ Dependencies check complete!"

# Check environment variables
echo "🔧 Checking environment variables..."

# Check if .env files exist
if [ ! -f "server/.env" ]; then
    echo "⚠️  Warning: server/.env file not found"
    echo "   Please create server/.env with the following variables:"
    echo "   MONGODB_URI=your_mongodb_connection_string"
    echo "   JWT_SECRET=your_jwt_secret"
    echo "   GEMINI_API_KEY=your_gemini_api_key"
    echo "   RAPIDAPI_KEY=your_rapidapi_key"
    echo "   STRIPE_SECRET_KEY=your_stripe_secret_key"
    echo "   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key"
    echo "   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret"
fi

# Test build
echo "🔨 Testing build process..."

# Test frontend build
echo "Building frontend..."
cd frontend
if npm run build; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi
cd ..

echo "🎉 Build test completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy to your chosen platform:"
echo "   - Render: Use the render.yaml file"
echo "   - Vercel: Connect your GitHub repo"
echo "   - Heroku: Use 'git push heroku main'"
echo ""
echo "3. Set up environment variables in your deployment platform"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions" 