// The river people's language: glyphs, how the notebook groups them, and
// every scripted conversation in the village.
//
// Grammar, so new lines stay consistent:
//   subject, recipient, object, verb      minä sinä kala antaa = I give you fish
//   plural marker follows the noun        kala monta = many fish
//   negation follows what it negates      leipä haluta ei = not want bread

// Glyph strokes in a 100x100 box, drawn with a round pen.
export const GLYPHS = {
  mina: 'M50 22 C30 22 22 38 22 52 C22 70 36 80 50 80 C64 80 78 70 78 52 C78 38 70 22 50 22 M50 46 L50 56',
  sina: 'M64 28 C42 16 20 32 22 52 C24 74 46 84 64 72 M82 52 L82 53',
  lapsi: 'M50 20 C42 20 40 30 50 34 C60 30 58 20 50 20 M30 78 C34 54 66 54 70 78',
  kala: 'M18 52 C34 30 62 30 74 50 C62 70 34 72 18 52 M74 50 L88 36 M74 50 L88 66',
  vesi: 'M16 34 C28 24 38 44 50 34 C62 24 72 44 84 34 M16 54 C28 44 38 64 50 54 C62 44 72 64 84 54 M30 74 C40 66 60 66 70 74',
  tuli: 'M50 16 C66 36 76 52 70 66 C64 82 36 82 30 66 C26 54 38 46 44 34 C48 48 56 52 58 60',
  leipa: 'M18 70 C18 34 82 34 82 70 Z M50 54 L50 55',
  antaa: 'M24 40 L24 41 M16 64 L68 64 C84 64 86 42 72 36',
  haluta: 'M30 72 C18 42 48 18 70 32 C86 44 72 66 56 58 C46 52 52 40 62 44',
  ei: 'M50 16 L50 84 M26 64 L74 36',
  monta: 'M46 28 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M26 66 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M66 66 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0',
  hyva: 'M20 50 C32 80 68 80 80 50 M50 18 L50 40',
  silta: 'M16 78 L16 54 C30 30 70 30 84 54 L84 78 M16 60 L84 60',
};

// A river glyph's correct meaning is the word with the same id.
export const PAGES = [
  { id: 'I', glyphs: ['mina', 'sina', 'lapsi'] },
  { id: 'II', glyphs: ['kala', 'vesi', 'tuli', 'leipa'] },
  { id: 'III', glyphs: ['antaa', 'haluta', 'hyva'] },
  { id: 'IV', glyphs: ['ei', 'monta', 'silta'] },
];

export const LETTER = ['mina', 'sina', 'kala', 'monta', 'antaa'];

// Each beat: who speaks (optional), what they say in glyphs (optional),
// and one gesture. Targets are characters, 'self', 'player' or scene points.
export const DIALOGUES = {
  fisher: [
    { who: 'fisher', say: ['mina'], act: { type: 'point', who: 'fisher', at: 'self' } },
    { who: 'fisher', say: ['sina'], act: { type: 'point', who: 'fisher', at: 'player' } },
    { who: 'fisher', say: ['kala'], act: { type: 'hold', who: 'fisher', item: 'fish' } },
    { who: 'fisher', say: ['kala', 'monta'], act: { type: 'point', who: 'fisher', at: 'rack' } },
    { who: 'fisher', say: ['lapsi', 'kala', 'haluta'], act: { type: 'point', who: 'fisher', at: 'child' } },
  ],
  child: [
    { who: 'child', say: ['mina', 'kala', 'haluta'], act: { type: 'point', who: 'child', at: 'fisher' } },
    { who: 'fisher', say: ['mina', 'sina', 'kala', 'antaa'], act: { type: 'give', from: 'fisher', to: 'child', item: 'fish' } },
    { who: 'child', say: ['kala', 'hyva'], act: { type: 'eat', who: 'child', item: 'fish' } },
    { who: 'child', say: ['mina', 'vesi', 'haluta'], act: { type: 'point', who: 'child', at: 'river' } },
    { who: 'child', say: ['vesi', 'hyva'], act: { type: 'eat', who: 'child', item: 'cup' } },
  ],
  baker: [
    { who: 'baker', say: ['tuli'], act: { type: 'point', who: 'baker', at: 'oven' } },
    { who: 'baker', say: ['leipa'], act: { type: 'hold', who: 'baker', item: 'bread' } },
    { who: 'baker', say: ['mina', 'sina', 'leipa', 'antaa'], act: { type: 'give', from: 'baker', to: 'player', item: 'bread' } },
    { who: 'child', say: ['mina', 'leipa', 'haluta', 'ei'], act: { type: 'shake', who: 'child' } },
  ],
  elder: [
    { who: 'elder', say: ['tuli', 'hyva'], act: { type: 'point', who: 'elder', at: 'campfire' } },
    { who: 'elder', say: ['tuli', 'monta'], act: { type: 'point', who: 'elder', at: 'farfires' } },
    { who: 'elder', say: ['vesi'], act: { type: 'point', who: 'elder', at: 'river' } },
    { who: 'elder', say: ['silta'], act: { type: 'point', who: 'elder', at: 'bridge' } },
    { who: 'elder', say: ['silta', 'hyva', 'ei'], act: { type: 'shake', who: 'elder', at: 'bridge' } },
    { who: 'elder', say: ['lapsi', 'hyva'], act: { type: 'point', who: 'elder', at: 'child' } },
  ],
  letter: [
    { who: 'child', say: ['sina'], act: { type: 'point', who: 'child', at: 'player' } },
    { who: 'child', act: { type: 'hold', who: 'child', item: 'letter' } },
  ],
};


