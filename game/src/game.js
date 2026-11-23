// The rules engine: playing a card, the combo, ending the turn, winning and
// losing. Every mutation ends in a render, so the table always shows the state.
import { CARDS } from './cards.js';
import { dealDamage, heal, newGame, startTurn } from './state.js';
import { noteElementPlayed } from './combo.js';
import { drawCards } from './deck.js';
import { cinderPlay } from './ai.js';
import { sfx } from './sound.js';
import { render } from './render.js';

export function startGame(state) {
  state.phase = 'play';
  state.log.push('Your move — click a card to play it.');
  sfx.turn();
  render(state);
}

export function applyCard(state, who, handIndex) {
  const side = state[who];
  const foe = state[who === 'you' ? 'cinder' : 'you'];
  const id = side.hand[handIndex];
  const card = CARDS[id];
  if (!card || card.cost > side.energy) return false;
  side.hand.splice(handIndex, 1);
  side.discard.push(id);
  side.energy -= card.cost;
  const whoName = who === 'you' ? 'You' : 'Cinder';
  if (card.damage) {
    const r = dealDamage(foe, card.damage);
    state.log.push(`${whoName} play ${card.name}: ${r.dealt} damage${r.absorbed ? ` (${r.absorbed} absorbed by shield)` : ''}.`);
  }
  if (card.shield) {
    side.shield += card.shield;
    state.log.push(`${whoName} gain ${card.shield} shield.`);
  }
  if (card.heal) {
    heal(side, card.heal);
    state.log.push(`${whoName} heal ${card.heal} life.`);
  }
  if (card.draw) {
    drawCards(state.rng, side, card.draw);
    state.log.push(`${whoName} draw a card.`);
  }
  if (who === 'you') {
    state.played.push(id);
  }
  // The combo is open to both sides: two cards of one element in a turn, and
  // the second one lands with +2 bonus damage under the COMBO x2 banner.
  const combo = noteElementPlayed(state, card.element);
  if (combo) {
    const r = dealDamage(foe, combo.bonus);
    state.log.push(`COMBO x2! Two ${card.element} cards — +${combo.bonus} bonus damage!`);
    if (who === 'you') sfx.combo();
  } else if (who === 'you') {
    sfx.play();
  }
  checkEnd(state);
  return true;
}

export function playCard(state, handIndex) {
  if (state.phase !== 'play') return;
  if (applyCard(state, 'you', handIndex)) render(state);
}

export function endTurn(state) {
  if (state.phase !== 'play' || state.busy) return;
  state.busy = true;
  // Cinder's turn starts fresh: its own combo window, its own played cards.
  state.elementsPlayed = [];
  state.combo = null;
  state.played = [];
  state.log.push('Cinder takes its turn…');
  const step = () => {
    cinderPlay(state, applyCard);
    if (state.phase === 'play') {
      startTurn(state);
      state.log.push('Your turn.');
      sfx.turn();
    }
    state.busy = false;
    render(state);
  };
  if (state.instant) {
    step();
  } else {
    render(state);
    setTimeout(step, 650);
  }
}

export function checkEnd(state) {
  if (state.cinder.life <= 0) {
    state.phase = 'win';
    state.log.push('Cinder falls — the last ember is yours!');
    sfx.win();
  } else if (state.you.life <= 0) {
    state.phase = 'loss';
    state.log.push('Your ember fades.');
    sfx.loss();
  }
}

export function restart(state) {
  const fresh = newGame(state.seed);
  Object.assign(state, fresh);
  state.phase = 'play';
  state.log.push('A new duel. Your move.');
  render(state);
}
