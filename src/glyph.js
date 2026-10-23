import { s } from './dom.js';
import { GLYPHS, scriptOf } from './data/language.js';

// The river people write with a round brush, the mountain people carve with a chisel.
const PEN = {
  river: { 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
  mountain: { 'stroke-linecap': 'square', 'stroke-linejoin': 'miter' },
};

// A glyph as its own <svg>, usable in HTML or nested inside the scene.
export function glyphSvg(id, props = {}) {
  return s('svg', { viewBox: '0 0 100 100', class: 'glyph', 'data-glyph': id, ...props },
    s('path', {
      d: GLYPHS[id],
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 7,
      ...PEN[scriptOf(id)],
    }),
  );
}
