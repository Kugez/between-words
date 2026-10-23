import { s } from '../dom.js';
import { seeded } from './random.js';
import { createFigure } from './figures.js';
import { W, H, flame, playerFigure, river, sky, world } from './common.js';

// Places characters point at or hand things to.
export const POINTS = {
  rack: { x: 240, y: 630 },
  river: { x: 700, y: 500 },
  farfires: { x: 900, y: 405 },
  bridge: { x: 1430, y: 530 },
  oven: { x: 790, y: 715 },
  campfire: { x: 1110, y: 750 },
  player: { x: 700, y: 850 },
};

const CAST = [
  { id: 'fisher', kind: 'fisher', x: 420, y: 790, facing: 1, robe: '#3f7a80', trim: '#2c5559' },
  { id: 'child', kind: 'child', x: 560, y: 800, scale: 0.66, facing: -1, robe: '#c58b3a', trim: '#8f6224' },
  { id: 'baker', kind: 'baker', x: 940, y: 785, facing: -1, robe: '#a4553a', trim: '#713a27' },
  { id: 'elder', kind: 'elder', x: 1250, y: 780, facing: -1, robe: '#6f6788', trim: '#4d4762' },
];

function farBank(rand) {
  const ridge = [];
  for (let i = 0; i <= 32; i++) ridge.push(`${(i / 32) * W},${(395 + (rand() - 0.5) * 22).toFixed(1)}`);
  const peaks = [];
  for (let i = 0; i <= 14; i++) peaks.push(`${(i / 14) * W},${(250 + rand() * 110).toFixed(1)}`);
  const fires = [150, 330, 520, 760, 990, 1160, 1340, 1500].map((x) => flame(x, 412 + rand() * 8, 4));
  return [
    s('path', { d: `M0,430 L${peaks.join(' L')} L${W},430 Z`, fill: '#3c3a57' }),
    s('path', { d: `M0,440 L${ridge.join(' L')} L${W},440 Z`, fill: '#2a2b40' }),
    ...fires,
  ];
}

function bridge() {
  // Seen from the bank: the deck narrows as it reaches over the water and
  // ends in splintered planks. The far half juts out from the other bank.
  return s('g', { 'data-point': 'bridge' },
    s('path', { d: 'M1404,590 L1404,640 M1472,590 L1472,640 M1424,548 L1424,582 M1456,548 L1456,580', stroke: '#241c16', 'stroke-width': 7 }),
    s('path', { d: 'M1384,592 L1490,592 L1464,540 L1458,534 L1450,542 L1440,530 L1430,544 L1420,536 Z', fill: '#5a4636' }),
    s('path', { d: 'M1392,578 L1482,578 M1400,563 L1475,563 M1408,550 L1468,550', stroke: '#3a2d22', 'stroke-width': 2.5 }),
    s('path', { d: 'M1384,592 L1384,566 L1418,514 M1490,592 L1490,566 L1466,524', fill: 'none', stroke: '#3a2d22', 'stroke-width': 4, 'stroke-linecap': 'round' }),
    s('path', { d: 'M1400,564 L1400,580 M1474,562 L1474,580', stroke: '#3a2d22', 'stroke-width': 4 }),
    s('path', { d: 'M1426,436 L1452,436 L1456,448 L1446,446 L1438,452 L1430,446 L1422,450 Z', fill: '#3a2e26' }),
    s('path', { d: 'M1430,450 L1430,470 M1450,448 L1450,466', stroke: '#241c16', 'stroke-width': 4 }),
  );
}

function rack() {
  const fish = [190, 215, 240, 265, 290].map((x, i) =>
    s('path', { d: `M${x},${618} C${x - 7},${630 + i % 2 * 4} ${x - 7},${650} ${x},${662} C${x + 7},${650} ${x + 7},${630 + i % 2 * 4} ${x},${618} Z M${x},${662} L${x - 6},${672} L${x + 6},${672} Z`, fill: '#9fb0b3' }),
  );
  return s('g', null,
    s('path', { d: 'M170,720 L170,600 M310,720 L310,600 M160,612 L320,612', stroke: '#4a3a2e', 'stroke-width': 8, 'stroke-linecap': 'round' }),
    ...fish,
  );
}

function oven() {
  return s('g', null,
    s('path', { d: 'M715,770 C715,660 865,660 865,770 Z', fill: '#6d5a4c' }),
    s('path', { d: 'M715,770 C715,690 790,672 820,676', fill: 'none', stroke: '#83705f', 'stroke-width': 6, 'stroke-linecap': 'round' }),
    s('path', { d: 'M762,770 C762,722 818,722 818,770 Z', fill: '#2a1d16' }),
    flame(790, 768, 10),
  );
}

function campfire() {
  return s('g', null,
    s('path', { d: 'M1080,772 L1140,758 M1082,758 L1138,772', stroke: '#4a3a2e', 'stroke-width': 9, 'stroke-linecap': 'round' }),
    flame(1110, 762, 16),
  );
}

function houses() {
  const house = (x, w, h) => s('g', null,
    s('path', { d: `M${x},590 L${x},${590 - h} L${x + w / 2},${590 - h - 46} L${x + w},${590 - h} L${x + w},590 Z`, fill: '#262839' }),
    s('rect', { x: x + w / 2 - 9, y: 590 - h + 18, width: 18, height: 20, rx: 3, fill: '#e8a25c', opacity: 0.85, class: 'ember-flicker' }),
  );
  return [house(20, 110, 70), house(118, 90, 52), house(1500, 96, 64)];
}

export function buildVillage() {
  const rand = seeded(11);
  const figures = Object.fromEntries(CAST.map((c) => [c.id, createFigure(c)]));
  return world({
    className: 'village',
    points: POINTS,
    figures,
    scenery: [
      ...sky(rand),
      ...farBank(rand),
      ...river(rand),
      s('path', { d: `M0,570 C300,555 600,585 900,566 C1150,552 1400,580 ${W},562 L${W},${H} L0,${H} Z`, fill: '#2b2f42' }),
      s('path', { d: `M0,640 C400,628 900,650 ${W},632 L${W},${H} L0,${H} Z`, fill: '#323549' }),
      ...houses(),
      bridge(),
      rack(),
      oven(),
      campfire(),
    ],
    foreground: [playerFigure()],
  });
}
