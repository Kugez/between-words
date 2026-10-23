import { s } from '../dom.js';
import { seeded } from './random.js';
import { createFigure } from './figures.js';
import { W, H, flame, glow, playerFigure, river, sky, world } from './common.js';

// The mountain people's camp on the far bank, looking back at the river village.
export const POINTS = {
  pile: { x: 250, y: 712 },
  wall: { x: 200, y: 640 },
  forge: { x: 520, y: 690 },
  farfires: { x: 800, y: 415 },
  river: { x: 700, y: 505 },
  bridge: { x: 1430, y: 530 },
  player: { x: 700, y: 850 },
};

const CAST = [
  { id: 'mason', kind: 'mason', x: 390, y: 790, facing: -1, robe: '#7d6b5a', trim: '#57493d' },
  { id: 'smith', kind: 'smith', x: 660, y: 785, facing: -1, robe: '#4f5466', trim: '#363a47' },
  { id: 'friend', kind: 'friend', x: 860, y: 800, scale: 0.66, facing: -1, robe: '#8a7f4a', trim: '#635b33' },
  { id: 'chief', kind: 'chief', x: 1230, y: 780, facing: 1, robe: '#3f5d50', trim: '#2c4238' },
];

function villageAcross(rand) {
  const ridge = [];
  for (let i = 0; i <= 32; i++) ridge.push(`${(i / 32) * W},${(418 + (rand() - 0.5) * 12).toFixed(1)}`);
  const huts = [120, 300, 520, 690, 940, 1120, 1290].map((x) => s('g', null,
    s('path', { d: `M${x},428 L${x},410 L${x + 14},398 L${x + 28},410 L${x + 28},428 Z`, fill: '#1e2131' }),
    s('rect', { x: x + 11, y: 413, width: 6, height: 6, fill: '#e8a25c', opacity: 0.9 }),
  ));
  return [
    s('path', { d: `M0,440 L${ridge.join(' L')} L${W},440 Z`, fill: '#262839' }),
    ...huts,
    ...[220, 610, 820, 1020, 1210].map((x) => flame(x, 426, 4)),
  ];
}

function ground() {
  return [
    s('path', { d: `M0,572 L120,560 L260,578 L420,562 L600,580 L780,566 L980,582 L1160,560 L1340,576 L${W},562 L${W},${H} L0,${H} Z`, fill: '#2f2c3a' }),
    s('path', { d: `M0,650 L300,636 L620,654 L980,638 L1300,652 L${W},640 L${W},${H} L0,${H} Z`, fill: '#37333f' }),
    s('path', { d: 'M1000,860 L1040,820 L1100,830 L1120,870 Z M90,880 L120,850 L170,860 L160,890 Z', fill: '#2a2733' }),
  ];
}

function tents() {
  const tent = (x, w, h, shade) => s('g', null,
    s('path', { d: `M${x},600 L${x + w / 2},${600 - h} L${x + w},600 Z`, fill: shade }),
    s('path', { d: `M${x + w / 2},600 L${x + w / 2 - 10},${600 - h * 0.35} L${x + w / 2 + 10},${600 - h * 0.35} Z`, fill: '#e8a25c', opacity: 0.75, class: 'ember-flicker' }),
  );
  return [tent(20, 130, 110, '#4a3e36'), tent(150, 100, 80, '#3f352f'), tent(1480, 110, 90, '#4a3e36')];
}

// A low wall of stacked stones; the mason adds to it while talking.
function wall() {
  const g = s('g', { class: 'wall' });
  const rows = [[110, 690], [124, 670], [138, 650]];
  const widths = [36, 34, 32];
  const stone = (x, y, w) => s('path', { d: `M${x},${y} L${x + 3},${y - 18} L${x + w - 4},${y - 20} L${x + w},${y - 2} Z`, fill: '#77708a', stroke: '#2f2c3a', 'stroke-width': 2 });
  rows.forEach(([x0, y], r) => {
    const count = 5 - r;
    for (let i = 0; i < count; i++) g.append(stone(x0 + i * widths[r], y, widths[r]));
  });
  let next = 0;
  return {
    el: g,
    add() {
      const x = 150 + next * 30;
      g.append(stone(x, 632, 30));
      next = (next + 1) % 4;
    },
  };
}

function pile() {
  return s('g', null,
    s('path', { d: 'M210,724 L222,700 L244,694 L262,704 L286,700 L300,724 Z', fill: '#6b6578' }),
    s('path', { d: 'M226,702 L240,686 L258,690 L262,704 Z', fill: '#7d7690' }),
  );
}

function forge() {
  return s('g', null,
    s('path', { d: 'M460,760 L460,690 L580,690 L580,760 Z', fill: '#4b4553' }),
    s('path', { d: 'M482,760 L482,718 L558,718 L558,760 Z', fill: '#1d1820' }),
    flame(520, 756, 12),
    s('path', { d: 'M590,760 L596,736 L640,736 L646,760 Z M584,736 L652,736 L652,728 L584,728 Z', fill: '#2a2630' }),
  );
}

function bridgeStub() {
  return s('g', null,
    s('path', { d: 'M1404,590 L1404,640 M1472,590 L1472,640', stroke: '#241c16', 'stroke-width': 7 }),
    s('path', { d: 'M1384,592 L1490,592 L1464,540 L1458,534 L1450,542 L1440,530 L1430,544 L1420,536 Z', fill: '#57524f' }),
    s('path', { d: 'M1392,578 L1482,578 M1400,563 L1475,563 M1408,550 L1468,550', stroke: '#35312f', 'stroke-width': 2.5 }),
    s('path', { d: 'M1426,436 L1452,436 L1456,448 L1446,446 L1438,452 L1430,446 L1422,450 Z', fill: '#4a3a2e' }),
  );
}

export function buildCamp() {
  const rand = seeded(23);
  const figures = Object.fromEntries(CAST.map((c) => [c.id, createFigure(c)]));
  const stones = wall();
  const player = playerFigure();
  const w = world({
    className: 'camp',
    points: POINTS,
    figures,
    scenery: [...sky(rand), ...villageAcross(rand), ...river(rand), ...ground(), ...tents(), stones.el, pile(), forge(), bridgeStub()],
    foreground: [player],
  });
  return {
    ...w,
    onPlace(at) {
      if (at === 'wall') stones.add();
    },
    onPlayerReceive(item) {
      // The smith's ember rekindles the traveller's lantern.
      if (item === 'ember') player.querySelector('.player__glow').replaceChildren(glow(800, 838, 120, 0.8));
    },
  };
}
