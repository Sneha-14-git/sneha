const quizData = [
  {
    question: "💻 Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    correct: 3
  },
  {
    question: "🎨 What does CSS stand for?",
    options: ["Central Style Sheets", "Cascading Style Sheets", "Computer Style System", "Colorful Style Sheets"],
    correct: 1
  },
  {
    question: "🌐 Which HTML tag is used for JavaScript?",
    options: ["<script>", "<js>", "<code>", "<javascript>"],
    correct: 0
  },
  {
    question: "📜 What does HTML stand for?",
    options: ["Hypertext Markup Language", "Hyper Tool Markup Language", "Hyperlinks Text Management Language", "Home Tool Markup Language"],
    correct: 0
  }
];

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const resultEl = document.getElementById("result");
const timerEl = document.getElementById("timer");
const attemptedEl = document.getElementById("attempted");
const remainingEl = document.getElementById("remaining");
const resultScreen = document.getElementById("result-screen");
const finalMessage = document.getElementById("final-message");
const appreciation = document.getElementById("appreciation");

function updateDashboard() {
  attemptedEl.textContent = currentQuestion;
  remainingEl.textContent = quizData.length - currentQuestion;
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 15;
  timerEl.textContent = timeLeft;
  timerEl.classList.remove("time-warning");

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 5) timerEl.classList.add("time-warning");
    if (timeLeft === 0) {
      clearInterval(timer);
      checkAnswer(-1);
    }
  }, 1000);
}

function loadQuestion() {
  clearInterval(timer);
  resultEl.classList.add("hidden");
  nextBtn.classList.add("hidden");
  updateDashboard();

  const current = quizData[currentQuestion];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = "";

  current.options.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.classList.add("option");
    btn.textContent = option;
    btn.addEventListener("click", () => checkAnswer(i));
    optionsEl.appendChild(btn);
  });

  startTimer();
}

function checkAnswer(selectedIndex) {
  clearInterval(timer);
  const current = quizData[currentQuestion];
  const buttons = document.querySelectorAll(".option");

  buttons.forEach((btn, i) => {
    if (i === current.correct) btn.classList.add("correct");
    else if (i === selectedIndex) btn.classList.add("wrong");
    btn.disabled = true;
  });

  if (selectedIndex === current.correct) {
    score++;
    resultEl.textContent = "🌸 Yay! You got it right!";
  } else if (selectedIndex === -1) {
    resultEl.textContent = "⏰ Time’s up!";
  } else {
    resultEl.textContent = "😿 Oops! Try again next time!";
  }

  resultEl.classList.remove("hidden");
  nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  attemptedEl.textContent = currentQuestion;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  document.getElementById("quiz").classList.add("hidden");
  resultScreen.classList.remove("hidden");

  const percent = (score / quizData.length) * 100;
  finalMessage.textContent = `You scored ${score}/${quizData.length} (${percent.toFixed(0)}%)`;

  if (percent === 100) {
    appreciation.innerHTML = "👏👏🎉 Perfect! You’re amazing! 💖";
  } else if (percent >= 60) {
    appreciation.innerHTML = "🌈 Great job! Keep improving! 💪";
  } else {
    appreciation.innerHTML = "😿 Better luck next time! You can do it!";
  }

  drawGraph(score, quizData.length - score);
  setupRating();
}

function drawGraph(correct, wrong) {
  const ctx = document.getElementById("scoreGraph");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Correct", "Wrong"],
      datasets: [{
        label: "Quiz Performance",
        data: [correct, wrong],
        backgroundColor: ["#a4f5c9", "#f5a4a4"],
        borderRadius: 8
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } },
      plugins: { legend: { display: false } }
    }
  });
}

/* ⭐ Rating system */
function setupRating() {
  const stars = document.querySelectorAll(".stars span");
  const msg = document.getElementById("rating-message");
  stars.forEach(star => {
    star.addEventListener("click", () => {
      const val = star.dataset.value;
      stars.forEach(s => s.classList.remove("active"));
      for (let i = 0; i < val; i++) stars[i].classList.add("active");
      msg.textContent = `You rated ${val}/5 stars 🌟`;
    });
  });
}

/* Start quiz */
remainingEl.textContent = quizData.length;
loadQuestion();
