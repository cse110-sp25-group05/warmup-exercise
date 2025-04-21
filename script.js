document.addEventListener("DOMContentLoaded", () => {
const deckContainer = document.getElementById("deck-container");
const dealerHand = document.getElementById('dealer-cards');
const playerHand = document.getElementById('player-cards');
const shuffleButton = document.getElementById("shuffle-button");
const newGameButton = document.getElementById("new-game-button");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");
const result = document.getElementById("results")


// Global vars to track player/dealer sum & cards
var dealerSum = 0;
var playerSum = 0;
let cards = [];

// Allows player to hit while playerSum < 21
var canHit = true;
var message

// Load cards from cards.html
fetch('deck.html')
  .then(response => response.text())
  .then(html => {
    const temp = document.createElement('div');
    temp.innerHTML = html;

    cards = Array.from(temp.querySelectorAll('.card'));
  })
  .catch(error => console.error('Error loading cards:', error));


window.onload = function(){
  shuffleArray(cards);
}

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

// Hit Functionality
hitButton.addEventListener("click", hit);

// Stand Functionality
standButton.addEventListener("click", stand);


// Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


function startGame(){
  // Reset Card Containers
  dealerHand.innerHTML = '';
  playerHand.innerHTML = '';
  ocument.getElementById("dealer-sum").innerText = '';
  document.getElementById("player-sum").innerText = '';
  result.innerHTML = '';

  // Reset scores
  playerSum = 0;
  dealerSum = 0;
  canHit = true;

  shuffleArray(cards);
  
  const hidden = cards.pop();
  const frontFaceDealer1 = hidden.querySelector('.card-front-black, .card-front-red');
  const rankDealer1 = frontFaceDealer1.dataset.rank;
  console.log("Dealer Card Rank:", rankDealer1);
  dealerSum += getValue(rankDealer1, dealerSum);
  console.log("Dealer Sum:", dealerSum);
  hidden.classList.add('flipped');
  hidden.id = 'hidden-dealer-card';
  dealerHand.appendChild(hidden);

  while(dealerSum < 17){
    const dealerCard = cards.pop(); // Pop the card from the array
    const frontFaceDealer = dealerCard.querySelector('.card-front-black, .card-front-red');
    const rankDealer = frontFaceDealer.dataset.rank;
    console.log("Dealer Card Rank:", rankDealer);
    dealerSum += getValue(rankDealer);
    console.log("Dealer Sum:", dealerSum);
    dealerHand.appendChild(dealerCard); // Add the card to the dealer's hand
    }


  for (let i = 0; i < 2; i++) {
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

function getValue(val, sum){
  if(val === "1"){ // 1 because we assigned aces to be 1 instead of A in data-rank
    if((sum + 11) > 21){
      return 1;
    }
    else{
      return 11;
    }
  }
  else if (val === "J" || val === "Q" || val === "K") {
    return 10;
  }
  else{
    return parseInt(val);
  }
}
  
function hit(){
  if(!canHit){
    return;
  }

  const playerCard = cards.pop(); // Pop the card from the array
  const frontFace = playerCard.querySelector('.card-front-black, .card-front-red');
  const rank = frontFace.dataset.rank;
  console.log("Player Card Rank:", rank);
  playerSum += getValue(rank);
  console.log("Player Sum:", playerSum);
  playerHand.appendChild(playerCard); // Add the card to the player's hand
  

  if(playerSum > 21){
    canHit = false;
  }
}

function stand(){
  canHit = false;
  const hidden = document.getElementById('hidden-dealer-card');
  hidden.classList.remove('flipped');

  if(playerSum > 21){
    message = "You lose!";
  }
  else if (dealerSum > 21){
    message = "You win!";
  }
  else if(playerSum === dealerSum){
    message = "Tie!";
  }
  else if(playerSum > dealerSum){
    message = "You win!";
  }
  else if(dealerSum > playerSum){
   message = "You lose!";
  }

  result.innerHTML = message;
  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("player-sum").innerText = playerSum;

}
});
