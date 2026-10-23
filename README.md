# Between Words

*Sanojen välissä*

A small browser puzzle game about learning two unknown languages from context
and helping two peoples understand each other again.

**Play:** https://kugez.github.io/between-words/

## How it plays

You arrive in a riverside village where nobody speaks your language. Tap the
villagers and watch what they do while they speak. Every glyph you see goes
into your notebook, where you guess its meaning. A page of the notebook is
confirmed only when every guess on it is right, and then those glyphs are
translated wherever they appear. To finish the chapter, write a letter for a
child in the villagers' own language.

In the second chapter you cross the river to the mountain people, who carve
a different script and build their sentences the other way round. In the
last chapter both peoples stand at the ends of the broken bridge, and you
translate their messages to each other until they start building again.

Each language lives in its own file with its grammar notes and every
scripted conversation: `src/data/river.js` and `src/data/mountain.js`.

## Running locally

The game is plain HTML, CSS and JavaScript with no build step. It uses ES
modules, so it has to be served over HTTP rather than opened as a file:

```sh
node tests/server.mjs   # then open http://localhost:4173
```

## Tests

An automated browser test plays through the game on every change, in
Chromium (desktop and phone) and WebKit (Safari):

```sh
npm install
npx playwright install chromium webkit
npm test
```

Every push to `main` that passes the tests is published to GitHub Pages.
