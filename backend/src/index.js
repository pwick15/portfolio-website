const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { generateChatResponse } = require("./services/aiService");

const app = express();

// Enable trust proxy for Cloud Run/proxies
app.set("trust proxy", 1);

// Configure strict CORS
const allowedOrigins = [
  'https://pwick15.github.io',
  'http://localhost:5500',
  'http://127.0.0.1:5500'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  // Expose the rate limit headers to the frontend script!
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset']
}));

app.use(express.json());

// Apply rate limiting: Max 20 requests per 10 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, 
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true, // Send RateLimit-* headers
  legacyHeaders: false, 
});

app.use("/api/", apiLimiter);

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, webContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Call our isolated AI layer
    const reply = await generateChatResponse(message, history, webContext);

    res.json({ reply });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Modular Zero-DB backend listening on port ${PORT}`);
});
