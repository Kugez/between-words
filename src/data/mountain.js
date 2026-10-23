// The mountain people's language. Glyph ids carry an "m_" prefix; the rest of
// the id is the word the glyph means.
//
// Grammar, so new lines stay consistent (it is deliberately unlike the river's):
//   the verb or what is said about something comes first
//                                         m_hyva m_tuli = the fire is good
//   then subject, then object             m_haluta m_mina m_kala = I want fish
//   a recipient follows the "to" glyph    m_antaa m_mina m_tuli m_lle m_sina = I give you fire
//   plural repeats the noun               m_kivi m_kivi = stones
//   negation comes before everything      m_ei m_haluta m_mina m_kivi = I do not want stone

// Angular strokes in a 100x100 box, drawn with a square pen.
export const GLYPHS = {
  m_mina: 'M50 82 L50 22 M30 42 L50 22 L70 42',
  m_sina: 'M18 50 L80 50 M60 30 L80 50 L60 70',
  m_lle: 'M30 26 L70 50 L30 74 M54 26 L54 74',
  m_kivi: 'M24 72 L32 36 L62 28 L78 60 L60 76 Z',
  m_tuli: 'M50 18 L74 76 L26 76 Z M50 48 L50 76',
  m_kala: 'M16 50 L44 32 L70 50 L44 68 Z M70 50 L86 34 L86 66 Z',
  m_silta: 'M14 74 L14 44 L86 44 L86 74 M36 44 L36 62 M64 44 L64 62',
  m_antaa: 'M18 28 L58 28 L58 72 L84 72 M72 60 L84 72 L72 84',
  m_haluta: 'M24 24 L50 76 L76 24 M38 24 L62 24',
  m_rakentaa: 'M16 78 L84 78 M26 78 L26 58 L48 58 L48 38 L70 38 L70 78',
  m_ei: 'M26 26 L74 74 M74 26 L26 74',
  m_hyva: 'M16 62 L36 38 L56 62 L76 38 L86 50',
};

export const PAGES = [
  { id: 'V', glyphs: ['m_mina', 'm_sina', 'm_lle'] },
  { id: 'VI', glyphs: ['m_kivi', 'm_tuli', 'm_kala', 'm_silta'] },
  { id: 'VII', glyphs: ['m_antaa', 'm_haluta', 'm_rakentaa'] },
  { id: 'VIII', glyphs: ['m_ei', 'm_hyva'] },
];

// The order the player meets the speakers in; each one waits for the one before.
export const TALKERS = ['mason', 'smith', 'friend', 'chief'];

export const DIALOGUES = {
  mason: [
    { who: 'mason', say: ['m_mina'], act: { type: 'point', who: 'mason', at: 'self' } },
    { who: 'mason', say: ['m_kivi'], act: { type: 'hold', who: 'mason', item: 'stone' } },
    { who: 'mason', say: ['m_kivi', 'm_kivi'], act: { type: 'point', who: 'mason', at: 'pile' } },
    { who: 'mason', say: ['m_rakentaa', 'm_mina'], act: { type: 'build', who: 'mason', item: 'stone', at: 'wall' } },
    { who: 'mason', say: ['m_sina'], act: { type: 'point', who: 'mason', at: 'player' } },
    { who: 'mason', say: ['m_antaa', 'm_mina', 'm_kivi'], act: { type: 'give', from: 'mason', to: 'player', item: 'stone' } },
  ],
  smith: [
    { who: 'smith', say: ['m_tuli'], act: { type: 'point', who: 'smith', at: 'forge' } },
    { who: 'smith', say: ['m_hyva', 'm_tuli'], act: { type: 'nod', who: 'smith' } },
    { who: 'smith', say: ['m_antaa', 'm_mina', 'm_tuli', 'm_lle', 'm_sina'], act: { type: 'give', from: 'smith', to: 'player', item: 'ember' } },
    { who: 'smith', say: ['m_ei', 'm_rakentaa', 'm_mina'], act: { type: 'shake', who: 'smith', at: 'wall' } },
  ],
  friend: [
    { who: 'friend', say: ['m_kala', 'm_kala'], act: { type: 'hold', who: 'friend', item: 'letter' } },
    { who: 'friend', say: ['m_haluta', 'm_mina', 'm_kala'], act: { type: 'point', who: 'friend', at: 'self' } },
    { who: 'mason', say: ['m_antaa', 'm_mina', 'm_kivi', 'm_lle', 'm_sina'], act: { type: 'give', from: 'mason', to: 'friend', item: 'stone' } },
    { who: 'friend', say: ['m_ei', 'm_haluta', 'm_mina', 'm_kivi'], act: { type: 'shake', who: 'friend' } },
  ],
  chief: [
    { who: 'chief', say: ['m_silta'], act: { type: 'point', who: 'chief', at: 'bridge' } },
    { who: 'chief', say: ['m_ei', 'm_hyva', 'm_silta'], act: { type: 'shake', who: 'chief', at: 'bridge' } },
    { who: 'chief', say: ['m_haluta', 'm_mina', 'm_silta'], act: { type: 'point', who: 'chief', at: 'self' } },
    { who: 'chief', say: ['m_antaa', 'm_mina', 'm_kivi', 'm_lle', 'm_silta'], act: { type: 'point', who: 'chief', at: 'bridge' } },
    { who: 'chief', say: ['m_sina'], act: { type: 'point', who: 'chief', at: 'player' } },
    { who: 'chief', say: ['m_antaa', 'm_sina', 'm_kivi', 'm_lle', 'm_silta'], act: { type: 'point', who: 'chief', at: 'bridge' } },
  ],
  // Once every mountain glyph has been seen, the chief leads the way to the bridge.
  summon: [
    { who: 'chief', say: ['m_sina', 'm_silta'], act: { type: 'point', who: 'chief', at: 'bridge' } },
  ],
};

// After the last message: the bridge is built.
export const BRIDGE_FINALE = [
  { who: 'chief', say: ['m_rakentaa', 'm_mina', 'm_silta'], act: { type: 'point', who: 'chief', at: 'gap' } },
  { who: 'elder', say: ['silta', 'hyva'], act: { type: 'nod', who: 'elder' } },
];

// The finale: each round one side speaks, the player writes it in the other
// side's language. River lines follow river grammar, mountain lines mountain grammar.
export const BRIDGE_ROUNDS = [
  {
    from: 'elder',
    to: 'chief',
    say: ['mina', 'silta', 'haluta'],
    answer: ['m_haluta', 'm_mina', 'm_silta'],
    hint: 'hintVerbFirst',
    reply: [{ who: 'chief', say: ['m_haluta', 'm_mina', 'm_silta'], act: { type: 'point', who: 'chief', at: 'gap' } }],
  },
  {
    from: 'chief',
    to: 'elder',
    say: ['m_haluta', 'm_mina', 'm_kala'],
    answer: ['mina', 'kala', 'haluta'],
    hint: 'hintVerbLast',
    reply: [{ who: 'elder', act: { type: 'point', who: 'elder', at: 'fisher' } }],
  },
  {
    from: 'elder',
    to: 'chief',
    say: ['mina', 'sina', 'kala', 'monta', 'antaa'],
    answer: ['m_antaa', 'm_mina', 'm_kala', 'm_kala', 'm_lle', 'm_sina'],
    hint: 'hintPlural',
    reply: [
      { act: { type: 'give', from: 'elder', to: 'chief', item: 'fish' } },
      { who: 'chief', say: ['m_hyva', 'm_kala'], act: { type: 'nod', who: 'chief' } },
    ],
  },
];
