import { h } from '../dom.js';
import { buildBridgeView } from '../art/bridge.js';
import { BRIDGE_FINALE, BRIDGE_ROUNDS } from '../data/mountain.js';
import { glyphsOf, scriptOf } from '../data/language.js';
import { createStage } from '../stage.js';
import { wait } from '../tween.js';
import { openWriter } from '../ui/writer.js';
import { sentenceRow } from '../ui/sentence.js';

// The finale. Each round one side speaks and the player, in a boat under the
// gap, writes the message in the other side's language.
export function bridgeScene({ t, state, go, save }) {
  const view = buildBridgeView();
  const stage = createStage({ world: view, state, t, save, go, sceneId: 'bridge' });
  const translateButton = h('button', { class: 'button', 'data-action': 'translate', hidden: true, onclick: () => openRound() }, t('translate'));
  stage.hud.insertBefore(translateButton, stage.hud.lastChild);

  const round = () => BRIDGE_ROUNDS[state.bridgeRound];

  async function speak() {
    const r = round();
    if (!r) return finale();
    await stage.play([{ who: r.from, say: r.say, act: { type: 'point', who: r.from, at: 'player' } }]);
    openRound();
  }

  function openRound() {
    const r = round();
    const target = scriptOf(r.answer[0]);
    translateButton.hidden = false;
    openWriter({
      state,
      t,
      title: t('translateTitle'),
      prompt: t(target === 'mountain' ? 'translateToMountain' : 'translateToRiver'),
      source: sentenceRow(state, r.say),
      keys: glyphsOf(target).filter((g) => state.seen[g]),
      answer: r.answer,
      hints: [t(r.hint), t('hintLength').replace('{n}', r.answer.length)],
      sendLabel: t('deliver'),
      onSolved: () => delivered(r),
    });
  }

  async function delivered(r) {
    translateButton.hidden = true;
    state.bridgeRound += 1;
    save();
    await stage.play([{ who: 'player', say: r.answer, act: { type: 'nod', who: r.to } }, ...r.reply]);
    speak();
  }

  async function finale() {
    await stage.play(BRIDGE_FINALE);
    await view.mend();
    await view.gather();
    state.finished = true;
    save();
    await wait(900);
    go('finale');
  }

  if (state.bridgeRound === 0) stage.say(t('bridgeHint'), 7000);
  setTimeout(() => stage.el.isConnected && speak(), 1200);
  return stage.el;
}
