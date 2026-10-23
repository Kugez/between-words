import { ALL_GLYPHS, PAGES, WORDS } from './data/river.js';

// Rules about what the player knows, shared by the scene, notebook and letter.

export function recordSentence(state, glyphs) {
  for (const g of glyphs) state.seen[g] = true;
  const key = glyphs.join(' ');
  if (!state.sentences.includes(key)) state.sentences.push(key);
}

export function pageOf(glyph) {
  return PAGES.find((p) => p.glyphs.includes(glyph));
}

export function isKnown(state, glyph) {
  return !!state.confirmed[pageOf(glyph)?.id];
}

export function allSeen(state) {
  return ALL_GLYPHS.every((g) => state.seen[g]);
}

// 'confirmed', 'wrong' (all filled in but something is off) or 'open'.
export function checkPage(state, page) {
  if (state.confirmed[page.id]) return 'confirmed';
  const filled = page.glyphs.every((g) => state.seen[g] && state.guesses[g]);
  if (!filled) return 'open';
  if (page.glyphs.every((g) => state.guesses[g] === g)) {
    state.confirmed[page.id] = true;
    return 'confirmed';
  }
  return 'wrong';
}

export function wordLabel(id, lang) {
  return WORDS[id]?.[lang] ?? WORDS[id]?.en ?? id;
}
