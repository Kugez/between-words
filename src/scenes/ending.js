import { h } from '../dom.js';
import { valleyBackdrop } from '../art/valley.js';
import { glyphSvg } from '../glyph.js';

// The reply from the far bank, in a script the player has never seen.
const REPLY = ['m_haluta', 'm_mina', 'm_kala'];

function textScene(id, content, backdrop = {}) {
  return h('section', { class: 'scene', 'data-scene': id }, valleyBackdrop(backdrop), h('div', { class: 'panel' }, ...content));
}

export function endingScene({ t, go }) {
  return textScene('ending', [
    h('p', { class: 'text' }, t('ending')),
    h('div', { class: 'reply', 'aria-hidden': 'true' }, REPLY.map((g) => glyphSvg(g))),
    h('p', { class: 'subtitle' }, t('endOfChapter1')),
    h('button', { class: 'button', 'data-action': 'continue-journey', onclick: () => go('crossing') }, t('continueJourney')),
  ]);
}

export function crossingScene({ t, state, go, save }) {
  if (state.chapter < 2) {
    state.chapter = 2;
    save();
  }
  return textScene('crossing', [
    h('p', { class: 'text' }, t('crossing')),
    h('button', { class: 'button', 'data-action': 'enter-camp', onclick: () => go('camp') }, t('enterCamp')),
  ]);
}

export function finaleScene({ t, go }) {
  return textScene('finale', [
    h('p', { class: 'text' }, t('finale')),
    h('div', { class: 'reply', 'aria-hidden': 'true' }, glyphSvg('silta'), glyphSvg('m_silta')),
    h('p', { class: 'subtitle' }, t('thanks')),
    h('button', { class: 'button', 'data-action': 'to-title', onclick: () => go('title') }, t('back')),
  ], { mended: true });
}
