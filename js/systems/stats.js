import { getStatsAtLevel } from '../data/classes.js';
import { ITEMS } from '../data/items.js';

const STAT_KEYS = ['hp', 'mp', 'atk', 'def', 'mag', 'res', 'spd', 'luk'];

// Recomputes a party member's max* stats from class+level+equipment and
// stores them directly on the member object (maxHp/maxMp/atk/def/mag/res/
// spd/luk) so battle/UI code can read them without recalculating. Current
// HP/MP are clamped to the new max but never restored here.
export function recomputeStats(member) {
  const base = getStatsAtLevel(member.classId, member.level);
  const totals = { ...base };
  for (const slot of Object.keys(member.equipment)) {
    const itemId = member.equipment[slot];
    if (!itemId) continue;
    const item = ITEMS[itemId];
    if (!item || !item.bonus) continue;
    for (const key of STAT_KEYS) {
      if (item.bonus[key]) totals[key] += item.bonus[key];
    }
  }
  member.maxHp = totals.hp;
  member.maxMp = totals.mp;
  member.atk = totals.atk;
  member.def = totals.def;
  member.mag = totals.mag;
  member.res = totals.res;
  member.spd = totals.spd;
  member.luk = totals.luk;

  member.currentHp = Math.min(member.currentHp ?? member.maxHp, member.maxHp);
  member.currentMp = Math.min(member.currentMp ?? member.maxMp, member.maxMp);
}
