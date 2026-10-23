// Progress is kept in localStorage. Storage can be unavailable (private
// browsing, blocked site data), so every access is guarded and the game
// keeps working in memory.
const KEY = 'between-words/save';
const VERSION = 2;

export function freshState(lang) {
  return {
    version: VERSION,
    lang,
    scene: 'title',
    started: false,
    seen: {},
    sentences: [],
    guesses: {},
    confirmed: {},
    pageMisses: {},
    talked: {},
    letterDone: false,
    chapter: 1,
    bridgeRound: 0,
    finished: false,
  };
}

export function loadState(fallbackLang) {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    // Fields added after a save was written get their defaults.
    if (saved && saved.version === VERSION) return { ...freshState(fallbackLang), ...saved };
  } catch {
    // Ignore unreadable or missing saves.
  }
  return freshState(fallbackLang);
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Saving is best effort.
  }
}
