// The COMBO: play two cards of the same element in one turn and the second
// one lands with +2 bonus damage to Cinder, under a COMBO x2 banner. Once per
// turn, so the decision is which element to double up on.
export const COMBO_BONUS = 2;

export function noteElementPlayed(state, element) {
  if (state.combo) return null;
  if (state.elementsPlayed.includes(element)) {
    state.combo = { element, bonus: COMBO_BONUS };
    return state.combo;
  }
  state.elementsPlayed.push(element);
  return null;
}

export function resetCombo(state) {
  state.elementsPlayed = [];
  state.combo = null;
  state.played = [];
}
