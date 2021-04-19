const board = document.querySelector(".board");
const startBtn = document.getElementById("start-btn");
const toggle = document.getElementById("switch");
let cardsCurrentlyFlipped = [];
let score = 0;
let scoreHistory = [];

let easyArray = [
  {
    src: "../img/banana.svg",
    id: 1,
    name: "banana",
  },
  {
    src: "../img/banana.svg",
    id: 2,
    name: "banana",
  },
  {
    src: "../img/cake.svg",
    id: 3,
    name: "cake",
  },
  {
    src: "../img/cake.svg",
    id: 4,
    name: "cake",
  },
  {
    src: "../img/donut.svg",
    id: 5,
    name: "donut",
  },
  {
    src: "../img/donut.svg",
    id: 6,
    name: "donut",
  },
  {
    src: "../img/strawberry.svg",
    id: 7,
    name: "strawberry",
  },
  {
    src: "../img/strawberry.svg",
    id: 8,
    name: "strawberry",
  },
  {
    src: "../img/taco.svg",
    id: 9,
    name: "taco",
  },
  {
    src: "../img/taco.svg",
    id: 10,
    name: "taco",
  },
  {
    src: "../img/wine.svg",
    id: 11,
    name: "wine",
  },
  {
    src: "../img/wine.svg",
    id: 12,
    name: "wine",
  },
];

let hardArray = [
  {
    src: "../img/13.svg",
    id: 13,
    name: "13",
  },
  {
    src: "../img/14.svg",
    id: 14,
    name: "13",
  },
  {
    src: "../img/15.svg",
    id: 15,
    name: "15",
  },
  {
    src: "../img/16.svg",
    id: 15,
    name: "15",
  },
  {
    src: "../img/17.svg",
    id: 17,
    name: "17",
  },
  {
    src: "../img/18.svg",
    id: 18,
    name: "17",
  },
  {
    src: "../img/19.svg",
    id: 19,
    name: "19",
  },
  {
    src: "../img/20.svg",
    id: 20,
    name: "19",
  },
  {
    src: "../img/21.svg",
    id: 21,
    name: "21",
  },
  {
    src: "../img/22.svg",
    id: 22,
    name: "21",
  },
  {
    src: "../img/23.svg",
    id: 23,
    name: "23",
  },
  {
    src: "../img/24.svg",
    id: 24,
    name: "23",
  },
];

class MemoryCard {
  constructor(imgSrc, imgName) {
    const board = document.querySelector(".board");
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

function startGame() {
  gameOver();
  displayScore();
  createBoard();
}

let difficulty = easyArray;
function determineDifficulty() {
  if (toggle.checked === false) {
    difficulty = easyArray;
  } else {
    difficulty = hardArray;
  }
  startGame();
}

function createBoard() {
  // randomizes the array https://flaviocopes.com/how-to-shuffle-array-javascript/
  let randomImgArray = difficulty.sort(() => Math.random() - 0.5);
  randomImgArray.forEach((img) => {
    new MemoryCard(img.src, img.name);
  });
}

function flipCards(e) {
  let card = e.target.parentElement;
  if (e.target.parentElement.classList.contains("card")) {
    // scoring in this if statement prevents score being incremented if a third card is clicked while the original 2 cards are still flipped
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
        card.classList.add("hide");
      });
    }, 700);
  }
}

function displayScore() {
  let scoreDisplay = document.querySelector(".score");
  scoreDisplay.textContent = score;
}

function gameOver() {
  //push score to history array
  board.innerHTML = "";
  score = 0;
  cardsCurrentlyFlipped = [];
}

startGame();

// Event Listeners
startBtn.addEventListener("click", startGame);
board.addEventListener("click", flipCards);
toggle.addEventListener("change", determineDifficulty);
