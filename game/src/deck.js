// Ember Duel — decks. A deck is 24 cards: three copies of each of the
// eight card types. Drawing reshuffles the discard pile when the deck
// runs out, so a game never stalls for lack of cards.

import { CARDS } from './cards.js';

export function buildDeck() {
  const deck = [];
  for (const card of CARDS) {
    for (let i = 0; i < 3; i++) deck.push(card.id);
  }
  return deck;
}

export function shuffle(deck, rng) {
  const shuffled = deck.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }
  return shuffled;
}

// Draw up to `count` cards from deck into hand, reshuffling the discard
// pile when the deck empties. Returns how many cards were actually drawn.
export function drawCards(deck, discard, hand, count, rng) {
  let drawn = 0;
  for (let i = 0; i < count; i++) {
    if (deck.length === 0) {
      if (discard.length === 0) break;
      deck.push(...shuffle(discard.splice(0), rng));
    }
    hand.push(deck.pop());
    drawn++;
  }
  return drawn;
}
