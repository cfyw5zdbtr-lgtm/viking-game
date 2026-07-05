import { goto, getCurrentName } from '../router.js';
import { setInteractive, clearUI } from '../engine/ui.js';
import { drawSprite, drawText, drawBar } from '../engine/draw.js';
import { Input } from '../engine/input.js';
import { MAPS } from '../data/maps.js';
import { ITEMS } from '../data/items.js';
import { getStage } from '../data/stages.js';
import { ENEMIES } from '../data/enemies.js';
import { state, markerKey } from '../state.js';
import { earnGold } from '../systems/economy.js';
import { addItem, addMaterial } from '../systems/inventory.js';
import { saveGame } from '../systems/save.js';

const PLAYER_SIZE = 24;
const VIEW_W = 960;
const VIEW_H = 540;
const SPEED = 240;
const TRIGGER_RADIUS = 30;
const WATER_BAND = 30; // px of dirt band between groundY and the reflection/water line

const PARALLAX = { mountain: 0.25, moon: 0.1, statue: 0.4, tree: 1.0, campfire: 1.0 };

const MARKER_COLORS = {
  shop: '#d4af37',
  blacksmith: '#c0522f',
  auction: '#3a7bd5',
  recruiter: '#8e44ad',
  stage_gate: '#2ecc71',
  boss_gate: '#8a0e0e',
  hub_return: '#8a8a8a',
  enemy_a: '#7a4a3a',
  enemy_b: '#4a3626',
  loot_node: '#e8d24c',
};

const MARKER_LABELS = {
  shop: 'SHOP',
  blacksmith: 'SMITH',
  auction: 'MARKET',
  recruiter: 'RECRUIT',
  stage_gate: 'GATE',
  boss_gate: 'BOSS',
  hub_return: 'HOME',
  enemy_a: '!',
  enemy_b: '!',
  loot_node: '?',
};

let map = null;
let playerX = 0;
let camX = 0;
let facing = 'right';
let nearSet = new Set();
let pickupText = '';
let pickupTimer = 0;

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function updateCamera() {
  const w = map.worldWidth;
  camX = w <= VIEW_W ? (w - VIEW_W) / 2 : clamp(playerX + PLAYER_SIZE / 2 - VIEW_W / 2, 0, w - VIEW_W);
}

function getNearPois() {
  const centerX = playerX + PLAYER_SIZE / 2;
  return map.pois.filter((p) => p.type !== 'player_spawn' && Math.abs(centerX - p.x) < TRIGGER_RADIUS);
}

function isCleared(key) {
  return state.progress.defeatedMarkers.includes(key) || state.progress.collectedLoot.includes(key);
}

function stageMaterials() {
  const stage = getStage(state.progress.stageId);
  const ids = new Set();
  for (const enemyId of stage?.enemyIds || []) {
    for (const drop of ENEMIES[enemyId]?.drops || []) {
      if (ITEMS[drop.id].type === 'material') ids.add(drop.id);
    }
  }
  return ids.size > 0 ? [...ids] : ['iron_scrap', 'bear_pelt'];
}

function collectLoot(key) {
  state.progress.collectedLoot.push(key);
  const roll = Math.random();
  if (roll < 0.4) {
    const gold = 10 + Math.floor(Math.random() * 15) * state.progress.stageId;
    earnGold(state, gold);
    pickupText = `Found ${gold} gold!`;
  } else if (roll < 0.7) {
    addItem(state, 'potion_health', 1);
    pickupText = 'Found a Health Potion!';
  } else {
    const materials = stageMaterials();
    const mat = materials[Math.floor(Math.random() * materials.length)];
    addMaterial(state, mat, 1);
    pickupText = `Found ${ITEMS[mat].name}!`;
  }
  pickupTimer = 2.5;
  saveGame(state);
}

