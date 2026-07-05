// Enemy templates. sprite refers to assets/sprites/enemies/<sprite>.png
// (falls back to a colored rectangle until art is generated).

export const ENEMIES = {
  bad_viking: {
    id: 'bad_viking', name: 'Bad Viking', sprite: 'bad_viking', color: '#7a4a3a',
    stats: { hp: 45, mp: 6, atk: 9, def: 5, mag: 2, res: 3, spd: 7, luk: 4 },
    skills: [], exp: 14, goldMin: 8, goldMax: 14,
    drops: [{ id: 'iron_scrap', chance: 0.6, qty: 1 }],
  },
  bear: {
    id: 'bear', name: 'Bear', sprite: 'bear', color: '#4a3626',
    stats: { hp: 70, mp: 0, atk: 12, def: 6, mag: 0, res: 2, spd: 5, luk: 2 },
    skills: [], exp: 18, goldMin: 5, goldMax: 10,
    drops: [{ id: 'bear_pelt', chance: 0.7, qty: 1 }],
  },
  raider_chieftain: {
    id: 'raider_chieftain', name: 'Raider Chieftain', sprite: 'raider_chieftain', color: '#8a2a2a',
    isBoss: true,
    stats: { hp: 220, mp: 20, atk: 16, def: 9, mag: 4, res: 6, spd: 9, luk: 8 },
    skills: ['cleave'], exp: 120, goldMin: 80, goldMax: 120,
    drops: [
      { id: 'iron_scrap', chance: 1.0, qty: 2 },
      { id: 'chieftain_axe', chance: 1.0, qty: 1 },
    ],
  },
  polar_bear: {
    id: 'polar_bear', name: 'Polar Bear', sprite: 'polar_bear', color: '#d8e4e8',
    stats: { hp: 78, mp: 0, atk: 13, def: 7, mag: 0, res: 3, spd: 6, luk: 2 },
    skills: [], exp: 22, goldMin: 9, goldMax: 16,
    drops: [{ id: 'thick_pelt', chance: 0.7, qty: 1 }],
  },
  alpha_polar_bear: {
    id: 'alpha_polar_bear', name: 'Alpha Polar Bear', sprite: 'alpha_polar_bear', color: '#eaf4f6',
    isBoss: true,
    stats: { hp: 260, mp: 10, atk: 20, def: 11, mag: 0, res: 4, spd: 8, luk: 6 },
    skills: ['maul'], exp: 170, goldMin: 110, goldMax: 160,
    drops: [
      { id: 'thick_pelt', chance: 1.0, qty: 3 },
      { id: 'frost_fang', chance: 1.0, qty: 1 },
    ],
  },
  roman_legionary: {
    id: 'roman_legionary', name: 'Roman Legionary', sprite: 'roman_legionary', color: '#8a1f1f',
    stats: { hp: 58, mp: 5, atk: 12, def: 10, mag: 1, res: 4, spd: 6, luk: 4 },
    skills: [], exp: 26, goldMin: 11, goldMax: 18,
    drops: [{ id: 'roman_steel', chance: 0.65, qty: 1 }],
  },
  roman_centurion: {
    id: 'roman_centurion', name: 'Roman Centurion', sprite: 'roman_centurion', color: '#b5341f',
    isBoss: true,
    stats: { hp: 300, mp: 18, atk: 21, def: 15, mag: 3, res: 7, spd: 9, luk: 8 },
    skills: ['cleave'], exp: 230, goldMin: 150, goldMax: 210,
    drops: [
      { id: 'roman_steel', chance: 1.0, qty: 3 },
      { id: 'centurion_shield', chance: 1.0, qty: 1 },
    ],
  },
  zombie_viking: {
    id: 'zombie_viking', name: 'Zombie Viking', sprite: 'zombie_viking', color: '#5a6a4a',
    stats: { hp: 64, mp: 8, atk: 11, def: 7, mag: 4, res: 6, spd: 4, luk: 3 },
    skills: [], exp: 30, goldMin: 12, goldMax: 20,
    drops: [{ id: 'zombie_sinew', chance: 0.65, qty: 1 }],
  },
  zombie_bear: {
    id: 'zombie_bear', name: 'Zombie Bear', sprite: 'zombie_bear', color: '#3a4a36',
    stats: { hp: 92, mp: 0, atk: 15, def: 8, mag: 0, res: 5, spd: 3, luk: 2 },
    skills: [], exp: 32, goldMin: 12, goldMax: 20,
    drops: [{ id: 'zombie_sinew', chance: 0.65, qty: 1 }],
  },
  undead_warlord: {
    id: 'undead_warlord', name: 'Undead Warlord', sprite: 'undead_warlord', color: '#3f4a3a',
    isBoss: true,
    stats: { hp: 340, mp: 24, atk: 23, def: 13, mag: 8, res: 10, spd: 8, luk: 8 },
    skills: ['cleave', 'maul'], exp: 300, goldMin: 200, goldMax: 270,
    drops: [
      { id: 'zombie_sinew', chance: 1.0, qty: 3 },
      { id: 'warlord_crest', chance: 1.0, qty: 1 },
    ],
  },
  medium_dragon: {
    id: 'medium_dragon', name: 'Medium Dragon', sprite: 'medium_dragon', color: '#c0522f',
    isBoss: true,
    stats: { hp: 420, mp: 40, atk: 27, def: 16, mag: 16, res: 11, spd: 11, luk: 9 },
    skills: ['fire_breath', 'cleave'], exp: 420, goldMin: 280, goldMax: 360,
    drops: [
      { id: 'dragon_scale', chance: 1.0, qty: 3 },
    ],
  },
  large_dragon: {
    id: 'large_dragon', name: 'Large Dragon', sprite: 'large_dragon', color: '#8a1f1f',
    isBoss: true,
    stats: { hp: 560, mp: 50, atk: 32, def: 20, mag: 20, res: 14, spd: 12, luk: 10 },
    skills: ['fire_breath', 'cleave', 'maul'], exp: 600, goldMin: 400, goldMax: 520,
    drops: [
      { id: 'dragon_scale', chance: 1.0, qty: 5 },
    ],
  },
  zombie_overlord_dragon: {
    id: 'zombie_overlord_dragon', name: 'Zombie Overlord Dragon', sprite: 'zombie_overlord_dragon', color: '#2a3a2a',
    isBoss: true,
    stats: { hp: 780, mp: 60, atk: 37, def: 23, mag: 26, res: 17, spd: 13, luk: 12 },
    skills: ['fire_breath', 'cleave', 'maul'], exp: 1000, goldMin: 700, goldMax: 900,
    drops: [
      { id: 'dragon_scale', chance: 1.0, qty: 8 },
      { id: 'overlord_crown', chance: 1.0, qty: 1 },
    ],
  },
};

// Generic scaling for future stages: statMult = 1 + 0.4*(stageIndex-1),
// bosses get an additional x1.3 on top of their stage's trash-mob multiplier.
export function scaleStats(baseStats, stageIndex, isBoss = false) {
  const mult = (1 + 0.4 * (stageIndex - 1)) * (isBoss ? 1.3 : 1);
  const scaled = {};
  for (const key of Object.keys(baseStats)) {
    scaled[key] = Math.round(baseStats[key] * mult);
  }
  return scaled;
}
