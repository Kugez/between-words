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
    enterVillage: 'Astu kylään',
    menu: 'Valikko',
    rotate: 'Peli näkyy parhaiten, kun käännät laitteen vaakatasoon.',
    notebook: 'Muistikirja',
    next: 'Jatka',
    close: 'Sulje',
    villageHint: 'Napauta kyläläisiä nähdäksesi, mitä he sanovat. Jokainen merkki tallentuu muistikirjaasi.',
    notSeen: 'Ei vielä nähty',
    meaningOf: 'Merkin merkitys',
    showSentences: 'Näytä, missä merkki on esiintynyt',
    pageHint: 'Valitse jokaiselle sivun merkille merkitys. Sivu vahvistuu, kun kaikki ovat oikein.',
    pageWrong: 'Jokin näistä ei vielä täsmää.',
    pageConfirmed: 'Sivu vahvistettu. Nämä merkit näkyvät nyt käännettyinä.',
    seenIn: 'Missä olet nähnyt tämän merkin',
    pickGlyph: 'Napauta merkkiä nähdäksesi lauseet, joissa se on esiintynyt.',
    letterReady: 'Lapsi näyttää haluavan sinulta jotain.',
    letterTitle: 'Lapsen kirje',
    letterPrompt: 'Lapsi ojentaa piirroksen ja tyhjän paperin. Kirjoita piirroksen viesti hänen kielellään.',
    erase: 'Pyyhi',
    send: 'Anna kirje',
    letterWrong: 'Lapsi kallistaa päätään. Kirje ei vielä sano sitä, mitä piirros näyttää.',
    ending:
      'Lapsi taittaa kirjeestä paperiveneen ja laskee sen virtaan. Vene lipuu pimeän joen yli. Hetken päästä toiselta rannalta lipuu takaisin toinen vene, ja sen kyljessä on merkkejä, joita et ole koskaan nähnyt.',
    endOfSlice: 'Ensimmäinen luku päättyy tähän. Kiitos, että pelasit!',
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
    enterVillage: 'Enter the village',
    menu: 'Menu',
    rotate: 'The game looks best with your device turned sideways.',
    notebook: 'Notebook',
    next: 'Continue',
    close: 'Close',
    villageHint: 'Tap the villagers to see what they say. Every glyph is saved in your notebook.',
    notSeen: 'Not seen yet',
    meaningOf: 'Meaning of the glyph',
    showSentences: 'Show where this glyph has appeared',
    pageHint: 'Choose a meaning for every glyph on this page. The page is confirmed when all of them are right.',
    pageWrong: 'Something here does not fit yet.',
    pageConfirmed: 'Page confirmed. These glyphs are now translated.',
    seenIn: 'Where you have seen this glyph',
    pickGlyph: 'Tap a glyph to see the sentences it has appeared in.',
    letterReady: 'The child seems to want something from you.',
    letterTitle: "The child's letter",
    letterPrompt: 'The child hands you a drawing and a blank sheet. Write the message of the drawing in their language.',
    erase: 'Erase',
    send: 'Give the letter',
    letterWrong: 'The child tilts their head. The letter does not yet say what the drawing shows.',
    ending:
      'The child folds the letter into a paper boat and sets it on the current. It drifts across the dark river. A while later another boat drifts back from the far bank, its side covered in glyphs you have never seen.',
    endOfSlice: 'The first chapter ends here. Thank you for playing!',
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
