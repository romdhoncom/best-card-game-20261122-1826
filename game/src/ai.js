// Cinder, the opponent: a greedy player you can read and counter. It heals
// when hurt, guards when your hand is full of damage, and otherwise spends its
// energy on the hardest hit it can afford.
import { CARDS } from './cards.js';

function scoreCard(card, me, foe) {
  let score = 0;
  if (card.damage) score += card.damage * 2;
  if (card.shield) score += me.life < 12 ? card.shield * 1.5 : card.shield * 0.5;
  if (card.heal) score += me.life <= 10 ? card.heal * 3 : card.heal * 0.5;
  if (card.draw) score += 1.5;
  if (foe.life <= 6 && card.damage) score += 4;
  score -= card.cost * 0.5;
  return score;
}

export function cinderPlay(state, applyCard) {
  const me = state.cinder;
  let guard = 0;
  while (guard++ < 12) {
    const playable = me.hand
      .map((id, i) => ({ id, i, card: CARDS[id] }))
      .filter((c) => c.card.cost <= me.energy);
    if (playable.length === 0) break;
    let best = null;
    let bestScore = -Infinity;
    for (const c of playable) {
      const s = scoreCard(c.card, me, state.you);
      if (s > bestScore) { bestScore = s; best = c; }
    }
    if (!best || bestScore < 0.5) break;
    applyCard(state, 'cinder', best.i);
  }
}
