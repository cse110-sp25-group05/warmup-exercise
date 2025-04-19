document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  const deckContainer = document.getElementById("deck-container");
  const shuffleButton = document.getElementById("shuffle-button");

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

  // Fisher-Yates Shuffle Algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
});
