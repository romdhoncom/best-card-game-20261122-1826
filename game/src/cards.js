// The eight card types of Ember Duel. Every card has a cost, an element and an
// effect. An element is told by colour AND shape, never by text alone:
// Ember ▲ orange, Frost ◆ blue, Spark ★ gold, Bloom ● green.
export const ELEMENTS = {
  ember: { shape: '▲', colour: '#e25822', name: 'Ember' },
  frost: { shape: '◆', colour: '#3a86ff', name: 'Frost' },
  spark: { shape: '★', colour: '#f5b301', name: 'Spark' },
  bloom: { shape: '●', colour: '#2e9e5b', name: 'Bloom' },
};

export const CARDS = {
  strike: { id: 'strike', name: 'Strike', element: 'ember', cost: 1, text: 'Deal 3 damage', damage: 3 },
  guard: { id: 'guard', name: 'Guard', element: 'frost', cost: 1, text: 'Gain 4 shield', shield: 4 },
  ember: { id: 'ember', name: 'Ember', element: 'ember', cost: 2, text: 'Deal 2, gain 2 shield', damage: 2, shield: 2 },
  mend: { id: 'mend', name: 'Mend', element: 'bloom', cost: 2, text: 'Heal 4 life', heal: 4 },
  spark: { id: 'spark', name: 'Spark', element: 'spark', cost: 1, text: 'Deal 2, draw 1', damage: 2, draw: 1 },
  frost: { id: 'frost', name: 'Frost', element: 'frost', cost: 2, text: 'Deal 2, gain 3 shield', damage: 2, shield: 3 },
  flame: { id: 'flame', name: 'Flame', element: 'ember', cost: 3, text: 'Deal 6 damage', damage: 6 },
  bloom: { id: 'bloom', name: 'Bloom', element: 'bloom', cost: 2, text: 'Heal 2, gain 3 shield', heal: 2, shield: 3 },
};

export const CARD_IDS = Object.keys(CARDS);
