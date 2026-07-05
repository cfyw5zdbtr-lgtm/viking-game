import { goto } from '../router.js';
import { setInteractive, clearUI, el, mount } from '../engine/ui.js';
import { drawText, drawBar, drawSprite } from '../engine/draw.js';
import { state } from '../state.js';
import { CLASSES } from '../data/classes.js';
import { SKILLS } from '../data/skills.js';
import { ITEMS } from '../data/items.js';
import { STAGES } from '../data/stages.js';
import {
  createBattleEnemy, buildTurnOrder, applyAction, chooseEnemyAction,
  pickLowestHpTarget, rollGold, rollDrops,
} from '../systems/combat.js';
import { grantExp } from '../systems/progression.js';
import { earnGold } from '../systems/economy.js';
import { addMaterial, addGear, removeItem, useConsumable } from '../systems/inventory.js';
import { saveGame } from '../systems/save.js';

const VIEW_W = 960;
const VIEW_H = 540;

let enemies = [];
let party = [];
let turnQueue = [];
let queueIndex = -1;
let activeCombatant = null;
let phase = 'advance'; // advance | player_menu | player_target | enemy_acting | fled | victory | defeat
let pendingAction = null;
let message = '';
let messageTimer = 0;
let battleParams = {};

function livingParty() { return party.filter((m) => m.currentHp > 0); }
function livingEnemies() { return enemies.filter((e) => e.currentHp > 0); }

function checkBattleEnd() {
  if (livingEnemies().length === 0) { handleVictory(); return true; }
  if (livingParty().length === 0) { handleDefeat(); return true; }
  return false;
}

function advanceAfter(delay = 1.1) {
  phase = 'advance';
  messageTimer = delay;
  clearUI();
}

function nextTurn() {
  if (checkBattleEnd()) return;
  queueIndex++;
  if (queueIndex >= turnQueue.length) {
    turnQueue = buildTurnOrder([...party, ...enemies]);
    queueIndex = 0;
  }
  activeCombatant = turnQueue[queueIndex];
  if (!activeCombatant || activeCombatant.currentHp <= 0) { nextTurn(); return; }

  if (party.includes(activeCombatant)) {
    activeCombatant.defending = false;
    phase = 'player_menu';
    renderActionMenu();
  } else {
    phase = 'enemy_acting';
    messageTimer = 0.9;
  }
}

function resolveEnemyTurn() {
  const enemy = activeCombatant;
  const target = pickLowestHpTarget(party);
  if (!target) { nextTurn(); return; }
  const result = applyAction(enemy, target, chooseEnemyAction(enemy));
  message = `${enemy.name} uses ${result.skillName} on ${target.name} for ${result.amount} ${result.kind === 'heal' ? 'healing' : 'damage'}!`;
  advanceAfter();
}

function resolvePlayerAction(target) {
  const { actionId } = pendingAction;
  let msg;
  if (actionId.startsWith('item:')) {
    const itemId = actionId.slice(5);
    useConsumable(target, itemId);
    removeItem(state, itemId, 1);
    msg = `${activeCombatant.name} uses ${ITEMS[itemId].name} on ${target.name}.`;
  } else {
    const result = applyAction(activeCombatant, target, actionId);
    msg = `${activeCombatant.name} uses ${result.skillName} on ${target.name} for ${result.amount} ${result.kind === 'heal' ? 'healing' : 'damage'}!`;
  }
  pendingAction = null;
  message = msg;
  advanceAfter();
}

function attemptFlee() {
  const avgPartySpd = party.reduce((s, m) => s + m.spd, 0) / party.length;
  const avgEnemySpd = enemies.reduce((s, e) => s + e.spd, 0) / enemies.length;
  const chance = Math.max(0.2, Math.min(0.9, 0.5 + (avgPartySpd - avgEnemySpd) * 0.02));
  if (Math.random() < chance) {
    message = 'You fled from battle!';
    phase = 'fled';
    messageTimer = 1.1;
    clearUI();
  } else {
    message = `${activeCombatant.name} failed to flee!`;
    advanceAfter();
  }
}

function renderActionMenu() {
  clearUI();
  setInteractive(true);
  const box = el('div', {
    className: 'panel',
    style: { position: 'absolute', left: '20px', bottom: '20px', width: '300px', display: 'flex', flexDirection: 'column', gap: '6px' },
  });
  box.appendChild(el('div', { className: 'title-text', style: { fontSize: '14px' } }, `${activeCombatant.name}'s turn`));
  const row = el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } });
  row.appendChild(el('button', { className: 'pixel-btn', onClick: () => beginTarget({ actionId: 'attack' }, 'enemy') }, 'Attack'));
  row.appendChild(el('button', { className: 'pixel-btn', onClick: renderSkillMenu }, 'Skill'));
  row.appendChild(el('button', { className: 'pixel-btn', onClick: renderItemMenu }, 'Item'));
  row.appendChild(el('button', {
    className: 'pixel-btn',
    onClick: () => {
      activeCombatant.defending = true;
      message = `${activeCombatant.name} braces for impact.`;
      advanceAfter();
    },
  }, 'Defend'));
  row.appendChild(el('button', { className: 'pixel-btn danger', onClick: attemptFlee }, 'Flee'));
  box.appendChild(row);
  mount(box);
}

