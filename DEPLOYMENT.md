# SkillSync Deployment Guide

This guide will help you deploy your SkillSync application to production.

## Prerequisites

Before deploying, make sure you have:

1. A MongoDB database (MongoDB Atlas recommended)
2. Stripe account for payments
3. Google Gemini API key for AI features
4. RapidAPI key for job data

## Option 1: Deploy to Render (Recommended)

Render is a great platform for full-stack applications with a generous free tier.

### Step 1: Prepare Environment Variables

You'll need to set up these environment variables in Render:

**Backend Environment Variables:**

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT tokens
- `GEMINI_API_KEY`: Your Google Gemini API key
- `RAPIDAPI_KEY`: Your RapidAPI key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `NODE_ENV`: Set to "production"

**Frontend Environment Variables:**

- `VITE_API_URL`: Will be set to your backend URL

### Step 2: Deploy to Render

1. **Fork or push your code to GitHub**

2. **Connect to Render:**

   - Go to [render.com](https://render.com)
   - Sign up/Login with your GitHub account
   - Click "New +" and select "Blueprint"

3. **Deploy using the render.yaml:**

   - Render will automatically detect the `render.yaml` file
   - It will create both backend and frontend services
   - Set the environment variables in the Render dashboard

4. **Configure your services:**
   - Backend will be available at: `https://skillsync-backend.onrender.com`
   - Frontend will be available at: `https://skillsync-frontend.onrender.com`

### Step 3: Update CORS Settings

After deployment, update the `CORS_ORIGIN` and `FRONTEND_URL` in your backend environment variables to match your actual frontend URL.

## Option 2: Deploy to Vercel + Railway

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set build settings:
   - Framework Preset: Vite
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && npm install`

### Backend (Railway)

1. Push your code to GitHub
2. Connect your repository to Railway
3. Set the root directory to `server`
4. Configure environment variables
5. Deploy

## Option 3: Deploy to Heroku

### Step 1: Create Heroku App

```bash
heroku create your-app-name
```

### Step 2: Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set GEMINI_API_KEY=your_gemini_key
heroku config:set RAPIDAPI_KEY=your_rapidapi_key
heroku config:set STRIPE_SECRET_KEY=your_stripe_secret
heroku config:set STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
heroku config:set STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### Step 3: Deploy

```bash
git push heroku main
```

## Environment Variables Setup

### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://mongodb.com/atlas)
2. Get your connection string
3. Replace `<password>` with your database password

### Stripe Setup

1. Create an account at [Stripe](https://stripe.com)
2. Get your API keys from the dashboard
3. Set up webhooks for payment processing

### Google Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to your environment variables

### RapidAPI

1. Sign up at [RapidAPI](https://rapidapi.com)
2. Subscribe to a job search API
3. Get your API key

## Post-Deployment Checklist

- [ ] Test all authentication flows
- [ ] Verify database connections
- [ ] Test payment integration
- [ ] Check AI features (resume analysis, interview)
- [ ] Verify file uploads work
- [ ] Test email notifications
- [ ] Check mobile responsiveness
- [ ] Verify CORS settings
- [ ] Test all API endpoints

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your frontend URL is correctly set in backend CORS settings
2. **Database Connection**: Verify your MongoDB URI is correct and accessible
3. **Build Failures**: Check that all dependencies are properly installed
4. **Environment Variables**: Ensure all required variables are set in your deployment platform

### Debug Commands:

```bash
# Check if server is running
curl https://your-backend-url/health

# Check build logs
# View logs in your deployment platform dashboard
```

## Security Considerations

- Use strong JWT secrets
- Keep API keys secure
- Enable HTTPS
- Set up proper CORS policies
- Use environment variables for sensitive data
- Regularly update dependencies

## Monitoring

Consider setting up:

- Application performance monitoring (APM)
- Error tracking (Sentry)
- Uptime monitoring
- Database monitoring
- Log aggregation

Your application should now be successfully deployed! 🚀
