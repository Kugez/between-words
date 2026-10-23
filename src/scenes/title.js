import { h } from '../dom.js';
import { valleyBackdrop } from '../art/valley.js';

export function titleScene({ t, state, go, toggleLanguage }) {
  return h('section', { class: 'scene', 'data-scene': 'title' },
    valleyBackdrop(),
    h('div', { class: 'corner' },
      h('button', { class: 'button button--quiet', 'data-action': 'language', onclick: toggleLanguage }, t('language')),
    ),
    h('div', { class: 'panel' },
      h('h1', { class: 'title' }, t('title')),
      h('p', { class: 'subtitle' }, t('subtitle')),
      h('div', { class: 'menu' },
        state.started &&
          h('button', { class: 'button', 'data-action': 'continue', onclick: () => go(state.scene === 'title' ? 'arrival' : state.scene) }, t('continueGame')),
        h('button', { class: 'button', 'data-action': 'new-game', onclick: () => go('arrival', { reset: true }) }, t('newGame')),
      ),
    ),
  );
}
