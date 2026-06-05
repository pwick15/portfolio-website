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
// 4. INTERACTIVE PHYSICS CANVAS (GEMINI ABOUT)
// ==========================================

const PALETTES = [
  // Palette 0: Cool tech colors (cyan/blue/purple)
  {
    primary: [66, 133, 244], // #4285f4
    colors: [[66, 133, 244], [168, 85, 247], [14, 165, 233]]
  },
  // Palette 1: Amber Gold
  {
    primary: [245, 158, 11], // #f59e0b
    colors: [[245, 158, 11], [239, 68, 68], [249, 115, 22]]
  },
  // Palette 2: Emerald Mint
  {
    primary: [16, 185, 129], // #10b981
    colors: [[16, 185, 129], [6, 182, 212], [52, 211, 153]]
  },
  // Palette 3: Elegant Silver
  {
    primary: [255, 255, 255], // #ffffff
    colors: [[255, 255, 255], [161, 161, 166], [81, 81, 84]]
  }
];

let activePaletteIndex = 0;
let mouse = { x: null, y: null, px: null, py: null, radius: 160 };
let isDragging = false;

// Apply active palette primary color to CSS variables for dynamic accent shifts
function applyPaletteToCSS(palette) {
  const primaryRGB = `rgb(${palette.primary[0]}, ${palette.primary[1]}, ${palette.primary[2]})`;
  document.documentElement.style.setProperty('--primary', primaryRGB);
  document.documentElement.style.setProperty(
    '--primary-glow', 
    `rgba(${palette.primary[0]}, ${palette.primary[1]}, ${palette.primary[2]}, 0.08)`
  );
}

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.reset();
  }

  reset() {
    this.baseX = Math.random() * this.canvasWidth;
    this.baseY = Math.random() * this.canvasHeight;
    this.x = this.baseX;
    this.y = this.baseY;
    this.vx = 0;
    this.vy = 0;
    this.size = Math.random() * 2 + 1; // size between 1 and 3px
    this.angle = Math.random() * Math.PI * 2;
    this.floatSpeed = Math.random() * 0.015 + 0.005;
    this.floatDistance = Math.random() * 10 + 5;
    
    // Assign a color index
    this.colorIndex = Math.floor(Math.random() * 3);
    const startPalette = PALETTES[activePaletteIndex].colors[this.colorIndex];
    this.currentRGB = [...startPalette];
  }

  update(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // 1. Smoothly Morph Colors to Active Palette
    const targetRGB = PALETTES[activePaletteIndex].colors[this.colorIndex];
    this.currentRGB[0] += (targetRGB[0] - this.currentRGB[0]) * 0.05;
    this.currentRGB[1] += (targetRGB[1] - this.currentRGB[1]) * 0.05;
    this.currentRGB[2] += (targetRGB[2] - this.currentRGB[2]) * 0.05;

    // 2. Wave-like floating drift
    this.angle += this.floatSpeed;
    const floatX = Math.sin(this.angle) * this.floatDistance;
    const floatY = Math.cos(this.angle) * this.floatDistance;
    const currentBaseX = this.baseX + floatX;
    const currentBaseY = this.baseY + floatY;

    // 3. Mouse Interaction (Repulsion & Drag Physics)
    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.hypot(dx, dy);

      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const pushAngle = Math.atan2(dy, dx);
        
        // Push force away from mouse
        this.vx += Math.cos(pushAngle) * force * 1.5;
        this.vy += Math.sin(pushAngle) * force * 1.5;

        // Mouse Drag Fluidity: pull particles along with mouse velocity
        if (mouse.px !== null && isDragging) {
          const mouseVx = mouse.x - mouse.px;
          const mouseVy = mouse.y - mouse.py;
          this.vx += mouseVx * force * 0.12;
          this.vy += mouseVy * force * 0.12;
        }
      }
    }

    // 4. Spring Return Force to Base Position
    const returnForceX = (currentBaseX - this.x) * 0.008;
    const returnForceY = (currentBaseY - this.y) * 0.008;
    this.vx += returnForceX;
    this.vy += returnForceY;

    // 5. Apply Friction and Move
    this.vx *= 0.90;
    this.vy *= 0.90;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${Math.round(this.currentRGB[0])}, ${Math.round(this.currentRGB[1])}, ${Math.round(this.currentRGB[2])}, 0.5)`;
    ctx.fill();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("interactive-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  let particles = [];
  const particleCount = 85;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Regenerate particles
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Track mouse coordinates
  window.addEventListener("mousemove", (e) => {
    mouse.px = mouse.x;
    mouse.py = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mousedown", (e) => {
    isDragging = true;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
    isDragging = false;
  });

  // Cycle palette on neutral click
  window.addEventListener("click", (e) => {
    // Prevent cycling if user clicked on button, link, search bar, or chip
    if (e.target.closest("input, button, a, .starter-link, .icon")) {
      return;
    }
    
    activePaletteIndex = (activePaletteIndex + 1) % PALETTES.length;
    applyPaletteToCSS(PALETTES[activePaletteIndex]);
  });

  // Main animation frame loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach(p => p.update(canvas.width, canvas.height));

    // Draw lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 110) {
          const alpha = (110 - dist) / 110 * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          
          // Mix line color based on the two connected particles
          const r = Math.round((particles[i].currentRGB[0] + particles[j].currentRGB[0]) / 2);
          const g = Math.round((particles[i].currentRGB[1] + particles[j].currentRGB[1]) / 2);
          const b = Math.round((particles[i].currentRGB[2] + particles[j].currentRGB[2]) / 2);
          
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => p.draw(ctx));
    
    // Smooth reset of mouse previous coordinates to prevent large inertia jumps
    if (mouse.px !== null) {
      mouse.px += (mouse.x - mouse.px) * 0.1;
      mouse.py += (mouse.y - mouse.py) * 0.1;
    }

    requestAnimationFrame(animate);
  }

  animate();
  
  // Set initial color variables
  applyPaletteToCSS(PALETTES[activePaletteIndex]);
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
