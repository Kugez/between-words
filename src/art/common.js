import { s } from '../dom.js';

// Shared pieces of the code-drawn world. Every scene is a 1600x900 view.
export const W = 1600;
export const H = 900;

export function defs() {
  return s('defs', null,
    s('linearGradient', { id: 'v-sky', x1: 0, y1: 0, x2: 0, y2: 1 },
      s('stop', { offset: '0', 'stop-color': '#121827' }),
      s('stop', { offset: '1', 'stop-color': '#45405f' }),
    ),
    s('linearGradient', { id: 'v-river', x1: 0, y1: 0, x2: 0, y2: 1 },
      s('stop', { offset: '0', 'stop-color': '#5f8f98' }),
      s('stop', { offset: '1', 'stop-color': '#2b4b56' }),
    ),
    s('radialGradient', { id: 'v-glow' },
      s('stop', { offset: '0', 'stop-color': '#e8a25c', 'stop-opacity': '0.75' }),
      s('stop', { offset: '1', 'stop-color': '#e8a25c', 'stop-opacity': '0' }),
    ),
  );
}

export function sky(rand, height = 240) {
  return [
    s('rect', { width: W, height: H, fill: 'url(#v-sky)' }),
    ...Array.from({ length: 70 }, () => s('circle', {
      cx: (rand() * W).toFixed(1), cy: (rand() * height).toFixed(1), r: (rand() * 1.3 + 0.3).toFixed(2), fill: '#f3ead8', opacity: (rand() * 0.5 + 0.2).toFixed(2),
    })),
  ];
}

export function glow(x, y, r, opacity = 0.7) {
  return s('circle', { cx: x, cy: y, r, fill: 'url(#v-glow)', opacity });
}

export function flame(x, y, size) {
  return s('g', { class: 'ember-flicker' },
    glow(x, y - size, size * 4),
    s('path', { d: `M${x - size},${y} C${x - size},${y - size * 1.4} ${x},${y - size * 1.6} ${x},${y - size * 2.6} C${x + size * 0.4},${y - size * 1.6} ${x + size},${y - size * 1.4} ${x + size},${y} Z`, fill: '#f0b25e' }),
    s('path', { d: `M${x - size * 0.5},${y} C${x - size * 0.5},${y - size * 0.8} ${x},${y - size} ${x},${y - size * 1.6} C${x + size * 0.2},${y - size} ${x + size * 0.5},${y - size * 0.8} ${x + size * 0.5},${y} Z`, fill: '#ffe2a8' }),
  );
}

export function river(rand, top = 430, height = 140) {
  const shimmer = Array.from({ length: 26 }, () => {
    const x = rand() * W;
    const y = top + 15 + rand() * (height - 30);
    const w = 20 + rand() * 60;
    return s('path', { d: `M${x},${y} L${x + w},${y}`, stroke: '#d9e6e4', 'stroke-width': 2, opacity: (0.1 + rand() * 0.25).toFixed(2), 'stroke-linecap': 'round' });
  });
  return [
    s('rect', { x: 0, y: top, width: W, height, fill: 'url(#v-river)' }),
    s('g', { class: 'mist' }, ...shimmer),
  ];
}

// The traveller seen from behind, holding a lantern.
export function playerFigure(x = 700) {
  return s('g', { class: 'player', 'aria-hidden': 'true' },
    s('g', { class: 'player__glow' }, glow(x + 100, 838, 70, 0.5)),
    s('path', { d: `M${x + 90},900 L${x + 96},836 M${x + 90},836 L${x + 106},836 L${x + 104},852 L${x + 92},852 Z`, stroke: '#e8a25c', 'stroke-width': 3, fill: '#ffd59a' }),
    s('path', { d: `M${x - 90},900 C${x - 88},860 ${x - 60},836 ${x},834 C${x + 60},836 ${x + 88},860 ${x + 90},900 Z`, fill: '#151826' }),
    s('circle', { cx: x, cy: 812, r: 34, fill: '#151826' }),
  );
}

// Fill wide screens edge to edge; on narrow ones show the whole view.
function fit() {
  return window.innerWidth / window.innerHeight > 1.5 ? 'xMidYMid slice' : 'xMidYMid meet';
}

// Wraps a scene's drawing with the layers every talking scene needs:
// figures, then held and thrown items, then the player, then speech bubbles.
export function world({ className, scenery, figures, foreground = [], points }) {
  const svg = s('svg', {
    class: `backdrop ${className}`,
    viewBox: `0 0 ${W} ${H}`,
    preserveAspectRatio: fit(),
    role: 'img',
  },
    defs(),
    ...scenery,
    ...Object.values(figures).map((f) => f.el),
    s('g', { class: 'items' }),
    ...foreground,
    s('g', { class: 'bubbles' }),
  );

  const onResize = () => {
    if (!svg.isConnected) return window.removeEventListener('resize', onResize);
    svg.setAttribute('preserveAspectRatio', fit());
  };
  window.addEventListener('resize', onResize);

  return { svg, figures, points, items: svg.querySelector('.items'), bubbles: svg.querySelector('.bubbles') };
}
