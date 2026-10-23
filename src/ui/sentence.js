import { h } from '../dom.js';
import { glyphSvg } from '../glyph.js';
import { isKnown, wordLabel } from '../progress.js';

// A row of glyphs with translations under the ones the player has confirmed.
export function sentenceRow(state, glyphs, { highlight } = {}) {
  return h('div', { class: 'sentence' },
    glyphs.map((g) =>
      h('span', { class: `sentence__word${g === highlight ? ' is-highlight' : ''}` },
        glyphSvg(g),
        h('small', null, isKnown(state, g) ? wordLabel(g, state.lang) : ' '),
      ),
    ),
  );
}
