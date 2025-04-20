document.addEventListener("DOMContentLoaded", () => {
  const deckContainer = document.getElementById("deck-container");
  const shuffleButton = document.getElementById("shuffle-button");
  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  let deck = [];

  function createDeck() {
    deck = [];
    for (let suit of suits) { //loop suits
      for (let rank of ranks) {//loop ranks
        deck.push({ suit, rank }); //push to deck
      }
    }
  }

  function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {//iterate thru deck -1 because java sucks and is 0 indexed
      const j = Math.floor(Math.random() * (i + 1));//math.random for shuffling=randomization
      [deck[i], deck[j]] = [deck[j], deck[i]]; //reoriente pos
    }
  }
//render to frontend html
  function renderDeck() {
    deckContainer.innerHTML = "";//sets our html to nothing so nothing is in container
    for (let card of deck) {//loop
      const cardDiv = document.createElement("div");//new element divs
      cardDiv.className = "card";
      cardDiv.innerHTML = `
        <div class="card-inner">
          <div class="${isRed(card.suit) ? "card-front-red" : "card-front-black"}" data-rank="${card.rank}" data-suit="${card.suit}">
            <span class="card-front-top">${card.rank}${card.suit}</span>
            <span class="card-front-middle">${card.suit}</span>
            <span class="card-front-bottom">${card.rank}${card.suit}</span>
          </div>
          <div class="card-back"><div></div></div>
        </div>
      `;
//upper inner html using html within java to cread the front of the cards
      cardDiv.addEventListener("click", () => {
        cardDiv.classList.toggle("flipped");
      });

      deckContainer.appendChild(cardDiv);
    }
  }

  function isRed(suit) {
    return suit === "♥" || suit === "♦";
  }

  createDeck();
  renderDeck();

  shuffleButton.addEventListener("click", () => {
    shuffleDeck();
    renderDeck();
  });
});
