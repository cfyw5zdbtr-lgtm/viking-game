// Base stats at level 1 + linear per-level growth.
// getStats() below computes a character's stats at their current level
// (before equipment bonuses, which are added separately in systems/combat.js).

export const CLASSES = {
  warrior: {
    id: 'warrior',
    name: 'Warrior',
    description: 'Balanced fighter, the player\'s own class.',
    base: { hp: 100, mp: 20, atk: 12, def: 10, mag: 4, res: 6, spd: 8, luk: 6 },
    growth: { hp: 18, mp: 3, atk: 2.4, def: 2, mag: 0.6, res: 1, spd: 1.2, luk: 1 },
    skills: ['power_strike'],
  },
  berserker: {
    id: 'berserker',
    name: 'Berserker',
    description: 'Reckless heavy hitter, low defense.',
    base: { hp: 110, mp: 10, atk: 16, def: 6, mag: 2, res: 3, spd: 9, luk: 5 },
    growth: { hp: 20, mp: 1.5, atk: 3, def: 1, mag: 0.3, res: 0.6, spd: 1.3, luk: 0.8 },
    skills: ['reckless_swing'],
  },
  shieldmaiden: {
    id: 'shieldmaiden',
    name: 'Shieldmaiden',
    description: 'Tanky frontliner with high defense.',
    base: { hp: 130, mp: 15, atk: 10, def: 16, mag: 3, res: 10, spd: 6, luk: 5 },
    growth: { hp: 24, mp: 2, atk: 1.8, def: 3, mag: 0.4, res: 1.6, spd: 0.8, luk: 0.8 },
    skills: ['shield_bash'],
  },
  huntress: {
    id: 'huntress',
    name: 'Huntress',
    description: 'Fast, precise ranged attacker.',
    base: { hp: 90, mp: 18, atk: 13, def: 6, mag: 5, res: 6, spd: 14, luk: 9 },
    growth: { hp: 15, mp: 2.5, atk: 2.2, def: 1, mag: 0.8, res: 1, spd: 1.8, luk: 1.4 },
    skills: ['piercing_shot'],
  },
  seer: {
    id: 'seer',
    name: 'Seer',
    description: 'Frost mage and healer.',
    base: { hp: 80, mp: 35, atk: 6, def: 6, mag: 16, res: 12, spd: 9, luk: 7 },
    growth: { hp: 13, mp: 5, atk: 0.8, def: 1, mag: 3, res: 1.8, spd: 1, luk: 1 },
    skills: ['healing_rune', 'frost_bolt'],
  },
};

export function getStatsAtLevel(classId, level) {
  const cls = CLASSES[classId];
  const lv = Math.max(1, level);
  const stats = {};
  for (const key of Object.keys(cls.base)) {
    stats[key] = Math.round(cls.base[key] + cls.growth[key] * (lv - 1));
  }
  return stats;
}
