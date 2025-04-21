document.addEventListener("DOMContentLoaded", () => {
const cards2 = document.querySelectorAll(".card");
const deckContainer = document.getElementById("deck-container");
const shuffleButton = document.getElementById("shuffle-button");
const newGameButton = document.getElementById("new-game-button");

// Global vars to track player/dealer sum
var dealerSum = 0;
var playerSum = 0;

// Global vars to track player/dealer ace amnt
var dealerAce = 0;
var playerAce = 0;


var hidden;
var deck;
let cards = [];

// Allows player to hit while playerSum < 21
var canHit = true;

// Load cards from cards.html
fetch('deck.html')
  .then(response => response.text())
  .then(html => {
    const temp = document.createElement('div');
    temp.innerHTML = html;

    cards = Array.from(temp.querySelectorAll('.card'));
  })
  .catch(error => console.error('Error loading cards:', error));


// Flip functionality
cards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });
});

// Shuffle functionality
shuffleButton.addEventListener("click", () => {
  shuffleArray(cards); // Shuffle the array
});

// New Game Functionality
newGameButton.addEventListener("click", startGame);

// Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

window.onload = function(){
  shuffleArray(cards);
}


function startGame(){
  // Reset Card Containers
  const dealerHand = document.getElementById('dealer-cards');
  const playerHand = document.getElementById('player-cards');
  dealerHand.innerHTML = '';
  playerHand.innerHTML = '';

  // Reset scores
  playerSum = 0;
  dealerSum = 0;

  shuffleArray(cards);

  for (let i = 0; i < 2; i++) {
    // Deal a card to the dealer
    const dealerCard = cards.pop(); // Pop the card from the array
    const frontFaceDealer = dealerCard.querySelector('.card-front-black, .card-front-red');
    const rankDealer = frontFaceDealer.dataset.rank;
    console.log("Player Card Rank:", rankDealer);
    dealerSum += getValue(rankDealer);
    console.log("Dealer Sum:", dealerSum);
    dealerHand.appendChild(dealerCard); // Add the card to the dealer's hand

    // Deal a card to the player
    const playerCard = cards.pop(); // Pop the card from the array
    const frontFace = playerCard.querySelector('.card-front-black, .card-front-red');
    const rank = frontFace.dataset.rank;
    console.log("Player Card Rank:", rank);
    playerSum += getValue(rank);
    console.log("Player Sum:", playerSum);
    playerHand.appendChild(playerCard); // Add the card to the player's hand

  }
}

function startGame(){
  // Reset Card Containers
  const dealerHand = document.getElementById('dealer-cards');
  const playerHand = document.getElementById('player-cards');
  dealerHand.innerHTML = '';
  playerHand.innerHTML = '';

  // Reset scores
  playerSum = 0;
  dealerSum = 0;

  shuffleArray(cards);

  for (let i = 0; i < 2; i++) {
    // Deal a card to the dealer
    const dealerCard = cards.pop(); // Pop the card from the array
    const frontFaceDealer = dealerCard.querySelector('.card-front-black, .card-front-red');
    const rankDealer = frontFaceDealer.dataset.rank;
    console.log("Player Card Rank:", rankDealer);
    dealerSum += getValue(rankDealer);
    console.log("Dealer Sum:", dealerSum);
    dealerHand.appendChild(dealerCard); // Add the card to the dealer's hand

    // Deal a card to the player
    const playerCard = cards.pop(); // Pop the card from the array
    const frontFace = playerCard.querySelector('.card-front-black, .card-front-red');
    const rank = frontFace.dataset.rank;
    console.log("Player Card Rank:", rank);
    playerSum += getValue(rank);
    console.log("Player Sum:", playerSum);
    playerHand.appendChild(playerCard); // Add the card to the player's hand

  }
}
function startGame(){
  // Reset Card Containers
  const dealerHand = document.getElementById('dealer-cards');
  const playerHand = document.getElementById('player-cards');
  dealerHand.innerHTML = '';
  playerHand.innerHTML = '';

  // Reset scores
  playerSum = 0;
  dealerSum = 0;

  shuffleArray(cards);

  while(dealerSum < 17){
    const dealerCard = cards.pop(); // Pop the card from the array
    const frontFaceDealer = dealerCard.querySelector('.card-front-black, .card-front-red');
    const rankDealer = frontFaceDealer.dataset.rank;
    console.log("Dealer Card Rank:", rankDealer);
    dealerSum += getValue(rankDealer, dealerSum);
    console.log("Dealer Sum:", dealerSum);
    dealerHand.appendChild(dealerCard); // Add the card to the dealer's hand
  }

  for (let i = 0; i < 2; i++) {
    // Deal a card to the player
    const playerCard = cards.pop(); // Pop the card from the array
    const frontFace = playerCard.querySelector('.card-front-black, .card-front-red');
    const rank = frontFace.dataset.rank;
    console.log("Player Card Rank:", rank);
    playerSum += getValue(rank, playerSum);
    console.log("Player Sum:", playerSum);
    playerHand.appendChild(playerCard); // Add the card to the player's hand

  }
}

function getValue(val, sum){
  if(val === "1"){ // 1 because we assigned aces to be 1 instead of A in data-rank
    if((sum + 11) > 21){
      return 1;
    }
    else{
      return 11;
    }
  }

  /* Face cards ------------------------------------------------------- */
  if (val === "J" || val === "Q" || val === "K" || val === "10") 
  {
    return 10;
  }

  /* Number cards (2 – 9) -------------------------------------------- */
  const n = parseInt(val, 10);
  if (!isNaN(n)) return n;

  // money tracking demo
  const standButton = document.getElementById("stand-button");
  const playerBank = document.getElementById("player-bank");
  
  if (standButton && playerBank) {
    standButton.addEventListener("click", () => {
      // demo a win/loss
      const win = Math.random() > 0.5;
      
      if (win) {
        playerBank.shadowRoot.querySelector('#win-button').click();
      } else {
        playerBank.shadowRoot.querySelector('#lose-button').click();
      }
    });
  }
}

});
