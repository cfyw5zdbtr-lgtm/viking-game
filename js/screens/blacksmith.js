import { setInteractive, clearUI, el, mount } from '../engine/ui.js';
import { state } from '../state.js';
import { ITEMS } from '../data/items.js';
import { BLACKSMITH_RECIPES } from '../data/shops.js';
import { canCraft, craftItem } from '../systems/crafting.js';
import { backButton, header, screenPanel, tabRow, renderEquipmentSection } from './shared.js';

let params = {};
let tab = 'craft';

function recipeText(recipe) {
  const parts = [`${recipe.gold}g`];
  for (const [matId, qty] of Object.entries(recipe.materials || {})) {
    const owned = state.inventory.materials[matId] || 0;
    parts.push(`${ITEMS[matId].name} x${qty} (have ${owned})`);
  }
  if (recipe.upgradeFrom) {
    const owned = state.inventory.gear[recipe.upgradeFrom] || 0;
    parts.push(`requires ${ITEMS[recipe.upgradeFrom].name} (have ${owned})`);
  }
  return parts.join(', ');
}

function render() {
  clearUI();
  setInteractive(true);
  const panel = screenPanel();
  panel.appendChild(header('Blacksmith'));
  panel.appendChild(tabRow(['Craft', 'Equip'], tab === 'craft' ? 'Craft' : 'Equip', (t) => { tab = t.toLowerCase(); render(); }));

  if (tab === 'craft') {
    for (const itemId of BLACKSMITH_RECIPES) {
      const item = ITEMS[itemId];
      const check = canCraft(state, itemId);
      const row = el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #2a2a3a', padding: '6px 0' } });
      row.appendChild(el('div', { style: { flex: '1' } }, [
        el('div', {}, item.name),
        el('div', { style: { color: '#9aa0b0', fontSize: '12px' } }, item.description),
        el('div', { style: { color: '#7a7a8a', fontSize: '11px' } }, recipeText(item.craft)),
        !check.ok ? el('div', { style: { color: '#a05050', fontSize: '11px' } }, check.reason) : null,
      ]));
      const btn = el('button', {
        className: 'pixel-btn',
        onClick: () => { if (craftItem(state, itemId)) render(); },
      }, 'Craft');
      if (!check.ok) btn.disabled = true;
      row.appendChild(btn);
      panel.appendChild(row);
    }
  } else {
    panel.appendChild(renderEquipmentSection(render));
  }

  mount(panel);
  mount(backButton(params));
}

const blacksmith = {
  onEnter(p) {
    params = p;
    tab = 'craft';
    render();
  },
  onExit() { clearUI(); setInteractive(false); },
  update() {},
  render(ctx) {
    ctx.fillStyle = '#241a1a';
    ctx.fillRect(0, 0, 960, 540);
  },
};

export default blacksmith;
