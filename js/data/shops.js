// Village economy content. The Blacksmith and Auction House list every item/
// material in the game up front - they're naturally gated by which materials
// you've actually looted, since those only drop in the stage you're on.
// SHOP_STOCK paces itself with unlockAfterStage (number of stages cleared).

export const SHOP_STOCK = [
  { id: 'potion_health', unlockAfterStage: 0 },
  { id: 'potion_mana', unlockAfterStage: 0 },
  { id: 'wooden_shield', unlockAfterStage: 0 },
  { id: 'leather_boots', unlockAfterStage: 0 },
  { id: 'greater_health_potion', unlockAfterStage: 1 },
  { id: 'elixir', unlockAfterStage: 4 },
];

export const BLACKSMITH_RECIPES = [
  'iron_sword', 'iron_armor', 'steel_sword',
  'frost_blade', 'frost_mail',
  'legion_blade', 'legion_plate',
  'grave_edge', 'bone_ward',
  'dragon_fang', 'dragon_scale_mail',
];

export const AUCTION_MATERIALS = [
  'iron_scrap', 'bear_pelt', 'thick_pelt', 'roman_steel', 'zombie_sinew', 'dragon_scale',
];

export const RECRUITS = [
  { id: 'ragnar', name: 'Ragnar', classId: 'berserker', price: 150, level: 1 },
  { id: 'freydis', name: 'Freydis', classId: 'shieldmaiden', price: 150, level: 1 },
  { id: 'astrid', name: 'Astrid', classId: 'huntress', price: 150, level: 1 },
  { id: 'solveig', name: 'Solveig', classId: 'seer', price: 180, level: 1 },
];
