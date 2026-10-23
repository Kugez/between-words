import { s } from '../dom.js';
import { LETTER } from '../data/river.js';
import { glyphsOf } from '../data/language.js';
import { openWriter } from './writer.js';

// The child's drawing: the child, many fish, an arrow over the river to a
// friend on the far bank.
function drawing() {
  const fish = (x, y) => s('path', { d: `M${x - 16},${y} C${x - 8},${y - 9} ${x + 8},${y - 9} ${x + 12},${y} C${x + 8},${y + 9} ${x - 8},${y + 9} ${x - 16},${y} Z M${x + 12},${y} L${x + 20},${y - 7} L${x + 20},${y + 7} Z` });
  return s('svg', { class: 'writer__drawing', viewBox: '0 0 400 200', 'aria-hidden': 'true' },
    s('rect', { x: 4, y: 4, width: 392, height: 192, rx: 6, fill: '#efe6d2' }),
    s('g', { fill: 'none', stroke: '#5a4636', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
      // The child, with the tuft of hair.
      s('circle', { cx: 60, cy: 92, r: 14 }),
      s('path', { d: 'M56,78 C60,68 68,70 70,76 M60,106 L60,146 M60,118 L44,132 M60,118 L80,110 M60,146 L48,168 M60,146 L72,168' }),
      // The friend across the water, with a pointed hat.
      s('circle', { cx: 340, cy: 92, r: 14 }),
      s('path', { d: 'M322,80 L340,54 L358,80 Z M340,106 L340,146 M340,118 L322,110 M340,118 L356,132 M340,146 L328,168 M340,146 L352,168' }),
      s('path', { d: 'M236,60 C244,90 228,120 240,180 M262,60 C270,90 254,120 266,180', stroke: '#5f8f98' }),
      s('path', { d: 'M96,128 L300,128 M286,116 L300,128 L286,140' }),
    ),
    s('g', { fill: '#5a4636' }, fish(150, 96), fish(196, 84), fish(196, 108)),
  );
}

export function openLetter({ state, t, onSubmit, onClose }) {
  return openWriter({
    state,
    t,
    title: t('letterTitle'),
    prompt: t('letterPrompt'),
    source: drawing(),
    keys: glyphsOf('river').filter((g) => state.seen[g]),
    answer: LETTER,
    hints: [t('letterHint1'), t('letterHint2')],
    onSolved: onSubmit,
    onClose,
  });
}
