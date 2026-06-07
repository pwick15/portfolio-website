const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

// Load CV context from file using absolute path resolved from __dirname
const cvPath = path.join(__dirname, "../data/cv.txt");
const cvContext = fs.readFileSync(cvPath, "utf8");

// Initialize the official Google Gen AI SDK configured for Vertex AI
const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT || "project-f3658b98-4d0a-4964-a7f",
  location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1"
});

/**
 * Handles the conversation flow.
 */
async function generateChatResponse(message, history = []) {
  // Format incoming history into the structure the unified SDK expects
  const contents = history.map((turn) => ({
    role: turn.role,
    parts: [{ text: turn.parts[0].text || turn.parts[0] }],
  }));

  // Append the new message
  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      systemInstruction: `You are an AI assistant representing the user based on their CV. Use the following CV context to answer queries accurately. If details aren't in the CV, politely state that.\n\nCV Context:\n${cvContext}`,
    },
  });

  return response.text;
}

module.exports = { generateChatResponse };
