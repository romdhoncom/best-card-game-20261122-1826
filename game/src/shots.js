// Fixed states for the four screenshots (?shot=start|play|win|loss) and the
// headless self-play harness (?test=N). The play shot is the new v2 tableau:
// mid-game, mid-combo — two Ember cards just played, the COMBO x2 banner up,
// both hands on the table, so the table reads full at a glance.
import { CARDS } from './cards.js';
import { newGame } from './state.js';
import { applyCard, endTurn } from './game.js';

export function applyShot(state, shot) {
  if (shot === 'start') {
    state.phase = 'title';
    return;
  }
  if (shot === 'win') {
    state.cinder.life = 0;
    state.phase = 'win';
    state.log.push('Cinder falls — the last ember is yours!');
    return;
  }
  if (shot === 'loss') {
    state.you.life = 0;
    state.phase = 'loss';
    state.log.push('Your ember fades.');
    return;
  }
  if (shot === 'play') {
    state.phase = 'play';
    state.turn = 3;
    state.you.life = 17;
    state.you.shield = 5;
    state.you.energy = 2;
    state.cinder.life = 12;
    state.cinder.shield = 2;
    state.cinder.energy = 4;
    state.you.hand = ['guard', 'mend', 'spark', 'frost', 'bloom', 'ember', 'strike'];
    state.cinder.hand = ['guard', 'frost', 'strike', 'ember', 'mend', 'spark'];
    state.played = ['strike', 'flame'];
    state.elementsPlayed = ['ember', 'ember'];
    state.combo = { element: 'ember', bonus: 2 };
    state.log = [
      'You play Strike: 3 damage.',
      'You play Flame: 6 damage.',
      'COMBO x2! Two ember cards — +2 bonus damage!',
      'Cinder is reeling at 12 life.',
    ];
  }
}

// Play N full games headlessly with a random policy for the player side and
// report the tally. Used by ?test=N to prove the game completes.
export function selfPlay(n, seed) {
  let wins = 0;
  let losses = 0;
  let draws = 0;
  for (let g = 0; g < n; g++) {
    const s = newGame(seed + g * 7919);
    s.phase = 'play';
    s.instant = true;
    let guard = 0;
    while (s.phase === 'play' && guard++ < 200) {
      let played = true;
      while (played && s.phase === 'play') {
        const afford = s.you.hand
          .map((id, i) => ({ id, i }))
          .filter((c) => CARDS[c.id].cost <= s.you.energy);
        if (afford.length === 0) { played = false; break; }
        const pick = afford[Math.floor(s.rng() * afford.length)];
        applyCard(s, 'you', pick.i);
      }
      if (s.phase !== 'play') break;
      endTurn(s);
    }
    if (s.phase === 'win') wins++;
    else if (s.phase === 'loss') losses++;
    else draws++;
  }
  return { wins, losses, draws };
}
