let bg, sound;
let currentScene = "intro";
let textColor = '#ffffff';
let textSizeVal = 50;
let graphColor;
let researchScore = 0, riskScore = 0, mindsetScore = 0;
let scoreHistory = [];
let currentQuestion = 0, selectedOption = -1;
let particles = [];
let canvas;

let questions = [
  { q: "Startup has no prototype yet?", options: ["Wait for prototype", "Invest small", "Invest big"] },
  { q: "Market research incomplete?", options: ["Fund research", "Invest anyway", "Find a partner"] },
  { q: "Founder inexperienced?", options: ["Hire experts", "Offer mentorship", "Ignore risk"] },
  { q: "Competitor launching soon?", options: ["Speed up launch", "Focus on quality", "Exit deal"] },
  { q: "Funding low?", options: ["Cut costs", "Raise capital", "Sell stake"] },
  { q: "Legal issues?", options: ["Hire legal team", "Ignore", "Delay investment"] },
  { q: "Tech innovation needed?", options: ["Fund R&D", "License tech", "Partner with firm"] },
  { q: "Economic downturn?", options: ["Stay invested", "Diversify", "Exit market"] },
  { q: "Product traction?", options: ["Reinvest profits", "Venture funding", "IPO"] },
  { q: "Final decision?", options: ["Sell company", "Keep growing", "Merge competitor"] }
];

let questionScores = [
  [{ research: 10, risk: 0, mindset: 5 }, { research: 0, risk: 10, mindset: 0 }, { research: -10, risk: 20, mindset: 0 }],
  [{ research: 15, risk: 0, mindset: 0 }, { research: 0, risk: 10, mindset: -5 }, { research: 5, risk: 5, mindset: 5 }],
  [{ research: 10, risk: 0, mindset: 15 }, { research: 0, risk: 0, mindset: 10 }, { research: 15, risk: 0, mindset: -10 }],
  [{ research: 5, risk: 10, mindset: 5 }, { research: 10, risk: 0, mindset: 10 }, { research: -10, risk: 20, mindset: 0 }],
  [{ research: 5, risk: 0, mindset: 5 }, { research: 10, risk: 5, mindset: 0 }, { research: -5, risk: 20, mindset: 0 }],
  [{ research: 15, risk: 0, mindset: 5 }, { research: -5, risk: 10, mindset: -5 }, { research: 10, risk: 0, mindset: 0 }],
  [{ research: 15, risk: 0, mindset: 5 }, { research: 5, risk: 0, mindset: 0 }, { research: 10, risk: 5, mindset: 5 }],
  [{ research: 0, risk: 0, mindset: 0 }, { research: 0, risk: 10, mindset: 5 }, { research: -10, risk: 20, mindset: 0 }],
  [{ research: 10, risk: 0, mindset: 10 }, { research: 5, risk: 5, mindset: 0 }, { research: 10, risk: 10, mindset: 5 }],
  [{ research: 0, risk: 0, mindset: 10 }, { research: 5, risk: 5, mindset: 5 }, { research: 10, risk: 0, mindset: 10 }]
];

function preload() {
  bg = loadImage('assetss/stockbackground.jpg');
  sound = loadSound('assetss/quizmusic.mp3');
}

function setup() {
  createResponsiveCanvas();
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  textFont("Verdana");

  graphColor = color(random(255), random(255), random(255));

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(2, 6),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5)
    });
  }

  setupControls();
}

function windowResized() {
  createResponsiveCanvas();
}

function createResponsiveCanvas() {
  const container = document.getElementById("sketch");
  const containerWidth = container.clientWidth;
  const w = Math.min(containerWidth, 800);
  const h = w * 10 / 16;

  if (canvas) resizeCanvas(w, h);
  else canvas = createCanvas(w, h).parent("sketch");
}

function getScale() { return width / 800; }

function draw() {
  clear();
  const scaleFactor = getScale();

  drawParticles(scaleFactor);

  if (currentScene === "question" || currentScene === "ending") drawGraph(scaleFactor);

  if (currentScene === "intro") drawIntro(scaleFactor);
  else if (currentScene === "instructions") drawInstructions(scaleFactor);
  else if (currentScene === "question") { drawQuestion(scaleFactor); drawNextButton(scaleFactor); }
  else if (currentScene === "ending") drawEnding(scaleFactor);
}

function drawParticles(scale) {
  noStroke();
  fill(255, 255, 255, 150);
  for (let p of particles) {
    ellipse(p.x * scale, p.y * scale, p.size * scale);
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x < 0) p.x = width / scale;
    if (p.x > width / scale) p.x = 0;
    if (p.y < 0) p.y = height / scale;
    if (p.y > height / scale) p.y = 0;
  }
}

function drawIntro(scale) {
  stroke(graphColor);
  strokeWeight(4 * scale);
  textSize(textSizeVal * scale);
  text("Welcome to Investor IQ!", width / 2, height * 0.3);
  fill(textColor);
  textSize(24 * scale);
  text("Click anywhere to continue.", width / 2, height * 0.4);
}

