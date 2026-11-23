// Ember Duel — bootstrap. Reads the URL, builds the state, wires the
// handlers, and renders. ?shot= shows a fixed state for screenshots;
// ?test=N plays N full games headlessly and reports the results.

import { createGame, startDuel, playCard, endTurn } from './game.js';
import { chooseCard } from './ai.js';
import { render } from './render.js';
import { bindKeyboard } from './input.js';
import { stateForShot, runTests } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seed = params.get('seed') || 'ember-duel';

let state = shot && shot !== 'start' ? stateForShot(shot, seed) : createGame(seed);
if (shot === 'start') state.phase = 'title';

const handlers = {
  onPlayCard(index) {
    if (state.phase !== 'play') return;
    const result = playCard(state, state.player, index);
    if (result.ok) render(state, handlers);
  },
  onEndTurn() {
    if (state.phase !== 'play') return;
    endTurn(state, chooseCard);
    render(state, handlers);
  },
  onAgain() {
    state = createGame(seed);
    startDuel(state);
    render(state, handlers);
  },
};

document.getElementById('play-button').addEventListener('click', () => {
  startDuel(state);
  render(state, handlers);
});

bindKeyboard(handlers);
render(state, handlers);

// Headless self-play test: report into the page for --dump-dom checks.
if (params.get('test')) {
  const count = Number(params.get('test')) || 10;
  const results = runTests(count);
  const node = document.createElement('div');
  node.id = 'test-result';
  node.textContent = JSON.stringify(results);
  document.body.appendChild(node);
  document.title = results.errors.length === 0 && results.unfinished === 0
    ? 'TESTS PASS'
    : 'TESTS FAIL';
}

// Exposed for debugging in the browser console only.
window.__ember = { get state() { return state; }, playCard, endTurn, chooseCard };
