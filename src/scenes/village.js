import { buildVillage } from '../art/village.js';
import { DIALOGUES, TALKERS } from '../data/river.js';
import { allSeen } from '../progress.js';
import { createTalkScene } from '../stage.js';
import { lerp, tween, wait } from '../tween.js';
import { openLetter } from '../ui/letter.js';

export function villageScene({ t, state, go, save }) {
  const letterReady = () => allSeen(state, 'river') && !state.letterDone;

  const stage = createTalkScene({
    sceneId: 'village',
    world: buildVillage(),
    dialogues: DIALOGUES,
    talkers: TALKERS,
    state,
    t,
    save,
    go,
    hint: Object.keys(state.talked).length ? null : t('villageHint'),
    dialogueFor: (id) => (id === 'child' && letterReady() ? 'letter' : id),
    isNew: (id) => !state.talked[id] || (id === 'child' && letterReady()),
    afterTalk(key, id) {
      if (key === 'letter') {
        openLetter({ state, t, onSubmit: sendLetter });
        return;
      }
      state.talked[id] = true;
      save();
      if (letterReady() && TALKERS.every((who) => state.talked[who])) stage.say(t('letterReady'));
    },
  });

  async function sendLetter() {
    state.letterDone = true;
    save();
    const child = stage.figures.child;
    const boat = stage.spawn('boat', child.hand());
    await stage.fly(boat, child.hand(), { x: 620, y: 545 }, 900);
    await tween(2600, (p) => stage.place(boat, { x: lerp(620, 900, p), y: lerp(545, 440, p) }, lerp(1, 0.45, p)));
    await wait(400);
    go('ending');
  }

  return stage.el;
}
