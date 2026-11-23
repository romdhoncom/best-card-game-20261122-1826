// Ember Duel — rendering. Builds the table, the hands, the life totals,
// the energy pips and the log from the game state, and re-renders after
// every move. Cards are real DOM elements so they can slide, flip and
// snap with CSS transitions.

import { ELEMENTS, cardById } from './cards.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function cardElement(card, opts) {
  const element = ELEMENTS[card.element];
  const node = el('div', 'card' + (opts && opts.faceDown ? ' card-back' : ''));
  node.style.setProperty('--element', element.color);
  node.style.setProperty('--glow', element.glow);
  if (opts && opts.faceDown) {
    node.appendChild(el('div', 'card-glyph', '▲'));
    node.appendChild(el('div', 'card-name', 'EMBER'));
    return node;
  }
  const cost = el('div', 'card-cost', String(card.cost));
  cost.title = 'Energy cost';
  node.appendChild(cost);
  node.appendChild(el('div', 'card-glyph', element.glyph));
  node.appendChild(el('div', 'card-value', String(card.value)));
  node.appendChild(el('div', 'card-name', card.name.toUpperCase()));
  node.appendChild(el('div', 'card-text', card.text));
  if (opts && opts.playable === false) node.classList.add('unplayable');
  if (opts && opts.index !== undefined) node.dataset.index = String(opts.index);
  return node;
}

export function renderTitle(state) {
  const title = document.getElementById('title-screen');
  const table = document.getElementById('table');
  const end = document.getElementById('end-screen');
  title.classList.remove('hidden');
  table.classList.add('hidden');
  end.classList.add('hidden');
}

export function renderTable(state, onPlayCard, onEndTurn) {
  document.getElementById('title-screen').classList.add('hidden');
  document.getElementById('end-screen').classList.add('hidden');
  const table = document.getElementById('table');
  table.classList.remove('hidden');

  renderSide(state, state.ai, 'ai', false);
  renderSide(state, state.player, 'player', true, onPlayCard);
  renderLog(state);
  renderCenter(state, onEndTurn);
}

function renderSide(state, side, who, faceUp, onPlayCard) {
  const life = document.getElementById(`${who}-life`);
  life.textContent = `♥ ${side.life}`;
  const shield = document.getElementById(`${who}-shield`);
  shield.textContent = side.shield > 0 ? `🛡 ${side.shield}` : '';
  shield.classList.toggle('hidden', side.shield <= 0);
  const energy = document.getElementById(`${who}-energy`);
  energy.textContent = '';
  for (let i = 0; i < side.maxEnergy; i++) {
    const pip = el('span', 'pip' + (i < side.energy ? ' pip-full' : ' pip-empty'));
    pip.textContent = '●';
    energy.appendChild(pip);
  }
  const hand = document.getElementById(`${who}-hand`);
  hand.textContent = '';
  side.hand.forEach((id, index) => {
    const card = cardById(id);
    const playable = faceUp && state.phase === 'play' && card.cost <= side.energy;
    const node = cardElement(card, { faceDown: !faceUp, playable, index });
    if (faceUp) {
      node.addEventListener('click', () => onPlayCard(index));
      node.tabIndex = 0;
      node.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') onPlayCard(index);
      });
    }
    hand.appendChild(node);
  });
  const count = document.getElementById(`${who}-deck`);
  count.textContent = `Deck ${side.deck.length} · Discard ${side.discard.length}`;
}

function renderCenter(state, onEndTurn) {
  const turn = document.getElementById('turn-label');
  turn.textContent = state.phase === 'ai' ? "Cinder's turn…" : `Turn ${state.turn} — your move`;
  const endButton = document.getElementById('end-turn');
  endButton.disabled = state.phase !== 'play';
  endButton.onclick = onEndTurn;
}

function renderLog(state) {
  const log = document.getElementById('log');
  log.textContent = '';
  state.log.forEach((line) => log.appendChild(el('div', 'log-line', line)));
}

export function renderEnd(state, onAgain) {
  document.getElementById('title-screen').classList.add('hidden');
  document.getElementById('table').classList.remove('hidden');
  const end = document.getElementById('end-screen');
  end.classList.remove('hidden');
  const won = state.phase === 'won';
  end.classList.toggle('win', won);
  end.classList.toggle('loss', !won);
  document.getElementById('end-title').textContent = won ? '★ VICTORY ★' : 'DEFEAT';
  document.getElementById('end-detail').textContent = won
    ? `Cinder's embers are out in ${state.turn} turns. Your life: ${state.player.life} · Cinder's life: 0.`
    : `Cinder wins in ${state.turn} turns. Your life: 0 · Cinder's life: ${state.ai.life}.`;
  document.getElementById('play-again').onclick = onAgain;
}

export function render(state, handlers) {
  if (state.phase === 'title') renderTitle(state);
  else if (state.phase === 'won' || state.phase === 'lost') {
    renderTable(state, handlers.onPlayCard, handlers.onEndTurn);
    renderEnd(state, handlers.onAgain);
  } else renderTable(state, handlers.onPlayCard, handlers.onEndTurn);
}
