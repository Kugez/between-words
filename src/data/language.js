import * as river from './river.js';
import * as mountain from './mountain.js';

export { WORDS } from './words.js';

export const GLYPHS = { ...river.GLYPHS, ...mountain.GLYPHS };

export const PAGES = [
  ...river.PAGES.map((p) => ({ ...p, script: 'river' })),
  ...mountain.PAGES.map((p) => ({ ...p, script: 'mountain' })),
];

export const SCRIPTS = ['river', 'mountain'];

export const scriptOf = (glyph) => (glyph.startsWith('m_') ? 'mountain' : 'river');

// The word a glyph means; word ids pass through unchanged.
export const meaningOf = (id) => (id.startsWith('m_') ? id.slice(2) : id);

export const glyphsOf = (script) => PAGES.filter((p) => p.script === script).flatMap((p) => p.glyphs);
