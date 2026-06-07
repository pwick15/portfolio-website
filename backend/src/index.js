const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const config = require("./config");
const { generateChatResponse } = require("./services/aiService");

const app = express();

// Enable trust proxy for Cloud Run/proxies
app.set("trust proxy", 1);

// Configure strict CORS using centralized configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || config.allowedOrigins.indexOf(origin) !== -1) {
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

// Google reCAPTCHA v3 verification helper
async function verifyRecaptcha(token) {
  const secretKey = config.recaptchaSecret;
  
  // For local development or if not configured yet, warn and bypass
  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY environment variable is not defined. Bypassing check.");
    return true;
  }
  
  if (!token) {
    console.warn("No reCAPTCHA token provided in request.");
    return false;
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`
    });

    const data = await response.json();
    
    if (!data.success) {
      console.warn("Google reCAPTCHA verification failed:", data["error-codes"]);
      return false;
    }

    // Google returns a score between 0.0 (bot) and 1.0 (human)
    // 0.5 is the standard threshold for form submissions
    return data.score >= 0.5;
  } catch (error) {
    console.error("reCAPTCHA siteverify request failed:", error);
    return false; // Fail secure
  }
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, webContext, recaptchaToken } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Verify reCAPTCHA token first
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res.status(403).json({ error: "Access denied. Automated activity detected by reCAPTCHA." });
    }

    // Call our isolated AI layer
    const reply = await generateChatResponse(message, history, webContext);

    res.json({ reply });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Modular Zero-DB backend listening on port ${PORT}`);
});
