import { CLASSES } from '../data/classes.js';
import { recomputeStats } from './stats.js';

export const MAX_LEVEL = 50;

export function expForNextLevel(level) {
  return Math.round(20 * level * level + 30 * level);
}

// Applies exp gain in place, returns { leveledUp, levelsGained }.
export function grantExp(member, amount) {
  member.exp += amount;
  let levelsGained = 0;
  while (member.level < MAX_LEVEL && member.exp >= expForNextLevel(member.level)) {
    member.exp -= expForNextLevel(member.level);
    member.level += 1;
    levelsGained += 1;
  }
  if (levelsGained > 0) {
    recomputeStats(member);
    // Heal to full on level up so the party doesn't limp forward at higher stats.
    member.currentHp = member.maxHp;
    member.currentMp = member.maxMp;
  }
  return { leveledUp: levelsGained > 0, levelsGained };
}

export function classSkills(classId) {
  return CLASSES[classId].skills;
}
