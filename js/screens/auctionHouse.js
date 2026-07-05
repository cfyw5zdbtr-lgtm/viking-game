import { setInteractive, clearUI, el, mount } from '../engine/ui.js';
import { state } from '../state.js';
import { ITEMS } from '../data/items.js';
import { AUCTION_MATERIALS } from '../data/shops.js';
import { rollMarketPrices, sellMaterial, buyMaterial } from '../systems/economy.js';
import { backButton, header, screenPanel } from './shared.js';

let params = {};

function render() {
  clearUI();
  setInteractive(true);
  const panel = screenPanel();
  panel.appendChild(header('Auction House'));
  panel.appendChild(el('div', { style: { color: '#9aa0b0', fontSize: '12px', marginBottom: '6px' } },
    'Prices shift with the tides of trade - check back for better deals.'));

  panel.appendChild(el('div', { className: 'title-text', style: { fontSize: '14px' } }, 'Sell your materials'));
  for (const matId of AUCTION_MATERIALS) {
    const item = ITEMS[matId];
    const owned = state.inventory.materials[matId] || 0;
    const price = state.market.prices[matId].sell;
    const row = el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #2a2a3a', padding: '6px 0' } });
    row.appendChild(el('div', { style: { flex: '1' } }, `${item.name} (owned: ${owned})`));
    row.appendChild(el('span', { className: 'gold-text' }, `${price}g each`));
    const btn = el('button', { className: 'pixel-btn', onClick: () => { if (sellMaterial(state, matId, 1)) render(); } }, 'Sell 1');
    if (owned <= 0) btn.disabled = true;
    row.appendChild(btn);
    panel.appendChild(row);
  }

  panel.appendChild(el('div', { className: 'title-text', style: { fontSize: '14px', marginTop: '10px' } }, 'Buy materials'));
  for (const matId of AUCTION_MATERIALS) {
    const item = ITEMS[matId];
    const price = state.market.prices[matId].buy;
    const row = el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #2a2a3a', padding: '6px 0' } });
    row.appendChild(el('div', { style: { flex: '1' } }, item.name));
    row.appendChild(el('span', { className: 'gold-text' }, `${price}g each`));
    const btn = el('button', { className: 'pixel-btn', onClick: () => { if (buyMaterial(state, matId, 1)) render(); } }, 'Buy 1');
    if (state.inventory.gold < price) btn.disabled = true;
    row.appendChild(btn);
    panel.appendChild(row);
  }

  mount(panel);
  mount(backButton(params));
}

const auctionHouse = {
  onEnter(p) {
    params = p;
    rollMarketPrices(state, AUCTION_MATERIALS);
    render();
  },
  onExit() { clearUI(); setInteractive(false); },
  update() {},
  render(ctx) {
    ctx.fillStyle = '#1a2030';
    ctx.fillRect(0, 0, 960, 540);
  },
};

export default auctionHouse;
