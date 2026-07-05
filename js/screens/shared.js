import { goto } from '../router.js';
import { el } from '../engine/ui.js';
import { state } from '../state.js';
import { ITEMS } from '../data/items.js';
import { equipItem, unequipItem } from '../systems/inventory.js';
import { saveGame } from '../systems/save.js';

export function backButton(params) {
  return el('button', {
    className: 'pixel-btn',
    style: { position: 'absolute', top: '14px', right: '16px' },
    onClick: () => {
      saveGame(state);
      goto('overworld', { mapKey: params.returnMapKey, exactPos: params.exactPos });
    },
  }, 'Leave');
}

export function header(title) {
  return el('div', {
    style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  }, [
    el('div', { className: 'title-text', style: { fontSize: '22px' } }, title),
    el('div', {}, [
      el('span', { className: 'gold-text' }, `${state.inventory.gold} gold`),
      '   ',
      el('span', { className: 'diamond-text' }, `${state.inventory.diamonds} diamonds`),
    ]),
  ]);
}

export function screenPanel() {
  return el('div', {
    className: 'panel',
    style: {
      position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
      width: '620px', maxHeight: '460px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px',
    },
  });
}

export function tabRow(tabs, active, onSelect) {
  const row = el('div', { style: { display: 'flex', gap: '6px', marginBottom: '8px' } });
  for (const t of tabs) {
    const btn = el('button', {
      className: 'pixel-btn',
      style: { borderColor: active === t ? '#e8c14c' : '#6d6d94' },
      onClick: () => onSelect(t),
    }, t);
    row.appendChild(btn);
  }
  return row;
}

export function partyPicker(onPick) {
  const row = el('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } });
  for (const m of state.party) {
    row.appendChild(el('button', { className: 'pixel-btn', onClick: () => onPick(m) }, `${m.name} (Lv${m.level})`));
  }
  return row;
}

const SLOTS = ['weapon', 'armor', 'accessory'];

// Renders an "Equipment" section: one row per party member/slot, with a
// button that opens a picker of owned unequipped gear for that slot.
export function renderEquipmentSection(rerender) {
  const wrap = el('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } });
  for (const member of state.party) {
    const memberBox = el('div', { style: { border: '1px solid #3a3a52', padding: '8px' } });
    memberBox.appendChild(el('div', { className: 'title-text', style: { fontSize: '13px', marginBottom: '4px' } }, `${member.name} (Lv${member.level} ${member.classId})`));
    for (const slot of SLOTS) {
      const equippedId = member.equipment[slot];
      const equippedName = equippedId ? ITEMS[equippedId].name : '(empty)';
      const row = el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' } });
      row.appendChild(el('span', { style: { width: '90px', textTransform: 'capitalize' } }, slot));
      row.appendChild(el('span', { style: { flex: '1' } }, equippedName));
      const owned = Object.entries(state.inventory.gear).filter(([id, qty]) => qty > 0 && ITEMS[id].slot === slot);
      if (owned.length > 0) {
        const select = el('select', { style: { background: '#0e0e18', color: '#e8e4d8', border: '1px solid #5a5a7a' } });
        select.appendChild(el('option', { value: '' }, 'Equip...'));
        for (const [id, qty] of owned) select.appendChild(el('option', { value: id }, `${ITEMS[id].name} x${qty}`));
        select.addEventListener('change', () => {
          if (select.value) { equipItem(state, member, select.value); rerender(); }
        });
        row.appendChild(select);
      }
      if (equippedId) {
        row.appendChild(el('button', { className: 'pixel-btn', onClick: () => { unequipItem(state, member, slot); rerender(); } }, 'Unequip'));
      }
      memberBox.appendChild(row);
    }
    wrap.appendChild(memberBox);
  }
  return wrap;
}
