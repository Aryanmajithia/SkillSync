# SkillSync Deployment Guide

## Quick Deploy Options

### Option 1: Render (Recommended - Free)

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Blueprint"
4. Connect your GitHub repo
5. Render will auto-detect `render.yaml` and deploy both frontend & backend
6. Set environment variables in Render dashboard

### Option 2: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Set build settings:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable: `VITE_API_URL = your-backend-url`

**Backend (Railway):**

1. Go to [railway.app](https://railway.app)
2. Import your GitHub repo
3. Set root directory to `server`
4. Add environment variables

## Required Environment Variables

### Backend Variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
RAPIDAPI_KEY=your_rapidapi_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NODE_ENV=production
```

### Frontend Variables:

```
VITE_API_URL=your_backend_url
```

## Setup External Services

1. **MongoDB Atlas** - Database
2. **Stripe** - Payments
3. **Google Gemini** - AI features
4. **RapidAPI** - Job data

## Deploy Steps

1. Push code to GitHub
2. Choose deployment platform
3. Set environment variables
4. Deploy
5. Test your app

That's it! 🚀
