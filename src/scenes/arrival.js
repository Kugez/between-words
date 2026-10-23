import { h } from '../dom.js';
import { valleyBackdrop } from '../art/valley.js';

export function arrivalScene({ t, go }) {
  return h('section', { class: 'scene', 'data-scene': 'arrival' },
    valleyBackdrop(),
    h('div', { class: 'panel' },
      h('p', { class: 'text' }, t('arrival')),
      h('button', { class: 'button', 'data-action': 'enter-village', onclick: () => go('village') }, t('enterVillage')),
    ),
  );
}
