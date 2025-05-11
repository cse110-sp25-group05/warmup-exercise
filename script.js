document.addEventListener("DOMContentLoaded", () => {
const dealerHand = document.getElementById('dealer-cards');
const playerHand = document.getElementById('player-cards');
const newGameButton = document.getElementById("new-game-button");
const resetDeckButton = document.getElementById("reset-deck-button");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");
const result = document.createElement("div");
result.id = "results";
result.style.textAlign = "center";
result.style.fontSize = "1.5rem";
result.style.fontWeight = "600";
result.style.padding = "1.2rem";
result.style.color = "#f39c12";
result.style.marginTop = "1rem";
result.style.marginBottom = "0";
document.querySelector("main").appendChild(result);
// hide message initially
result.style.display = "none";
const playerBank = document.getElementById("player-bank");

// global vars to track player/dealer sum & cards
var dealerSum = 0;
var playerSum = 0;
let cards = [];
let hiddenCard;
let messageTimeout = null;

// allows player to hit while playerSum < 21
var canHit = false;
var gameInProgress = false;

// start a new game
async function startGame() {
  // make sure player has placed a bet
  let currentBet = parseFloat(localStorage.getItem('currentBet') || "0");
  
  // if there is no bet, require the player to place a bet first
  if (currentBet <= 0) {
    showMessage("💰 Please place a bet first!", 4000);
    highlightBetChips(); // highlight the betting chips
    return; // exit the function - don't start the game without a bet
  } else {
    // clear result area
    result.style.display = "none";
  }
  
  // reset card containers
  dealerHand.innerHTML = '';
  playerHand.innerHTML = '';
  document.getElementById("dealer-sum").innerText = '';
  document.getElementById("player-sum").innerText = '';
  
  // reset scores
  playerSum = 0;
  dealerSum = 0;
  canHit = true;
  gameInProgress = true;
  
  // enable game controls
  hitButton.disabled = false;
  standButton.disabled = false;

  try {
    // ensure we have cards
    if (cards.length < 10) {
      cards = await loadDeck();
      shuffleArray(cards);
      fixCardSVGSizes(cards);
    }
    
    // deal hidden card to dealer
    hiddenCard = cards.pop().cloneNode(true);
    const hiddenCardFront = hiddenCard.querySelector('.card-front-black, .card-front-red');
    const hiddenCardRank = hiddenCardFront ? hiddenCardFront.dataset.rank : '10'; // default to 10 if not found
    dealerSum += getValue(hiddenCardRank, dealerSum);
    hiddenCard.classList.add('flipped'); // this makes the card show its back
    hiddenCard.id = 'hidden-dealer-card';
    
    // play card sound
    if (window.soundManager) {
      window.soundManager.playCard();
    }
    
    // fix SVG sizes in the hidden card
    fixCardSVGSizes([hiddenCard]);
    
    dealerHand.appendChild(hiddenCard);

    // deal visible card to dealer
    const dealerCard = cards.pop().cloneNode(true);
    const dealerCardFront = dealerCard.querySelector('.card-front-black, .card-front-red');
    const dealerCardRank = dealerCardFront ? dealerCardFront.dataset.rank : '10';
    dealerSum += getValue(dealerCardRank, dealerSum);
    
    // play card sound with delay
    setTimeout(() => {
      if (window.soundManager) {
        window.soundManager.playCard();
      }
    }, 300);
    
    dealerHand.appendChild(dealerCard);

    // deal two cards to player
    for (let i = 0; i < 2; i++) {
      const playerCard = cards.pop().cloneNode(true);
      const frontFace = playerCard.querySelector('.card-front-black, .card-front-red');
      const rank = frontFace ? frontFace.dataset.rank : '5';
      playerSum += getValue(rank, playerSum);
      
      // play card sound with longer delay
      setTimeout(() => {
        if (window.soundManager) {
          window.soundManager.playCard();
        }
      }, 600 + (i * 300));
      
      playerHand.appendChild(playerCard);
    }
    
    // check for blackjack
    checkForBlackjack();
  } catch (error) {
    console.error("Error dealing cards:", error);
    showMessage("Error starting game. Please refresh the page.", 5000);
  }
}

// function to show message with auto-hide after delay
function showMessage(text, duration = 3000) {
  // clear any existing timeout
  if (messageTimeout) {
    clearTimeout(messageTimeout);
  }
  
  // show message
  result.innerHTML = text;
  result.style.display = "block";
  result.style.animation = "fadeIn 0.5s ease-out forwards";
  
  // set timeout to hide message
  if (duration > 0) {
    messageTimeout = setTimeout(() => {
      result.style.animation = "fadeOut 0.5s ease-out forwards";
      setTimeout(() => {
        result.style.display = "none";
      }, 500);
    }, duration);
  }
  
  // add click event to dismiss message when clicked
  result.onclick = function() {
    result.style.animation = "fadeOut 0.3s ease-out forwards";
    setTimeout(() => {
      result.style.display = "none";
    }, 300);
    
    // clear the timeout if it exists
    if (messageTimeout) {
      clearTimeout(messageTimeout);
    }
  };
}

// function to highlight bet chips
function highlightBetChips() {
  const chips = document.querySelectorAll('.chip-button, [data-value]');
  const placeBetBtn = document.querySelector('#place-bet-button, button[onclick="placeBet()"], button:contains("PLACE BET")');
  
  // add highlight class to chips
  chips.forEach(chip => {
    chip.classList.add('highlight-chips');
  });
  
  // highlight place bet button if found
  if (placeBetBtn) {
    placeBetBtn.classList.add('highlight-chips');
    setTimeout(() => {
      placeBetBtn.classList.remove('highlight-chips');
    }, 3000);
  }
  
  // remove highlight after animation completes
  setTimeout(() => {
    chips.forEach(chip => {
      chip.classList.remove('highlight-chips');
    });
  }, 3000); // 3 seconds (matches 3 animation iterations)
}

// load cards from cards.html
function loadDeck() {
  return fetch('deck.html')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load deck: ${response.status} ${response.statusText}`);
      }
      return response.text();
    })
    .then(html => {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const cards = Array.from(temp.querySelectorAll('.card'));
      return cards;
    })
    .catch(error => {
      console.error('Error loading cards:', error);
      showMessage("Error loading cards. Please refresh the page.", 8000);
      return [];
    });
}

// initialize the game
async function initGame() {
  try {
    cards = await loadDeck();
    shuffleArray(cards);
    
    // fix SVG sizes for all cards in the deck
    fixCardSVGSizes(cards);
    
    // disable game controls initially
    hitButton.disabled = true;
    standButton.disabled = true;
    
    // setup event listeners
    newGameButton.addEventListener("click", startGame);
    resetDeckButton.addEventListener("click", resetGame);
    hitButton.addEventListener("click", hit);
    standButton.addEventListener("click", stand);
    
    // flip functionality for cards
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        if (!gameInProgress) {
          card.classList.toggle("flipped");
        }
      });
    });
  } catch (error) {
    console.error("Error initializing game:", error);
    showMessage("Error initializing game. Please refresh the page.", 8000);
  }
}

// fisher-yates shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// function to fix SVG sizes in cards
function fixCardSVGSizes(cardElements) {
  cardElements.forEach(card => {
    // determine if this is a black or red card
    const isRed = card.querySelector('.card-front-red');
    
    // fix top and bottom SVGs
    const smallSvgs = card.querySelectorAll('.card-front-top svg, .card-front-bottom svg');
    smallSvgs.forEach(svg => {
      svg.setAttribute('width', '10');
      svg.setAttribute('height', '12');
      svg.style.maxWidth = '12px';
      svg.style.maxHeight = '14px';
      
      // make sure paths have proper fill color based on suit
      const paths = svg.querySelectorAll('path');
      paths.forEach(path => {
        if (isRed) {
          path.setAttribute('fill', '#d32f2f');
        } else {
          path.setAttribute('fill', '#000000');
        }
      });
    });
    
    // fix middle SVG
    const middleSvg = card.querySelector('.card-front-middle svg');
    if (middleSvg) {
      middleSvg.setAttribute('width', '40');
      middleSvg.setAttribute('height', '40');
      middleSvg.style.maxWidth = '40px';
      middleSvg.style.maxHeight = '40px';
      
      // make sure paths have proper fill color based on suit
      const paths = middleSvg.querySelectorAll('path');
      paths.forEach(path => {
        if (isRed) {
          path.setAttribute('fill', '#d32f2f');
        } else {
          path.setAttribute('fill', '#000000');
        }
      });
    }
    
    // fix rank displays - ensure proper display of numbers
    const rankTop = card.querySelector('.card-front-top .card-rank');
    const rankBottom = card.querySelector('.card-front-bottom .card-suit');
    
    if (rankTop) {
      rankTop.style.fontSize = '1.2rem';
      rankTop.style.lineHeight = '1';
      rankTop.style.fontWeight = 'bold';
      rankTop.style.marginLeft = '2px';
      rankTop.style.fontFamily = "'Arial', sans-serif";
      
      // convert A, J, Q, K to full text for better readability
      if (rankTop.textContent === 'J') rankTop.textContent = 'J';
      if (rankTop.textContent === 'Q') rankTop.textContent = 'Q';
      if (rankTop.textContent === 'K') rankTop.textContent = 'K';
      if (rankTop.textContent === '1') rankTop.textContent = 'A';
    }
    
    if (rankBottom) {
      rankBottom.style.fontSize = '1.2rem';
      rankBottom.style.lineHeight = '1';
      rankBottom.style.fontWeight = 'bold';
      rankBottom.style.marginRight = '2px';
      rankBottom.style.fontFamily = "'Arial', sans-serif";
      
      // convert A, J, Q, K to full text for better readability
      if (rankBottom.textContent === 'J') rankBottom.textContent = 'J';
      if (rankBottom.textContent === 'Q') rankBottom.textContent = 'Q';
      if (rankBottom.textContent === 'K') rankBottom.textContent = 'K';
      if (rankBottom.textContent === '1') rankBottom.textContent = 'A';
    }
    
    // add white border around the card for better look
    const cardFront = card.querySelector('.card-front-black, .card-front-red');
    if (cardFront) {
      cardFront.style.border = '1px solid #e0e0e0';
    }
  });
}

// reset the game
async function resetGame() {
  // reset UI
  dealerHand.innerHTML = '';
  playerHand.innerHTML = '';
  document.getElementById("dealer-sum").innerText = '';
  document.getElementById("player-sum").innerText = '';
  result.style.display = "none";
  
  // reset game state
  playerSum = 0;
  dealerSum = 0;
  canHit = false;
  gameInProgress = false;
  
  // disable game controls
  hitButton.disabled = true;
  standButton.disabled = true;
  
  // reset player bank if needed
  try {
    if (window.playerBankComponent) {
      window.playerBankComponent.resetGame();
    } else if (playerBank._shadowRoot) {
      playerBank._shadowRoot.querySelector('#reset-button').click();
    } else {
      playerBank.resetGame();
    }
  } catch (e) {
    console.error('Error resetting player bank:', e);
  }
  
  // reload deck
  cards = await loadDeck();
  shuffleArray(cards);
}

// get card value
function getValue(val, currentSum = 0) {
  if (val === "1") { // ace
    if ((currentSum + 11) <= 21) {
      return 11;
    } else {
      return 1;
    }
  } else if (val === "J" || val === "Q" || val === "K") {
    return 10;
  } else {
    return parseInt(val);
  }
}

// Hit functionality
function hit() {
  if (!canHit || !gameInProgress) {
    return;
  }

  try {
    // Deal a card to the player
    const playerCard = cards.pop().cloneNode(true);
    const frontFace = playerCard.querySelector('.card-front-black, .card-front-red');
    const rank = frontFace ? frontFace.dataset.rank : '5';
    playerSum += getValue(rank, playerSum);
    
    // play card sound
    if (window.soundManager) {
      window.soundManager.playCard();
    }
    
    // Fix the SVG sizes in the cloned card
    fixCardSVGSizes([playerCard]);
    
    // Add card to player hand
    playerHand.appendChild(playerCard);
    
    // Update player sum
    document.getElementById("player-sum").innerText = playerSum;
    
    // Check if player busts
    if (playerSum > 21) {
      canHit = false;
      gameOver();
    }
  } catch (error) {
    console.error("Error during hit:", error);
    showMessage("Error during hit. Please restart the game.", 5000);
  }
}

// Stand functionality
function stand() {
  if (!gameInProgress) {
    return;
  }
  
  // Disable player actions
  canHit = false;
  
  // Reveal dealer's hidden card
  const hidden = document.getElementById('hidden-dealer-card');
  hidden.classList.remove('flipped');
  
  // Deal cards to dealer until sum is at least 17
  dealerPlay();
}

// Dealer's turn to play
function dealerPlay() {
  try {
    // Dealer hits until 17 or higher
    while (dealerSum < 17) {
      const dealerCard = cards.pop().cloneNode(true);
      const frontFace = dealerCard.querySelector('.card-front-black, .card-front-red');
      const rank = frontFace ? frontFace.dataset.rank : '10';
      dealerSum += getValue(rank, dealerSum);
      
      // play card sound
      if (window.soundManager) {
        window.soundManager.playCard();
      }
      
      // Fix SVG sizes in the dealer card
      fixCardSVGSizes([dealerCard]);
      
      // Add card to dealer hand
      dealerHand.appendChild(dealerCard);
    }
    
    // Update dealer sum
    document.getElementById("dealer-sum").innerText = dealerSum;
    
    // Determine winner
    gameOver();
  } catch (error) {
    console.error("Error during dealer play:", error);
    showMessage("Error during dealer play. Please restart the game.", 5000);
  }
}

// Check for blackjack at start of game
function checkForBlackjack() {
  if (playerSum === 21) {
    if (dealerSum === 21) {
      // Both have blackjack - push
      showMessage("🤝 Both have Blackjack! Push! 🤝", 5000);
      
      // play card sound
      if (window.soundManager) {
        window.soundManager.playCard();
      }
      
      try {
        if (window.playerBankComponent) {
          window.playerBankComponent.resetButton.click(); // Return bet to player
        } else {
          playerBank.resetButton.click(); // Return bet to player
        }
      } catch (e) {
        console.error('Error handling bet on blackjack push:', e);
      }
    } else {
      // Player has blackjack
      showMessage("🎉 Blackjack! You win! 🎉", 5000);
      
      // play card sound
      if (window.soundManager) {
        window.soundManager.playCard();
      }
      
      try {
        if (window.playerBankComponent) {
          window.playerBankComponent.winBet(); // Win with blackjack
        } else {
          playerBank.winBet(); // Win with blackjack
        }
      } catch (e) {
        console.error('Error handling blackjack win:', e);
      }
    }
    gameInProgress = false;
    canHit = false;
    showFinalScores();
    return true;
  }
  
  // Update the scores
  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("player-sum").innerText = playerSum;
  
  // Show dealer's hidden card
  const hidden = document.getElementById('hidden-dealer-card');
  if (hidden) {
    hidden.classList.remove('flipped');
  }

  // Determine winner
  if (playerSum > 21) {
    showMessage("😞 You Bust! Dealer wins", 5000);
    
    // play card sound
    if (window.soundManager) {
      window.soundManager.playCard();
    }
    
    try {
      if (window.playerBankComponent) {
        window.playerBankComponent.loseBet();
      } else {
        playerBank.loseBet();
      }
    } catch (e) {
      console.error('Error handling player bust loss:', e);
    }
  } else if (dealerSum > 21) {
    showMessage("🎉 Dealer Busts! You win!", 5000);
    
    // play card sound
    if (window.soundManager) {
      window.soundManager.playCard();
    }
    
    try {
      if (window.playerBankComponent) {
        window.playerBankComponent.winBet();
      } else {
        playerBank.winBet();
      }
    } catch (e) {
      console.error('Error handling dealer bust win:', e);
    }
  } else if (playerSum === dealerSum) {
    showMessage("🤝 Push! It's a tie!", 5000);
    
    // play card sound
    if (window.soundManager) {
      window.soundManager.playCard();
    }
    
    try {
      if (window.playerBankComponent) {
        window.playerBankComponent.resetButton.click(); // Return bet to player
      } else {
        playerBank.resetButton.click(); // Return bet to player
      }
    } catch (e) {
      console.error('Error handling push:', e);
    }
  } else if (playerSum > dealerSum) {
    showMessage("🎉 You Win!", 5000);
    
    // play card sound
    if (window.soundManager) {
      window.soundManager.playCard();
    }
    
    try {
      if (window.playerBankComponent) {
        window.playerBankComponent.winBet();
      } else {
        playerBank.winBet();
      }
    } catch (e) {
      console.error('Error handling player win:', e);
    }
  } else {
    showMessage("😞 Dealer Wins", 5000);
    
    // play card sound
    if (window.soundManager) {
      window.soundManager.playCard();
    }
    
    try {
      if (window.playerBankComponent) {
        window.playerBankComponent.loseBet();
      } else {
        playerBank.loseBet();
      }
    } catch (e) {
      console.error('Error handling dealer win:', e);
    }
  }
  
  // Show final scores
  showFinalScores();
}

// show final scores
function showFinalScores() {
  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("player-sum").innerText = playerSum;
}

// initialize the game
initGame();
});

