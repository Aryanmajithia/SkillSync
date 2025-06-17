# SkillSync - AI-Powered Job Search Platform

A comprehensive job search and interview platform powered by AI, featuring resume analysis, AI interviews, job matching, and premium subscription features.

## 🌐 Live Demo

- **Frontend (Vercel):** [https://skillsync-cbstxyrmx-aryanmajithia18.vercel.app](https://skillsync-cbstxyrmx-aryanmajithia18.vercel.app)
- **Backend API (Render):** [https://skillsync-backend-opqm.onrender.com](https://skillsync-backend-opqm.onrender.com)
- **API Health Check:** [https://skillsync-backend-opqm.onrender.com/health](https://skillsync-backend-opqm.onrender.com/health)

## 🚀 Features

- **AI-Powered Resume Analysis** - Get detailed feedback and ATS optimization
- **Smart Job Matching** - AI-driven job recommendations based on your profile
- **Premium AI Interviews** - Practice with advanced AI interview simulations
- **Application Tracking** - Monitor your job applications in real-time
- **Stripe Integration** - Secure payment processing for premium features
- **Real-time Chatbot** - AI-powered job search assistance
- **Dark/Light Theme** - Beautiful, responsive UI with theme switching

## 🛠️ Tech Stack

### Frontend

- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Query** for data fetching
- **Stripe** for payments
- **Lucide React** for icons

### Backend

- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Stripe** for payment processing
- **Google Gemini AI** for AI features
- **Multer** for file uploads

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Stripe account
- Google Gemini API key

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/skillsync.git
   cd skillsync
   ```

2. **Install dependencies**

   ```bash
   npm run install:all
   ```

3. **Environment Setup**

   **Backend** (`server/.env`):

   ```env
   MONGODB_URI=mongodb://localhost:27017/skillsync
   JWT_SECRET=your-super-secret-jwt-key
   GEMINI_API_KEY=your-gemini-api-key
   RAPIDAPI_KEY=your-rapidapi-key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   FRONTEND_URL=http://localhost:5173
   ```

   **Frontend** (`frontend/.env`):

   ```env
   VITE_API_URL=http://localhost:5000
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

4. **Start development servers**

   ```bash
   npm run dev
   ```

   This will start both frontend (http://localhost:5173) and backend (http://localhost:5000)

## 🚀 Deployment

### ✅ Already Deployed

This project is currently deployed and live:

- **Frontend:** [https://skillsync-cbstxyrmx-aryanmajithia18.vercel.app](https://skillsync-cbstxyrmx-aryanmajithia18.vercel.app) (Vercel)
- **Backend:** [https://skillsync-backend-opqm.onrender.com](https://skillsync-backend-opqm.onrender.com) (Render)

### Deployment Instructions (For Reference)

If you want to deploy your own instance:

### 1. GitHub Setup

1. **Initialize Git and push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/skillsync.git
   git push -u origin main
   ```

### 2. Backend Deployment (Render)

1. **Go to [Render.com](https://render.com) and sign up**
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure the service:**

   - **Name**: `skillsync-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free

5. **Add Environment Variables:**

   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `RAPIDAPI_KEY`: Your RapidAPI key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
   - `CORS_ORIGIN`: `https://skillsync-cbstxyrmx-aryanmajithia18.vercel.app`
   - `FRONTEND_URL`: `https://skillsync-cbstxyrmx-aryanmajithia18.vercel.app`

6. **Deploy and note the URL** (e.g., `https://skillsync-backend.onrender.com`)

### 3. Frontend Deployment (Vercel)

1. **Go to [Vercel.com](https://vercel.com) and sign up**
2. **Import your GitHub repository**
3. **Configure the project:**

   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variables:**

   - `VITE_API_URL`: `https://skillsync-backend-opqm.onrender.com`
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

5. **Deploy**

### 4. Update CORS Settings

After both deployments are complete:

1. **Go back to Render dashboard**
2. **Update the environment variables:**

   - `CORS_ORIGIN`: `https://skillsync-cbstxyrmx-aryanmajithia18.vercel.app`
   - `FRONTEND_URL`: `https://skillsync-cbstxyrmx-aryanmajithia18.vercel.app`

3. **Redeploy the backend service**

## 🔧 Configuration

### MongoDB Atlas Setup

1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `<password>` with your database password
5. Add the connection string to your environment variables

### Stripe Setup

1. Create a Stripe account
2. Get your API keys from the dashboard
3. Set up webhooks for production
4. Update environment variables with your keys

### Google Gemini AI

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to environment variables

## 📱 Usage

### For Job Seekers

1. **Register/Login** to your account
2. **Upload your resume** for AI analysis
3. **Browse jobs** and apply
4. **Practice interviews** with AI
5. **Track applications** in your dashboard
6. **Upgrade to premium** for advanced features

### For Employers

1. **Register as an employer**
2. **Post job listings**
3. **Review applications**
4. **Manage candidates**

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- Secure file uploads
- Stripe PCI compliance

## 🧪 Testing

### Stripe Test Cards

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@skillsync.com or create an issue in this repository.

## 🔄 Updates

Stay updated with the latest features and improvements by following this repository.

---

**Made with ❤️ by Aryan Majithia**
