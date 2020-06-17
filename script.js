// Questions Data
const questions = [
  {
    question: "Commonly used data types DO NOT include:",
    options: [
      ["Alert", true],
      ["Boolean", false],
      ["Number", false],
      ["String", false],
    ],
  },
  {
    question:
      "String values must be enclosed within ______ when being assigned to variables.",
    options: [
      ["Commas", false],
      ["Brackets", false],
      ["Quotes", true],
      ["Parentheses", false],
    ],
  },
  {
    question: "Arrays in JavaScript can be used to store ______.",
    options: [
      ["Numbers and strings", false],
      ["Other arrays", false],
      ["Booleans", false],
      ["All of the above", true],
    ],
  },
];

// Clock and Nav
const clockDisplay = document.querySelector(".clock");
const highscoresNav = document.querySelector(".see-highscores");

// Start Card
const startCard = document.querySelector(".start-card");
const startBtn = document.querySelector(".start-btn");

// Question Display Card
const questionCard = document.querySelector(".question-card");

// Submit Highscore Card
const endCard = document.querySelector(".end-card");
const endForm = document.querySelector(".score-form");
const initialsInput = document.querySelector("#initials");

// Highscores Card
const scoreCard = document.querySelector(".score-card");
const scoreTableBody = document.querySelector(".scores-body");
const backBtn = document.querySelector(".back-btn");
const clearBtn = document.querySelector(".clear-btn");

// Global Variables
let highscores;
let clock = 100;
// Set clock on page load
clockDisplay.innerHTML = clock;
let ticker;
let questionIndex = 0;

function fetchHighscores() {
  let localHighscores = localStorage.getItem("highscores");
  if (localHighscores) {
    highscores = JSON.parse(localHighscores);
  } else {
    highscores = [];
    localStorage.setItem("highscores", JSON.stringify(highscores));
  }
}

function updateHighscores(newHighscore) {
  highscores.push(newHighscore);
  highscores = highscores.sort((a, b) => b.score - a.score);
  localStorage.setItem("highscores", JSON.stringify(highscores));
}

function clearHighscores() {
  highscores = [];
  localStorage.setItem("highscores", JSON.stringify(highscores));
  displayHighscores();
}

function displayHighscores() {
  scoreTableBody.innerHTML = "";
  highscores.forEach((item, index) => {
    const row = document.createElement("tr");

    const rankTh = document.createElement("th");
    rankTh.textContent = index + 1;
    row.appendChild(rankTh);

    const initialsTd = document.createElement("td");
    initialsTd.textContent = item.initials;
    row.appendChild(initialsTd);

    const scoreTd = document.createElement("td");
    scoreTd.textContent = item.score;
    row.appendChild(scoreTd);

    scoreTableBody.appendChild(row);
  });
}

function displayElement(element, on) {
  if (on) {
    element.classList.remove("d-none");
    element.classList.add("d-block");
  } else {
    element.classList.remove("d-block");
    element.classList.add("d-none");
  }
}

function hideAllCards() {
  displayElement(startCard, false);
  displayElement(questionCard, false);
  displayElement(endCard, false);
  displayElement(scoreCard, false);
}

function endGame() {
  displayElement(questionCard, false);
  displayElement(endCard, true);
  clearInterval(ticker);
  endCard.querySelector(".final-score").textContent = clock;
}

function abortGame() {
  clearInterval(ticker);
  questionIndex = 0;
  clock = 100;
  clockDisplay.innerHTML = clock;
}

function startTimer() {
  ticker = setInterval(() => {
    if (clock > 0) {
      clock--;
      if (clock < 10) {
        clockDisplay.style.color = "firebrick";
      }
      clockDisplay.innerHTML = clock;
    } else {
      endGame();
    }
  }, 1000);
}

function flashResult(message) {
  const resultDisplay = questionCard.querySelector(".q-result");
  displayElement(resultDisplay, true);
  resultDisplay.lastElementChild.innerHTML = message[0];
  resultDisplay.lastElementChild.style.color = message[1];
  clockDisplay.style.color = message[1];
  const flash = setTimeout(() => {
    displayElement(resultDisplay, false);
    clockDisplay.style.color = "inherit";
    clearTimeout(flash);
  }, 1000);
}

function handleSelection(e) {
  const correct = e.target.dataset.correct === "true";
  const message = correct
    ? ["Correct!", "forestgreen"]
    : ["Incorrect!", "firebrick"];
  flashResult(message);
  if (!correct) {
    clock = clock - 10;
    clockDisplay.innerHTML = clock;
  }
  advanceGame();
}

function advanceGame() {
  if (questionIndex < questions.length - 1) {
    questionIndex++;
    displayQuestion(questions[questionIndex]);
  } else {
    endGame();
  }
}

function displayQuestion(q) {
  questionCard.querySelector(".question").textContent = q.question;
  questionCard.querySelectorAll(".option").forEach((item, index) => {
    item.innerHTML = `${index + 1}. ${q.options[index][0]}`;
    item.setAttribute("data-correct", q.options[index][1]);
    item.parentElement.addEventListener("click", handleSelection);
  });
}

function startGame() {
  startTimer();
  displayQuestion(questions[questionIndex]);
}

function init() {
  fetchHighscores();
  displayElement(startCard, true);
}

highscoresNav.addEventListener("click", () => {
  abortGame();
  hideAllCards();
  displayHighscores();
  displayElement(scoreCard, true);
});

clearBtn.addEventListener("click", clearHighscores);

backBtn.addEventListener("click", () => {
  abortGame();
  hideAllCards();
  displayElement(startCard, true);
});

startBtn.addEventListener("click", () => {
  displayElement(startCard, false);
  displayElement(questionCard, true);
  startGame();
});

endForm.addEventListener("submit", (e) => {
  e.preventDefault();
  updateHighscores({ initials: initialsInput.value, score: clock });
  displayElement(endCard, false);
  displayElement(scoreCard, true);
  displayHighscores();
});

init();
