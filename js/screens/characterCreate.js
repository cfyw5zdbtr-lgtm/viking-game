import { goto } from '../router.js';
import { setInteractive, clearUI, el, mount } from '../engine/ui.js';
import { startNewGame } from '../state.js';

let selectedGender = 'boy';

const characterCreate = {
  onEnter() {
    selectedGender = 'boy';
    setInteractive(true);
    clearUI();

    const panel = el('div', {
      className: 'panel',
      style: {
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
        width: '420px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center',
      },
    });

    panel.appendChild(el('div', { className: 'title-text', style: { fontSize: '20px' } }, 'Create Your Viking'));

    const nameInput = el('input', {
      type: 'text', maxlength: '16', value: 'Erik', placeholder: 'Name',
      style: { width: '90%', padding: '8px', fontSize: '16px', textAlign: 'center', background: '#0e0e18', color: '#e8e4d8', border: '2px solid #5a5a7a' },
    });
    panel.appendChild(nameInput);

    const genderRow = el('div', { style: { display: 'flex', gap: '10px' } });
    const boyBtn = el('button', { className: 'pixel-btn', onClick: () => selectGender('boy') }, 'Boy');
    const girlBtn = el('button', { className: 'pixel-btn', onClick: () => selectGender('girl') }, 'Girl');
    genderRow.appendChild(boyBtn);
    genderRow.appendChild(girlBtn);
    panel.appendChild(genderRow);

    function selectGender(g) {
      selectedGender = g;
      boyBtn.style.borderColor = g === 'boy' ? '#e8c14c' : '#6d6d94';
      girlBtn.style.borderColor = g === 'girl' ? '#e8c14c' : '#6d6d94';
    }
    selectGender('boy');

    const confirmBtn = el('button', {
      className: 'pixel-btn',
      style: { width: '60%', marginTop: '8px' },
      onClick: () => {
        const name = nameInput.value.trim() || 'Erik';
        startNewGame(name, selectedGender);
        goto('overworld', { mapKey: 'hub' });
      },
    }, 'Begin Journey');
    panel.appendChild(confirmBtn);

    mount(panel);
  },
  onExit() {
    clearUI();
    setInteractive(false);
  },
  update() {},
  render(ctx) {
    ctx.fillStyle = '#141826';
    ctx.fillRect(0, 0, 960, 540);
  },
};

export default characterCreate;
