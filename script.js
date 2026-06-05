/* PORTFOLIO JAVASCRIPT
   Features:
   1. Mobile Navigation Hamburger Menu Toggle
   2. Scroll Reveal Observer (entrance animations)
   3. Hero Subtitle Typing Effect
   4. Local Mock RAG AI Chatbot Engine (AWS Ready)
*/

// ==========================================
// 1. MOBILE NAVIGATION TOGGLE
// ==========================================
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Close mobile menu when clicking a link
document.querySelectorAll(".menu-links a").forEach(link => {
  link.addEventListener("click", () => {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    if (menu.classList.contains("open")) {
      menu.classList.remove("open");
      icon.classList.remove("open");
    }
  });
});

// ==========================================
// 2. SCROLL REVEAL OBSERVER
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".reveal");
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));
});

// ==========================================
// 3. HERO SUBTITLE TYPING EFFECT
// ==========================================
const words = [
  "Mechatronics Engineer",
  "AI & Computer Vision Specialist",
  "Robotics & Control Systems Developer",
  "First Class Honours Graduate @ ANU"
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedTextSpan = document.getElementById("typed-text");
const typingSpeed = 70; // ms
const erasingSpeed = 40; // ms
const newWordDelay = 2000; // ms to display word

function typeEffect() {
  if (!typedTextSpan) return;
  
  const currentWord = words[wordIndex];
  
  if (isDeleting) {
    typedTextSpan.innerHTML = currentWord.substring(0, charIndex) + '<span class="typing-cursor"></span>';
    charIndex--;
  } else {
    typedTextSpan.innerHTML = currentWord.substring(0, charIndex + 1) + '<span class="typing-cursor"></span>';
    charIndex++;
  }

  let delay = isDeleting ? erasingSpeed : typingSpeed;

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    delay = newWordDelay; // wait before deleting
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length; // move to next word
    delay = 500; // brief pause before starting new word
  }

  setTimeout(typeEffect, delay);
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(typeEffect, 1000);
});

// ==========================================
// 4. MOCK RAG AI ENGINE (AWS-READY)
// ==========================================

// AWS INTEGRATION SETTINGS
// To connect your live AWS instance:
// 1. Set USE_MOCK_RAG = false;
// 2. Set AWS_API_ENDPOINT to your AWS API Gateway/Lambda endpoint.
const USE_MOCK_RAG = true;
const AWS_API_ENDPOINT = "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/chat";

