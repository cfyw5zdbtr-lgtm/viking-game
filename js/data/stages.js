// Stage metadata driving the hub's stage gate, boss gate, and encounter
// markers ('1'/'2' on a stage map resolve to enemyIds[0]/enemyIds[1] here).

export const STAGES = [
  {
    id: 1, name: 'Coastal Village Outskirts', mapKey: 'stage1',
    enemyIds: ['bad_viking', 'bear'], bossId: 'raider_chieftain',
    implemented: true,
  },
  {
    id: 2, name: 'Frozen Tundra', mapKey: 'stage2',
    enemyIds: ['bad_viking', 'polar_bear'], bossId: 'alpha_polar_bear',
    implemented: true,
  },
  {
    id: 3, name: 'Roman Frontier Fort', mapKey: 'stage3',
    enemyIds: ['roman_legionary', 'roman_legionary'], bossId: 'roman_centurion',
    implemented: true,
  },
  {
    id: 4, name: 'Cursed Battlefield', mapKey: 'stage4',
    enemyIds: ['zombie_viking', 'zombie_bear'], bossId: 'undead_warlord',
    implemented: true,
  },
  {
    id: 5, name: "Dragon's Foothills", mapKey: 'stage5',
    enemyIds: ['zombie_viking', 'roman_legionary'], bossId: 'medium_dragon',
    implemented: true,
  },
  {
    id: 6, name: "Dragon's Peak", mapKey: 'stage6',
    enemyIds: ['zombie_bear', 'roman_legionary'], bossId: 'large_dragon',
    implemented: true,
  },
  {
    id: 7, name: 'The Sunken Crypt', mapKey: 'stage7',
    enemyIds: ['zombie_viking', 'zombie_bear'], bossId: 'zombie_overlord_dragon',
    implemented: true,
  },
];

export function getStage(id) {
  return STAGES.find((s) => s.id === id);
}
