import { ITEMS } from '../data/items.js';
import { canAfford, spendGold } from './economy.js';
import { addGear, removeGear, removeMaterial } from './inventory.js';

export function canCraft(state, itemId) {
  const item = ITEMS[itemId];
  if (!item || !item.craft) return { ok: false, reason: 'No recipe.' };
  const recipe = item.craft;
  if (!canAfford(state, recipe.gold)) return { ok: false, reason: 'Not enough gold.' };
  for (const [matId, qty] of Object.entries(recipe.materials || {})) {
    if ((state.inventory.materials[matId] || 0) < qty) {
      return { ok: false, reason: `Need ${qty}x ${ITEMS[matId].name}.` };
    }
  }
  if (recipe.upgradeFrom && (state.inventory.gear[recipe.upgradeFrom] || 0) < 1) {
    return { ok: false, reason: `Need an unequipped ${ITEMS[recipe.upgradeFrom].name}.` };
  }
  return { ok: true };
}

export function craftItem(state, itemId) {
  const check = canCraft(state, itemId);
  if (!check.ok) return false;
  const recipe = ITEMS[itemId].craft;
  spendGold(state, recipe.gold);
  for (const [matId, qty] of Object.entries(recipe.materials || {})) {
    removeMaterial(state, matId, qty);
  }
  if (recipe.upgradeFrom) removeGear(state, recipe.upgradeFrom, 1);
  addGear(state, itemId, 1);
  return true;
}
