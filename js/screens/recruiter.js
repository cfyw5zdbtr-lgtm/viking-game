import { setInteractive, clearUI, el, mount } from '../engine/ui.js';
import { state, createMember } from '../state.js';
import { CLASSES } from '../data/classes.js';
import { RECRUITS } from '../data/shops.js';
import { canAfford, spendGold } from '../systems/economy.js';
import { saveGame } from '../systems/save.js';
import { backButton, header, screenPanel } from './shared.js';

const MAX_PARTY_SIZE = 4;
let params = {};

function render() {
  clearUI();
  setInteractive(true);
  const panel = screenPanel();
  panel.appendChild(header('Hall of Champions'));
  panel.appendChild(el('div', { style: { color: '#9aa0b0', fontSize: '12px', marginBottom: '6px' } },
    'Freed captives and wandering mercenaries, ready to join your crew for the right price.'));

  const partyFull = state.party.length >= MAX_PARTY_SIZE;
  if (partyFull) panel.appendChild(el('div', { style: { color: '#a05050' } }, `Your crew is full (${MAX_PARTY_SIZE} max).`));

  for (const recruit of RECRUITS) {
    const already = state.progress.recruited.includes(recruit.id);
    const cls = CLASSES[recruit.classId];
    const row = el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #2a2a3a', padding: '6px 0' } });
    row.appendChild(el('div', { style: { flex: '1' } }, [
      el('div', {}, `${recruit.name} - ${cls.name}`),
      el('div', { style: { color: '#9aa0b0', fontSize: '12px' } }, cls.description),
    ]));
    if (already) {
      row.appendChild(el('span', { style: { color: '#7ee06a' } }, 'Recruited'));
    } else {
      row.appendChild(el('span', { className: 'gold-text' }, `${recruit.price}g`));
      const btn = el('button', {
        className: 'pixel-btn',
        onClick: () => {
          if (!canAfford(state, recruit.price)) return;
          spendGold(state, recruit.price);
          state.party.push(createMember(recruit.name, recruit.classId, recruit.level));
          state.progress.recruited.push(recruit.id);
          saveGame(state);
          render();
        },
      }, 'Recruit');
      if (partyFull || state.inventory.gold < recruit.price) btn.disabled = true;
      row.appendChild(btn);
    }
    panel.appendChild(row);
  }

  mount(panel);
  mount(backButton(params));
}

const recruiter = {
  onEnter(p) {
    params = p;
    render();
  },
  onExit() { clearUI(); setInteractive(false); },
  update() {},
  render(ctx) {
    ctx.fillStyle = '#241a2e';
    ctx.fillRect(0, 0, 960, 540);
  },
};

export default recruiter;
