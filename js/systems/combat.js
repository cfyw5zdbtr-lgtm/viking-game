import { ENEMIES, scaleStats } from '../data/enemies.js';
import { SKILLS } from '../data/skills.js';

export function createBattleEnemy(enemyId, stageIndex, uid) {
  const template = ENEMIES[enemyId];
  const stats = scaleStats(template.stats, stageIndex, template.isBoss);
  return {
    uid,
    enemyId,
    name: template.name,
    sprite: template.sprite,
    color: template.color,
    isBoss: template.isBoss || false,
    maxHp: stats.hp, currentHp: stats.hp,
    maxMp: stats.mp, currentMp: stats.mp,
    atk: stats.atk, def: stats.def, mag: stats.mag, res: stats.res, spd: stats.spd, luk: stats.luk,
    skills: template.skills,
    exp: template.exp, goldMin: template.goldMin, goldMax: template.goldMax,
    drops: template.drops,
    defending: false,
    alive: true,
  };
}

// Turn order by SPD desc, with a small random jitter so ties (and near-ties)
// don't always resolve the same way.
export function buildTurnOrder(combatants) {
  return [...combatants]
    .filter((c) => c.alive !== false && c.currentHp > 0)
    .map((c) => ({ c, roll: c.spd + Math.random() * 3 }))
    .sort((a, b) => b.roll - a.roll)
    .map((entry) => entry.c);
}

function variance() {
  return 0.9 + Math.random() * 0.2;
}

function isCrit(luk) {
  return Math.random() < Math.min(0.4, luk * 0.01);
}

export function computePhysicalDamage(attacker, defender, power = 1) {
  let dmg = Math.max(1, Math.floor((attacker.atk * power - defender.def * 0.5) * variance()));
  if (defender.defending) dmg = Math.floor(dmg * 0.5);
  if (isCrit(attacker.luk)) dmg = Math.floor(dmg * 1.5);
  return dmg;
}

export function computeMagicalDamage(attacker, defender, power = 1) {
  let dmg = Math.max(1, Math.floor((attacker.mag * power - defender.res * 0.5) * variance()));
  if (defender.defending) dmg = Math.floor(dmg * 0.5);
  if (isCrit(attacker.luk)) dmg = Math.floor(dmg * 1.5);
  return dmg;
}

export function computeHeal(caster, power = 1) {
  return Math.max(1, Math.floor(caster.mag * power * variance()));
}

// Applies a skill (or a plain 'attack') from caster to target, mutating
// target's HP/MP in place. Returns a small result descriptor for the log.
export function applyAction(caster, target, actionId) {
  if (actionId === 'attack') {
    const dmg = computePhysicalDamage(caster, target, 1);
    target.currentHp = Math.max(0, target.currentHp - dmg);
    return { kind: 'damage', amount: dmg, skillName: 'Attack' };
  }
  const skill = SKILLS[actionId];
  if (!skill) return { kind: 'noop' };
  caster.currentMp = Math.max(0, caster.currentMp - skill.mpCost);
  if (skill.type === 'physical') {
    const dmg = computePhysicalDamage(caster, target, skill.power);
    target.currentHp = Math.max(0, target.currentHp - dmg);
    return { kind: 'damage', amount: dmg, skillName: skill.name };
  }
  if (skill.type === 'magical') {
    const dmg = computeMagicalDamage(caster, target, skill.power);
    target.currentHp = Math.max(0, target.currentHp - dmg);
    return { kind: 'damage', amount: dmg, skillName: skill.name };
  }
  if (skill.type === 'heal') {
    const amount = computeHeal(caster, skill.power);
    target.currentHp = Math.min(target.maxHp, target.currentHp + amount);
    return { kind: 'heal', amount, skillName: skill.name };
  }
  return { kind: 'noop' };
}

// Simple enemy AI: uses a skill ~50% of the time if it has MP for one,
// otherwise a basic attack. Targets the lowest-HP living party member.
export function chooseEnemyAction(enemy) {
  const usable = (enemy.skills || []).filter((id) => SKILLS[id].mpCost <= enemy.currentMp);
  if (usable.length > 0 && Math.random() < 0.5) {
    return usable[Math.floor(Math.random() * usable.length)];
  }
  return 'attack';
}

export function pickLowestHpTarget(party) {
  const alive = party.filter((m) => m.currentHp > 0);
  if (alive.length === 0) return null;
  return alive.reduce((lowest, m) => (m.currentHp / m.maxHp < lowest.currentHp / lowest.maxHp ? m : lowest));
}

export function rollGold(enemy) {
  return Math.floor(enemy.goldMin + Math.random() * (enemy.goldMax - enemy.goldMin + 1));
}

export function rollDrops(enemy) {
  const drops = [];
  for (const drop of enemy.drops || []) {
    if (Math.random() < drop.chance) drops.push({ id: drop.id, qty: drop.qty });
  }
  return drops;
}
