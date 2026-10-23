import { h, s } from '../dom.js';
import { valleyBackdrop } from '../art/valley.js';

// Angular strokes of a script the player has never seen: the mountain people's.
const REPLY = [
  'M20 80 L50 20 L80 80 M35 55 L65 55',
  'M25 25 L75 25 L50 80 Z',
  'M20 50 L50 20 L80 50 L50 80 Z M50 20 L50 80',
];

export function endingScene({ t, go }) {
  return h('section', { class: 'scene', 'data-scene': 'ending' },
    valleyBackdrop(),
    h('div', { class: 'panel' },
      h('p', { class: 'text' }, t('ending')),
      h('div', { class: 'reply', 'aria-hidden': 'true' },
        REPLY.map((d) => s('svg', { viewBox: '0 0 100 100', class: 'glyph' },
          s('path', { d, fill: 'none', stroke: 'currentColor', 'stroke-width': 7, 'stroke-linejoin': 'miter', 'stroke-linecap': 'square' }),
        )),
      ),
      h('p', { class: 'subtitle' }, t('endOfSlice')),
      h('button', { class: 'button', 'data-action': 'to-title', onclick: () => go('title') }, t('back')),
    ),
  );
}
