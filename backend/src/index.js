const express = require("express");
const cors = require("cors");
const { generateChatResponse } = require("./services/aiService");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Call our isolated AI layer
    const reply = await generateChatResponse(message, history);

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
