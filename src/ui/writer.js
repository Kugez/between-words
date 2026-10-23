import { h } from '../dom.js';
import { glyphSvg } from '../glyph.js';
import { isKnown, wordLabel } from '../progress.js';
import { openOverlay } from './overlay.js';

const MAX = 8;

// A writing pad: the player builds a sentence from glyph keys and hands it over.
// After two wrong tries the first hint appears, after three the second.
export function openWriter({ state, t, title, prompt, source, keys, answer, hints = [], sendLabel, onSolved, onClose }) {
  const written = [];
  let misses = 0;
  let feedback = '';
  const body = h('div', { class: 'writer' });
  const overlay = openOverlay({ className: 'overlay--writer', label: title, closeLabel: t('close'), onClose, content: body });

  function submit() {
    if (written.join(' ') === answer.join(' ')) {
      overlay.close();
      onSolved();
      return;
    }
    misses += 1;
    feedback = t('writerWrong');
    render();
  }

  function render() {
    const shownHints = hints.slice(0, Math.max(0, misses - 1));
    body.replaceChildren(
      h('h2', null, title),
      h('p', { class: 'muted' }, prompt),
      source,
      h('div', { class: 'writer__line', 'data-written': written.join(' ') },
        Array.from({ length: Math.max(written.length + 1, 4) }, (_, i) =>
          h('span', { class: `slot${written[i] ? ' is-filled' : ''}` }, written[i] ? glyphSvg(written[i]) : ''),
        ),
      ),
      h('div', { class: 'writer__keys' },
        keys.map((g) =>
          h('button', {
            class: 'key',
            'data-key': g,
            disabled: written.length >= MAX,
            onclick: () => { written.push(g); feedback = ''; render(); },
          }, glyphSvg(g), h('small', null, isKnown(state, g) ? wordLabel(g, state.lang) : ' ')),
        ),
      ),
      h('p', { class: 'writer__feedback', 'data-feedback': feedback ? 'wrong' : '' }, feedback),
      ...(shownHints.length ? [h('ul', { class: 'writer__hints' }, shownHints.map((hint) => h('li', null, hint)))] : []),
      h('div', { class: 'writer__actions' },
        h('button', { class: 'button button--quiet', 'data-action': 'erase', disabled: !written.length, onclick: () => { written.pop(); render(); } }, t('erase')),
        h('button', { class: 'button', 'data-action': 'send', disabled: !written.length, onclick: submit }, sendLabel || t('send')),
      ),
    );
  }

  render();
  return overlay;
}
