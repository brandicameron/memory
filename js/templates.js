export const board = document.querySelector(".board");

export class MemoryCard {
  constructor(imgSrc, imgName) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-name", imgName);
    board.appendChild(card);
    let cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    // cardBack.textContent = imgName; //for testing lol
    card.appendChild(cardBack);
    let cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    card.appendChild(cardFront);
    let cardImg = document.createElement("img");
    cardImg.classList.add("card-image");
    cardImg.src = imgSrc;
    cardImg.alt = "Silly monster to match up.";
    cardImg.height = "200";
    cardImg.width = "200";
    cardImg.setAttribute("data-name", imgName);
    cardFront.appendChild(cardImg);
  }
}

export class ScoreTemplate {
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