// Local RAG database compiled from website/resume content
const RAG_DATABASE = [
  {
    keywords: ["skills", "skill", "technologies", "programming", "languages", "c++", "python", "pytorch", "tensorflow", "opencv", "verilog", "altium", "ros", "ros2"],
    response: "Punjaya's skillset spans across Mechatronics, CS, and AI. Highlights include:\n\n" +
              "• **Computer Vision & AI**: Python, OpenCV (Experienced), PyTorch, TensorFlow, C++ (Intermediate).\n" +
              "• **Embedded Systems**: ROS/ROS2, C, UART | I2C | CAN | UDP (Intermediate), Verilog, Altium (Entry).\n" +
              "• **Control Systems**: GPS-Denied Navigation, State Estimation, SLAM, ArduPilot, State Machines.\n" +
              "• **Software Dev**: Git, Linux, Vim/Neovim, Docker, HTML/CSS/JS.\n" +
              "• **Data Analysis**: NumPy, Pandas, Plotly, Matplotlib, Seaborn."
  },
  {
    keywords: ["paper", "publication", "publications", "research", "journal", "european journal", "ejoc", "observer", "navigation", "gnss"],
    response: "Punjaya co-authored a peer-reviewed research paper in the **European Journal of Control (2024)** titled:\n\n" +
              "*\"Constructive synchronous observer design for inertial navigation with delayed GNSS measurements\"*.\n\n" +
              "This work presents the first observer for Inertial Navigation Systems (INS) with delayed GNSS measurements to feature almost global asymptotic and local exponential stability. You can view the paper using the button in the **Honours** or **Projects** sections!"
  },
  {
    keywords: ["awards", "award", "finalist", "national security", "defence", "australian ai awards", "scholars", "scholarship", "cecs", "dickins"],
    response: "Punjaya has received notable honours:\n\n" +
              "• **Australian AI Awards Finalist 2024**: Named a national finalist for *AI Innovator in Defence and National Security*.\n" +
              "• **CECS R&D Excellence Scholarship**: Awarded to high-performing research-stream engineering students at ANU.\n" +
              "• **CECC Dickins Scholarship**: Awarded to high-achieving Honours students at ANU."
  },
  {
    keywords: ["education", "gpa", "atar", "university", "anu", "academic", "hons", "honours", "first class"],
    response: "Punjaya graduated with a **Bachelor of Engineering (R&D) with First Class Honours** from the **Australian National University (ANU)**, majoring in Mechatronics and Computer Science. He achieved a **6.72/7.0 GPA** and had a **99.20 ATAR** entry rank."
  },
  {
    keywords: ["projects", "project", "portfolio", "change detection", "lidar", "bms", "battery", "estimator", "airsim", "emotion", "acoustic", "mof", "combined xi", "games"],
    response: "Punjaya has completed several key engineering projects:\n\n" +
              "1. **AI Change Detection System**: Near real-time unsupervised deep learning change detection on the edge using fused LiDAR and camera images.\n" +
              "2. **Battery Management System**: Embedded C firmware regulating safe battery charging/discharging using state machines and I2C/PMBus.\n" +
              "3. **GPS-Denied Navigation Integration**: Integrated and tuned visual inertial state estimators in AirSim simulation environment.\n" +
              "4. **Acoustic Emotion Recognition**: Deployed ML models to identify human emotions from audio spectrograms (published 2 research papers).\n" +
              "5. **Combined XI Builder**: Web scraping and Flask web application for football fans (built with Python).\n" +
              "You can browse through the cards in the **Projects** section to read more and access GitHub repositories!"
  },
  {
    keywords: ["contact", "email", "mail", "linkedin", "github", "hire", "phone", "reach out"],
    response: "You can easily connect with Punjaya:\n\n" +
              "• **Email**: [punjayawick@gmail.com](mailto:punjayawick@gmail.com)\n" +
              "• **LinkedIn**: [linkedin.com/in/punjayawick15](https://www.linkedin.com/in/punjayawick15/)\n" +
              "• **GitHub**: [github.com/pwick15](https://github.com/pwick15)\n\n" +
              "Feel free to send an email or connect on LinkedIn to discuss collaborations!"
  },
  {
    keywords: ["about", "who is", "introduction", "background", "mission", "personal", "football", "barcelona", "sri lanka", "buddhist", "gratitude"],
    response: "Punjaya is a Mechatronics and CS graduate from ANU fascinated by the intersection of software, electronics, and robotics. \n\n" +
              "**Mission**: Create impactful robotics systems to improve lives. Long-term, he dreams of helping his home country, Sri Lanka, through humanitarian engineering.\n\n" +
              "**Interests**: Passionate football fan (Visca el Barça!), travel, music, and guided by Buddhist principles of gratitude and impermanence."
  }
];

// Fallback response when no keywords match
const FALLBACK_RESPONSE = "I'm not sure about that specific query. I can tell you about Punjaya's:\n\n" +
                          "• **Research Papers** (EJoC inertial navigation observer paper)\n" +
                          "• **AI Awards Finalist 2024** nomination\n" +
                          "• **Core Skills** (Python, C++, PyTorch, ROS, Control systems)\n" +
                          "• **Engineering Projects** (Change detection, BMS, AirSim simulator)\n" +
                          "• **Education** (First Class Honours, GPA 6.72/7 at ANU)\n" +
                          "• **Contact info**\n\n" +
                          "Try clicking one of the prompt chips below, or ask a question containing these terms!";

// Helper to scroll the chat history to the bottom
function scrollToBottom() {
  const chatHistory = document.getElementById("chat-history");
  if (chatHistory) {
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }
}

// Trigger query when starter chips are clicked
function sendPrompt(promptText) {
  const chatInput = document.getElementById("chat-input");
  if (chatInput) {
    chatInput.value = promptText;
    sendMessage();
  }
}

// Handle hitting Enter in the input bar
function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

