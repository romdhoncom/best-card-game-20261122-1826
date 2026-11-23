// Input: click a card to play it, keys 1–7 do the same, Enter ends the turn
// (or starts the duel from the title), R restarts.
import { playCard, endTurn, restart, startGame } from './game.js';

export function bindInput(state) {
  document.getElementById('you-hand').addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    playCard(state, Number(card.dataset.index));
  });
  document.getElementById('end-turn').addEventListener('click', () => endTurn(state));
  document.getElementById('start-btn').addEventListener('click', () => startGame(state));
  document.querySelectorAll('.restart-btn').forEach((b) => b.addEventListener('click', () => restart(state)));
  document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '7') {
      playCard(state, Number(e.key) - 1);
    } else if (e.key === 'Enter') {
      if (state.phase === 'title') startGame(state);
      else endTurn(state);
    } else if (e.key === 'r' || e.key === 'R') {
      if (state.phase !== 'title') restart(state);
    }
  });
}
