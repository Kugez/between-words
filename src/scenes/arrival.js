import { h } from '../dom.js';
import { valleyBackdrop } from '../art/valley.js';

// Placeholder opening scene; the first playable area replaces it in the next stage.
export function arrivalScene({ t, go }) {
  return h('section', { class: 'scene', 'data-scene': 'arrival' },
    valleyBackdrop(),
    h('div', { class: 'panel' },
      h('p', { class: 'text' }, t('arrival')),
      h('button', { class: 'button button--quiet', 'data-action': 'back', onclick: () => go('title') }, t('back')),
    ),
  );
}
