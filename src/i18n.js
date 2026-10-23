// Every player-facing string lives here so the game stays bilingual.
const STRINGS = {
  fi: {
    title: 'Sanojen välissä',
    subtitle: 'Kaksi kansaa, kaksi kieltä, yksi romahtanut silta.',
    newGame: 'Aloita',
    continueGame: 'Jatka',
    language: 'In English',
    arrival:
      'Saavut laaksoon iltahämärissä. Joen toisella puolella palaa tulia, mutta silta niiden välillä on romahtanut. Kukaan ei puhu kieltäsi.',
    back: 'Takaisin',
  },
  en: {
    title: 'Between Words',
    subtitle: 'Two peoples, two languages, one fallen bridge.',
    newGame: 'Begin',
    continueGame: 'Continue',
    language: 'Suomeksi',
    arrival:
      'You reach the valley at dusk. Fires burn on both sides of the river, but the bridge between them has fallen. No one here speaks your language.',
    back: 'Back',
  },
};

export const LANGUAGES = Object.keys(STRINGS);

export function detectLanguage() {
  const preferred = (navigator.languages || [navigator.language || 'en']).map((l) => l.slice(0, 2));
  return preferred.find((l) => LANGUAGES.includes(l)) || 'en';
}

export function translator(lang) {
  const table = STRINGS[lang] || STRINGS.en;
  return (key) => table[key] ?? STRINGS.en[key] ?? key;
}