function renderSkillMenu() {
  clearUI();
  setInteractive(true);
  const box = el('div', {
    className: 'panel',
    style: { position: 'absolute', left: '20px', bottom: '20px', width: '320px', display: 'flex', flexDirection: 'column', gap: '6px' },
  });
  box.appendChild(el('div', { className: 'title-text', style: { fontSize: '14px' } }, 'Choose a skill'));
  const skillIds = CLASSES[activeCombatant.classId].skills;
  for (const skillId of skillIds) {
    const skill = SKILLS[skillId];
    const affordable = activeCombatant.currentMp >= skill.mpCost;
    const btn = el('button', {
      className: 'pixel-btn',
      style: { width: '100%', textAlign: 'left' },
      onClick: () => beginTarget({ actionId: skillId }, skill.target === 'single-ally' ? 'ally' : 'enemy'),
    }, `${skill.name} (${skill.mpCost} MP)`);
    if (!affordable) btn.disabled = true;
    box.appendChild(btn);
  }
  box.appendChild(el('button', { className: 'pixel-btn', onClick: renderActionMenu }, 'Back'));
  mount(box);
}

function renderItemMenu() {
  clearUI();
  setInteractive(true);
  const box = el('div', {
    className: 'panel',
    style: { position: 'absolute', left: '20px', bottom: '20px', width: '320px', display: 'flex', flexDirection: 'column', gap: '6px' },
  });
  box.appendChild(el('div', { className: 'title-text', style: { fontSize: '14px' } }, 'Choose an item'));
  const owned = Object.entries(state.inventory.items).filter(([id, qty]) => qty > 0 && ITEMS[id].type === 'consumable');
  if (owned.length === 0) box.appendChild(el('div', {}, 'No items to use.'));
  for (const [itemId, qty] of owned) {
    const item = ITEMS[itemId];
    box.appendChild(el('button', {
      className: 'pixel-btn',
      style: { width: '100%', textAlign: 'left' },
      onClick: () => beginTarget({ actionId: `item:${itemId}` }, 'ally'),
    }, `${item.name} x${qty}`));
  }
  box.appendChild(el('button', { className: 'pixel-btn', onClick: renderActionMenu }, 'Back'));
  mount(box);
}

function beginTarget(action, side) {
  pendingAction = action;
  clearUI();
  setInteractive(true);
  const box = el('div', {
    className: 'panel',
    style: { position: 'absolute', left: '20px', bottom: '20px', width: '320px', display: 'flex', flexDirection: 'column', gap: '6px' },
  });
  box.appendChild(el('div', { className: 'title-text', style: { fontSize: '14px' } }, 'Choose a target'));
  const targets = side === 'enemy' ? livingEnemies() : livingParty();
  for (const t of targets) {
    box.appendChild(el('button', {
      className: 'pixel-btn',
      style: { width: '100%', textAlign: 'left' },
      onClick: () => resolvePlayerAction(t),
    }, `${t.name} (${t.currentHp}/${t.maxHp} HP)`));
  }
  box.appendChild(el('button', { className: 'pixel-btn', onClick: renderActionMenu }, 'Back'));
  mount(box);
}

function handleVictory() {
  phase = 'victory';
  const totalExp = enemies.reduce((s, e) => s + e.exp, 0);
  const totalGold = enemies.reduce((s, e) => s + rollGold(e), 0);
  const drops = [];
  enemies.forEach((e) => drops.push(...rollDrops(e)));
  const levelUps = [];
  party.forEach((m) => {
    const res = grantExp(m, totalExp);
    if (res.leveledUp) levelUps.push(`${m.name} reached level ${m.level}!`);
  });
  earnGold(state, totalGold);
  drops.forEach((d) => {
    const item = ITEMS[d.id];
    if (item.type === 'material') addMaterial(state, d.id, d.qty);
    else addGear(state, d.id, d.qty);
  });
  if (battleParams.markerKey) state.progress.defeatedMarkers.push(battleParams.markerKey);
  if (battleParams.isBoss && !state.progress.stagesCleared.includes(battleParams.stageId)) {
    state.progress.stagesCleared.push(battleParams.stageId);
    if (battleParams.stageId === state.progress.stageId) {
      state.progress.stageId = Math.min(STAGES.length, state.progress.stageId + 1);
    }
  }
  saveGame(state);

  clearUI();
  setInteractive(true);
  const box = el('div', {
    className: 'panel',
    style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '380px', display: 'flex', flexDirection: 'column', gap: '8px' },
  });
  box.appendChild(el('div', { className: 'title-text', style: { fontSize: '20px' } }, 'Victory!'));
  box.appendChild(el('div', { className: 'gold-text' }, `+${totalGold} gold, +${totalExp} exp each`));
  if (drops.length) {
    box.appendChild(el('div', {}, `Loot: ${drops.map((d) => `${ITEMS[d.id].name} x${d.qty}`).join(', ')}`));
  }
  levelUps.forEach((line) => box.appendChild(el('div', { className: 'hp-text' }, line)));
  box.appendChild(el('button', {
    className: 'pixel-btn',
    style: { marginTop: '10px' },
    onClick: () => {
      if (battleParams.isBoss) goto('victory', { stageId: battleParams.stageId });
      else goto('overworld', { mapKey: battleParams.returnMapKey, exactPos: battleParams.returnPos });
    },
  }, 'Continue'));
  mount(box);
}

