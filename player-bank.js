class PlayerBank extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // get stored values or use defaults
    this.money = 5000;
    this.currentBet = 0;
    this.loadFromLocalStorage();
    this.bettingEnabled = true;
    
    // create the component UI
    this.render();
    // set up event listeners for buttons
    this.setupEventListeners();
    
    // make elements accessible outside the shadow DOM
    this.resetButton = this.shadowRoot.querySelector('#reset-button');
    this.betButton = this.shadowRoot.querySelector('#bet-button');
    
    // expose methods to window for external access
    window.playerBankComponent = this;
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
          color: var(--text);
          font-family: var(--font-primary);
          width: 100%;
        }
        
        .bank-container {
          background: rgba(45, 54, 76, 0.4);
          backdrop-filter: blur(10px);
          border-radius: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
          margin: 0;
        }
        
        .balance {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-size: 16px;
          font-weight: 500;
          padding: 8px 12px;
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .money {
          color: #00ff44;
          font-weight: bold;
          text-shadow: 0 0 8px rgba(0, 255, 68, 0.3);
        }
        
        .bet {
          color: #ffcc00;
          font-weight: bold;
          text-shadow: 0 0 8px rgba(255, 204, 0, 0.3);
        }
        
        /* grid layout */
        .chips {
          display: grid;
          grid-template-columns: repeat(3, 1fr); 
          gap: 10px;
          margin: 15px 0;
        }
        
        /* basic poker chip style - common for all */
        .chip {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          position: relative;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
        }
        
        /* common white segment pattern - same for all */
        .chip::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-repeat: no-repeat;
          background-position: center;
          z-index: 1;
          background-image:
            conic-gradient(
              transparent 0deg,
              transparent 10deg,
              white 10deg,
              white 35deg,
              transparent 35deg,
              transparent 55deg,
              white 55deg,
              white 80deg,
              transparent 80deg,
              transparent 100deg,
              white 100deg,
              white 125deg,
              transparent 125deg,
              transparent 145deg,
              white 145deg,
              white 170deg,
              transparent 170deg,
              transparent 190deg,
              white 190deg,
              white 215deg,
              transparent 215deg,
              transparent 235deg,
              white 235deg,
              white 260deg,
              transparent 260deg,
              transparent 280deg,
              white 280deg,
              white 305deg,
              transparent 305deg,
              transparent 325deg,
              white 325deg,
              white 350deg,
              transparent 350deg,
              transparent 360deg
            );
        }
        
        /* common inner circle - same for all */
        .chip::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 65%;
          height: 65%;
          border-radius: 50%;
          border: 2px dashed rgba(0, 0, 0, 0.5);
          z-index: 2;
          background-color: white;
          box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.2);
        }
        
        /* value text - standard size */
        .chip span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
          color: black;
          font-size: 16px;
          font-weight: bold;
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
        }
        
        /* smaller text for higher values */
        .chip-250 span,
        .chip-500 span {
          font-size: 14px;
        }
        
        /* decoration dots - same for all */
        .chip-decoration {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          z-index: 1;
          pointer-events: none;
        }
        
        .chip-decoration::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-image: 
            /* top dots */
            radial-gradient(circle at 50% 18%, white 0%, white 4%, transparent 5%),
            /* right dots */
            radial-gradient(circle at 82% 50%, white 0%, white 4%, transparent 5%),
            /* bottom dots */
            radial-gradient(circle at 50% 82%, white 0%, white 4%, transparent 5%),
            /* left dots */
            radial-gradient(circle at 18% 50%, white 0%, white 4%, transparent 5%);
        }
        
        /* color definitions - different for each chip */
        .chip-5 {
          background: #d10000; /* red */
        }
        
        .chip-10 {
          background: #0066cc; /* blue */
        }
        
        .chip-25 {
          background: #008800; /* green */
        }
        
        .chip-100 {
          background: #cc9900; /* yellow */
        }
        
        .chip-250 {
          background: #9c27b0; /* purple */
        }
        
        .chip-500 {
          background: #ff5722; /* orange */
        }
        
        /* hover effect - same for all */
        .chip:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
          filter: brightness(1.1);
        }
        
        .chip:active {
          transform: scale(0.95);
          box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
        }
        
        .chip.clicked {
          animation: chip-click 0.15s ease-out forwards;
        }
        
        @keyframes chip-click {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: auto;
        }
        
        /* buttons */
        button {
          padding: 10px;
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          text-align: center;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        button:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
        
        button:active {
          transform: translateY(1px);
        }
        
        #bet-button {
          background: #00732e;
          box-shadow: 0 3px 0 #005d24;
        }
        
        #reset-button {
          background: #333;
          box-shadow: 0 3px 0 #222;
        }
        
        .disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }
      </style>
      
      <div class="bank-container">
        <div class="balance">
          <span>Balance:</span>
          <span class="money" id="money-amount">$5000.00</span>
        </div>
        
        <div class="balance">
          <span>Current Bet:</span>
          <span class="bet" id="bet-amount">$0.00</span>
        </div>
        
        <div class="chips">
          <div class="chip chip-5" data-value="5">
            <div class="chip-decoration"></div>
            <span>$5</span>
          </div>
          <div class="chip chip-10" data-value="10">
            <div class="chip-decoration"></div>
            <span>$10</span>
          </div>
          <div class="chip chip-25" data-value="25">
            <div class="chip-decoration"></div>
            <span>$25</span>
          </div>
          <div class="chip chip-100" data-value="100">
            <div class="chip-decoration"></div>
            <span>$100</span>
          </div>
          <div class="chip chip-250" data-value="250">
            <div class="chip-decoration"></div>
            <span>$250</span>
          </div>
          <div class="chip chip-500" data-value="500">
            <div class="chip-decoration"></div>
            <span>$500</span>
          </div>
        </div>
        
        <div class="actions">
          <button id="bet-button">Place Bet</button>
          <button id="reset-button">Reset</button>
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
          
          // play chip sound
          if (window.soundManager) {
            window.soundManager.playChip();
          }
          
          // add click animation
          chips[i].classList.add('clicked');
          setTimeout(() => {
            chips[i].classList.remove('clicked');
          }, 150);
        } else {
          this.showMessage('Not enough funds!');
        }
      });
    }
    
    // place bet button
    const betButton = this.shadowRoot.querySelector('#bet-button');
    betButton.addEventListener('click', () => {
      if (this.currentBet > 0) {
        // save the bet to localStorage
        localStorage.setItem('currentBet', this.currentBet);
        this.showMessage('Bet placed: $' + this.currentBet.toFixed(2));
        
        // play chip sound
        if (window.soundManager) {
          window.soundManager.playChip();
        }
        
        // disable chips and bet button after bet is placed
        this.disableBetting(true);
        
        // dispatch a custom event that the bet has been placed
        this.dispatchEvent(new CustomEvent('betplaced', {
          bubbles: true,
          composed: true,
          detail: { amount: this.currentBet }
        }));
      } else {
        this.showMessage('Please place a bet first!');
      }
    });
    
    // reset bet button
    const resetButton = this.shadowRoot.querySelector('#reset-button');
    resetButton.addEventListener('click', () => {
      if (this.currentBet > 0) {
        // play chip sound
        if (window.soundManager) {
          window.soundManager.playChip();
        }
      }
      
      this.money += this.currentBet;
      this.currentBet = 0;
      this.updateDisplay();
      localStorage.setItem('playerMoney', this.money);
      localStorage.setItem('currentBet', this.currentBet);
      
      // re-enable betting
      this.disableBetting(false);
    });
  }

  // show message in a nicer way
  showMessage(message) {
    const messageElem = document.getElementById('results');
    if (messageElem) {
      messageElem.textContent = message;
    } else {
      alert(message);
    }
  }
  
  // enable/disable betting UI
  disableBetting(disabled) {
    const chips = this.shadowRoot.querySelectorAll('.chip');
    const betButton = this.shadowRoot.querySelector('#bet-button');
    
    chips.forEach(chip => {
      if (disabled) {
        chip.classList.add('disabled');
      } else {
        chip.classList.remove('disabled');
      }
    });
    
    betButton.disabled = disabled;
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
      // play chip sound
      if (window.soundManager) {
        window.soundManager.playChip();
      }
      
      // player wins they get double their bet (original bet + winnings)
      this.money += (this.currentBet * 2);
      this.currentBet = 0;
      this.updateDisplay();
      localStorage.setItem('playerMoney', this.money);
      localStorage.setItem('currentBet', this.currentBet);
      this.showMessage('You won!');
      
      // re-enable betting
      this.disableBetting(false);
    }
  }

  // player loses their bet
  loseBet() {
    if (this.currentBet > 0) {
      // play chip sound
      if (window.soundManager) {
        window.soundManager.playChip();
      }
      
      // player loses their bet, nothing is returned
      this.currentBet = 0;
      this.updateDisplay();
      localStorage.setItem('currentBet', this.currentBet);
      
      // re-enable betting
      this.disableBetting(false);
    }
  }

  // reset the game to starting values
  resetGame() {
    this.money = 5000;
    this.currentBet = 0;
    this.updateDisplay();
    localStorage.setItem('playerMoney', this.money);
    localStorage.setItem('currentBet', this.currentBet);
    
    // re-enable betting
    this.disableBetting(false);
  }

  // load player data from localStorage
  loadFromLocalStorage() {
    if (localStorage.getItem('playerMoney')) {
      this.money = parseFloat(localStorage.getItem('playerMoney'));
    }
    
    if (localStorage.getItem('currentBet')) {
      this.currentBet = parseFloat(localStorage.getItem('currentBet'));
    }
  }
}

// register the web component so it can be used in html
customElements.define('player-bank', PlayerBank); 