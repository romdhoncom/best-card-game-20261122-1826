// Ember Duel — Cinder's brain. A readable heuristic, so its choices can
// be read and countered: it finishes a low-life foe, guards when hurt,
// heals when badly wounded, and otherwise spends its energy on damage.

import { cardById } from './cards.js';

export function scoreCard(state, ai, card) {
  const foe = state.player;
  let score = 0;
  if (card.effect.kind === 'damage') {
    score = card.effect.amount * 2;
    if (foe.life <= card.effect.amount) score += 50;
    if (foe.life <= 6) score += 6;
  } else if (card.effect.kind === 'shield') {
    score = card.effect.amount;
    if (ai.life <= 8) score += 10;
    if (ai.shield >= 8) score -= 8;
  } else if (card.effect.kind === 'heal') {
    score = ai.life < ai.maxLife ? card.effect.amount * 2 : -10;
    if (ai.life <= 6) score += 12;
  } else if (card.effect.kind === 'draw') {
    score = ai.hand.length >= 6 ? -6 : 5;
  }
  if (card.effect.draw) score += 3;
  if (card.effect.drain) score += 3;
  // Prefer the most damage per energy; break ties toward cheaper cards.
  score += card.effect.amount / card.cost;
  return score;
}

// Pick the index of the best card Cinder can afford, or null to pass.
export function chooseCard(state, ai) {
  let bestIndex = null;
  let bestScore = -Infinity;
  ai.hand.forEach((id, index) => {
    const card = cardById(id);
    if (card.cost > ai.energy) return;
    const score = scoreCard(state, ai, card);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });
  // Never spend the last energy on a draw when the hand is already full.
  return bestScore > 0 ? bestIndex : null;
}
