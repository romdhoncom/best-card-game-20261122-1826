// Ember Duel — the eight card types.
//
// Each card carries a cost, an element, and one effect. An element is a
// colour AND a shape (Ember ▲, Frost ◆, Spark ★, Bloom ●), so suits are
// told apart by colour and shape together, never by text alone.

export const ELEMENTS = {
  ember: { color: '#e2492f', glow: '#ff7a3c', glyph: '▲', label: 'Ember' },
  frost: { color: '#2f7fe2', glow: '#6ec1ff', glyph: '◆', label: 'Frost' },
  spark: { color: '#d9a521', glow: '#ffd94d', glyph: '★', label: 'Spark' },
  bloom: { color: '#3d9e57', glow: '#7ddc97', glyph: '●', label: 'Bloom' },
};

export const CARDS = [
  { id: 'strike', name: 'Strike', cost: 1, element: 'ember', value: 3,
    effect: { kind: 'damage', amount: 3 }, text: 'Deal 3 damage.' },
  { id: 'guard', name: 'Guard', cost: 1, element: 'frost', value: 4,
    effect: { kind: 'shield', amount: 4 }, text: 'Gain 4 shield.' },
  { id: 'ember', name: 'Ember', cost: 2, element: 'ember', value: 5,
    effect: { kind: 'damage', amount: 5 }, text: 'Deal 5 damage.' },
  { id: 'mend', name: 'Mend', cost: 2, element: 'bloom', value: 4,
    effect: { kind: 'heal', amount: 4 }, text: 'Restore 4 life.' },
  { id: 'spark', name: 'Spark', cost: 1, element: 'spark', value: 2,
    effect: { kind: 'damage', amount: 2, draw: 1 },
    text: 'Deal 2 damage. Draw 1 card.' },
  { id: 'frost', name: 'Frost', cost: 2, element: 'frost', value: 2,
    effect: { kind: 'damage', amount: 2, drain: 1 },
    text: 'Deal 2 damage. Foe loses 1 energy next turn.' },
  { id: 'flame', name: 'Flame', cost: 3, element: 'ember', value: 7,
    effect: { kind: 'damage', amount: 7 }, text: 'Deal 7 damage.' },
  { id: 'bloom', name: 'Bloom', cost: 1, element: 'bloom', value: 2,
    effect: { kind: 'draw', amount: 2 }, text: 'Draw 2 cards.' },
];

export function cardById(id) {
  return CARDS.find((card) => card.id === id);
}
