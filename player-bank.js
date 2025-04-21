class PlayerBank extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // get stored values or use defaults
    this.money = 1000;
    this.currentBet = 0;
    
    // try to load saved data from localStorage
    if (localStorage.getItem('playerMoney')) {
      this.money = parseFloat(localStorage.getItem('playerMoney'));
    }
    
    if (localStorage.getItem('currentBet')) {
      this.currentBet = parseFloat(localStorage.getItem('currentBet'));
    }

    // create the component UI
    this.render();
    // set up event listeners for buttons
    this.setupEventListeners();
  }

  // when the element is added to the DOM
  connectedCallback() {
    this.updateDisplay();
  }

  // create the html structure and styles
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 10px 0;
        }
        
        .bank-container {
          background-color: rgba(0, 32, 20, 0.9);
          color: white;
          padding: 15px;
          border-radius: 5px;
          max-width: 300px;
          margin: 0 auto;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }
        
        .balance {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 16px;
        }
        
        .money {
          color: #00ff00;
          font-weight: bold;
        }
        
        .bet {
          color: #ffcc00;
          font-weight: bold;
        }
        
        .chips {
          display: flex;
          justify-content: space-between;
          margin: 15px 0;
        }
        
        .chip {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }
        
        .chip-5 { background-color: #ff0000; }
        .chip-10 { background-color: #0000ff; }
        .chip-25 { background-color: #00cc00; }
        .chip-100 { background-color: #ffcc00; color: black; }
        
        .actions {
          display: flex;
          justify-content: space-between;
          gap: 5px;
        }
        
        button {
          padding: 6px 10px;
          border: none;
          border-radius: 3px;
          background-color: #333;
          color: white;
          cursor: pointer;
          flex: 1;
        }
        
        button:hover {
          background-color: #444;
        }
      </style>
      
      <div class="bank-container">
        <div class="balance">
          <span>Balance:</span>
          <span class="money" id="money-amount">$1000.00</span>
        </div>
        
        <div class="balance">
          <span>Current Bet:</span>
          <span class="bet" id="bet-amount">$0.00</span>
        </div>
        
        <div class="chips">
          <div class="chip chip-5" data-value="5">$5</div>
          <div class="chip chip-10" data-value="10">$10</div>
          <div class="chip chip-25" data-value="25">$25</div>
          <div class="chip chip-100" data-value="100">$100</div>
        </div>
        
        <div class="actions">
          <button id="bet-button">Place Bet</button>
          <button id="reset-button">Reset</button>
          <button id="win-button">Win</button>
          <button id="lose-button">Lose</button>
        </div>
      </div>
    `;
  }

  // set up all the button click handlers
  setupEventListeners() {
    // chip selection - add money to the bet when clicked
    const chips = this.shadowRoot.querySelectorAll('.chip');
    for (let i = 0; i < chips.length; i++) {
      chips[i].addEventListener('click', () => {
        const value = parseFloat(chips[i].dataset.value);
        if (this.money >= value) {
          this.addToBet(value);
        } else {
          alert('Not enough funds!');
        }
      });
    }
    
    // place bet button
    const betButton = this.shadowRoot.querySelector('#bet-button');
    betButton.addEventListener('click', () => {
      if (this.currentBet > 0) {
        // Save the bet to localStorage
        localStorage.setItem('currentBet', this.currentBet);
        alert('Bet placed: $' + this.currentBet);
      } else {
        alert('Please place a bet first!');
      }
    });
    
    // reset bet button
    const resetButton = this.shadowRoot.querySelector('#reset-button');
    resetButton.addEventListener('click', () => {
      this.money += this.currentBet;
      this.currentBet = 0;
      this.updateDisplay();
      localStorage.setItem('playerMoney', this.money);
      localStorage.setItem('currentBet', this.currentBet);
    });
    
    // win button - for demo purposes
    const winButton = this.shadowRoot.querySelector('#win-button');
    winButton.addEventListener('click', () => {
      this.winBet();
    });
    
    // lose button - for demo purposes
    const loseButton = this.shadowRoot.querySelector('#lose-button');
    loseButton.addEventListener('click', () => {
      this.loseBet();
    });
  }

  // update the displayed money and bet amounts
  updateDisplay() {
    const moneyDisplay = this.shadowRoot.querySelector('#money-amount');
    const betDisplay = this.shadowRoot.querySelector('#bet-amount');
    
    moneyDisplay.textContent = '$' + this.money.toFixed(2);
    betDisplay.textContent = '$' + this.currentBet.toFixed(2);
  }

  // add money to the current bet
  addToBet(amount) {
    this.money -= amount;
    this.currentBet += amount;
    this.updateDisplay();
    localStorage.setItem('playerMoney', this.money);
  }

  // player wins their bet
  winBet() {
    if (this.currentBet > 0) {
      // player wins they get double their bet (original bet + winnings)
      this.money += (this.currentBet * 2);
      this.currentBet = 0;
      this.updateDisplay();
      localStorage.setItem('playerMoney', this.money);
      localStorage.setItem('currentBet', this.currentBet);
      alert('You won!');
    }
  }

  // player loses their bet
  loseBet() {
    if (this.currentBet > 0) {
      // player loses their bet, nothing is returned
      this.currentBet = 0;
      this.updateDisplay();
      localStorage.setItem('currentBet', this.currentBet);
      alert('You lost.');
    }
  }

  // reset the game to starting values
  resetGame() {
    this.money = 1000;
    this.currentBet = 0;
    this.updateDisplay();
    localStorage.setItem('playerMoney', this.money);
    localStorage.setItem('currentBet', this.currentBet);
  }
}

// register the web component so it can be used in html
customElements.define('player-bank', PlayerBank); 