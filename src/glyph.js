import { s } from './dom.js';
import { GLYPHS } from './data/river.js';

// A glyph as its own <svg>, usable in HTML or nested inside the scene.
export function glyphSvg(id, props = {}) {
  return s('svg', { viewBox: '0 0 100 100', class: 'glyph', 'data-glyph': id, ...props },
    s('path', {
      d: GLYPHS[id],
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 7,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }),
  );
}
