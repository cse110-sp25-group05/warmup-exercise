import assert from 'node:assert';
import fs     from 'node:fs';
import path   from 'node:path';

export async function runScriptTests () {
  console.log('• script-tests');

  const src = fs.readFileSync(path.resolve('script.js'), 'utf8');

  // grab the last (real) implementation of each helper
  const shuffleSrc = src.match(/function\s+shuffleArray[\s\S]*?\n\}/)?.[0];
  const valueSrc   = [...src.matchAll(/function\s+getValue[\s\S]*?\n\}/g)].pop()?.[0];
  if (!shuffleSrc || !valueSrc) throw new Error('helpers not found in script.js');

  // evaluate helpers in isolation
  const shuffleArray = new Function(`${shuffleSrc}; return shuffleArray;`)();
  const getValue     = new Function(`${valueSrc}; return getValue;`)();

  // stub DOM APIs the helpers touch
  globalThis.document = { getElementById: () => null };

  /* shuffleArray ----------------------------------------------------- */
  const deck = [...Array(52).keys()];
  const copy = [...deck];
  shuffleArray(deck);
  assert.deepStrictEqual([...deck].sort((a, b) => a - b), copy);
  assert.notDeepStrictEqual(deck, copy);

  /* getValue --------------------------------------------------------- */
  assert.strictEqual(getValue('1',  5), 11); // safe Ace
  assert.strictEqual(getValue('1', 15),  1); // busting Ace
  assert.strictEqual(getValue('7',  0),  7);
  ['J', 'Q', 'K', '10'].forEach(r => assert.strictEqual(getValue(r, 0), 10));

  console.log('  ✓ passed');
}
