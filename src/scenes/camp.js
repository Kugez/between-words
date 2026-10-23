import { buildCamp } from '../art/camp.js';
import { DIALOGUES, TALKERS } from '../data/mountain.js';
import { allSeen } from '../progress.js';
import { createTalkScene } from '../stage.js';

export function campScene({ t, state, go, save }) {
  const ready = () => allSeen(state, 'mountain') && TALKERS.every((who) => state.talked[who]);

  const stage = createTalkScene({
    sceneId: 'camp',
    world: buildCamp(),
    dialogues: DIALOGUES,
    talkers: TALKERS,
    state,
    t,
    save,
    go,
    hint: TALKERS.some((who) => state.talked[who]) ? null : t('campHint'),
    dialogueFor: (id) => (id === 'chief' && ready() ? 'summon' : id),
    isNew: (id) => !state.talked[id] || (id === 'chief' && ready()),
    afterTalk(key, id) {
      if (key === 'summon') {
        go('bridge');
        return;
      }
      state.talked[id] = true;
      save();
      if (ready()) stage.say(t('chiefReady'));
    },
  });

  return stage.el;
}
