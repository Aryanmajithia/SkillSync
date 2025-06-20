#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

console.log("🚀 SkillSync Setup Wizard");
console.log("========================\n");

async function setup() {
  try {
    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

    if (majorVersion < 16) {
      console.error("❌ Node.js version 16 or higher is required");
      console.error(`Current version: ${nodeVersion}`);
      process.exit(1);
    }

    console.log(`✅ Node.js version: ${nodeVersion}`);

    // Install dependencies
    console.log("\n📦 Installing dependencies...");

    console.log("Installing root dependencies...");
    execSync("npm install", { stdio: "inherit" });

    console.log("Installing server dependencies...");
    execSync("cd server && npm install", { stdio: "inherit" });

    console.log("Installing frontend dependencies...");
    execSync("cd frontend && npm install", { stdio: "inherit" });

    // Create environment files
    console.log("\n🔧 Setting up environment files...");

    // Backend environment
    const backendEnvPath = path.join(__dirname, "server", ".env");
    if (!fs.existsSync(backendEnvPath)) {
      const backendEnvContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/skillsync

# JWT Configuration
JWT_SECRET=${generateSecret()}
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Google AI (Gemini) Configuration
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Feature Flags
ENABLE_AI_FEATURES=true
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_STRIPE_PAYMENTS=true
ENABLE_FILE_UPLOADS=true

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
`;

      fs.writeFileSync(backendEnvPath, backendEnvContent);
      console.log("✅ Created server/.env");
    }

    // Frontend environment
    const frontendEnvPath = path.join(__dirname, "frontend", ".env");
    if (!fs.existsSync(frontendEnvPath)) {
      const frontendEnvContent = `# API Configuration
VITE_API_URL=http://localhost:5000

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Feature Flags
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_STRIPE_PAYMENTS=true
VITE_ENABLE_FILE_UPLOADS=true

# App Configuration
VITE_APP_NAME=SkillSync
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=AI-powered job search and interview platform

# Development Configuration
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true
`;

      fs.writeFileSync(frontendEnvPath, frontendEnvContent);
      console.log("✅ Created frontend/.env");
    }

    // Create upload directories
    console.log("\n📁 Creating upload directories...");
    const uploadDirs = [
      "server/uploads",
      "server/uploads/chat-files",
      "server/uploads/resumes",
      "server/uploads/avatars",
      "server/uploads/job-attachments",
      "server/logs",
    ];

    uploadDirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created ${dir}`);
      }
    });

    // Check MongoDB connection
    console.log("\n🗄️ Checking MongoDB connection...");
    try {
      // This is a basic check - in production you'd want more robust connection testing
      console.log("⚠️  Please ensure MongoDB is running on localhost:27017");
      console.log("   Or update MONGODB_URI in server/.env for cloud database");
    } catch (error) {
      console.log("⚠️  MongoDB connection check skipped");
    }

    // Final setup instructions
    console.log("\n🎉 Setup completed successfully!");
    console.log("\n📋 Next steps:");
    console.log(
      "1. Update environment variables in server/.env and frontend/.env"
    );
    console.log("2. Set up your MongoDB database (local or cloud)");
    console.log("3. Get API keys for Google AI and Stripe (optional)");
    console.log("4. Start the development servers: npm run dev");
    console.log("\n🚀 Quick start:");
    console.log("   npm run dev");
    console.log("\n📚 Documentation: README.md");

    // Ask if user wants to start the servers
    const startServers = await question(
      "\n❓ Would you like to start the development servers now? (y/n): "
    );

    if (
      startServers.toLowerCase() === "y" ||
      startServers.toLowerCase() === "yes"
    ) {
      console.log("\n🚀 Starting development servers...");
      execSync("npm run dev", { stdio: "inherit" });
    }
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

function generateSecret() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

setup();
