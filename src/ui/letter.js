import { h, s } from '../dom.js';
import { glyphSvg } from '../glyph.js';
import { ALL_GLYPHS, LETTER } from '../data/river.js';
import { isKnown, wordLabel } from '../progress.js';
import { openOverlay } from './overlay.js';

const MAX = 7;

// The child's drawing: the child, many fish, an arrow over the river to a
// friend on the far bank.
function drawing() {
  const fish = (x, y) => s('path', { d: `M${x - 16},${y} C${x - 8},${y - 9} ${x + 8},${y - 9} ${x + 12},${y} C${x + 8},${y + 9} ${x - 8},${y + 9} ${x - 16},${y} Z M${x + 12},${y} L${x + 20},${y - 7} L${x + 20},${y + 7} Z` });
  return s('svg', { class: 'letter__drawing', viewBox: '0 0 400 200', 'aria-hidden': 'true' },
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
  const written = [];
  const body = h('div', { class: 'letter' });
  const overlay = openOverlay({ className: 'overlay--letter', label: t('letterTitle'), closeLabel: t('close'), onClose, content: body });
  let feedback = '';

  const keys = ALL_GLYPHS.filter((g) => state.seen[g]);

  function render() {
    body.replaceChildren(
      h('h2', null, t('letterTitle')),
      h('p', { class: 'muted' }, t('letterPrompt')),
      drawing(),
      h('div', { class: 'letter__line', 'data-letter-line': written.join(' ') },
        Array.from({ length: Math.max(written.length + 1, 5) }, (_, i) =>
          h('span', { class: `slot${written[i] ? ' is-filled' : ''}` }, written[i] ? glyphSvg(written[i]) : ''),
        ),
      ),
      h('div', { class: 'letter__keys' },
        keys.map((g) =>
          h('button', {
            class: 'key',
            'data-key': g,
            disabled: written.length >= MAX,
            onclick: () => { written.push(g); feedback = ''; render(); },
          }, glyphSvg(g), h('small', null, isKnown(state, g) ? wordLabel(g, state.lang) : ' ')),
        ),
      ),
      h('p', { class: 'letter__feedback', 'data-feedback': feedback ? 'wrong' : '' }, feedback),
      h('div', { class: 'letter__actions' },
        h('button', { class: 'button button--quiet', 'data-action': 'erase', disabled: !written.length, onclick: () => { written.pop(); render(); } }, t('erase')),
        h('button', {
          class: 'button',
          'data-action': 'send',
          disabled: !written.length,
          onclick: () => {
            if (written.join(' ') === LETTER.join(' ')) {
              overlay.close();
              onSubmit();
            } else {
              feedback = t('letterWrong');
              render();
            }
          },
        }, t('send')),
      ),
    );
  }

  render();
  return overlay;
}
