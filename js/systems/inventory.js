import { ITEMS } from '../data/items.js';
import { recomputeStats } from './stats.js';

export function addItem(state, itemId, qty = 1) {
  state.inventory.items[itemId] = (state.inventory.items[itemId] || 0) + qty;
}

export function removeItem(state, itemId, qty = 1) {
  const have = state.inventory.items[itemId] || 0;
  state.inventory.items[itemId] = Math.max(0, have - qty);
}

export function addGear(state, itemId, qty = 1) {
  state.inventory.gear[itemId] = (state.inventory.gear[itemId] || 0) + qty;
}

export function removeGear(state, itemId, qty = 1) {
  const have = state.inventory.gear[itemId] || 0;
  state.inventory.gear[itemId] = Math.max(0, have - qty);
}

export function addMaterial(state, matId, qty = 1) {
  state.inventory.materials[matId] = (state.inventory.materials[matId] || 0) + qty;
}

export function removeMaterial(state, matId, qty = 1) {
  const have = state.inventory.materials[matId] || 0;
  state.inventory.materials[matId] = Math.max(0, have - qty);
}

// Equip an owned (unequipped) gear item onto a party member's slot.
// The previously equipped item (if any) is returned to the gear pool.
export function equipItem(state, member, itemId) {
  const item = ITEMS[itemId];
  if (!item || item.type !== 'equipment') return false;
  const owned = state.inventory.gear[itemId] || 0;
  if (owned <= 0) return false;

  const slot = item.slot;
  const previous = member.equipment[slot];
  removeGear(state, itemId, 1);
  if (previous) addGear(state, previous, 1);
  member.equipment[slot] = itemId;
  recomputeStats(member);
  return true;
}

export function unequipItem(state, member, slot) {
  const current = member.equipment[slot];
  if (!current) return false;
  addGear(state, current, 1);
  member.equipment[slot] = null;
  recomputeStats(member);
  return true;
}

export function useConsumable(member, itemId) {
  const item = ITEMS[itemId];
  if (!item || item.type !== 'consumable') return false;
  if (item.effect.hp) member.currentHp = Math.min(member.maxHp, member.currentHp + item.effect.hp);
  if (item.effect.mp) member.currentMp = Math.min(member.maxMp, member.currentMp + item.effect.mp);
  return true;
}