function onMarkerTriggered(poi, key) {
  const mapKey = state.progress.currentMap;
  const stage = getStage(state.progress.stageId);
  switch (poi.type) {
    case 'shop': goto('shop', { returnMapKey: mapKey, exactPos: { x: playerX } }); break;
    case 'blacksmith': goto('blacksmith', { returnMapKey: mapKey, exactPos: { x: playerX } }); break;
    case 'auction': goto('auction', { returnMapKey: mapKey, exactPos: { x: playerX } }); break;
    case 'recruiter': goto('recruiter', { returnMapKey: mapKey, exactPos: { x: playerX } }); break;
    case 'stage_gate':
      if (!stage || !stage.implemented) return;
      goto('overworld', { mapKey: stage.mapKey, spawnType: 'hub_return' });
      break;
    case 'hub_return':
      goto('overworld', { mapKey: 'hub', spawnType: 'stage_gate' });
      break;
    case 'boss_gate':
      goto('battle', {
        enemyIds: [stage.bossId], isBoss: true, stageId: stage.id,
        returnMapKey: mapKey, returnPos: { x: playerX }, markerKey: key,
      });
      break;
    case 'enemy_a':
    case 'enemy_b': {
      if (isCleared(key)) return;
      const enemyId = poi.type === 'enemy_a' ? stage.enemyIds[0] : stage.enemyIds[1];
      goto('battle', {
        enemyIds: [enemyId], stageId: stage.id,
        returnMapKey: mapKey, returnPos: { x: playerX }, markerKey: key,
      });
      break;
    }
    case 'loot_node':
      if (isCleared(key)) return;
      collectLoot(key);
      break;
    default: break;
  }
}

