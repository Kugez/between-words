import { s } from '../dom.js';

const ARM = 78;
const DEG = 180 / Math.PI;

function features(kind, f) {
  switch (kind) {
    case 'fisher':
      return [
        s('path', { d: 'M-22,-192 C-20,-214 20,-214 22,-192 Z', fill: '#c9b48a' }),
        s('ellipse', { cx: 0, cy: -192, rx: 44, ry: 8, fill: '#c9b48a' }),
      ];
    case 'child':
      return [s('path', { d: `M${-6 * f},-200 C${4 * f},-214 ${16 * f},-210 ${18 * f},-198`, fill: 'none', stroke: '#3a2a22', 'stroke-width': 6, 'stroke-linecap': 'round' })];
    case 'baker':
      return [
        s('path', { d: 'M-25,-182 C-26,-212 26,-212 25,-182 C14,-190 -14,-190 -25,-182 Z', fill: '#efe2c4' }),
        s('circle', { cx: 24 * f, cy: -192, r: 6, fill: '#efe2c4' }),
      ];
    case 'elder':
      return [
        s('path', { d: 'M-14,-166 C-14,-130 14,-130 14,-166 Z', fill: '#d9d4cc' }),
        s('path', { d: 'M-24,-184 C-24,-210 24,-210 24,-184 C14,-196 -14,-196 -24,-184 Z', fill: '#d9d4cc' }),
      ];
    // The mountain people wear pointed felt hats.
    case 'mason':
      return [
        s('path', { d: 'M-26,-190 L0,-236 L26,-190 Z', fill: '#7b6a55' }),

      ];
    case 'smith':
      return [
        s('path', { d: 'M-24,-192 L4,-230 L24,-192 Z', fill: '#3d3a3f' }),
        s('path', { d: `M${-6 * f},-160 L${10 * f},-160`, stroke: '#2a2226', 'stroke-width': 4, 'stroke-linecap': 'round' }),
      ];
    case 'friend':
      return [s('path', { d: 'M-22,-190 L0,-226 L22,-190 Z', fill: '#b5473a' })];
    case 'chief':
      return [
        s('path', { d: 'M-28,-190 L0,-246 L28,-190 Z', fill: '#2f4a3e' }),
        s('path', { d: 'M-28,-190 L28,-190', stroke: '#c9a24a', 'stroke-width': 5 }),

      ];
    default:
      return [];
  }
}

const MOUNTAIN = new Set(['mason', 'smith', 'friend', 'chief']);

// A villager standing with feet at (x, y). Everything is drawn in local
// coordinates (up is negative y) and scaled, so one shape serves adult and child.
export function createFigure({ id, kind, x, y, scale = 1, facing = 1, robe, trim, skin = '#c99a74' }) {
  const shoulder = { x: 14 * facing, y: -142 };
  const rest = -14 * facing;

  const hand = s('circle', { cx: shoulder.x, cy: shoulder.y + ARM, r: 9, fill: skin });
  const arm = s('g', { class: 'arm' },
    s('path', { d: `M${shoulder.x},${shoulder.y} L${shoulder.x},${shoulder.y + ARM}`, stroke: trim, 'stroke-width': 16, 'stroke-linecap': 'round' }),
    hand,
  );
  const head = s('g', { class: 'head' },
    s('circle', { cx: 0, cy: -178, r: 24, fill: skin }),
    ...features(kind, facing),
  );
  const body = s('g', { class: 'body' },
    kind === 'elder' && s('path', { d: `M${-34 * facing},-170 L${-34 * facing},0`, stroke: '#6b5440', 'stroke-width': 7, 'stroke-linecap': 'round' }),
    s('path', {
      d: MOUNTAIN.has(kind)
        ? 'M-42,0 L-30,-150 L0,-162 L30,-150 L42,0 Z'
        : 'M-38,0 C-41,-60 -34,-120 -24,-152 Q0,-166 24,-152 C34,-120 41,-60 38,0 Z',
      fill: robe,
    }),
    s('path', { d: 'M-38,0 C-39,-12 39,-12 38,0 Z', fill: trim, opacity: 0.6 }),
    kind === 'chief' && s('path', { d: 'M-30,-150 L0,-134 L30,-150', fill: 'none', stroke: '#c9a24a', 'stroke-width': 5 }),
    head,
    arm,
  );
  const el = s('g', {
    class: 'figure',
    'data-figure': id,
    transform: `translate(${x},${y}) scale(${scale})`,
  }, body);

  const figure = {
    id,
    el,
    x,
    y,
    scale,
    facing,
    angle: rest,
    rest,
    head,
    body,
    toWorld(p) {
      return { x: x + p.x * scale, y: y + p.y * scale };
    },
    toLocal(p) {
      return { x: (p.x - x) / scale, y: (p.y - y) / scale };
    },
    setArm(deg) {
      figure.angle = deg;
      arm.setAttribute('transform', `rotate(${deg.toFixed(2)},${shoulder.x},${shoulder.y})`);
    },
    handLocal(deg = figure.angle) {
      const r = deg / DEG;
      return { x: shoulder.x - Math.sin(r) * ARM, y: shoulder.y + Math.cos(r) * ARM };
    },
    hand() {
      return figure.toWorld(figure.handLocal());
    },
    mouth() {
      return figure.toWorld({ x: 8 * facing, y: -170 });
    },
    top() {
      return figure.toWorld({ x: 0, y: -230 });
    },
    // Arm angle that points the hand at a world position.
    angleTo(target) {
      const p = figure.toLocal(target);
      return Math.atan2(-(p.x - shoulder.x), p.y - shoulder.y) * DEG;
    },
    selfAngle() {
      return 48 * facing;
    },
  };
  figure.setArm(rest);
  return figure;
}

