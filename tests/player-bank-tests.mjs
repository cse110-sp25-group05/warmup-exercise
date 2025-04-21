// tests/player‑bank-tests.mjs
import assert        from 'node:assert';
import { JSDOM }     from 'jsdom';
import { fireEvent } from '@testing-library/dom';
import fs            from 'node:fs';
import path          from 'node:path';

/* jsdom sandbox */
const dom = new JSDOM(`<!doctype html><html><body></body></html>`, {
  url: 'http://localhost'
});
globalThis.window   = dom.window;
globalThis.document = dom.window.document;
globalThis.localStorage = dom.window.localStorage; // used by component
globalThis.alert        = () => {};               // silence alerts

/* Make shadowRoot.getElementById available */
globalThis.HTMLElement = class {
  attachShadow() {
    const root = dom.window.document.createElement('div');
    this.shadowRoot = root;
    // mirror getElementById on the shadow root
    root.getElementById = id => root.querySelector(`#${id}`);
    return root;
  }
};

/* Minimal customElements stub */
const registry = {};
globalThis.customElements = {
  define: (tag, ctor) => (registry[tag] = ctor),
  get   : tag => registry[tag],
  whenDefined: tag => Promise.resolve()
};

/* Register the component */
const src = fs.readFileSync(path.resolve('player-bank.js'), 'utf8');
new Function(src).call(globalThis);

/* Instantiate and initialize */
const PlayerBank = registry['player-bank'];
const bank = new PlayerBank();
bank.connectedCallback?.();

/* Helper to query inside the shadow root */
const $ = sel => bank.shadowRoot.querySelector(sel);

export async function runBankTests() {
  console.log('• player-bank-tests');

  assert.strictEqual($('#money-amount').textContent.trim(), '$1000.00');
  assert.strictEqual($('#bet-amount' ).textContent.trim(),  '$0.00');

  fireEvent.click($('.chip-5'));
  assert.strictEqual(bank.money,      995);
  assert.strictEqual(bank.currentBet,   5);

  bank.winBet();
  assert.strictEqual(bank.money,     1005);
  assert.strictEqual(bank.currentBet,    0);

  bank.addToBet(10);
  bank.loseBet();
  assert.strictEqual(bank.money,      995);
  assert.strictEqual(bank.currentBet,    0);

  bank.resetGame();
  assert.strictEqual(bank.money,     1000);
  assert.strictEqual(bank.currentBet,   0);

  console.log('  ✓ passed');
}
