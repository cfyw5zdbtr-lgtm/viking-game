import { goto } from '../router.js';
import { setInteractive, clearUI, el, mount } from '../engine/ui.js';
import { getStage, STAGES } from '../data/stages.js';
import { ENEMIES } from '../data/enemies.js';

const victory = {
  onEnter(params) {
    setInteractive(true);
    clearUI();
    const stage = getStage(params.stageId);
    const boss = ENEMIES[stage.bossId];
    const isFinal = stage.id === STAGES.length;
    const next = getStage(stage.id + 1);
    const box = el('div', {
      className: 'panel',
      style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '440px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' },
    });
    box.appendChild(el('div', { className: 'title-text', style: { fontSize: '24px' } }, `${stage.name} Cleared!`));
    if (isFinal) {
      box.appendChild(el('div', {}, `The ${boss.name} falls at last. Vinland is safe, and your saga is sung for generations to come.`));
    } else {
      box.appendChild(el('div', {}, `The ${boss.name} falls. Word of your deeds spreads across the land.`));
      if (next && !next.implemented) {
        box.appendChild(el('div', { style: { color: '#9aa0b0', textAlign: 'center' } },
          `${next.name} is being charted for your next voyage - coming soon.`));
      }
    }
    box.appendChild(el('button', {
      className: 'pixel-btn',
      onClick: () => goto('overworld', { mapKey: 'hub', spawnType: 'player_spawn' }),
    }, 'Return to Village'));
    mount(box);
  },
  onExit() { clearUI(); setInteractive(false); },
  update() {},
  render(ctx) {
    ctx.fillStyle = '#141826';
    ctx.fillRect(0, 0, 960, 540);
  },
};

export default victory;
