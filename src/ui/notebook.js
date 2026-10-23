import { h } from '../dom.js';
import { glyphSvg } from '../glyph.js';
import { SCRIPTS, WORDS, meaningOf } from '../data/language.js';
import { checkPage, openPages, pageOf, pageScore, wordLabel } from '../progress.js';
import { sentenceRow } from './sentence.js';
import { openOverlay } from './overlay.js';

export function openNotebook({ state, t, focus, save, replay, onClose }) {
  const pages = openPages(state);
  let page = (focus && pageOf(focus)) || pages.find((p) => !state.confirmed[p.id]) || pages[0];
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
    if (result === 'wrong') state.pageMisses[page.id] = (state.pageMisses[page.id] || 0) + 1;
    message = result === 'confirmed' ? t('pageConfirmed') : result === 'wrong' ? wrongMessage() : '';
    save();
    render(result === 'confirmed');
  }

  // Wrong tries earn help: first how many are right, then which glyph is off.
  function misses() {
    return state.pageMisses[page.id] || 0;
  }

  function wrongMessage() {
    const { right, total } = pageScore(state, page);
    if (misses() >= 4) return t('pageOff');
    if (misses() >= 2) return `${t('pageWrong')} ${t('pageScore').replace('{n}', right).replace('{total}', total)}`;
    return t('pageWrong');
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
      words.map((w) => h('option', { value: w, selected: (known ? meaningOf(glyph) : state.guesses[glyph]) === w }, wordLabel(w, state.lang))),
    );
    const off = !known && misses() >= 4 && message && pageScore(state, page).off === glyph;
    return h('div', { class: `card${known ? ' is-known' : ''}${selected === glyph ? ' is-selected' : ''}${off ? ' is-off' : ''}`, 'data-card': glyph },
      h('button', { class: 'card__glyph', 'aria-label': t('showSentences'), onclick: () => { selected = glyph; render(); } }, glyphSvg(glyph)),
      select,
    );
  }

  // A heard sentence, with a button to watch it again when the scene allows.
  function seenRow(glyphs) {
    const again = replay?.(glyphs, selected);
    return h('div', { class: 'seen' },
      sentenceRow(state, glyphs, { highlight: selected }),
      again && h('button', { class: 'seen__replay', 'data-action': 'replay', 'aria-label': t('watchAgain'), title: t('watchAgain'), onclick: again }, '▶'),
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
        SCRIPTS.filter((script) => pages.some((p) => p.script === script)).map((script) =>
          h('div', { class: `notebook__script notebook__script--${script}` },
            h('span', { class: 'notebook__script-name' }, t(`script_${script}`)),
            pages.filter((p) => p.script === script).map((p) =>
              h('button', {
                class: `tab${p === page ? ' is-active' : ''}${state.confirmed[p.id] ? ' is-known' : ''}`,
                'data-page': p.id,
                onclick: () => { page = p; message = ''; render(); },
              }, p.id),
            ),
          ),
        ),
      ),
      h('div', { class: `notebook__cards${celebrate ? ' celebrate' : ''}` }, page.glyphs.map(card)),
      h('p', { class: `notebook__status${confirmed ? ' is-known' : ''}`, 'data-status': confirmed ? 'confirmed' : message ? 'wrong' : 'open' },
        message || (confirmed ? t('pageConfirmed') : t('pageHint'))),
      h('section', { class: 'notebook__seen' },
        selected
          ? [h('h3', null, t('seenIn')), ...sentences.map((g) => seenRow(g))]
          : h('p', { class: 'muted' }, t('pickGlyph')),
      ),
    );
  }

  render();
  return overlay;
}