function drawInstructions(scale) {
  fill(textColor);
  textSize(28 * scale);
  text("The Ultimate Test of Your Financial Instincts!", width / 2, height * 0.2);
  textSize(20 * scale);
  text("Can you make the right calls, balance risk and reward,", width / 2, height * 0.3);
  text("and think like a true investor?", width / 2, height * 0.35);
  drawStartButton(scale);
}

function drawStartButton(scale) {
  fill('#00ff00');
  rect(width / 2, height * 0.6, 200 * scale, 50 * scale, 10 * scale);
  fill('#070101ff');
  textSize(24 * scale);
  text("Start", width / 2, height * 0.6);
}

function drawQuestion(scale) {
  const q = questions[currentQuestion];
  fill(textColor);
  textSize(textSizeVal * scale);
  text(q.q, width / 2, height * 0.15);

  textSize(20 * scale);
  let y = height * 0.35;
  for (let i = 0; i < q.options.length; i++) {
    drawOption(width / 2, y + i * 0.12 * height, q.options[i], i, scale);
  }
}

function drawOption(x, y, label, index, scale) {
  let optionColor = graphColor;
  if (mouseX > x - 150 * scale && mouseX < x + 150 * scale &&
      mouseY > y - 25 * scale && mouseY < y + 25 * scale) optionColor = '#ff9900';
  else if (selectedOption === index) optionColor = '#00ccff';
  fill(optionColor);
  rect(x, y, 300 * scale, 50 * scale, 10 * scale);
  fill(textColor);
  textSize(20 * scale);
  text(label, x, y);
}

function drawNextButton(scale) {
  fill('#00ff00');
  rect(width / 2, height * 0.94, 150 * scale, 40 * scale, 10 * scale);
  fill('#070101ff');
  textSize(20 * scale);
  text("Next", width / 2, height * 0.94);
}

function drawEnding(scale) {
  fill(textColor);
  textSize(28 * scale);
  let avgScore = (researchScore + riskScore + mindsetScore) / 3;
  if (avgScore < 30) text("Do More Research Before Investing!", width / 2, height / 2);
  else if (avgScore < 60) text("Keep At It! You're Learning.", width / 2, height / 2);
  else text("Great Investor Mindset! Future VC star!", width / 2, height / 2);
}

function drawGraph(scale) {
  stroke(graphColor);
  strokeWeight(4 * scale);
  noFill();
  beginShape();
  for (let i = 0; i < scoreHistory.length; i++) {
    let x = map(i, 0, questions.length - 1, 50 * scale, width - 50 * scale);
    let y = map((scoreHistory[i].research + scoreHistory[i].risk + scoreHistory[i].mindset) / 3,
                0, 100, height - 50 * scale, 50 * scale);
    vertex(x, y);
  }
  endShape();
}

function mousePressed() {
  const scale = getScale();

  if (currentScene === "intro") { currentScene = "instructions"; return; }
  if (currentScene === "instructions") {
    if (mouseX > width / 2 - 100 * scale && mouseX < width / 2 + 100 * scale &&
        mouseY > height * 0.55 && mouseY < height * 0.65) { currentScene = "question"; return; }
  }

  if (currentScene === "question") {
    let y = height * 0.35;
    for (let i = 0; i < 3; i++) {
      if (mouseX > width / 2 - 150 * scale && mouseX < width / 2 + 150 * scale &&
          mouseY > y + i * 0.12 * height - 25 * scale && mouseY < y + i * 0.12 * height + 25 * scale) {
        selectedOption = i;
      }
    }

    if (mouseX > width / 2 - 75 * scale && mouseX < width / 2 + 75 * scale &&
        mouseY > height * 0.94 - 20 * scale && mouseY < height * 0.94 + 20 * scale &&
        selectedOption !== -1) {
      const scores = questionScores[currentQuestion][selectedOption];
      researchScore += scores.research;
      riskScore += scores.risk;
      mindsetScore += scores.mindset;
      scoreHistory.push({ research: researchScore, risk: riskScore, mindset: mindsetScore });

      selectedOption = -1;
      currentQuestion++;
      if (currentQuestion >= questions.length) currentScene = "ending";
    }
  }
}

function setupControls() {
  document.getElementById('change-graph-color').addEventListener('click', () => {
    graphColor = color(random(255), random(255), random(255));
  });

  const textSizeSlider = document.getElementById('text-size');
  const textSizeDisplay = document.getElementById('textSizeVal');
  textSizeSlider.addEventListener('input', () => {
    textSizeVal = parseInt(textSizeSlider.value);
    textSizeDisplay.textContent = textSizeVal;
  });

  document.getElementById('text-color').addEventListener('input', e => {
    textColor = e.target.value;
  });

  const vol = document.getElementById('vol');
  const volVal = document.getElementById('volVal');
  if (vol && volVal && sound) {
    sound.setVolume(parseFloat(vol.value));
    volVal.textContent = parseFloat(vol.value).toFixed(2);
    vol.addEventListener('input', () => {
      const v = parseFloat(vol.value);
      sound.setVolume(v);
      volVal.textContent = v.toFixed(2);
    });
  }

  const toggleSound = document.getElementById('toggle-sound');
  if (toggleSound && sound) {
    toggleSound.addEventListener('click', () => {
      if (!sound.isPlaying()) { sound.play(); sound.setLoop(true); }
      else { sound.stop(); }
    });
  }
}
