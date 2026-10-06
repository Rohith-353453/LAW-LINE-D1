const express = require('express');
require('dotenv').config(); // Load env vars immediately
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Security & Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Allow CDN scripts (Tailwind, Firebase, FA)
}));
app.use(cors()); // Allow local development
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: "Too many requests. Please try again later." }
});
app.use('/api', limiter);

// Serve Static Frontend Files (Root)
// This MUST come before routes to ensure index.html handles '/'
app.use(express.static(__dirname));

// API Endpoint
app.post('/api/analyze', async (req, res) => {
    try {
        // 1. Check API Key presence
        if (!process.env.GEMINI_API_KEY) {
            console.error("CRITICAL: GEMINI_API_KEY is missing in .env file.");
            return res.status(500).json({
                error: "Server Configuration Error: API Key missing.",
                details: "Please add GEMINI_API_KEY to your .env file."
            });
        }

        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: "Please provide a valid query." });
        }

        // 2. Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use the fast, cost-effective model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemPrompt = `
        Role: You are a helpful Indian Legal Advisor.
        Task: Explain the following legal query in **SIMPLE, BASIC ENGLISH**.
        
        Constraints:
        - Use simple words that a 10-year-old can understand.
        - **DO NOT use Hindi** (unless explicitly asked by the user).
        - Break down complex legal terms into plain English.
        - Add a mandatory disclaimer at the end.
        
        User Query: "${query}"
        `;

        console.log(`Processing Query: ${query.substring(0, 50)}...`);

        // 3. Generate Content
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        console.log("Success: Response generated.");
        res.json({ response: text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({
            error: "AI Service Error.",
            details: error.message || "Unknown error occurred."
        });
    }
});

// Fallback: redirects to index.html for any unhandled routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(port, () => {
    console.log(`\n---------------------------------------------------------`);
    console.log(`✅ Server running at http://localhost:${port}`);
    console.log(`👉 API Key Status: ${process.env.GEMINI_API_KEY ? "Loaded (" + process.env.GEMINI_API_KEY.length + " chars)" : "❌ MISSING"}`);
    console.log(`👉 Open http://localhost:${port} to use the app.`);
    console.log(`---------------------------------------------------------\n`);
});
