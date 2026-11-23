// Ember Duel — the game state machine: turns, energy, card effects,
// shield, and the win/loss conditions. Pure logic; rendering lives in
// render.js and the opponent's choices live in ai.js.

import { buildDeck, drawCards, shuffle } from './deck.js';
import { cardById } from './cards.js';
import { rngFromSeed } from './random.js';

export const MAX_LIFE = 20;
export const START_ENERGY = 3;
export const MAX_ENERGY = 6;
export const HAND_LIMIT = 7;

export function createSide(name, rng) {
  const deck = shuffle(buildDeck(), rng);
  const side = {
    name,
    life: MAX_LIFE,
    maxLife: MAX_LIFE,
    shield: 0,
    energy: START_ENERGY,
    maxEnergy: START_ENERGY,
    drain: 0,
    hand: [],
    deck,
    discard: [],
  };
  drawCards(side.deck, side.discard, side.hand, 4, rng);
  return side;
}

export function createGame(seedText) {
  const rng = rngFromSeed(seedText);
  const state = {
    seed: seedText,
    rng,
    phase: 'title',
    turn: 1,
    player: createSide('You', rng),
    ai: createSide('Cinder', rng),
    log: ['The duel begins. Cinder shuffles the embers.'],
    winner: null,
  };
  return state;
}

export function startDuel(state) {
  state.phase = 'play';
  beginTurn(state, state.player);
  logLine(state, 'Your turn — play a card, then End Turn.');
}

export function beginTurn(state, side) {
  const isPlayer = side === state.player;
  const turnNumber = isPlayer ? state.turn : state.turn;
  side.maxEnergy = Math.min(START_ENERGY + (state.turn - 1), MAX_ENERGY);
  side.energy = Math.max(0, side.maxEnergy - side.drain);
  side.drain = 0;
  const drawn = drawCards(side.deck, side.discard, side.hand, 1, state.rng);
  if (drawn === 0) logLine(state, `${side.name} has no cards left to draw.`);
  return turnNumber;
}

export function canPlay(state, side, index) {
  const active = state.phase === 'play' ? state.player : state.phase === 'ai' ? state.ai : null;
  if (active === null) return { ok: false, reason: 'not playing' };
  if (side !== active) return { ok: false, reason: 'not your turn' };
  const id = side.hand[index];
  if (id === undefined) return { ok: false, reason: 'no such card' };
  const card = cardById(id);
  if (card.cost > side.energy) return { ok: false, reason: 'not enough energy' };
  return { ok: true, card };
}

// Play the card at `index` from `side`'s hand against the other side.
// Returns { ok, reason }.
export function playCard(state, side, index) {
  const check = canPlay(state, side, index);
  if (!check.ok) return check;
  const other = side === state.player ? state.ai : state.player;
  const card = check.card;
  side.energy -= card.cost;
  side.hand.splice(index, 1);
  side.discard.push(card.id);
  applyEffect(state, side, other, card);
  checkEnd(state);
  return { ok: true, card };
}

export function applyEffect(state, actor, target, card) {
  const effect = card.effect;
  if (effect.kind === 'damage') {
    dealDamage(state, target, effect.amount);
    logLine(state, `${actor.name} plays ${card.name} — ${effect.amount} damage to ${target.name}.`);
  } else if (effect.kind === 'shield') {
    actor.shield += effect.amount;
    logLine(state, `${actor.name} plays ${card.name} — gains ${effect.amount} shield.`);
  } else if (effect.kind === 'heal') {
    const healed = Math.min(effect.amount, actor.maxLife - actor.life);
    actor.life += healed;
    logLine(state, `${actor.name} plays ${card.name} — restores ${healed} life.`);
  } else if (effect.kind === 'draw') {
    const drawn = drawCards(actor.deck, actor.discard, actor.hand, effect.amount, state.rng);
    logLine(state, `${actor.name} plays ${card.name} — draws ${drawn}.`);
  }
  if (effect.draw) {
    const drawn = drawCards(actor.deck, actor.discard, actor.hand, effect.draw, state.rng);
    logLine(state, `${actor.name} draws ${drawn} more.`);
  }
  if (effect.drain) {
    target.drain += effect.drain;
    logLine(state, `${target.name} loses ${effect.drain} energy next turn.`);
  }
}

export function dealDamage(state, target, amount) {
  let left = amount;
  if (target.shield > 0) {
    const absorbed = Math.min(target.shield, left);
    target.shield -= absorbed;
    left -= absorbed;
  }
  target.life = Math.max(0, target.life - left);
}

export function checkEnd(state) {
  if (state.ai.life <= 0) {
    state.phase = 'won';
    state.winner = 'player';
    logLine(state, 'Cinder falls. Victory is yours.');
  } else if (state.player.life <= 0) {
    state.phase = 'lost';
    state.winner = 'ai';
    logLine(state, 'Your embers fade. Cinder wins the duel.');
  }
}

// End the player's turn: the AI plays, then a fresh player turn begins.
export function endTurn(state, chooseCard) {
  if (state.phase !== 'play') return;
  state.phase = 'ai';
  logLine(state, "Cinder's turn.");
  runAiTurn(state, chooseCard);
  if (state.phase === 'ai') {
    state.phase = 'play';
    state.turn += 1;
    beginTurn(state, state.player);
    logLine(state, `Turn ${state.turn} — your turn.`);
  }
}

export function runAiTurn(state, chooseCard) {
  beginTurn(state, state.ai);
  let guard = 0;
  while (state.phase === 'ai' && guard < 12) {
    guard++;
    const index = chooseCard(state, state.ai);
    if (index === null || index === undefined) break;
    const result = playCard(state, state.ai, index);
    if (!result.ok) break;
    if (state.phase !== 'ai') return;
  }
  if (state.phase === 'ai') logLine(state, 'Cinder ends its turn.');
}

export function logLine(state, text) {
  state.log.push(text);
  if (state.log.length > 6) state.log.splice(0, state.log.length - 6);
}
