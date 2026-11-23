// Ember Duel — deterministic states for screenshots and self-play tests.
//
// ?shot=start  the title screen
// ?shot=play   a mid-game table (both hands, life totals, energy visible)
// ?shot=win    the victory screen
// ?shot=loss   the defeat screen
// ?test=1      play full games headlessly and report the results into the
//              page, so a headless browser can verify the game end to end.
//
// The shown states are built from a seed so the same URL always renders
// the same table; the test mode proves real play reaches both endings.

import { createGame, startDuel, playCard, endTurn, logLine } from './game.js';
import { chooseCard } from './ai.js';
import { cardById } from './cards.js';
import { rngFromSeed } from './random.js';

function pickHand(rng, ids) {
  // Sample distinct cards where possible, so a shown hand reads as a
  // varied hand rather than three copies of one card.
  const pool = ids.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  const hand = [];
  for (let i = 0; i < 5; i++) hand.push(pool[i % pool.length]);
  return hand.slice(0, Math.min(5, ids.length));
}

function shownState(seed, setup) {
  const state = createGame(seed);
  startDuel(state);
  setup(state, rngFromSeed(seed + '-shown'));
  return state;
}

export function stateForShot(shot, seed) {
  if (shot === 'play') {
    return shownState(seed, (state, rng) => {
      state.turn = 5;
      state.player.life = 14;
      state.player.shield = 4;
      state.player.energy = 4;
      state.player.maxEnergy = 5;
      state.player.hand = pickHand(rng, ['strike', 'ember', 'spark', 'guard', 'flame']);
      state.ai.life = 11;
      state.ai.shield = 2;
      state.ai.energy = 5;
      state.ai.maxEnergy = 5;
      state.ai.hand = pickHand(rng, ['strike', 'ember', 'frost', 'guard']);
      state.log = [
        'Turn 5 — your move',
        'Cinder plays Ember — 5 damage to You.',
        'You play Guard — gains 4 shield.',
        'Cinder plays Frost — 2 damage. You lose 1 energy next turn.',
        'You play Spark — 2 damage to Cinder. You draw 1 more.',
      ];
    });
  }
  if (shot === 'win') {
    return shownState(seed, (state, rng) => {
      state.turn = 7;
      state.phase = 'won';
      state.winner = 'player';
      state.player.life = 9;
      state.player.shield = 0;
      state.player.energy = 2;
      state.player.maxEnergy = 6;
      state.player.hand = pickHand(rng, ['mend', 'spark', 'bloom']);
      state.ai.life = 0;
      state.ai.shield = 0;
      state.ai.energy = 0;
      state.ai.hand = [];
      state.log = [
        'Turn 7 — your move',
        'You play Flame — 7 damage to Cinder.',
        'Cinder falls. Victory is yours.',
      ];
    });
  }
  if (shot === 'loss') {
    return shownState(seed, (state, rng) => {
      state.turn = 8;
      state.phase = 'lost';
      state.winner = 'ai';
      state.player.life = 0;
      state.player.shield = 0;
      state.player.energy = 0;
      state.player.hand = pickHand(rng, ['guard', 'mend']);
      state.ai.life = 6;
      state.ai.shield = 3;
      state.ai.energy = 3;
      state.ai.maxEnergy = 6;
      state.ai.hand = pickHand(rng, ['ember', 'strike', 'flame']);
      state.log = [
        'Turn 8 — your move',
        'Cinder plays Flame — 7 damage to You.',
        'Your embers fade. Cinder wins the duel.',
      ];
    });
  }
  return createGame(seed);
}

// Play one full game headlessly: the player spends energy on its best
// damage card each turn, then ends the turn. Returns the outcome.
export function selfPlay(seed) {
  const state = createGame(seed);
  startDuel(state);
  let turns = 0;
  while (state.phase === 'play' && turns < 60) {
    turns++;
    let guard = 0;
    while (state.phase === 'play' && guard < 12) {
      guard++;
      let best = null;
      let bestValue = -1;
      state.player.hand.forEach((id, index) => {
        const card = cardById(id);
        if (card.cost > state.player.energy) return;
        const value = card.effect.kind === 'damage' ? card.effect.amount : 0;
        if (value > bestValue) {
          bestValue = value;
          best = index;
        }
      });
      if (best === null || bestValue <= 0) break;
      playCard(state, state.player, best);
    }
    if (state.phase === 'play') endTurn(state, chooseCard);
  }
  return { phase: state.phase, turns, playerLife: state.player.life, aiLife: state.ai.life };
}

export function runTests(count) {
  const results = { games: 0, wins: 0, losses: 0, unfinished: 0, errors: [] };
  for (let i = 0; i < count; i++) {
    try {
      const outcome = selfPlay(`test-${i}`);
      results.games++;
      if (outcome.phase === 'won') results.wins++;
      else if (outcome.phase === 'lost') results.losses++;
      else results.unfinished++;
    } catch (error) {
      results.errors.push(`game ${i}: ${error.message}`);
    }
  }
  return results;
}
