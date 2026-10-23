import { s } from '../dom.js';
import { seeded } from './random.js';
import { createFigure } from './figures.js';
import { W, H, flame, glow, sky, world } from './common.js';
import { lerp, tween, wait } from '../tween.js';

// The broken bridge seen from the side: the river village on the left, the
// mountain camp on the right, and the traveller in a boat under the gap.
const DECK = 600;
const GAP = [640, 960];

export const POINTS = {
  gap: { x: 800, y: DECK },
  player: { x: 800, y: 740 },
  playerTop: { x: 800, y: 700 },
};

const CAST = [
  { id: 'elder', kind: 'elder', x: 570, y: DECK, scale: 0.9, facing: 1, robe: '#6f6788', trim: '#4d4762' },
  { id: 'chief', kind: 'chief', x: 1030, y: DECK, scale: 0.9, facing: -1, robe: '#3f5d50', trim: '#2c4238' },
  { id: 'child', kind: 'child', x: 300, y: DECK, scale: 0.6, facing: 1, robe: '#c58b3a', trim: '#8f6224' },
  { id: 'fisher', kind: 'fisher', x: 190, y: DECK, scale: 0.85, facing: 1, robe: '#3f7a80', trim: '#2c5559' },
  { id: 'friend', kind: 'friend', x: 1300, y: DECK, scale: 0.6, facing: -1, robe: '#8a7f4a', trim: '#635b33' },
  { id: 'mason', kind: 'mason', x: 1420, y: DECK, scale: 0.85, facing: -1, robe: '#7d6b5a', trim: '#57493d' },
];

function banks(rand) {
  const ridge = (x0, x1, base, amp) => {
    const pts = [];
    for (let i = 0; i <= 12; i++) pts.push(`${lerp(x0, x1, i / 12).toFixed(1)},${(base - rand() * amp).toFixed(1)}`);
    return `M${x0},${DECK} L${pts.join(' L')} L${x1},${DECK} Z`;
  };
  const hut = (x) => s('g', null,
    s('path', { d: `M${x},${DECK} L${x},${DECK - 50} L${x + 34},${DECK - 82} L${x + 68},${DECK - 50} L${x + 68},${DECK} Z`, fill: '#262839' }),
    s('rect', { x: x + 26, y: DECK - 40, width: 14, height: 14, rx: 2, fill: '#e8a25c', opacity: 0.85, class: 'ember-flicker' }),
  );
  const tent = (x) => s('g', null,
    s('path', { d: `M${x},${DECK} L${x + 45},${DECK - 90} L${x + 90},${DECK} Z`, fill: '#4a3e36' }),
    s('path', { d: `M${x + 45},${DECK} L${x + 37},${DECK - 30} L${x + 53},${DECK - 30} Z`, fill: '#e8a25c', opacity: 0.75, class: 'ember-flicker' }),
  );
  return [
    s('path', { d: ridge(0, 520, 470, 60), fill: '#2f3047' }),
    s('path', { d: ridge(1080, W, 420, 140), fill: '#3c3a57' }),
    hut(30), hut(110), flame(250, DECK - 4, 8),
    tent(1460), tent(1360), flame(1250, DECK - 4, 8),
    s('path', { d: `M0,${DECK} L470,${DECK} L500,${H} L0,${H} Z`, fill: '#2b2f42' }),
    s('path', { d: `M1130,${DECK} L${W},${DECK} L${W},${H} L1100,${H} Z`, fill: '#2f2c3a' }),
  ];
}

function water(rand) {
  const shimmer = Array.from({ length: 22 }, () => {
    const x = 460 + rand() * 680;
    const y = 700 + rand() * 180;
    return s('path', { d: `M${x},${y} L${x + 20 + rand() * 50},${y}`, stroke: '#d9e6e4', 'stroke-width': 2, opacity: (0.1 + rand() * 0.25).toFixed(2), 'stroke-linecap': 'round' });
  });
  return [s('rect', { x: 0, y: 690, width: W, height: H - 690, fill: 'url(#v-river)' }), s('g', { class: 'mist' }, ...shimmer)];
}

function deck(x0, x1, color) {
  const posts = [];
  for (let x = x0 + 30; x < x1 - 10; x += 120) posts.push(`M${x},${DECK + 14} L${x},${H}`);
  return s('g', null,
    s('path', { d: posts.join(' '), stroke: '#241c16', 'stroke-width': 10 }),
    s('rect', { x: x0, y: DECK, width: x1 - x0, height: 16, fill: color }),
    s('path', { d: `M${x0},${DECK - 34} L${x1},${DECK - 34}`, stroke: '#3a2d22', 'stroke-width': 4 }),
  );
}

function boat() {
  return s('g', { class: 'player', 'aria-hidden': 'true' },
    glow(840, 712, 70, 0.55),
    s('path', { d: 'M830,760 L834,706 M826,706 L842,706 L840,720 L828,720 Z', stroke: '#e8a25c', 'stroke-width': 3, fill: '#ffd59a' }),
    s('circle', { cx: 790, cy: 712, r: 20, fill: '#151826' }),
    s('path', { d: 'M760,764 C762,738 774,728 790,728 C806,728 818,738 820,764 Z', fill: '#151826' }),
    s('path', { d: 'M700,760 L900,760 L870,792 L730,792 Z', fill: '#4a3a2e' }),
  );
}

export function buildBridgeView() {
  const rand = seeded(31);
  const figures = Object.fromEntries(CAST.map((c) => [c.id, createFigure(c)]));
  const planks = s('g', { class: 'planks' });
  const w = world({
    className: 'bridge-view',
    points: POINTS,
    figures,
    scenery: [...sky(rand, 300), ...banks(rand), ...water(rand), deck(0, GAP[0], '#5a4636'), deck(GAP[1], W, '#57524f'), planks],
    foreground: [boat()],
  });

  return {
    ...w,
    // Planks laid from both ends until they meet in the middle.
    async mend() {
      const width = 40;
      const count = (GAP[1] - GAP[0]) / width;
      for (let i = 0; i < count / 2; i++) {
        for (const x of [GAP[0] + i * width, GAP[1] - (i + 1) * width]) {
          const plank = s('rect', { x, y: DECK, width: width - 2, height: 16, fill: '#7a5f45', opacity: 0, 'data-plank': '' });
          planks.append(plank);
          tween(300, (p) => plank.setAttribute('opacity', p.toFixed(2)));
        }
        await wait(260);
      }
      planks.append(s('path', { d: `M${GAP[0]},${DECK - 34} L${GAP[1]},${DECK - 34}`, stroke: '#3a2d22', 'stroke-width': 4 }));
    },
    // The two children run to meet in the middle of the new bridge.
    async gather() {
      const move = (f, to) => {
        const from = f.x;
        return tween(1800, (p) => f.el.setAttribute('transform', `translate(${lerp(from, to, p).toFixed(1)},${f.y}) scale(${f.scale})`));
      };
      await Promise.all([move(figures.child, 770), move(figures.friend, 830), move(figures.fisher, 470), move(figures.mason, 1130)]);
    },
  };
}
