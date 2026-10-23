import { h } from '../dom.js';
import { glyphSvg } from '../glyph.js';
import { PAGES, WORDS } from '../data/river.js';
import { checkPage, pageOf, wordLabel } from '../progress.js';
import { sentenceRow } from './sentence.js';
import { openOverlay } from './overlay.js';

export function openNotebook({ state, t, focus, save, onClose }) {
  let page = (focus && pageOf(focus)) || PAGES.find((p) => !state.confirmed[p.id]) || PAGES[0];
  let selected = focus && state.seen[focus] ? focus : null;
  let message = '';

  const body = h('div', { class: 'notebook' });
  const overlay = openOverlay({
    className: 'overlay--notebook',
    label: t('notebook'),
    closeLabel: t('close'),
    onClose,
    content: body,
  });

  const words = Object.keys(WORDS).sort((a, b) => wordLabel(a, state.lang).localeCompare(wordLabel(b, state.lang), state.lang));

  function choose(glyph, word) {
    if (word) state.guesses[glyph] = word;
    else delete state.guesses[glyph];
    const result = checkPage(state, page);
    message = result === 'confirmed' ? t('pageConfirmed') : result === 'wrong' ? t('pageWrong') : '';
    save();
    render(result === 'confirmed');
  }

  function card(glyph) {
    const known = !!state.confirmed[page.id];
    if (!state.seen[glyph]) {
      return h('div', { class: 'card card--unseen', 'data-card': glyph }, h('span', { class: 'card__unknown' }, '?'), h('small', null, t('notSeen')));
    }
    const select = h('select', {
      class: 'card__select',
      'data-guess': glyph,
      'aria-label': t('meaningOf'),
      disabled: known,
      onchange: (e) => choose(glyph, e.target.value),
    },
      h('option', { value: '' }, '—'),
      words.map((w) => h('option', { value: w, selected: state.guesses[glyph] === w }, wordLabel(w, state.lang))),
    );
    return h('div', { class: `card${known ? ' is-known' : ''}${selected === glyph ? ' is-selected' : ''}`, 'data-card': glyph },
      h('button', { class: 'card__glyph', 'aria-label': t('showSentences'), onclick: () => { selected = glyph; render(); } }, glyphSvg(glyph)),
      select,
    );
  }

  function render(celebrate = false) {
    const confirmed = !!state.confirmed[page.id];
    const sentences = selected
      ? state.sentences.map((s) => s.split(' ')).filter((g) => g.includes(selected)).slice(-6)
      : [];
    body.replaceChildren(
      h('h2', { class: 'notebook__title' }, t('notebook')),
      h('nav', { class: 'notebook__tabs' },
        PAGES.map((p) =>
          h('button', {
            class: `tab${p === page ? ' is-active' : ''}${state.confirmed[p.id] ? ' is-known' : ''}`,
            'data-page': p.id,
            onclick: () => { page = p; message = ''; render(); },
          }, p.id),
        ),
      ),
      h('div', { class: `notebook__cards${celebrate ? ' celebrate' : ''}` }, page.glyphs.map(card)),
      h('p', { class: `notebook__status${confirmed ? ' is-known' : ''}`, 'data-status': confirmed ? 'confirmed' : message ? 'wrong' : 'open' },
        message || (confirmed ? t('pageConfirmed') : t('pageHint'))),
      h('section', { class: 'notebook__seen' },
        selected
          ? [h('h3', null, t('seenIn')), ...sentences.map((g) => sentenceRow(state, g, { highlight: selected }))]
          : h('p', { class: 'muted' }, t('pickGlyph')),
      ),
    );
  }

  render();
  return overlay;
}
