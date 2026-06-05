/* PORTFOLIO JAVASCRIPT
   Features:
   1. Mobile Navigation Hamburger Menu Toggle
   2. Scroll Reveal Observer (entrance animations)
   3. Hero Subtitle Typing Effect
   4. Interactive Constellation Physics Canvas (Gemini Style)
   5. Minimalist AI prompt search and typographic response panel
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
        observer.unobserve(entry.target);
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
const typingSpeed = 60;
const erasingSpeed = 30;
const newWordDelay = 2000;

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
    delay = newWordDelay;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 500;
  }

  setTimeout(typeEffect, delay);
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(typeEffect, 800);
});


// ==========================================
// 5. MINIMALIST TYPOGRAPHIC RAG ENGINE
// ==========================================

const USE_MOCK_RAG = true;
const AWS_API_ENDPOINT = "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/chat";

const RAG_DATABASE = [
  {
    keywords: ["skills", "skill", "technologies", "programming", "languages", "c++", "python", "pytorch", "tensorflow", "opencv", "verilog", "altium", "ros", "ros2"],
    response: "Punjaya's skillset spans across Mechatronics, CS, and AI. Highlights include:\n\n" +
              "• **Computer Vision & AI**: Python, OpenCV (Experienced), PyTorch, TensorFlow, C++ (Intermediate).\n" +
              "• **Embedded Systems**: ROS/ROS2, C, UART | I2C | CAN | UDP (Intermediate), Verilog, Altium Designer.\n" +
              "• **Control Systems**: GPS-Denied Navigation, State Estimation, SLAM, ArduPilot, State Machines.\n" +
              "• **Software Dev**: Git, Linux, Vim/Neovim, Docker, HTML/CSS/JS.\n" +
              "• **Data Analysis**: NumPy, Pandas, Plotly, Matplotlib, Seaborn."
  },
  {
    keywords: ["paper", "publication", "publications", "research", "journal", "european journal", "ejoc", "observer", "navigation", "gnss"],
    response: "Punjaya co-authored a peer-reviewed research paper in the **European Journal of Control (2024)** titled:\n\n" +
              "*\"Constructive synchronous observer design for inertial navigation with delayed GNSS measurements\"*.\n\n" +
              "This work presents the first observer for Inertial Navigation Systems (INS) with delayed GNSS measurements to feature almost global asymptotic and local exponential stability. You can view the paper in the **Honours** or **Projects** sections!"
  },
  {
    keywords: ["awards", "award", "finalist", "national security", "defence", "australian ai awards", "scholars", "scholarship", "cecs", "dickins"],
    response: "Punjaya has received notable academic and professional awards:\n\n" +
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

const FALLBACK_RESPONSE = "I couldn't find a direct match for that query. I can tell you about Punjaya's:\n\n" +
                          "• **Research Papers** (EJoC inertial navigation observer paper)\n" +
                          "• **AI Awards Finalist 2024** nomination\n" +
                          "• **Core Skills** (Python, C++, PyTorch, ROS, Control systems)\n" +
                          "• **Engineering Projects** (Change detection, BMS, AirSim simulator)\n" +
                          "• **Education** (First Class Honours, GPA 6.72/7 at ANU)\n" +
                          "• **Contact info**\n\n" +
                          "Try asking another question, or click one of the suggestion chips!";

function sendPrompt(promptText) {
  const chatInput = document.getElementById("chat-input");
  if (chatInput) {
    chatInput.value = promptText;
    sendMessage();
  }
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

function clearResponse() {
  const panel = document.getElementById("ai-response-panel");
  const content = document.getElementById("chat-history");
  const input = document.getElementById("chat-input");
  
  if (panel) panel.style.display = "none";
  if (content) content.innerHTML = "";
  if (input) input.value = "";
}

async function sendMessage() {
  const chatInput = document.getElementById("chat-input");
  if (!chatInput) return;
  
  const query = chatInput.value.trim();
  if (query === "") return;
  
  // Show response panel
  const panel = document.getElementById("ai-response-panel");
  if (panel) panel.style.display = "block";
  
  // Add typing indicator
  const content = document.getElementById("chat-history");
  content.innerHTML = `
    <div class="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  
  try {
    let answerText = "";
    
    if (USE_MOCK_RAG) {
      // Mock search query
      answerText = queryMockRAG(query);
      await new Promise(resolve => setTimeout(resolve, 800));
    } else {
      // Live AWS fetch
      const response = await fetch(AWS_API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query })
      });
      if (!response.ok) {
        throw new Error("AWS request failed");
      }
      const data = await response.json();
      answerText = data.response || "No response received.";
    }
    
    // Clear typing and stream the response
    content.innerHTML = "";
    await streamResponse(answerText);
    
  } catch (error) {
    console.error("RAG error:", error);
    content.innerHTML = "Sorry, I had trouble connecting to the RAG database. Please check my contact details or try again later!";
  }
}

async function streamResponse(fullText) {
  const content = document.getElementById("chat-history");
  if (!content) return;
  
  const wordsArray = fullText.split(" ");
  let currentHTML = "";
  
  for (let i = 0; i < wordsArray.length; i++) {
    currentHTML += wordsArray[i] + " ";
    
    // Parse markdown tags
    let tempText = currentHTML
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/\n/g, '<br>')
      .replace(/• /g, '• ');
      
    content.innerHTML = tempText;
    
    // Typing delay
    await new Promise(resolve => setTimeout(resolve, 35));
  }
}

function queryMockRAG(query) {
  const lowercaseQuery = query.toLowerCase();
  for (const doc of RAG_DATABASE) {
    for (const keyword of doc.keywords) {
      if (lowercaseQuery.includes(keyword)) {
        return doc.response;
      }
    }
  }
  return FALLBACK_RESPONSE;
}


// ==========================================
// 7. SCROLL-DRIVEN BACKGROUND GRADIENT
// ==========================================
window.addEventListener('scroll', () => {
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (documentHeight <= 0) return;
  const scrollPercent = window.scrollY / documentHeight;
  
  // Shift background position based on scroll percentage
  const xPos = scrollPercent * 100;
  const yPos = scrollPercent * 100;
  document.body.style.backgroundPosition = `${xPos}% ${yPos}%`;
});

