#!/bin/bash

echo "Setting up SkillSync development environment..."

# Create .env files if they don't exist
echo "Creating environment files..."

# Backend .env
if [ ! -f "./backend/.env" ]; then
  echo "Creating backend/.env..."
  cat > ./backend/.env << EOL
PORT=4000
MONGODB_URI=mongodb://localhost:27017/skillsync
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
ELASTICSEARCH_URL=http://localhost:9200
RABBITMQ_URL=amqp://localhost:5672
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
EOL
fi

# Frontend .env
if [ ! -f "./frontend/.env" ]; then
  echo "Creating frontend/.env..."
  cat > ./frontend/.env << EOL
VITE_API_URL=http://localhost:4000/api
EOL
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo "Setup complete! To start the development servers:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "Note: Make sure you have the following services running locally:"
echo "- MongoDB (mongodb://localhost:27017)"
echo "- Redis (redis://localhost:6379)"
echo "- Elasticsearch (http://localhost:9200)"
echo "- RabbitMQ (amqp://localhost:5672)" 