export function createItem(kind) {
  switch (kind) {
    case 'fish':
      return s('g', { class: 'item' },
        s('path', { d: 'M-24,0 C-12,-12 10,-12 18,0 C10,12 -12,12 -24,0 Z', fill: '#b8c7c9' }),
        s('path', { d: 'M18,0 L30,-10 L30,10 Z', fill: '#93a7aa' }),
        s('circle', { cx: -14, cy: -2, r: 2, fill: '#1d2433' }),
      );
    case 'bread':
      return s('g', { class: 'item' },
        s('path', { d: 'M-24,8 C-24,-16 24,-16 24,8 Z', fill: '#d08f4c' }),
        s('path', { d: 'M-8,-6 L-4,2 M6,-6 L10,2', stroke: '#8f5a2a', 'stroke-width': 3, 'stroke-linecap': 'round' }),
      );
    case 'cup':
      return s('g', { class: 'item' },
        s('path', { d: 'M-12,-10 L12,-10 L9,12 L-9,12 Z', fill: '#8c6a4f' }),
        s('ellipse', { cx: 0, cy: -10, rx: 12, ry: 3, fill: '#7fb3bb' }),
      );
    case 'letter':
      return s('g', { class: 'item' },
        s('rect', { x: -22, y: -16, width: 44, height: 32, rx: 2, fill: '#efe6d2' }),
        s('path', { d: 'M-14,-4 L-6,-4 M-2,-4 L12,-4 M-12,6 L10,6', stroke: '#7a6a58', 'stroke-width': 2.5, 'stroke-linecap': 'round' }),
      );
    case 'stone':
      return s('g', { class: 'item' },
        s('path', { d: 'M-16,8 L-12,-8 L4,-13 L16,-2 L10,10 Z', fill: '#8c8597' }),
        s('path', { d: 'M-8,-6 L4,-10', stroke: '#b3adbd', 'stroke-width': 2, 'stroke-linecap': 'round' }),
      );
    case 'ember':
      return s('g', { class: 'item' },
        s('circle', { r: 26, fill: 'url(#v-glow)' }),
        s('circle', { r: 7, fill: '#ffd59a' }),
      );
    case 'boat':
      return s('g', { class: 'item' },
        s('path', { d: 'M-26,0 L26,0 L16,12 L-16,12 Z', fill: '#efe6d2' }),
        s('path', { d: 'M-4,0 L6,-22 L14,0 Z', fill: '#e2d6bc' }),
      );
    default:
      return s('g');
  }
}
