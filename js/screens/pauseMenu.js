import { goto } from '../router.js';
import { setInteractive, clearUI, el, mount } from '../engine/ui.js';
import { state } from '../state.js';
import { CLASSES } from '../data/classes.js';
import { ITEMS } from '../data/items.js';
import { saveGame } from '../systems/save.js';
import { screenPanel } from './shared.js';

let params = {};

function statLine(member) {
  return `HP ${member.currentHp}/${member.maxHp}  MP ${member.currentMp}/${member.maxMp}  ATK ${member.atk} DEF ${member.def} MAG ${member.mag} RES ${member.res} SPD ${member.spd} LUK ${member.luk}`;
}

function equipLine(member) {
  const parts = ['weapon', 'armor', 'accessory'].map((slot) => {
    const id = member.equipment[slot];
    return id ? ITEMS[id].name : `(no ${slot})`;
  });
  return parts.join(' / ');
}

function render() {
  clearUI();
  setInteractive(true);
  const panel = screenPanel();
  panel.appendChild(el('div', { className: 'title-text', style: { fontSize: '22px', marginBottom: '6px' } }, 'Paused'));
  panel.appendChild(el('div', { className: 'gold-text' }, `${state.inventory.gold} gold  |  ${state.inventory.diamonds} diamonds`));

  panel.appendChild(el('div', { className: 'title-text', style: { fontSize: '15px', marginTop: '10px' } }, 'Your Crew'));
  for (const m of state.party) {
    const box = el('div', { style: { borderBottom: '1px solid #2a2a3a', padding: '6px 0' } });
    box.appendChild(el('div', {}, `${m.name} - Lv${m.level} ${CLASSES[m.classId].name} (exp ${m.exp})`));
    box.appendChild(el('div', { style: { color: '#9aa0b0', fontSize: '12px' } }, statLine(m)));
    box.appendChild(el('div', { style: { color: '#7a7a8a', fontSize: '12px' } }, equipLine(m)));
    panel.appendChild(box);
  }

  const btnRow = el('div', { style: { display: 'flex', gap: '8px', marginTop: '12px' } });
  btnRow.appendChild(el('button', {
    className: 'pixel-btn',
    onClick: () => { saveGame(state); render(); },
  }, 'Save Game'));
  btnRow.appendChild(el('button', {
    className: 'pixel-btn',
    onClick: () => goto('overworld', { mapKey: params.returnMapKey, exactPos: params.exactPos }),
  }, 'Resume'));
  btnRow.appendChild(el('button', {
    className: 'pixel-btn danger',
    onClick: () => goto('title'),
  }, 'Quit to Title'));
  panel.appendChild(btnRow);

  mount(panel);
}

const pauseMenu = {
  onEnter(p) {
    params = p;
    render();
  },
  onExit() { clearUI(); setInteractive(false); },
  update() {},
  render(ctx) {
    ctx.fillStyle = '#12121c';
    ctx.fillRect(0, 0, 960, 540);
  },
};

export default pauseMenu;
