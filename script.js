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
const newGameNav = document.querySelector(".new-game");

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
const newGameBtn = document.querySelector(".newGame-btn");
const clearBtn = document.querySelector(".clear-btn");

// Global Variables
let highscores;
let questionIndex = 0;
let clock = 100;
let ticker;

// Initialize Application
function init() {
  clockDisplay.innerHTML = clock;
  fetchHighscores();
  displayElement(startCard, true);
}

// Display and Utility Functions
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

// Game Functions
function startGame() {
  startTimer();
  displayQuestion(questions[questionIndex]);
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
function displayQuestion(q) {
  questionCard.querySelector(".question").textContent = q.question;
  questionCard.querySelectorAll(".option").forEach((item, index) => {
    item.innerHTML = `${index + 1}. ${q.options[index][0]}`;
    item.setAttribute("data-correct", q.options[index][1]);
    item.parentElement.addEventListener("click", handleSelection);
  });
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
  }, 1500);
}
function advanceGame() {
  if (questionIndex < questions.length - 1) {
    questionIndex++;
    displayQuestion(questions[questionIndex]);
  } else {
    endGame();
  }
}
function endGame() {
  displayElement(questionCard, false);
  displayElement(endCard, true);
  clearInterval(ticker);
  endCard.querySelector(".final-score").textContent = clock;
}
function abortGameTo(card) {
  clearInterval(ticker);
  questionIndex = 0;
  clock = 100;
  clockDisplay.innerHTML = clock;
  hideAllCards();
  displayElement(card, true);
}

// Highscore Functions
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

// Event Listeners
highscoresNav.addEventListener("click", () => {
  abortGameTo(scoreCard);
  displayHighscores();
});

clearBtn.addEventListener("click", clearHighscores);

newGameBtn.addEventListener("click", () => abortGameTo(startCard));

newGameNav.addEventListener("click", () => abortGameTo(startCard));

startBtn.addEventListener("click", () => {
  hideAllCards();
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

// Start application on load
init();
