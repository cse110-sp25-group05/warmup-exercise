import { runScriptTests } from './script-tests.mjs';
import { runBankTests   } from './player-bank-tests.mjs';
import { runDeckTests   } from './deck-tests.mjs';

(async () => {
  try {
    await runScriptTests();
    await runBankTests();
    await runDeckTests();
    console.log('\x1b[32m✓ ALL TESTS PASSED\x1b[0m');
  } catch (err) {
    console.error('\x1b[31m✗ TEST FAILURE\x1b[0m');
    console.error(err.stack || err);
    process.exit(1);
  }
})();
