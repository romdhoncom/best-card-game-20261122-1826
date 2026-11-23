// The table: every render rebuilds the hands, the played cards, the combo
// banner, the meters and the log from the state, so the screen never drifts.
import { ELEMENTS, CARDS } from './cards.js';
import { energyForTurn } from './state.js';

const $ = (id) => document.getElementById(id);

function valueLine(card) {
  const parts = [];
  if (card.damage) parts.push(`⚔ ${card.damage}`);
  if (card.shield) parts.push(`🛡 ${card.shield}`);
  if (card.heal) parts.push(`❤ ${card.heal}`);
  if (card.draw) parts.push(`+${card.draw} card`);
  return parts.join(' · ');
}

function cardEl(id, opts = {}) {
  const card = CARDS[id];
  const el = ELEMENTS[card.element];
  const div = document.createElement('div');
  div.className = 'card' + (opts.mini ? ' mini' : '') + (opts.playable ? ' playable' : '') + (opts.cant ? ' cant' : '');
  div.style.borderTop = `6px solid ${el.colour}`;
  if (opts.index !== undefined) div.dataset.index = opts.index;
  div.innerHTML =
    `<div class="cost">${card.cost}</div>` +
    `<div class="shape" style="color:${el.colour}">${el.shape}</div>` +
    `<div class="cname">${card.name}</div>` +
    `<div class="ctext">${card.text}</div>` +
    `<div class="value">${valueLine(card)}</div>`;
  return div;
}

function backEl() {
  const div = document.createElement('div');
  div.className = 'card mini back';
  div.innerHTML = '<div class="shape">🔥</div><div class="cname">Cinder</div>';
  return div;
}

export function render(state) {
  $('cinder-life').textContent = state.cinder.life;
  $('cinder-shield').textContent = state.cinder.shield;
  $('cinder-energy').textContent = state.cinder.energy;
  $('you-life').textContent = state.you.life;
  $('you-shield').textContent = state.you.shield;
  $('you-energy').textContent = state.you.energy;
  $('you-energy-max').textContent = energyForTurn(state.turn);
  $('turn-label').textContent = `Turn ${state.turn} — energy ${energyForTurn(state.turn)}`;
  $('deck-count').textContent = state.you.deck.length;

  const cinderHand = $('cinder-hand');
  cinderHand.innerHTML = '';
  for (const _id of state.cinder.hand) cinderHand.appendChild(backEl());

  const youHand = $('you-hand');
  youHand.innerHTML = '';
  state.you.hand.forEach((id, i) => {
    const card = CARDS[id];
    const playable = state.phase === 'play' && card.cost <= state.you.energy;
    youHand.appendChild(cardEl(id, { index: i, playable, cant: state.phase === 'play' && !playable }));
  });

  const played = $('played');
  played.innerHTML = '';
  for (const id of state.played.slice(-3)) played.appendChild(cardEl(id, { mini: true }));
  if (state.played.length === 0) played.innerHTML = '<div class="col-label">— none yet —</div>';

  const banner = $('combo-banner');
  if (state.combo) {
    const el = ELEMENTS[state.combo.element];
    banner.classList.remove('hidden');
    $('combo-detail').textContent = `${el.shape} ${el.name} — +${state.combo.bonus} bonus damage!`;
  } else {
    banner.classList.add('hidden');
  }

  $('log').innerHTML = state.log.slice(-4).map((l) => `<div>${l}</div>`).join('');

  $('title-overlay').classList.toggle('hidden', state.phase !== 'title');
  $('win-overlay').classList.toggle('hidden', state.phase !== 'win');
  $('loss-overlay').classList.toggle('hidden', state.phase !== 'loss');
}
