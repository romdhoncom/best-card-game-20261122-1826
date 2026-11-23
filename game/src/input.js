// Ember Duel — keyboard input. Number keys play the matching hand card,
// Enter or Space ends the turn, R starts a fresh duel from any screen.

export function bindKeyboard(handlers) {
  document.addEventListener('keydown', (event) => {
    if (event.key >= '1' && event.key <= '7') {
      const index = Number(event.key) - 1;
      handlers.onPlayCard(index);
    } else if (event.key === 'Enter' || event.key === ' ') {
      const endButton = document.getElementById('end-turn');
      if (endButton && !endButton.disabled) handlers.onEndTurn();
    } else if (event.key === 'r' || event.key === 'R') {
      handlers.onAgain();
    }
  });
}
