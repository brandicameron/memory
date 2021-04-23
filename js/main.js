import { easyArray } from "./easy-array.js";
import { hardArray } from "./hard-array.js";

const board = document.querySelector(".board");
const startBtn = document.getElementById("start-btn");
let chosenDifficulty = easyArray;
let difficulty = "easy";
let cardsCurrentlyFlipped = [];
let cardsMatched = [];
let score = 0;

// Add score to Local Storage
let scoreHistory = JSON.parse(localStorage.getItem("scoreList") || "[]");

function saveScore(level, score) {
  let newData = { level: level, score: score };
  scoreHistory.push(newData);
  localStorage.setItem("scoreList", JSON.stringify(scoreHistory));
  // add score to DOM
  new ScoreTemplate(newData.level, newData.score);
}

function displayScoreHistory() {
  scoreHistory.forEach((score) => {
    new ScoreTemplate(score.level, score.score);
  });
}

class MemoryCard {
  constructor(imgSrc, imgName) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-name", imgName);
    board.appendChild(card);
    let cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    cardBack.textContent = imgName; //delete when done testing lol
    card.appendChild(cardBack);
    let cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    card.appendChild(cardFront);
    let cardImg = document.createElement("img");
    cardImg.src = imgSrc;
    cardImg.setAttribute("data-name", imgName);
    cardFront.appendChild(cardImg);
  }
}

class ScoreTemplate {
  constructor(level, turns) {
    let scoresContainer = document.querySelector(".scores-container");
    let scoreDisplay = document.createElement("div");
    scoreDisplay.classList.add("score-display");
    scoresContainer.appendChild(scoreDisplay);
    let levelDisplay = document.createElement("div");
    levelDisplay.classList.add("level");
    levelDisplay.textContent = level;
    scoreDisplay.appendChild(levelDisplay);
    let turnsDisplay = document.createElement("div");
    turnsDisplay.classList.add("num-turns");
    turnsDisplay.textContent = turns;
    scoreDisplay.appendChild(turnsDisplay);
  }
}

function determineDifficulty() {
  if (this.checked === false) {
    chosenDifficulty = easyArray;
    difficulty = "easy";
  } else {
    chosenDifficulty = hardArray;
    difficulty = "hard";
  }
  startGame();
}

function shuffle(array) {
  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function createBoard() {
  let randomizedArray = shuffle(chosenDifficulty);

  randomizedArray.forEach((img) => {
    new MemoryCard(img.src, img.name);
  });

  // Change color of cards based on selected difficulty
  let cardBacks = document.querySelectorAll(".card-back");
  if (chosenDifficulty === hardArray) {
    cardBacks.forEach((card) => {
      card.classList.add("hard-color");
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
        matchedCard.classList.add("match-visual");
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
  if (cardsMatched.length == 12) {
    let currentLevel = difficulty;
    let currentScore = score;

    saveScore(currentLevel, currentScore);

    setTimeout(() => {
      let congrats = document.createElement("div");
      congrats.classList.add("congrats");

      switch (cardsMatched.length === 12) {
        case currentScore < 9:
          congrats.classList.add("best");
          break;
        case currentScore < 12:
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
      arrow.classList.add("arrow");
      arrow.src = "../img/arrow.svg";
      arrow.alt = "Start a New Game!!";
      container.appendChild(arrow);
    }, 2500);
  }
}

function displayCurrentScore() {
  let scoreDisplay = document.querySelector(".score");
  scoreDisplay.textContent = score;
}

function resetBoard() {
  board.innerHTML = "";
  score = 0;
  cardsCurrentlyFlipped = [];
  cardsMatched = [];
}

function clearHistory() {
  localStorage.clear();
  document.querySelector(".scores-container").innerHTML = "";
}

function startGame() {
  resetBoard();
  displayCurrentScore();
  createBoard();
}
startGame();
displayScoreHistory();

// Event Listeners
startBtn.addEventListener("click", startGame);
board.addEventListener("click", flipCards);
document
  .getElementById("switch")
  .addEventListener("change", determineDifficulty);
document
  .getElementById("clear-history")
  .addEventListener("click", clearHistory);
