const SAVE_KEY = 'vinland_saga_save_v1';

export function saveGame(state) {
  const snapshot = {
    player: state.player,
    party: state.party,
    inventory: state.inventory,
    progress: state.progress,
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
}

export function hasSave() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Corrupt save data, ignoring.', e);
    return null;
  }
}

export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}
