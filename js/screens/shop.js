import { setInteractive, clearUI, el, mount } from '../engine/ui.js';
import { state } from '../state.js';
import { ITEMS } from '../data/items.js';
import { SHOP_STOCK } from '../data/shops.js';
import { buyItem } from '../systems/economy.js';
import { backButton, header, screenPanel, tabRow, renderEquipmentSection } from './shared.js';

let params = {};
let tab = 'buy';

function render() {
  clearUI();
  setInteractive(true);
  const panel = screenPanel();
  panel.appendChild(header('Village Shop'));
  panel.appendChild(tabRow(['Buy', 'Equip'], tab === 'buy' ? 'Buy' : 'Equip', (t) => { tab = t.toLowerCase(); render(); }));

  if (tab === 'buy') {
    const stock = SHOP_STOCK.filter((s) => s.unlockAfterStage <= state.progress.stagesCleared.length);
    for (const { id: itemId } of stock) {
      const item = ITEMS[itemId];
      const row = el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #2a2a3a', padding: '6px 0' } });
      row.appendChild(el('div', { style: { flex: '1' } }, [
        el('div', {}, item.name),
        el('div', { style: { color: '#9aa0b0', fontSize: '12px' } }, item.description),
      ]));
      row.appendChild(el('span', { className: 'gold-text' }, `${item.price}g`));
      const btn = el('button', {
        className: 'pixel-btn',
        onClick: () => { if (buyItem(state, itemId)) render(); },
      }, 'Buy');
      if (state.inventory.gold < item.price) btn.disabled = true;
      row.appendChild(btn);
      panel.appendChild(row);
    }
  } else {
    panel.appendChild(renderEquipmentSection(render));
  }

  mount(panel);
  mount(backButton(params));
}

const shop = {
  onEnter(p) {
    params = p;
    tab = 'buy';
    render();
  },
  onExit() { clearUI(); setInteractive(false); },
  update() {},
  render(ctx) {
    ctx.fillStyle = '#1a1a26';
    ctx.fillRect(0, 0, 960, 540);
  },
};

export default shop;
