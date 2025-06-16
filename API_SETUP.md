# API Integration Setup Guide

This guide will help you set up the Gemini AI and JSearch API integrations for your SkillSync project.

## Prerequisites

1. Install required packages:

```bash
cd server
npm install @google/generative-ai axios
```

## 1. Gemini AI Setup

### Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Add to Environment Variables

Create a `.env` file in the `server` directory and add:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

## 2. JSearch API Setup (RapidAPI)

### Step 1: Get RapidAPI Key

1. Go to [RapidAPI](https://rapidapi.com)
2. Sign up/Login to your account
3. Search for "JSearch" in the marketplace
4. Subscribe to the JSearch API (free tier available)
5. Copy your RapidAPI key from your dashboard

### Step 2: Add to Environment Variables

Add to your `.env` file:

```
RAPIDAPI_KEY=your_actual_rapidapi_key_here
```

## 3. Complete Environment File

Your `server/.env` file should look like this:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/skillsync

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Gemini AI API Key (Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here

# RapidAPI Key (for JSearch job search)
RAPIDAPI_KEY=your_rapidapi_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 4. Testing the Integrations

### Test Gemini AI Chat

1. Start your server: `npm run dev` (in server directory)
2. Open the chatbot in your frontend
3. Ask any career-related question
4. You should receive a response from Gemini AI

### Test External Job Search

1. Go to the Jobs page in your frontend
2. Click the "External" toggle
3. Search for jobs
4. You should see real jobs from JSearch API

## 5. API Endpoints

### AI Chat

- **Endpoint:** `POST /api/ai/chat`
- **Body:** `{ "message": "your question here" }`
- **Response:** `{ "response": "AI response" }`

### External Job Search

- **Endpoint:** `GET /api/jobs/search/external`
- **Query Parameters:**
  - `query`: Job search term (default: "software developer")
  - `location`: Location (default: "United States")
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10)

## 6. Troubleshooting

### Gemini AI Issues

- **Error:** "GEMINI_API_KEY not found"
  - Solution: Check your `.env` file and ensure the key is correct
- **Error:** "API key invalid"
  - Solution: Verify your API key in Google AI Studio

### JSearch API Issues

- **Error:** "RAPIDAPI_KEY not found"
  - Solution: Check your `.env` file and ensure the key is correct
- **Error:** "API quota exceeded"
  - Solution: Check your RapidAPI subscription limits
- **Fallback:** If API fails, the system will show mock data

### General Issues

- **Server not starting:** Check all environment variables are set
- **CORS errors:** Ensure your frontend is configured to call the backend
- **Network errors:** Check your internet connection and API endpoints

## 7. Alternative APIs

If you prefer different APIs:

### Alternative AI Services

- **OpenAI GPT:** Replace Gemini with OpenAI's API
- **Claude:** Use Anthropic's Claude API
- **Local AI:** Use local models like Ollama

### Alternative Job Search APIs

- **Adzuna:** Free job search API
- **LinkedIn:** Requires business account
- **Indeed:** No public API available
- **ZipRecruiter:** Requires partnership

## 8. Security Notes

- Never commit your `.env` file to version control
- Use environment variables for all API keys
- Consider rate limiting for production use
- Monitor API usage to avoid unexpected costs

## 9. Production Deployment

For production deployment:

1. Set up proper environment variables on your hosting platform
2. Configure CORS properly
3. Add rate limiting
4. Set up monitoring for API usage
5. Consider caching for job search results

## Support

If you encounter issues:

1. Check the console logs for detailed error messages
2. Verify your API keys are correct
3. Test the APIs directly using tools like Postman
4. Check the API documentation for any changes
