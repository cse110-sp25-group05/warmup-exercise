document.addEventListener("DOMContentLoaded", () => {
  const cards = deckContainer.querySelectorAll(".card");
  const deckContainer = document.getElementById("deck-container");
  const shuffleButton = document.getElementById("shuffle-button");
  const drawOneButton = document.getElementById("draw-one");//button
  const drawFiveButton = document.getElementById("draw-five");//button
  const playerHand = document.getElementById("player-hand");
  let remainingCards = [];

document.addEventListener("DOMContentLoaded", () => {
  const cardArray = Array.from(deckContainer.children);
  shuffleArray(cardArray);
  cardArray.forEach((card) => deckContainer.appendChild(card));
  remainingCards = Array.from(deckContainer.children);
});

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
    remainingCards=Array.from(deckContainer.children);
  });

  // Fisher-Yates Shuffle Algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function drawCards(n) {
    for (let i = 0; i < n; i++) {
      if (remainingCards.length === 0) return;
      const card = remainingCards.shift(); //Remove from top of deck
      playerHand.appendChild(card); //Move to player hand
    }
  }
  drawOneButton.addEventListener("click", () => drawCards(1));// Button event listeners
  drawFiveButton.addEventListener("click", () => drawCards(5));
});
