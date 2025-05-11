import assert  from 'node:assert';
import { JSDOM } from 'jsdom';
import fs      from 'node:fs';
import path    from 'node:path';

export async function runDeckTests () {
  console.log('• deck-tests');

  const html  = fs.readFileSync(path.resolve('deck.html'), 'utf8');
  const dom   = new JSDOM(html);
  const cards = dom.window.document.querySelectorAll('.card');

  assert.strictEqual(cards.length, 52, 'deck must have 52 cards');

  cards.forEach(card => {
    assert.ok(card.querySelector('.card-front-red, .card-front-black'));
    assert.ok(card.querySelector('.card-back'));
  });

  console.log('  ✓ passed');
}
