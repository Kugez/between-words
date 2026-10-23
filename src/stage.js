import { h, s } from './dom.js';
import { W } from './art/common.js';
import { createItem } from './art/figures.js';
import { glyphSvg } from './glyph.js';
import { isKnown, recordSentence, wordLabel } from './progress.js';
import { lerp, tween } from './tween.js';
import { openNotebook } from './ui/notebook.js';

const G = 64;
const GAP = 8;
const PAD = 16;

// Everything a scene needs to make its characters speak and gesture: speech
// bubbles, gestures, the Continue button, the notebook and a status line.
export function createStage({ world, state, t, save, go, sceneId }) {
  const { svg, figures, items, bubbles, points } = world;
  const held = new Map();
  let ready = false;
  let advance = null;
  const stage = { talking: false, closing: false };

  const toast = h('p', { class: 'toast', role: 'status' });
  const nextButton = h('button', { class: 'button next', 'data-action': 'advance', disabled: true, hidden: true, onclick: () => advance?.() }, t('next'));
  const hud = h('div', { class: 'hud' },
    h('button', { class: 'button button--quiet', 'data-action': 'menu', onclick: () => go('title') }, t('menu')),
    h('button', { class: 'button notebook-button', 'data-action': 'notebook', onclick: () => notebook() }, t('notebook')),
  );

  function say(text, ms = 5000) {
    toast.textContent = text;
    toast.classList.add('is-visible');
    clearTimeout(say.timer);
    say.timer = setTimeout(() => toast.classList.remove('is-visible'), ms);
  }

  function notebook(focus) {
    openNotebook({ state, t, focus, save, onClose: () => { refreshBubble(); stage.onNotebookClose?.(); } });
  }

  svg.addEventListener('click', () => advance?.());

  // --- Gestures -----------------------------------------------------------

  function target(at) {
    if (figures[at]) return figures[at].toWorld({ x: 0, y: -150 });
    return points[at];
  }

  async function armTo(f, deg, ms = 450) {
    const from = f.angle;
    const item = held.get(f.id);
    await tween(ms, (p) => {
      f.setArm(lerp(from, deg, p));
      if (item) place(item, f.hand());
    });
  }

  function place(item, { x, y }, scale = 1) {
    item.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${scale.toFixed(3)})`);
  }

  function spawn(kind, at) {
    const item = createItem(kind);
    place(item, at);
    items.append(item);
    return item;
  }

  async function fly(item, from, to, ms = 700, endScale = 1) {
    await tween(ms, (p) => place(item, { x: lerp(from.x, to.x, p), y: lerp(from.y, to.y, p) - Math.sin(p * Math.PI) * 30 }, lerp(1, endScale, p)));
  }

  async function fade(item) {
    await tween(300, (p) => item.setAttribute('opacity', (1 - p).toFixed(2)));
    item.remove();
  }

  async function shakeHead(f) {
    await tween(800, (p) => f.head.setAttribute('transform', `translate(${(Math.sin(p * Math.PI * 4) * 6).toFixed(2)},0)`));
    f.head.removeAttribute('transform');
  }

  async function nod(f) {
    await tween(500, (p) => f.head.setAttribute('transform', `translate(0,${(Math.sin(p * Math.PI * 2) * 4).toFixed(2)})`));
    f.head.removeAttribute('transform');
  }

  const ACTIONS = {
    async point({ who, at }) {
      const f = figures[who];
      await armTo(f, at === 'self' ? f.selfAngle() : f.angleTo(target(at)));
      if (at === 'self') await nod(f);
    },
    async hold({ who, item }) {
      const f = figures[who];
      await armTo(f, -62 * f.facing);
      if (!held.has(who)) held.set(who, spawn(item, f.hand()));
    },
    async give({ from, to, item }) {
      const giver = figures[from];
      const taker = figures[to];
      const dest = taker ? taker.toWorld({ x: 0, y: -110 }) : points.player;
      await Promise.all([
        armTo(giver, giver.angleTo(dest)),
        taker && armTo(taker, taker.angleTo(giver.hand())),
      ]);
      const thing = held.get(from) || spawn(item, giver.hand());
      held.delete(from);
      await fly(thing, giver.hand(), taker ? taker.hand() : points.player, 750, taker ? 1 : 0.6);
      if (taker) {
        held.set(to, thing);
      } else {
        world.onPlayerReceive?.(item);
        await fade(thing);
      }
      await armTo(giver, giver.rest, 300);
    },
    async build({ who, item, at }) {
      const f = figures[who];
      const thing = held.get(who) || spawn(item, f.hand());
      held.delete(who);
      await armTo(f, f.angleTo(points[at]));
      await fly(thing, f.hand(), points[at], 600, 0.8);
      thing.remove();
      world.onPlace?.(at);
    },
    async eat({ who, item }) {
      const f = figures[who];
      const thing = held.get(who) || spawn(item, f.hand());
      held.delete(who);
      await armTo(f, f.angleTo(f.mouth()) * 0.75);
      await fly(thing, f.hand(), f.mouth(), 500, 0.2);
      thing.remove();
      await nod(f);
    },
    async shake({ who, at }) {
      const f = figures[who];
      if (at) await armTo(f, f.angleTo(target(at)));
      await shakeHead(f);
    },
    async nod({ who }) {
      await nod(figures[who]);
    },
  };

  // --- Speech bubbles -----------------------------------------------------

  let bubble = null;

  function anchorOf(who) {
    return figures[who] ? figures[who].top() : points[`${who}Top`];
  }

  function drawBubble(who, glyphs) {
    bubbles.replaceChildren();
    bubble = who && glyphs ? { who, glyphs } : null;
    if (!bubble) return;
    const captions = glyphs.some((g) => isKnown(state, g));
    const width = glyphs.length * G + (glyphs.length - 1) * GAP + PAD * 2;
    const height = G + PAD * 2 + (captions ? 22 : 0);
    const anchor = anchorOf(who);
    const x = Math.max(12, Math.min(W - 12 - width, anchor.x - width / 2));
    const y = Math.max(12, anchor.y - height - 18);
    const tailX = Math.max(x + 20, Math.min(x + width - 20, anchor.x));

    bubbles.append(
      s('g', { class: `bubble${who === 'player' ? ' bubble--player' : ''}`, 'data-bubble': glyphs.join(' '), 'data-speaker': who },
        s('path', { d: `M${tailX - 12},${y + height - 1} L${anchor.x},${anchor.y - 4} L${tailX + 12},${y + height - 1} Z`, class: 'bubble__shape' }),
        s('rect', { x, y, width, height, rx: 18, class: 'bubble__shape' }),
        ...glyphs.map((g, i) => {
          const gx = x + PAD + i * (G + GAP);
          const group = s('g', { class: 'bubble__glyph', 'data-glyph': g, role: 'button', tabindex: 0 },
            s('rect', { x: gx, y: y + PAD, width: G, height: G, rx: 8, fill: 'transparent' }),
            glyphSvg(g, { x: gx, y: y + PAD, width: G, height: G, color: '#2a2236' }),
            isKnown(state, g) && s('text', { x: gx + G / 2, y: y + PAD + G + 18, 'text-anchor': 'middle', class: 'bubble__caption' }, wordLabel(g, state.lang)),
          );
          group.addEventListener('click', (e) => {
            e.stopPropagation();
            notebook(g);
          });
          return group;
        }),
      ),
    );
  }

  function refreshBubble() {
    if (bubble) drawBubble(bubble.who, bubble.glyphs);
  }

  // --- Playing a conversation ---------------------------------------------

  // Plays beats one at a time; the player continues with a click, Space or Enter.
  async function play(beats) {
    stage.talking = true;
    svg.classList.add('is-talking');
    nextButton.hidden = false;

    for (const [i, beat] of beats.entries()) {
      ready = false;
      nextButton.disabled = true;
      await Promise.all(Object.values(figures).filter((f) => f.angle !== f.rest && !held.has(f.id)).map((f) => armTo(f, f.rest, 250)));
      if (beat.say) {
        recordSentence(state, beat.say);
        save();
      }
      drawBubble(beat.who, beat.say);
      if (beat.act) await ACTIONS[beat.act.type](beat.act);
      ready = true;
      nextButton.disabled = false;
      await new Promise((resolve) => {
        advance = () => {
          if (!ready) return;
          advance = null;
          ready = false;
          nextButton.disabled = true;
          if (i === beats.length - 1) nextButton.hidden = true;
          resolve();
        };
      });
    }

    stage.closing = true;
    drawBubble(null);
    await Promise.all([...held.values()].map(fade));
    held.clear();
    await Promise.all(Object.values(figures).map((f) => armTo(f, f.rest, 300)));
    stage.talking = false;
    stage.closing = false;
    svg.classList.remove('is-talking');
    nextButton.hidden = true;
  }

  document.addEventListener('keydown', function onKey(e) {
    if (!svg.isConnected) return document.removeEventListener('keydown', onKey);
    if (stage.talking && (e.key === ' ' || e.key === 'Enter') && !document.querySelector('.overlay')) {
      e.preventDefault();
      advance?.();
    }
  });

  const el = h('section', { class: `scene scene--world scene--${sceneId}`, 'data-scene': sceneId },
    svg,
    h('p', { class: 'rotate-hint' }, t('rotate')),
    hud,
    nextButton,
    toast,
  );

  return Object.assign(stage, {
    el,
    hud,
    figures,
    points,
    play,
    say,
    notebook,
    spawn,
    fly,
    place,
    advance: () => advance?.(),
  });
}

// A scene of villagers to talk to. `dialogueFor(id)` picks what someone says
// next and `afterTalk(key, id)` reacts once a conversation ends.
export function createTalkScene({ sceneId, world, dialogues, talkers, dialogueFor, isNew, afterTalk, hint, state, t, save, go }) {
  const stage = createStage({ world, state, t, save, go, sceneId });
  const { figures } = world;
  let queued = null;

  function refreshMarkers() {
    for (const id of talkers) figures[id].el.classList.toggle('has-news', isNew(id));
  }
  stage.onNotebookClose = refreshMarkers;

  async function talk(id) {
    const key = dialogueFor(id);
    await stage.play(dialogues[key]);
    refreshMarkers();
    if (queued) {
      const who = queued;
      queued = null;
      return talk(who);
    }
    await afterTalk?.(key, id);
    refreshMarkers();
  }

  for (const id of talkers) {
    const f = figures[id];
    f.el.append(
      s('path', { class: 'marker', d: 'M0,-262 L10,-250 L0,-238 L-10,-250 Z', fill: '#e8a25c' }),
      s('rect', { class: 'hotspot', 'data-hotspot': id, x: -55, y: -270, width: 110, height: 280, fill: 'transparent' }),
    );
    f.el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!stage.talking) talk(id);
      else if (stage.closing) queued = id;
      else stage.advance();
    });
  }

  refreshMarkers();
  if (hint) setTimeout(() => stage.say(hint, 7000), 900);
  return stage;
}
