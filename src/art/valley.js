import { s } from '../dom.js';
import { seeded } from './random.js';

const W = 1600;
const H = 900;

// A ridge line across the whole width, closed down to the bottom edge.
function ridge(rand, baseY, amplitude, steps) {
  const points = [];
  let y = baseY;
  for (let i = 0; i <= steps; i++) {
    y += (rand() - 0.5) * amplitude;
    y = Math.max(baseY - amplitude * 1.5, Math.min(baseY + amplitude * 1.5, y));
    points.push(`${((i / steps) * W).toFixed(1)},${y.toFixed(1)}`);
  }
  return `M0,${H} L${points.join(' L')} L${W},${H} Z`;
}

function fire(x, y) {
  return s('g', { class: 'ember-flicker' },
    s('circle', { cx: x, cy: y, r: 60, fill: 'url(#glow)' }),
    s('circle', { cx: x, cy: y, r: 4, fill: '#ffd59a' }),
  );
}

// The opening view: night valley, a river, fires on both banks and the fallen bridge.
export function valleyBackdrop() {
  const rand = seeded(7);

  const stars = Array.from({ length: 140 }, () =>
    s('circle', {
      cx: (rand() * W).toFixed(1),
      cy: (rand() * H * 0.55).toFixed(1),
      r: (rand() * 1.4 + 0.3).toFixed(2),
      fill: '#f3ead8',
      opacity: (rand() * 0.6 + 0.2).toFixed(2),
    }),
  );

  return s('svg', {
    class: 'backdrop',
    viewBox: `0 0 ${W} ${H}`,
    preserveAspectRatio: 'xMidYMid slice',
    'aria-hidden': 'true',
  },
    s('defs', null,
      s('linearGradient', { id: 'sky', x1: 0, y1: 0, x2: 0, y2: 1 },
        s('stop', { offset: '0', 'stop-color': '#121827' }),
        s('stop', { offset: '0.6', 'stop-color': '#3b3f5c' }),
        s('stop', { offset: '1', 'stop-color': '#7a5d6b' }),
      ),
      s('radialGradient', { id: 'glow' },
        s('stop', { offset: '0', 'stop-color': '#e8a25c', 'stop-opacity': '0.8' }),
        s('stop', { offset: '1', 'stop-color': '#e8a25c', 'stop-opacity': '0' }),
      ),
      s('radialGradient', { id: 'mist' },
        s('stop', { offset: '0', 'stop-color': '#f3ead8', 'stop-opacity': '1' }),
        s('stop', { offset: '1', 'stop-color': '#f3ead8', 'stop-opacity': '0' }),
      ),
      s('linearGradient', { id: 'river', x1: 0, y1: 0, x2: 0, y2: 1 },
        s('stop', { offset: '0', 'stop-color': '#9fc6c9' }),
        s('stop', { offset: '1', 'stop-color': '#2f5560' }),
      ),
    ),
    s('rect', { width: W, height: H, fill: 'url(#sky)' }),
    ...stars,
    s('circle', { cx: 1240, cy: 170, r: 46, fill: '#f3ead8', opacity: 0.9 }),
    s('path', { d: ridge(rand, 470, 70, 24), fill: '#4a4866' }),
    s('path', { d: ridge(rand, 560, 50, 32), fill: '#36364f' }),
    s('ellipse', { class: 'mist mist--slow', cx: 800, cy: 600, rx: 1000, ry: 70, fill: 'url(#mist)', opacity: 0.12 }),
    s('path', { d: ridge(rand, 650, 30, 40), fill: '#262a3d' }),
    // River winding from the mountains towards the viewer.
    s('path', {
      d: 'M786,668 C770,690 860,710 830,760 C800,820 870,870 920,900 L690,900 C650,860 650,820 700,780 C760,730 720,700 780,668 Z',
      fill: 'url(#river)',
      opacity: 0.85,
    }),
    // Fallen bridge: two stubs reaching across, the gap between them.
    s('path', { d: 'M560,742 L700,742 L712,750 L560,750 Z', fill: '#1a1d2b' }),
    s('path', { d: 'M862,742 L1040,742 L1040,750 L874,750 Z', fill: '#1a1d2b' }),
    s('path', { d: 'M706,748 L720,790 M868,748 L850,786', stroke: '#1a1d2b', 'stroke-width': 5 }),
    fire(470, 720),
    fire(1130, 715),
    s('ellipse', { class: 'mist', cx: 800, cy: 790, rx: 900, ry: 60, fill: 'url(#mist)', opacity: 0.12 }),
  );
}
