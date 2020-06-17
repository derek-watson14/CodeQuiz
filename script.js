// Questions Data
const questions = [
  {
    question: "Which of the following is NOT a semantic HTML tag?",
    options: [
      "&lt;article&gt;",
      "&lt;div&gt;",
      "&lt;section&gt;",
      "&lt;nav&gt;",
    ],
    correct: 1,
  },
  {
    question: "I could access the class 'myClass' with what syntax in CSS?",
    options: ["#myClass{}", ".myClass()", ".myClass{}", "#myClass()"],
    correct: 2,
  },
  {
    question:
      "Which of the following is NOT a keyword to define a variable in Javascript?",
    options: ["string", "var", "let", "const"],
    correct: 0,
  },
  {
    question:
      "Setting this attribute on an <img> tag will set text for screen readers and for when the image fails to load:",
    options: ["src", "type", "data", "alt"],
    correct: 3,
  },
  {
    question:
      "What CSS syntax would I use to select ALL possible <a> tags in my navbar <nav>?",
    options: ["nav a{}", "nav>a{}", "nav .a{}", "nav #a{}"],
    correct: 0,
  },
  {
    question: "What does an array storing the numbers 1, 2 and 3 look like?",
    options: ["{1, 2, 3};", "['1', '2', '3']", "[1, 2, 3]", "{'1', '2', '3'}"],
    correct: 2,
  },
  {
    question:
      "Which of the following is NOT a block element by default in HTML?",
    options: ["&lt;div&gt;", "&lt;span&gt;", "&lt;form&gt;", "&lt;h1&gt;"],
    correct: 1,
  },
  {
    question:
      "What is the syntax to change the CSS styles when an element is hovered?",
    options: [
      "element;hover{}",
      "element+hover{}",
      "element>hover{}",
      "element:hover{}",
    ],
    correct: 3,
  },
  {
    question:
      "Which method allows you to save a reference to ANY DOM element to a variable?",
    options: [
      "getElementsByClassName()",
      "getElementById()",
      "getElementsByTagName()",
      "querySelector()",
    ],
    correct: 3,
  },
  {
    question:
      "Which HTML tag is used to define a hyperlink, which links one page to another?",
    options: ["&lt;a&gt;", "&lt;address&gt;", "&lt;link&gt;", "&lt;source&gt;"],
    correct: 0,
  },
  {
    question:
      "Which CSS property-value pair will make an element into a flexbox conatiner?",
    options: [
      "style: flex;",
      "flex-wrap: nowrap;",
      "display: flex;",
      "flex: 1;",
    ],
    correct: 2,
  },
  {
    question: "Which of the following JS values is NOT falsy?",
    options: ["0", "'false'", "''", "null"],
    correct: 1,
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
let clock = 180;
let ticker;

// Initialize Application
function init() {
  showCard(startCard);
  clockDisplay.innerHTML = clock;
  fetchHighscores();
}

// Display and Utility Functions
function displayElement(element, yes) {
  if (yes) {
    element.classList.remove("d-none");
    element.classList.add("d-block");
  } else {
    element.classList.remove("d-block");
    element.classList.add("d-none");
  }
}
function showCard(card) {
  displayElement(startCard, false);
  displayElement(questionCard, false);
  displayElement(endCard, false);
  displayElement(scoreCard, false);
  displayElement(card, true);
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
    item.innerHTML = `${q.options[index]}`;
    item.setAttribute("data-correct", index === q.correct ? "yes" : "no");
    item.parentElement.addEventListener("click", handleSelection);
  });
}
function handleSelection(e) {
  const correct = e.target.dataset.correct === "yes";
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
  clearInterval(ticker);
  showCard(endCard);
  endCard.querySelector(".final-score").textContent = clock;
}
function abortGameTo(card) {
  clearInterval(ticker);
  questionIndex = 0;
  clock = 100;
  clockDisplay.innerHTML = clock;
  showCard(card);
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
  showCard(questionCard);
  startGame();
});

endForm.addEventListener("submit", (e) => {
  e.preventDefault();
  updateHighscores({ initials: initialsInput.value, score: clock });
  initialsInput.value = "";
  showCard(scoreCard);
  displayHighscores();
});

// Start application
init();
