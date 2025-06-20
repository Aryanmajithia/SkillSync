# SkillSync - AI-Powered Job Search & Interview Platform

A comprehensive, full-stack job search and interview preparation platform powered by AI technology. Built with React, Node.js, MongoDB, and integrated with advanced AI services.

## 🌐 Live Demo

- **Frontend (Vercel):** [https://skillsync-cbstxyrmx-aryanmajithia18.vercel.app](https://skillsync-cbstxyrmx-aryanmajithia18.vercel.app)
- **Backend API (Render):** [https://skillsync-backend-opqm.onrender.com](https://skillsync-backend-opqm.onrender.com)
- **API Health Check:** [https://skillsync-backend-opqm.onrender.com/health](https://skillsync-backend-opqm.onrender.com/health)

## 🚀 Features

### Core Features

- **AI-Powered Job Matching** - Advanced algorithms to match candidates with perfect job opportunities
- **Resume Analysis & Optimization** - ATS-friendly resume suggestions and scoring
- **AI Interview Preparation** - Practice interviews with real-time feedback
- **Career Analytics Dashboard** - Track your job search progress and performance
- **Real-time Messaging** - Connect with employers and recruiters
- **Premium Subscription System** - Advanced features for premium users

### Advanced AI Features

- **Gemini AI Integration** - Google's latest AI for interview questions and career guidance
- **Resume ATS Scoring** - Optimize resumes for Applicant Tracking Systems
- **Smart Job Recommendations** - Personalized job suggestions based on skills and preferences
- **Interview Performance Analytics** - Detailed feedback and improvement suggestions
- **Career Path Planning** - AI-driven career development recommendations

### Technical Features

- **Real-time Chat** - Socket.IO powered messaging system
- **File Upload & Management** - Resume and document handling
- **Stripe Payment Integration** - Secure subscription management
- **Email Notifications** - Automated email alerts and updates
- **Responsive Design** - Mobile-first, modern UI/UX
- **Dark/Light Theme** - User preference support
- **Advanced Security** - JWT authentication, rate limiting, CORS protection

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Socket.IO Client** - Real-time communication
- **Stripe Elements** - Payment processing

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Token authentication
- **Multer** - File upload handling
- **Nodemailer** - Email sending
- **Stripe** - Payment processing
- **Google AI (Gemini)** - Advanced AI capabilities

### DevOps & Tools

- **Docker** - Containerization
- **Vercel** - Frontend deployment
- **Render** - Backend deployment
- **GitHub Actions** - CI/CD pipeline
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/skillsync.git
cd skillsync
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Return to root
cd ..
```

### 3. Environment Setup

#### Backend Environment

Create `server/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/skillsync

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
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
```

#### Frontend Environment

Create `frontend/.env` file:

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Feature Flags
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_STRIPE_PAYMENTS=true
VITE_ENABLE_FILE_UPLOADS=true
```

### 4. Start Development Servers

#### Option 1: Start Both Servers (Recommended)

```bash
npm run dev
```

#### Option 2: Start Servers Separately

```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:frontend
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 🏗️ Project Structure

```
skillsync/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── contexts/       # React contexts
│   │   ├── utils/          # Utility functions
│   │   └── lib/            # Third-party library configs
│   ├── package.json
│   └── vite.config.js
├── server/                  # Node.js backend application
│   ├── routes/             # API route handlers
│   ├── models/             # MongoDB models
│   ├── middleware/         # Express middleware
│   ├── services/           # Business logic services
│   ├── uploads/            # File upload directory
│   ├── migrations/         # Database migrations
│   ├── package.json
│   └── index.js
├── package.json            # Root package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

| Variable            | Description               | Default                             |
| ------------------- | ------------------------- | ----------------------------------- |
| `PORT`              | Server port               | 5000                                |
| `NODE_ENV`          | Environment mode          | development                         |
| `MONGODB_URI`       | MongoDB connection string | mongodb://localhost:27017/skillsync |
| `JWT_SECRET`        | JWT signing secret        | Required                            |
| `FRONTEND_URL`      | Frontend URL for CORS     | http://localhost:5173               |
| `GOOGLE_AI_API_KEY` | Google AI API key         | Required for AI features            |
| `STRIPE_SECRET_KEY` | Stripe secret key         | Required for payments               |
| `EMAIL_HOST`        | SMTP host                 | smtp.gmail.com                      |
| `EMAIL_USER`        | Email username            | Required                            |
| `EMAIL_PASS`        | Email password            | Required                            |

#### Frontend (.env)

| Variable                      | Description             | Default               |
| ----------------------------- | ----------------------- | --------------------- |
| `VITE_API_URL`                | Backend API URL         | http://localhost:5000 |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key  | Required for payments |
| `VITE_ENABLE_AI_FEATURES`     | Enable AI features      | true                  |
| `VITE_ENABLE_STRIPE_PAYMENTS` | Enable payment features | true                  |

### Database Setup

1. **Local MongoDB**

   ```bash
   # Install MongoDB locally
   # Start MongoDB service
   mongod
   ```

2. **MongoDB Atlas (Cloud)**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get connection string and update `MONGODB_URI`

### AI Services Setup

1. **Google AI (Gemini)**

   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create API key
   - Add to `GOOGLE_AI_API_KEY`

2. **Stripe Payments**
   - Create account at [Stripe](https://stripe.com)
   - Get API keys from dashboard
   - Add to environment variables

## 🚀 Deployment

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

### Backend (Render)

1. Connect GitHub repository to Render
2. Configure environment variables
3. Set build command: `npm install`
4. Set start command: `npm start`

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🧪 Testing

```bash
# Run backend tests
cd server && npm test

# Run frontend tests
cd frontend && npm test

# Run all tests
npm test
```

## 📊 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Password reset

### Job Endpoints

- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### AI Endpoints

- `POST /api/ai/chat` - AI chat interface
- `POST /api/ai/resume-analysis` - Resume analysis
- `POST /api/ai/interview-prep` - Interview preparation
- `POST /api/ai/job-matching` - Job matching

### Application Endpoints

- `GET /api/applications` - Get user applications
- `POST /api/applications` - Submit application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Withdraw application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/yourusername/skillsync/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/skillsync/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/skillsync/discussions)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Node.js](https://nodejs.org/) - Backend runtime
- [MongoDB](https://www.mongodb.com/) - Database
- [Google AI](https://ai.google/) - AI services
- [Stripe](https://stripe.com/) - Payment processing
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

**Made with ❤️ by [Your Name]**