// Main function to send message and trigger the RAG query
async function sendMessage() {
  const chatInput = document.getElementById("chat-input");
  if (!chatInput) return;
  
  const query = chatInput.value.trim();
  if (query === "") return;
  
  // Clear input
  chatInput.value = "";
  
  // Append user message
  appendMessage(query, "user");
  scrollToBottom();
  
  // Add typing indicator
  const typingIndicator = appendTypingIndicator();
  scrollToBottom();
  
  try {
    let answerText = "";
    
    if (USE_MOCK_RAG) {
      // Run local keyword matching mock
      answerText = queryMockRAG(query);
      // Simulate artificial network delay
      await new Promise(resolve => setTimeout(resolve, 800));
    } else {
      // Execute live AWS fetch
      const response = await fetch(AWS_API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query })
      });
      if (!response.ok) {
        throw new Error("AWS network response was not ok");
      }
      const data = await response.json();
      answerText = data.response || "Received empty response from AWS RAG server.";
    }
    
    // Remove typing indicator and stream response
    removeTypingIndicator(typingIndicator);
    await streamResponse(answerText);
    
  } catch (error) {
    console.error("RAG Error:", error);
    removeTypingIndicator(typingIndicator);
    await streamResponse("Sorry, I encountered an error connecting to the RAG database. Please check my contact details or try again later!");
  }
}

// Append a message bubble to the chat box
function appendMessage(text, sender) {
  const chatHistory = document.getElementById("chat-history");
  if (!chatHistory) return;
  
  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-msg ${sender}`;
  
  // Format basic markdown bolding/bullets into HTML
  let formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*?)\*/g, '<i>$1</i>')
    .replace(/\n/g, '<br>')
    .replace(/• /g, '• ');

  msgDiv.innerHTML = `
    <div class="msg-bubble">${formattedText}</div>
    <div class="msg-meta">${sender === 'user' ? 'You' : 'AI Assistant'} • Just now</div>
  `;
  
  chatHistory.appendChild(msgDiv);
}

// Add typing bubble
function appendTypingIndicator() {
  const chatHistory = document.getElementById("chat-history");
  if (!chatHistory) return null;
  
  const indicatorDiv = document.createElement("div");
  indicatorDiv.className = "chat-msg bot";
  indicatorDiv.innerHTML = `
    <div class="msg-bubble">
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  chatHistory.appendChild(indicatorDiv);
  return indicatorDiv;
}

// Remove typing bubble
function removeTypingIndicator(indicatorDiv) {
  if (indicatorDiv && indicatorDiv.parentNode) {
    indicatorDiv.parentNode.removeChild(indicatorDiv);
  }
}

// Stream the response string character-by-character
async function streamResponse(fullText) {
  const chatHistory = document.getElementById("chat-history");
  if (!chatHistory) return;
  
  const msgDiv = document.createElement("div");
  msgDiv.className = "chat-msg bot";
  
  // Prepare HTML structure
  msgDiv.innerHTML = `
    <div class="msg-bubble"></div>
    <div class="msg-meta">AI Assistant • Just now</div>
  `;
  chatHistory.appendChild(msgDiv);
  
  const bubble = msgDiv.querySelector(".msg-bubble");
  
  // Stream words/characters to avoid raw HTML tags rendering sequentially
  // To stream cleanly while supporting markdown bold/italic/links, we'll split by chars/words
  // or just render it quickly word-by-word. Word-by-word is faster and safer for formatting.
  const wordsArray = fullText.split(" ");
  let currentHTML = "";
  
  for (let i = 0; i < wordsArray.length; i++) {
    currentHTML += wordsArray[i] + " ";
    
    // Parse formatting on current buffer
    let tempText = currentHTML
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/\n/g, '<br>')
      .replace(/• /g, '• ');
      
    bubble.innerHTML = tempText;
    scrollToBottom();
    
    // Typing speed control
    await new Promise(resolve => setTimeout(resolve, 40));
  }
}

// Query local mock search index
function queryMockRAG(query) {
  const lowercaseQuery = query.toLowerCase();
  
  // Check matching keywords
  for (const doc of RAG_DATABASE) {
    for (const keyword of doc.keywords) {
      if (lowercaseQuery.includes(keyword)) {
        return doc.response;
      }
    }
  }
  
  return FALLBACK_RESPONSE;
}
