import { easyArray } from "./easy-array.js";
import { hardArray } from "./hard-array.js";

const board = document.querySelector(".board");
const startBtn = document.getElementById("start-btn");
let cardsCurrentlyFlipped = [];
let score = 0;
let chosenDifficulty = easyArray;
let difficulty = "easy";
let cardsMatched = [];
let scoreHistory = [];

class MemoryCard {
  constructor(imgSrc, imgName) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-name", imgName);
    board.appendChild(card);
    let cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
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

function determineDifficulty() {
  if (this.checked === false) {
    chosenDifficulty = easyArray;
  } else {
    chosenDifficulty = hardArray;
    difficulty = "hard";
  }
  startGame();
}

/* 
  randomizes the array
  https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  */
function shuffle(array) {
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
      displayScore();
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
    console.log("Game Over!");
    scoreHistory.push({ difficulty: difficulty, score: score });
    console.log(scoreHistory);
  }
}

function displayScore() {
  let scoreDisplay = document.querySelector(".score");
  scoreDisplay.textContent = score;
}

function gameOver() {
  board.innerHTML = "";
  score = 0;
  cardsCurrentlyFlipped = [];
  cardsMatched = [];
}

function startGame() {
  gameOver();
  displayScore();
  createBoard();
}
startGame();

// Event Listeners
startBtn.addEventListener("click", startGame);
board.addEventListener("click", flipCards);
document
  .getElementById("switch")
  .addEventListener("change", determineDifficulty);
