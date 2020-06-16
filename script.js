let questions = [
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

let clockDisplay = document.querySelector(".clock");
let startCard = document.querySelector(".start-card");
let startBtn = document.querySelector(".start-btn");
let questionCard = document.querySelector(".question-card");
let endCard = document.querySelector(".end-card");

let clock = 200;
let ticker;
clockDisplay.innerHTML = clock;

let questionNumber = 0;

function displayElement(element, on) {
  if (on) {
    element.classList.remove("d-none");
    element.classList.add("d-block");
  } else {
    element.classList.remove("d-block");
    element.classList.add("d-none");
  }
}

function endGame() {
  displayElement(questionCard, false);
  displayElement(endCard, true);
  endCard.querySelector(".final-score").textContent = clock;
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
      clearInterval(ticker);
      endGame();
    }
  }, 1000);
}

function flashResult(message) {
  let resultDisplay = questionCard.querySelector(".result");
  displayElement(resultDisplay, true);
  resultDisplay.lastElementChild.innerHTML = message[0];
  resultDisplay.lastElementChild.style.color = message[1];
  clockDisplay.style.color = message[1];
  let flash = setTimeout(() => {
    displayElement(resultDisplay, false);
    clockDisplay.style.color = "inherit";
    clearTimeout(flash);
  }, 1000);
}

function handleSelection(e) {
  let correct = e.target.dataset.correct === "true";
  let message = correct
    ? ["Correct!", "forestgreen"]
    : ["Incorrect!", "firebrick"];
  flashResult(message);
  if (e.target.dataset.correct === "false") {
    clock = clock - 10;
  }
  advanceGame();
}

function advanceGame() {
  if (questionNumber < questions.length - 1) {
    questionNumber++;
    displayQuestion(questions[questionNumber]);
  } else {
    clearInterval(ticker);
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
  displayQuestion(questions[questionNumber]);
}

startBtn.addEventListener("click", () => {
  displayElement(startCard, false);
  displayElement(questionCard, true);
  startGame();
});
