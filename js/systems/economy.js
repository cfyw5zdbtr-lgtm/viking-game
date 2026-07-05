import { ITEMS } from '../data/items.js';
import { addItem, addGear, addMaterial, removeMaterial } from './inventory.js';

export function canAfford(state, gold) {
  return state.inventory.gold >= gold;
}

export function spendGold(state, amount) {
  state.inventory.gold = Math.max(0, state.inventory.gold - amount);
}

export function earnGold(state, amount) {
  state.inventory.gold += amount;
}

export function buyItem(state, itemId) {
  const item = ITEMS[itemId];
  if (!item || !canAfford(state, item.price)) return false;
  spendGold(state, item.price);
  if (item.type === 'consumable') addItem(state, itemId, 1);
  else if (item.type === 'equipment') addGear(state, itemId, 1);
  return true;
}

export function sellConsumable(state, itemId) {
  const item = ITEMS[itemId];
  const owned = state.inventory.items[itemId] || 0;
  if (!item || owned <= 0) return false;
  state.inventory.items[itemId] = owned - 1;
  earnGold(state, Math.floor(item.price / 2));
  return true;
}

// Market prices fluctuate +/-15% each time the Auction House is entered,
// stored on state.market so the price stays stable while the screen is open.
export function rollMarketPrices(state, materialIds) {
  const prices = {};
  for (const id of materialIds) {
    const mult = 0.85 + Math.random() * 0.3;
    prices[id] = { sell: Math.round(ITEMS[id].sellPrice * mult), buy: Math.round(ITEMS[id].buyPrice * mult) };
  }
  state.market.prices = prices;
  return prices;
}

export function sellMaterial(state, matId, qty = 1) {
  const owned = state.inventory.materials[matId] || 0;
  if (owned < qty) return false;
  const price = state.market.prices[matId]?.sell ?? ITEMS[matId].sellPrice;
  removeMaterial(state, matId, qty);
  earnGold(state, price * qty);
  return true;
}

export function buyMaterial(state, matId, qty = 1) {
  const price = state.market.prices[matId]?.buy ?? ITEMS[matId].buyPrice;
  const cost = price * qty;
  if (!canAfford(state, cost)) return false;
  spendGold(state, cost);
  addMaterial(state, matId, qty);
  return true;
}
