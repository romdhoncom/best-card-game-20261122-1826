// Ember Duel boots here: a fresh game from the seed, the fixed screenshot
// state when ?shot= is given, the input bindings, and the headless self-play
// tally when ?test=N is given.
import { newGame } from './state.js';
import { render } from './render.js';
import { bindInput } from './input.js';
import { applyShot, selfPlay } from './shots.js';

const params = new URLSearchParams(location.search);
const seed = Number(params.get('seed') || 1234);
const state = newGame(seed);

const shot = params.get('shot');
if (shot) applyShot(state, shot);

render(state);
bindInput(state);

const test = params.get('test');
if (test) {
  const result = selfPlay(Number(test), seed);
  const text = `self-play: W ${result.wins} / L ${result.losses} / D ${result.draws} over ${test} games`;
  document.getElementById('test-result').textContent = text;
  document.title = text;
  console.log(text);
}
