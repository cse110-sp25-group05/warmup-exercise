document.addEventListener("DOMContentLoaded", () => {
const cards2 = document.querySelectorAll(".card");
const deckContainer = document.getElementById("deck-container");
const shuffleButton = document.getElementById("shuffle-button");
const dealButton = document.getElementById("deal-button");

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
  const cardArray = Array.from(deckContainer.children); // Get all cards as an array
  shuffleArray(cardArray); // Shuffle the array
  cardArray.forEach((card) => deckContainer.appendChild(card)); // Re-append cards in shuffled order
});

// Deal Functionality
dealButton.addEventListener("click", startGame);

// Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

window.onload = function(){
  buildDeck();
  shuffleArray(cardArray);
  startGame();
}

function buildDeck(){
  
  let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  let types = ["clover", "diamond", "heart", "spade"];
  deck = [];

  for(let i = 0; i< types.length; i++){
      for(let j = 0; j <values.length; j++){
          deck.push(values[j] + "-" + types[i]);
      }
  }
  console.log(deck);
}

function startGame(){
  const dealerHand = document.getElementById('dealer-cards');
  const playerHand = document.getElementById('player-cards');

  for (let i = 0; i < 2; i++) {
    // Deal a card to the player
    const playerCard = cards.pop(); // Pop the card from the array
    playerHand.appendChild(playerCard); // Add the card to the player's hand
    
    // Deal a card to the dealer
    const dealerCard = cards.pop(); // Pop the card from the array
    dealerHand.appendChild(dealerCard); // Add the card to the dealer's hand
  }
}

function getValue(card){
  let data = card.split("-");
  let value = data[0];
  return parseInt(value);
}

});
