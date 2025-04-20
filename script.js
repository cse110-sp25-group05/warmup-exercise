document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  const deckContainer = document.getElementById("deck-container");
  const shuffleButton = document.getElementById("shuffle-button");
  const newGameButton = document.getElementById("new-game-button");
  const resetDeckButton = document.getElementById("reset-deck-button");

  // Flip functionality
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });

  // Shuffle functionality
  if (shuffleButton) {
    shuffleButton.addEventListener("click", () => {
      const cardArray = Array.from(deckContainer.children); // Get all cards as an array
      shuffleArray(cardArray); // Shuffle the array
      cardArray.forEach((card) => deckContainer.appendChild(card)); // Re-append cards in shuffled order
    });
  }

  // Fisher-Yates Shuffle Algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // new game button handler
  if (newGameButton) {
    newGameButton.addEventListener("click", () => {
      // reset all values and reshuffle deck for a new game
      alert("Starting new game - resetting values and reshuffling deck");
      
      // clear player and dealer hands
      const playerHand = document.querySelector("#player-hand > div");
      const dealerHand = document.querySelector("#dealer-hand > div");
      
      // keep only the h2 heading in each hand
      while (playerHand.children.length > 1) {
        playerHand.removeChild(playerHand.lastChild);
      }
      
      while (dealerHand.children.length > 1) {
        dealerHand.removeChild(dealerHand.lastChild);
      }
      
      // shuffle the deck if it exists
      if (deckContainer && deckContainer.children.length > 0) {
        const cardArray = Array.from(deckContainer.children);
        shuffleArray(cardArray);
        cardArray.forEach((card) => deckContainer.appendChild(card));
      }
    });
  }
  
  // reset Deck button handler
  if (resetDeckButton) {
    resetDeckButton.addEventListener("click", () => {
      alert("Resetting and reshuffling deck");
      
      // just shuffle the current deck
      if (deckContainer && deckContainer.children.length > 0) {
        const cardArray = Array.from(deckContainer.children);
        shuffleArray(cardArray);
        cardArray.forEach((card) => deckContainer.appendChild(card));
      }
    });
  }
});
