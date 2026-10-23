import { PAGES, WORDS, glyphsOf, meaningOf } from './data/language.js';

// Rules about what the player knows, shared by the scenes, notebook and writing pad.

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

export function allSeen(state, script = 'river') {
  return glyphsOf(script).every((g) => state.seen[g]);
}

// Notebook pages the player can open: the mountain pages appear after the crossing.
export function openPages(state) {
  return PAGES.filter((p) => p.script === 'river' || state.chapter >= 2);
}

// 'confirmed', 'wrong' (all filled in but something is off) or 'open'.
export function checkPage(state, page) {
  if (state.confirmed[page.id]) return 'confirmed';
  const filled = page.glyphs.every((g) => state.seen[g] && state.guesses[g]);
  if (!filled) return 'open';
  if (page.glyphs.every((g) => state.guesses[g] === meaningOf(g))) {
    state.confirmed[page.id] = true;
    return 'confirmed';
  }
  return 'wrong';
}

// How many filled-in guesses on a page are right, and the first one that is not.
export function pageScore(state, page) {
  const right = page.glyphs.filter((g) => state.guesses[g] === meaningOf(g));
  const off = page.glyphs.find((g) => state.guesses[g] && state.guesses[g] !== meaningOf(g));
  return { right: right.length, total: page.glyphs.length, off };
}

// Label for a word id or a glyph id.
export function wordLabel(id, lang) {
  const word = WORDS[meaningOf(id)];
  return word?.[lang] ?? word?.en ?? id;
}
