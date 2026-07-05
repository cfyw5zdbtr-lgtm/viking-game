import { goto } from '../router.js';
import { setInteractive, clearUI, el, mount } from '../engine/ui.js';
import { drawText } from '../engine/draw.js';
import { hasSave, loadGame } from '../systems/save.js';
import { loadFromSnapshot } from '../state.js';

let time = 0;

const titleScreen = {
  onEnter() {
    time = 0;
    setInteractive(true);
    clearUI();
    const wrap = el('div', {
      style: {
        position: 'absolute', left: '0', top: '380px', width: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
      },
    });
    wrap.appendChild(el('button', {
      className: 'pixel-btn',
      style: { width: '220px' },
      onClick: () => goto('characterCreate'),
    }, 'New Saga'));

    const continueBtn = el('button', {
      className: 'pixel-btn',
      style: { width: '220px' },
      onClick: () => {
        const snap = loadGame();
        if (snap) {
          loadFromSnapshot(snap);
          goto('overworld', { mapKey: snap.progress.currentMap });
        }
      },
    }, 'Continue');
    if (!hasSave()) continueBtn.disabled = true;
    wrap.appendChild(continueBtn);

    mount(wrap);
  },
  onExit() {
    clearUI();
    setInteractive(false);
  },
  update(dt) {
    time += dt;
  },
  render(ctx) {
    ctx.fillStyle = '#0a0e18';
    ctx.fillRect(0, 0, 960, 540);

    // Simple parallax "fjord" backdrop
    ctx.fillStyle = '#132038';
    ctx.fillRect(0, 300, 960, 240);
    ctx.fillStyle = '#0d1830';
    for (let i = 0; i < 5; i++) {
      const x = ((i * 220) - (time * 15) % 220 + 960) % 960 - 100;
      ctx.beginPath();
      ctx.moveTo(x, 320);
      ctx.lineTo(x + 90, 220);
      ctx.lineTo(x + 180, 320);
      ctx.fill();
    }

    drawText(ctx, 'VINLAND SAGA', 480, 150, { size: 56, color: '#e8c14c', align: 'center', bold: true });
    drawText(ctx, 'a viking rpg', 480, 215, { size: 20, color: '#9aa0b0', align: 'center' });
  },
};

export default titleScreen;
