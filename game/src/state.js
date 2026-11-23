// The duel's state: both sides' life, shield, energy, hands and decks, the
// turn counter, the cards played this turn and the log. Energy grows with the
// turn: 3 on turn 1, then +1 a turn, up to 6.
import { buildDeck, drawCards } from './deck.js';
import { makeRng } from './random.js';

export const MAX_LIFE = 20;
export const MAX_HAND = 7;

export function energyForTurn(turn) {
  return Math.min(6, turn + 2);
}

function freshSide(rng) {
  return { life: MAX_LIFE, shield: 0, energy: 0, hand: [], deck: buildDeck(rng), discard: [] };
}

export function newGame(seed = 1234) {
  const rng = makeRng(seed);
  const state = {
    phase: 'title',
    turn: 1,
    seed,
    rng,
    you: freshSide(rng),
    cinder: freshSide(rng),
    played: [],
    elementsPlayed: [],
    combo: null,
    log: ['The duel begins. You hold the first ember.'],
  };
  drawCards(rng, state.you, 4);
  drawCards(rng, state.cinder, 4);
  state.you.energy = energyForTurn(1);
  state.cinder.energy = energyForTurn(1);
  return state;
}

// Damage hits shield first; whatever is left hits life.
export function dealDamage(side, n) {
  const absorbed = Math.min(side.shield, n);
  side.shield -= absorbed;
  const dealt = n - absorbed;
  side.life = Math.max(0, side.life - dealt);
  return { absorbed, dealt };
}

export function heal(side, n) {
  side.life = Math.min(MAX_LIFE, side.life + n);
}

export function startTurn(state) {
  state.turn += 1;
  const energy = energyForTurn(state.turn);
  state.you.energy = energy;
  state.cinder.energy = energy;
  state.played = [];
  state.elementsPlayed = [];
  state.combo = null;
  drawCards(state.rng, state.you, 2);
  drawCards(state.rng, state.cinder, 2);
  state.log.push(`Turn ${state.turn}: energy grows to ${energy}.`);
}
