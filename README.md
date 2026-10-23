# Between Words

*Sanojen välissä*

A small browser puzzle game about learning two unknown languages from context
and helping two peoples understand each other again.

**Play:** https://kugez.github.io/between-words/

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
