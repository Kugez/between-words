import { detectLanguage, translator } from './i18n.js';
import { freshState, loadState, saveState } from './state.js';
import { titleScene } from './scenes/title.js';
import { arrivalScene } from './scenes/arrival.js';

const SCENES = {
  title: titleScene,
  arrival: arrivalScene,
};

const app = document.getElementById('app');
let state = loadState(detectLanguage());

function render(name) {
  const scene = SCENES[name] || SCENES.title;
  const t = translator(state.lang);
  document.documentElement.lang = state.lang;
  document.title = t('title');

  const next = scene({ t, state, go, toggleLanguage });
  // Fade out whatever is on screen; a quick double click can leave several.
  for (const previous of app.querySelectorAll('.scene:not(.scene--leaving)')) {
    previous.classList.add('scene--leaving');
    previous.setAttribute('aria-hidden', 'true');
    previous.addEventListener('animationend', () => previous.remove(), { once: true });
    // Fallback in case animations are disabled.
    setTimeout(() => previous.remove(), 700);
  }
  app.querySelector('noscript')?.remove();
  app.append(next);
  (next.querySelector('.panel button') || next.querySelector('button'))?.focus({ preventScroll: true });
}

function go(name, { reset = false } = {}) {
  if (reset) state = freshState(state.lang);
  if (name !== 'title') {
    state.started = true;
    state.scene = name;
  }
  saveState(state);
  render(name);
}

function toggleLanguage() {
  state.lang = state.lang === 'fi' ? 'en' : 'fi';
  saveState(state);
  render('title');
}

render('title');