function drawSky(ctx) {
  const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  grad.addColorStop(0, map.sky.top);
  grad.addColorStop(1, map.sky.bottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
}

function drawDecoration(ctx, d, sx) {
  if (sx < -400 || sx > VIEW_W + 400) return;
  if (d.type === 'mountain') {
    ctx.fillStyle = 'rgba(20,20,30,0.55)';
    ctx.beginPath();
    ctx.moveTo(sx - d.width / 2, map.groundY);
    ctx.lineTo(sx, map.groundY - d.height);
    ctx.lineTo(sx + d.width / 2, map.groundY);
    ctx.closePath();
    ctx.fill();
  } else if (d.type === 'moon') {
    ctx.fillStyle = 'rgba(240,240,220,0.9)';
    ctx.beginPath();
    ctx.arc(sx, d.y, d.radius, 0, Math.PI * 2);
    ctx.fill();
  } else if (d.type === 'statue') {
    ctx.fillStyle = 'rgba(30,30,40,0.6)';
    ctx.fillRect(sx - 14, map.groundY - d.height, 28, d.height);
    ctx.fillRect(sx - 30, map.groundY - d.height, 60, 16);
  } else if (d.type === 'tree') {
    ctx.fillStyle = '#4a3020';
    ctx.fillRect(sx - 4, map.groundY - 26, 8, 26);
    ctx.fillStyle = '#2f5d3a';
    ctx.beginPath();
    ctx.arc(sx, map.groundY - 34, 20, 0, Math.PI * 2);
    ctx.fill();
  } else if (d.type === 'campfire') {
    ctx.fillStyle = '#e8862f';
    ctx.beginPath();
    ctx.arc(sx, map.groundY - 6, 7, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWorldLayer(ctx) {
  for (const d of map.decorations) {
    const factor = PARALLAX[d.type] ?? 0.5;
    drawDecoration(ctx, d, d.x - camX * factor);
  }

  ctx.fillStyle = '#5a4632';
  ctx.fillRect(0, map.groundY - 8, VIEW_W, WATER_BAND + 8);

  const mapKey = state.progress.currentMap;
  for (const poi of map.pois) {
    if (poi.type === 'player_spawn') continue;
    const key = markerKey(mapKey, poi);
    if (isCleared(key)) continue;
    const sx = poi.x - camX;
    if (sx < -40 || sx > VIEW_W + 40) continue;
    const size = 28;
    ctx.fillStyle = MARKER_COLORS[poi.type] || '#999';
    ctx.fillRect(sx - size / 2, map.groundY - size, size, size);
    const label = MARKER_LABELS[poi.type];
    if (label && label.length > 1) {
      drawText(ctx, label, sx, map.groundY - size - 16, { size: 9, color: '#fff', align: 'center' });
    } else if (label) {
      drawText(ctx, label, sx, map.groundY - size + 6, { size: 16, color: '#fff', align: 'center', bold: true });
    }
  }

  const sx = playerX - camX;
  const spritePath = `assets/sprites/player_${state.player.gender}.png`;
  const fallback = state.player.gender === 'girl' ? '#d1548f' : '#3a6bd8';
  if (facing === 'left') {
    ctx.save();
    ctx.translate(sx + PLAYER_SIZE, map.groundY - PLAYER_SIZE);
    ctx.scale(-1, 1);
    drawSprite(ctx, spritePath, 0, 0, PLAYER_SIZE, PLAYER_SIZE, fallback);
    ctx.restore();
  } else {
    drawSprite(ctx, spritePath, sx, map.groundY - PLAYER_SIZE, PLAYER_SIZE, PLAYER_SIZE, fallback);
  }
}

function drawHud(ctx) {
  ctx.save();
  ctx.fillStyle = 'rgba(10,10,18,0.7)';
  ctx.fillRect(0, 0, VIEW_W, 30);
  const stageName = map === MAPS.hub ? 'Ravensfjord Village' : (getStage(state.progress.stageId)?.name || '');
  drawText(ctx, stageName, 10, 8, { size: 14, color: '#e8e4d8' });
  drawText(ctx, `Gold: ${state.inventory.gold}`, 700, 8, { size: 14, color: '#e8c14c' });
  drawText(ctx, `Diamonds: ${state.inventory.diamonds}`, 830, 8, { size: 14, color: '#5ad1e6' });

  const barW = 150, barH = 8;
  state.party.forEach((m, i) => {
    const y = VIEW_H - 20 - i * 26;
    ctx.fillStyle = 'rgba(10,10,18,0.7)';
    ctx.fillRect(6, y - 16, barW + 10, 40);
    drawText(ctx, `${m.name} Lv${m.level}`, 10, y - 14, { size: 11, color: '#e8e4d8' });
    drawBar(ctx, 10, y, barW, barH, m.currentHp / m.maxHp, '#7ee06a');
    drawBar(ctx, 10, y + 10, barW, barH, m.currentMp / m.maxMp, '#6aa8e0');
  });

  drawText(ctx, 'ESC: Menu', VIEW_W - 10, VIEW_H - 22, { size: 12, color: '#9aa0b0', align: 'right' });

  if (pickupTimer > 0) {
    drawText(ctx, pickupText, VIEW_W / 2, 60, { size: 16, color: '#f0ead6', align: 'center', bold: true });
  }
  ctx.restore();
}

const overworld = {
  onEnter(params = {}) {
    const mapKey = params.mapKey || state.progress.currentMap || 'hub';
    map = MAPS[mapKey];
    state.progress.currentMap = mapKey;
    setInteractive(false);
    clearUI();

    if (params.exactPos) {
      playerX = params.exactPos.x;
    } else {
      const spawnType = params.spawnType || 'player_spawn';
      const poi = map.pois.find((p) => p.type === spawnType) || map.pois[0] || { x: 100 };
      playerX = poi.x;
    }
    nearSet = new Set(getNearPois().map((p) => markerKey(mapKey, p)));
    updateCamera();
    pickupTimer = 0;
  },
  onExit() {
    clearUI();
  },
  update(dt) {
    if (Input.isCancelPressed()) {
      goto('pauseMenu', { returnMapKey: state.progress.currentMap, exactPos: { x: playerX } });
      return;
    }
    let dx = 0;
    if (Input.isMoveLeft()) dx -= 1;
    if (Input.isMoveRight()) dx += 1;
    if (dx < 0) facing = 'left'; else if (dx > 0) facing = 'right';
    if (dx !== 0) {
      playerX = clamp(playerX + dx * SPEED * dt, 0, map.worldWidth - PLAYER_SIZE);
    }

    updateCamera();

    const mapKey = state.progress.currentMap;
    const nowPois = getNearPois();
    const nowKeys = new Set(nowPois.map((p) => markerKey(mapKey, p)));
    for (const poi of nowPois) {
      const key = markerKey(mapKey, poi);
      if (!nearSet.has(key)) {
        onMarkerTriggered(poi, key);
        // A trigger may have switched screens/maps (goto re-enters this very
        // module and resets its state); bail out instead of overwriting that
        // fresh state with the stale `nowKeys` computed before the switch.
        if (getCurrentName() !== 'overworld' || state.progress.currentMap !== mapKey) return;
      }
    }
    nearSet = nowKeys;

    if (pickupTimer > 0) pickupTimer -= dt;
  },
  render(ctx) {
    drawSky(ctx);
    drawWorldLayer(ctx);

    const waterLineY = map.groundY + WATER_BAND;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, waterLineY, VIEW_W, VIEW_H - waterLineY);
    ctx.clip();
    ctx.globalAlpha = 0.35;
    ctx.translate(0, 2 * waterLineY);
    ctx.scale(1, -1);
    drawWorldLayer(ctx);
    ctx.restore();

    ctx.fillStyle = map.waterColor;
    ctx.globalAlpha = 0.35;
    ctx.fillRect(0, waterLineY, VIEW_W, VIEW_H - waterLineY);
    ctx.globalAlpha = 1;

    drawHud(ctx);
  },
};

export default overworld;