function handleDefeat() {
  phase = 'defeat';
  clearUI();
  setInteractive(true);
  const box = el('div', {
    className: 'panel',
    style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '380px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' },
  });
  box.appendChild(el('div', { className: 'title-text', style: { fontSize: '20px' } }, 'Your party has fallen...'));
  box.appendChild(el('div', {}, 'The village elders nurse you back to health.'));
  box.appendChild(el('button', {
    className: 'pixel-btn',
    onClick: () => {
      party.forEach((m) => { m.currentHp = m.maxHp; m.currentMp = m.maxMp; });
      saveGame(state);
      goto('overworld', { mapKey: 'hub', spawnType: 'player_spawn' });
    },
  }, 'Return to Village'));
  mount(box);
}

const battle = {
  onEnter(params) {
    battleParams = params;
    party = state.party;
    party.forEach((m) => { m.defending = false; });
    enemies = params.enemyIds.map((id, i) => createBattleEnemy(id, params.stageId || 1, i));
    turnQueue = [];
    queueIndex = -1;
    pendingAction = null;
    message = params.isBoss ? `The ${enemies[0].name} blocks your path!` : 'A battle begins!';
    messageTimer = 1.1;
    phase = 'advance';
    clearUI();
  },
  onExit() {
    clearUI();
    setInteractive(false);
  },
  update(dt) {
    if (messageTimer > 0) {
      messageTimer -= dt;
      return;
    }
    if (phase === 'advance') { nextTurn(); return; }
    if (phase === 'enemy_acting') { resolveEnemyTurn(); return; }
    if (phase === 'fled') {
      goto('overworld', { mapKey: battleParams.returnMapKey, exactPos: battleParams.returnPos });
    }
  },
  render(ctx) {
    ctx.fillStyle = '#2a2438';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.fillStyle = '#1c1826';
    ctx.fillRect(0, 320, VIEW_W, VIEW_H - 320);

    // message log strip
    ctx.fillStyle = 'rgba(10,10,18,0.7)';
    ctx.fillRect(0, 0, VIEW_W, 34);
    drawText(ctx, message, VIEW_W / 2, 9, { size: 15, color: '#f0ead6', align: 'center' });

    // enemies
    const spacing = VIEW_W / (enemies.length + 1);
    enemies.forEach((e, i) => {
      const size = e.isBoss ? 96 : 64;
      const x = spacing * (i + 1) - size / 2;
      const y = 170 - size / 2;
      const isActive = activeCombatant === e;
      if (isActive) {
        ctx.strokeStyle = '#e8c14c';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 4, y - 4, size + 8, size + 8);
      }
      drawSprite(ctx, `assets/sprites/enemies/${e.sprite}.png`, x, y, size, size, e.currentHp > 0 ? e.color : '#333');
      drawText(ctx, e.name, x + size / 2, y - 30, { size: 12, color: '#e8e4d8', align: 'center' });
      drawBar(ctx, x, y - 14, size, 8, e.currentHp / e.maxHp, '#c0392b');
    });

    // party panel
    const partyBoxY = 340;
    party.forEach((m, i) => {
      const y = partyBoxY + i * 44;
      const isActive = activeCombatant === m;
      ctx.fillStyle = isActive ? 'rgba(232,193,78,0.15)' : 'rgba(255,255,255,0.03)';
      ctx.fillRect(340, y, 300, 38);
      drawText(ctx, `${m.name} Lv${m.level}${m.currentHp <= 0 ? ' (down)' : ''}`, 348, y + 2, { size: 12, color: m.currentHp <= 0 ? '#a05050' : '#e8e4d8' });
      drawBar(ctx, 348, y + 18, 130, 8, m.currentHp / m.maxHp, '#7ee06a');
      drawBar(ctx, 486, y + 18, 130, 8, m.currentMp / m.maxMp, '#6aa8e0');
      drawText(ctx, `${m.currentHp}/${m.maxHp}`, 348, y + 26, { size: 9, color: '#9aa0b0' });
      drawText(ctx, `${m.currentMp}/${m.maxMp}`, 486, y + 26, { size: 9, color: '#9aa0b0' });
    });
  },
};

export default battle;
