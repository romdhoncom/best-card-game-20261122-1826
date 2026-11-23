// The deck: 24 cards, three of each of the eight types, shuffled. When it runs
// out, the discard pile is shuffled back in.
import { CARD_IDS } from './cards.js';
import { shuffle } from './random.js';

export function buildDeck(rng) {
  const deck = [];
  for (const id of CARD_IDS) for (let i = 0; i < 3; i++) deck.push(id);
  return shuffle(rng, deck);
}

export function drawCards(rng, side, n) {
  for (let i = 0; i < n && side.hand.length < 7; i++) {
    if (side.deck.length === 0) {
      side.deck = shuffle(rng, side.discard);
      side.discard = [];
      if (side.deck.length === 0) break;
    }
    side.hand.push(side.deck.pop());
  }
}
