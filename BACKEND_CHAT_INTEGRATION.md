# Badda AI Chat - Backend Integration Guide

## Overview
This guide shows you how to add Google Gemini AI integration to your Railway backend to power Badda, your AI assistant.

## Step 1: Install Dependencies

In your **backend project**, run:
```bash
npm install @google/generative-ai
```

## Step 2: Get Your FREE Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key
4. Add it to your Railway environment variables as `GEMINI_API_KEY`

**In Railway Dashboard:**
- Go to your project → Variables
- Add: `GEMINI_API_KEY` = `your-api-key-here`

## Step 3: Create Chat Route Handler

Create a new file `routes/chat.js` (or `chat.ts` if using TypeScript) in your backend:

```javascript
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt to define Badda's personality and knowledge
const SYSTEM_PROMPT = `You are Badda, an AI assistant for Lotto Pro - a lottery inventory management system for retail stores.

Your knowledge base:
- Product: Lotto Pro helps store owners track scratch-off lottery tickets
- Price: $29.99/month with no contracts, cancel anytime
- Key Features:
  * Real-time ticket inventory tracking
  * Automatic daily sales reports
  * Multi-store management support
  * Mobile app - use any smartphone, no special hardware needed
  * Prevents $5,000-$7,000 annual losses from theft and mismanagement
  * Setup in just 5 minutes
  * 24/7 support available

- Free Trial: Available - no credit card required
- Target Users: Convenience store owners, gas stations, lottery retailers
- Benefits: Stop theft, track inventory, perfect daily reports, affordable

Personality:
- Friendly, helpful, and professional
- Concise but informative responses
- Always mention you can connect users to human support for complex issues
- Focus on helping potential customers understand the value
- If asked about features not in your knowledge base, offer to connect them with support

Keep responses conversational and under 3-4 sentences when possible.`;

/**
 * POST /api/chat/message
 * Send message to Badda AI
 */
router.post('/message', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT
    });

    // Build conversation history
    const chatHistory = history.slice(-10).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Start chat with history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 500,
      },
    });

    // Send message and get response
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    res.json({
      success: true,
      reply: reply,
      message: reply // For compatibility
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message'
    });
  }
});

module.exports = router;
```

## Step 4: Register the Route

In your main **backend server file** (usually `index.js`, `server.js`, or `app.js`):

```javascript
// Add this with your other route imports
const chatRoutes = require('./routes/chat');

// Add this with your other route registrations
app.use('/api/chat', chatRoutes);
```

**Example placement:**
```javascript
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/stores');
const chatRoutes = require('./routes/chat'); // ADD THIS

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/chat', chatRoutes); // ADD THIS

// ... rest of your server code
```

## Step 5: Deploy to Railway

1. Commit your changes:
```bash
git add .
git commit -m "Add Badda AI chat integration with Gemini"
git push
```

2. Railway will automatically deploy your changes

3. Verify the environment variable `GEMINI_API_KEY` is set in Railway dashboard

## Step 6: Test It!

1. Open your Lotto Pro website
2. Click the Badda chat button (robot icon)
3. Try asking:
   - "What is Lotto Pro?"
   - "How much does it cost?"
   - "What features do you offer?"
   - "Do you have a free trial?"

## Customizing Badda

### Update Badda's Knowledge
Edit the `SYSTEM_PROMPT` in `routes/chat.js` to:
- Add new features
- Update pricing
- Change personality
- Add specific responses to common questions

### Adjust Response Length
In the `generationConfig`:
```javascript
maxOutputTokens: 500, // Lower = shorter responses, Higher = longer
temperature: 0.7, // Lower = more focused, Higher = more creative
```

## Free Tier Limits

Google Gemini API Free Tier:
- ✅ 1,500 requests per day
- ✅ 60 requests per minute
- ✅ Gemini 1.5 Flash model (fast & efficient)

This is MORE than enough for a landing page chatbot!

## Troubleshooting

**Chat not working?**
1. Check Railway logs for errors
2. Verify `GEMINI_API_KEY` is set correctly
3. Make sure the route is registered in your main server file
4. Check browser console for network errors

**Getting rate limit errors?**
- Free tier: 60 requests/min is plenty for normal use
- If needed, add request caching or rate limiting

**Need help?**
- Check Railway deployment logs
- Test the endpoint directly: `POST https://your-app.up.railway.app/api/chat/message`

## Next Steps

- Monitor usage in [Google AI Studio](https://aistudio.google.com/)
- Customize Badda's personality in the system prompt
- Add conversation persistence (save chat history to database)
- Implement user feedback system
- Add analytics to track common questions

---

That's it! Badda is now powered by Google Gemini AI and ready to help your customers 24/7! 🤖
