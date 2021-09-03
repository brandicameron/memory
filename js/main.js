import { hardArray, easyArray } from "./card-arrays.js";
import { board, MemoryCard, ScoreTemplate } from "./templates.js";
import { shuffle } from "./shuffle.js";

const startBtn = document.getElementById("start-btn");
let chosenDifficulty = easyArray;
let difficulty = "Easy";
let cardsCurrentlyFlipped = [];
let cardsMatched = [];
let score = 0;
let scoreHistory = JSON.parse(localStorage.getItem("scoreList") || "[]");

function determineDifficulty() {
  const scoreBox = document.documentElement.querySelector(".score-box");

  if (this.checked === false) {
    chosenDifficulty = easyArray;
    difficulty = "Easy";
    scoreBox.style.background = "var(--easy-gradient)";
    startBtn.style.background = "var(--easy-gradient)";
  } else {
    chosenDifficulty = hardArray;
    difficulty = "Hard";
    scoreBox.style.background = "var(--hard-gradient)";
    startBtn.style.background = "var(--hard-gradient)";
  }
  startGame();
}

function createBoard() {
  let randomizedArray = shuffle(chosenDifficulty);

  randomizedArray.forEach((img) => {
    new MemoryCard(img.src, img.name);
  });

  // color of cards based on selected difficulty
  let cardBacks = document.querySelectorAll(".card-back");

  if (chosenDifficulty === hardArray) {
    cardBacks.forEach((card) => {
      card.style.background = "url(../img/circles.svg), var(--hard-gradient)";
    });
  }
}

function flipCards(e) {
  let card = e.target.parentElement;
  if (card.classList.contains("card")) {
    /* 
    scoring in this if statement prevents score being incremented if a
    third card is clicked while the original 2 cards are still flipped
    */
    if (cardsCurrentlyFlipped.length === 1) {
      score++;
      displayCurrentScore();
    }
    if (cardsCurrentlyFlipped.length < 2) {
      card.classList.add("flipped");
      cardsCurrentlyFlipped.push(card);
    }
    if (cardsCurrentlyFlipped.length == 2) {
      checkForMatch();
      setTimeout(() => {
        cardsCurrentlyFlipped.forEach((flippedCard) => {
          flippedCard.classList.remove("flipped");
        });
        cardsCurrentlyFlipped = [];
      }, 1500);
    }
  }
}

function checkForMatch() {
  let firstItemName = cardsCurrentlyFlipped[0].getAttribute("data-name");
  let secondItemName = cardsCurrentlyFlipped[1].getAttribute("data-name");

  if (firstItemName === secondItemName) {
    setTimeout(() => {
      cardsCurrentlyFlipped.forEach((matchedCard) => {
        matchedCard.classList.add("correct-match");
      });
    }, 200);

    setTimeout(() => {
      cardsCurrentlyFlipped.forEach((card) => {
        cardsMatched.push(card);
        card.classList.add("hide");
      });
      gameOverCheck();
    }, 700);
  }
}

function gameOverCheck() {
  if (cardsMatched.length == chosenDifficulty.length) {
    let currentLevel = difficulty;
    let currentScore = score;

    saveScore(currentLevel, currentScore);

    setTimeout(() => {
      let congrats = document.createElement("div");
      congrats.classList.add("congrats");
      congrats.textContent = `You completed the game in ${score} turns!`;

      switch (cardsMatched.length === chosenDifficulty.length) {
        case currentScore < chosenDifficulty.length - 4:
          congrats.classList.add("best");
          break;
        case currentScore < chosenDifficulty.length:
          congrats.classList.add("better");
          break;
        default:
          congrats.classList.add("good");
      }

      board.appendChild(congrats);
    }, 1200);

    setTimeout(() => {
      let container = document.querySelector(".button-container");
      let arrow = document.createElement("img");
      arrow.src = "./img/arrow.svg";
      arrow.alt = "Start a New Game!!";
      arrow.classList.add("arrow");
      container.appendChild(arrow);
    }, 2500);
  }
}

function saveScore(level, score) {
  let newData = { level: level, score: score };
  scoreHistory.push(newData);
  localStorage.setItem("scoreList", JSON.stringify(scoreHistory));
  // add score to DOM
  new ScoreTemplate(newData.level, newData.score);
}

function displayCurrentScore() {
  let scoreDisplay = document.querySelector(".score");
  scoreDisplay.textContent = score;
}

function viewScoreHistory() {
  historyContainer.classList.toggle("slide-out");

  if (historyContainer.classList.contains("slide-out")) {
    document.body.style.position = "fixed";
    // document.body.style.top = `-${window.scrollY}px`;
  } else {
    document.body.style.position = "static";
  }
}

// pulls from local storage & displays in history on load
(function displayScoreHistory() {
  scoreHistory.forEach((score) => {
    new ScoreTemplate(score.level, score.score);
  });
})();

function resetBoard() {
  board.innerHTML = "";
  score = 0;
  cardsCurrentlyFlipped = [];
  cardsMatched = [];
}

function clearHistory(e) {
  // this prevents the score board from sliding back in when the clear history button is clicked
  e.stopPropagation();
  localStorage.clear();
  document.querySelector(".scores-container").innerHTML = "";
}

function startGame() {
  resetBoard();
  displayCurrentScore();
  createBoard();
}

startGame();

// Event Listeners
const toggleSwitch = document.getElementById("switch");
const clearHistoryBtn = document.getElementById("clear-history");
const historyContainer = document.querySelector(".score-history-container");

startBtn.addEventListener("click", startGame);
board.addEventListener("click", flipCards);
toggleSwitch.addEventListener("change", determineDifficulty);
clearHistoryBtn.addEventListener("click", clearHistory);
historyContainer.addEventListener("click", viewScoreHistory);

// Test
// (function gameOverTest() {
//   let allCards = document.querySelectorAll(".card");
//   allCards.forEach((card) => {
//     card.classList.add("hide");
//   });

//   setTimeout(() => {
//     let congrats = document.createElement("div");
//     congrats.classList.add("congrats");
//     congrats.textContent = `You completed the game in ${score} turns!`;

//     congrats.classList.add("better");

//     board.appendChild(congrats);
//   }, 1200);

//   setTimeout(() => {
//     let container = document.querySelector(".button-container");
//     let arrow = document.createElement("img");
//     arrow.src = "./img/arrow.svg";
//     arrow.alt = "Start a New Game!!";
//     arrow.classList.add("arrow");
//     container.appendChild(arrow);
//   }, 2500);

//   let currentLevel = difficulty;
//   let currentScore = score;
//   saveScore(currentLevel, currentScore);
// })();
