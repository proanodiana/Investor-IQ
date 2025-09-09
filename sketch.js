let bg;
let sound;
let currentScene = "intro";
let textColor = '#ffffff';
let textSizeVal = 50;
let graphColor;
let chartType = "line";

// Scores and history
let researchScore = 0;
let riskScore = 0;
let mindsetScore = 0;
let scoreHistory = [];

// Questions
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

let currentQuestion = 0;
let selectedOption = -1;

// Particle background
let particles = [];

function preload() {
  bg = loadImage('assetss/stockbackground.jpg');
  sound = loadSound('assetss/quizmusic.mp3');
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("sketch");
  textAlign(CENTER);
  textFont("Verdana");

  // Default graph color
  graphColor = color(random(255), random(255), random(255));

  // Particle setup
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: random(window.innerWidth),
      y: random(window.innerHeight),
      size: random(2, 6),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5)
    });
  }

  // Color generator button
  document.getElementById('change-graph-color').addEventListener('click', () => {
    graphColor = color(random(255), random(255), random(255));
  });

  // Text size slider
  const textSizeSlider = document.getElementById('text-size');
  const textSizeDisplay = document.getElementById('textSizeVal');
  textSizeSlider.addEventListener('input', () => {
    textSizeVal = parseInt(textSizeSlider.value);
    textSizeDisplay.textContent = textSizeVal;
  });

  // Text color input
  document.getElementById('text-color').addEventListener('input', e => {
    textColor = e.target.value;
  });

  // Volume slider hookup
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

  // Play/Stop button
  const toggleSound = document.getElementById('toggle-sound');
  if (toggleSound && sound) {
    toggleSound.addEventListener('click', () => {
      if (!sound.isPlaying()) {
        sound.play();
        sound.setLoop(true);
      } else {
        sound.stop();
      }
    });
  }
}


function draw() {
  //background(20, 20, 40);
  clear();
  drawParticles();

  if (currentScene === "question" || currentScene === "ending") drawGraph();

  if (currentScene === "intro") {
    drawIntro();
  } else if (currentScene === "instructions") {
    drawInstructions();
  } else if (currentScene === "question") {
    drawQuestion();
    drawNextButton();
  } else if (currentScene === "ending") {
    drawEnding();
  }
}

function drawParticles() {
  noStroke();
  fill(255, 255, 255, 150);
  for (let p of particles) {
    ellipse(p.x, p.y, p.size);
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
  }
}

function drawIntro() {
  stroke(graphColor);
  strokeWeight(4)
  textSize(textSizeVal);
  text("Welcome to Investor IQ!", width / 2, 150);

  fill(textColor);
  textSize(24);
  text("Click anywhere to continue.", width / 2, 200);
}

function drawInstructions() {
  fill(textColor);
  textSize(28);
  text("The Ultimate Test of Your Financial Instincts!", width / 2, 100);

  textSize(20);
  text("Can you make the right calls, balance risk and reward,", width / 2, 150);
  text("and think like a true investor?", width / 2, 180);
  text("Click the Start button below to begin!", width / 2, 210);

  drawStartButton();
}

function drawStartButton() {
  fill('#00ff00');
  rectMode(CENTER);
  rect(width / 2, 300, 200, 50, 10);
  fill('#070101ff');
  textSize(24);
  text("Start", width / 2, 308);
}

function drawQuestion() {
  let q = questions[currentQuestion];
  fill(textColor);
  textSize(textSizeVal);
  text(q.q, width / 2, 80);

  textSize(20);
  let y = 200;
  for (let i = 0; i < q.options.length; i++) {
    drawOption(width / 2, y + i * 80, q.options[i], i);
  }
}

function drawOption(x, y, label, index) {
  let optionColor = graphColor;
  if (mouseX > x - 150 && mouseX < x + 150 && mouseY > y - 25 && mouseY < y + 25) {
    optionColor = '#ff9900';
  } else if (selectedOption === index) {
    optionColor = '#00ccff';
  }
  fill(optionColor);
  rectMode(CENTER);
  rect(x, y, 300, 50, 10);
  fill(textColor);
  text(label, x, y + 5);
}

function drawNextButton() {
  fill('#00ff00');
  rectMode(CENTER);
  rect(width / 2, 470, 150, 40, 10);
  fill('#070101ff');
  textSize(20);
  text("Next", width / 2, 475);
}

function drawEnding() {
  fill(textColor);
  textSize(28);
  let avgScore = (researchScore + riskScore + mindsetScore) / 3;
  if (avgScore < 30) {
    text("Do More Research Before Investing!", width / 2, height / 2);
  } else if (avgScore < 60) {
    text("Keep At It! You're Learning.", width / 2, height / 2);
  } else {
    text("Great Investor Mindset! Future VC star!", width / 2, height / 2);
  }
}

function drawGraph() {
  stroke(graphColor);
  strokeWeight(4);
  noFill();
  beginShape();
  for (let i = 0; i < scoreHistory.length; i++) {
    let x = map(i, 0, questions.length - 1, 50, width - 50);
    let y = map((scoreHistory[i].research + scoreHistory[i].risk + scoreHistory[i].mindset) / 3, 0, 100, height - 50, 50);
    vertex(x, y);
  }
  endShape();
}

function mousePressed() {
  // Intro -> Instructions
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    
    if (currentScene === "intro") {
      currentScene = "instructions";
      return;
    }

    // Instructions -> Question
    if (currentScene === "instructions") {
      if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
          mouseY > 275 && mouseY < 325) {
        currentScene = "question";
        return;
      }
    }

    // Question logic
    if (currentScene === "question") {
      let y = 200;
      for (let i = 0; i < 3; i++) {
        if (mouseX > width / 2 - 150 && mouseX < width / 2 + 150 &&
            mouseY > y + i * 80 - 25 && mouseY < y + i * 80 + 25) {
          selectedOption = i;
        }
      }

      // Next button logic
      if (mouseX > width / 2 - 75 && mouseX < width / 2 + 75 &&
          mouseY > 450 && mouseY < 490 && selectedOption !== -1) {

        let scores = questionScores[currentQuestion][selectedOption];
        researchScore += scores.research;
        riskScore += scores.risk;
        mindsetScore += scores.mindset;

        scoreHistory.push({ research: researchScore, risk: riskScore, mindset: mindsetScore });
        selectedOption = -1;
        currentQuestion++;

        if (currentQuestion >= questions.length) {
          currentScene = "ending";
        }
      }
    }
  }
}
