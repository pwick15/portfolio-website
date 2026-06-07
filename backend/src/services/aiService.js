const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

// Load CV context from file using absolute path resolved from __dirname
const cvPath = path.join(__dirname, "../data/cv.txt");
const cvContext = fs.readFileSync(cvPath, "utf8");

const config = require("../config");

// Initialize the official Google Gen AI SDK configured for Vertex AI
const ai = new GoogleGenAI({
  vertexai: true,
  project: config.gcpProject,
  location: config.gcpLocation
});

/**
 * Handles the conversation flow.
 */
async function generateChatResponse(message, history = [], webContext = "") {
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

  // Construct system instruction with both CV and dynamic website context
  let systemInstruction = `You are an AI assistant representing Punjaya Wickramasinghe (the website owner) based on his CV and portfolio website content.
Use the provided CV context and website context to answer queries accurately. If details are not available in either, politely state that you do not have that information.

CV Context:
${cvContext}`;

  if (webContext) {
    systemInstruction += `\n\nWebsite Page Content:\n${webContext}`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      systemInstruction: systemInstruction,
    },
  });

  return response.text;
}

module.exports = { generateChatResponse };
