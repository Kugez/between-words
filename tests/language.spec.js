import { test, expect } from '@playwright/test';
import * as river from '../src/data/river.js';
import * as mountain from '../src/data/mountain.js';

// A glyph can only be learned if it is heard apart from the other glyphs on
// its notebook page. If two always appear together, the player cannot tell
// which one means what.
for (const lang of [river, mountain]) {
  const sentences = Object.values(lang.DIALOGUES).flat().map((line) => line.say);
  for (const page of lang.PAGES) {
    test(`page ${page.id} glyphs can be told apart`, () => {
      for (const a of page.glyphs) {
        for (const b of page.glyphs) {
          if (a === b) continue;
          const apart = sentences.some((say) => say.includes(a) && !say.includes(b));
          expect(apart, `${a} is never heard without ${b}`).toBe(true);
        }
      }
    });
  }
}
