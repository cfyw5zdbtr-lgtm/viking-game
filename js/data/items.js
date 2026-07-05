// Item catalogue. `slot` on equipment is one of weapon/armor/accessory.
// Materials have no slot and are only used for crafting/auction trading.

export const ITEMS = {
  // --- consumables ---
  potion_health: {
    id: 'potion_health', name: 'Health Potion', type: 'consumable',
    price: 15, effect: { hp: 40 }, description: 'Restores 40 HP.',
  },
  potion_mana: {
    id: 'potion_mana', name: 'Mana Potion', type: 'consumable',
    price: 15, effect: { mp: 20 }, description: 'Restores 20 MP.',
  },
  greater_health_potion: {
    id: 'greater_health_potion', name: 'Greater Health Potion', type: 'consumable',
    price: 45, effect: { hp: 90 }, description: 'Restores 90 HP.',
  },
  elixir: {
    id: 'elixir', name: 'Elixir', type: 'consumable',
    price: 90, effect: { hp: 999, mp: 999 }, description: 'Fully restores HP and MP.',
  },

  // --- equipment ---
  rusty_sword: {
    id: 'rusty_sword', name: 'Rusty Sword', type: 'equipment', slot: 'weapon',
    price: 0, bonus: { atk: 3 }, description: 'A dull starting blade.',
  },
  iron_sword: {
    id: 'iron_sword', name: 'Iron Sword', type: 'equipment', slot: 'weapon',
    price: 60, bonus: { atk: 8 }, description: 'A well-forged iron blade.',
    craft: { gold: 40, materials: { iron_scrap: 3 } },
  },
  steel_sword: {
    id: 'steel_sword', name: 'Steel Sword', type: 'equipment', slot: 'weapon',
    price: 140, bonus: { atk: 14 }, description: 'Upgraded iron sword, folded steel edge.',
    craft: { gold: 90, materials: { iron_scrap: 2 }, upgradeFrom: 'iron_sword' },
  },
  wooden_shield: {
    id: 'wooden_shield', name: 'Wooden Shield', type: 'equipment', slot: 'armor',
    price: 25, bonus: { def: 4 }, description: 'A simple round shield.',
  },
  iron_armor: {
    id: 'iron_armor', name: 'Iron Armor', type: 'equipment', slot: 'armor',
    price: 130, bonus: { def: 10, hp: 15 }, description: 'Banded iron chestplate.',
    craft: { gold: 50, materials: { bear_pelt: 2, iron_scrap: 2 } },
  },
  leather_boots: {
    id: 'leather_boots', name: 'Leather Boots', type: 'equipment', slot: 'accessory',
    price: 30, bonus: { spd: 3 }, description: 'Light boots for quick footwork.',
  },
  chieftain_axe: {
    id: 'chieftain_axe', name: "Chieftain's Axe", type: 'equipment', slot: 'weapon',
    price: 0, bonus: { atk: 18, luk: 2 }, description: 'Rare axe carried by the Raider Chieftain.',
  },
  frost_blade: {
    id: 'frost_blade', name: 'Frost Blade', type: 'equipment', slot: 'weapon',
    price: 260, bonus: { atk: 22 }, description: 'A blade rimed with unmelting frost.',
    craft: { gold: 160, materials: { thick_pelt: 3 }, upgradeFrom: 'steel_sword' },
  },
  frost_fang: {
    id: 'frost_fang', name: 'Frost Fang', type: 'equipment', slot: 'accessory',
    price: 0, bonus: { spd: 5, luk: 3 }, description: "Fang torn from the Alpha Polar Bear's jaw.",
  },
  frost_mail: {
    id: 'frost_mail', name: 'Frost Mail', type: 'equipment', slot: 'armor',
    price: 240, bonus: { def: 16, hp: 25 }, description: 'Iron armor lined with thick fur.',
    craft: { gold: 140, materials: { thick_pelt: 3 }, upgradeFrom: 'iron_armor' },
  },
  legion_blade: {
    id: 'legion_blade', name: 'Legion Blade', type: 'equipment', slot: 'weapon',
    price: 420, bonus: { atk: 30 }, description: 'A short, brutally efficient Roman gladius.',
    craft: { gold: 260, materials: { roman_steel: 3 }, upgradeFrom: 'frost_blade' },
  },
  centurion_shield: {
    id: 'centurion_shield', name: "Centurion's Shield", type: 'equipment', slot: 'armor',
    price: 0, bonus: { def: 20, hp: 20 }, description: 'A rare tower shield taken from the Centurion.',
  },
  legion_plate: {
    id: 'legion_plate', name: 'Legion Plate', type: 'equipment', slot: 'armor',
    price: 400, bonus: { def: 24, hp: 35 }, description: 'Segmented Roman battle plate.',
    craft: { gold: 240, materials: { roman_steel: 3 }, upgradeFrom: 'frost_mail' },
  },
  grave_edge: {
    id: 'grave_edge', name: 'Grave Edge', type: 'equipment', slot: 'weapon',
    price: 620, bonus: { atk: 40 }, description: 'A blade pulled from a battlefield grave.',
    craft: { gold: 380, materials: { zombie_sinew: 3 }, upgradeFrom: 'legion_blade' },
  },
  warlord_crest: {
    id: 'warlord_crest', name: "Warlord's Crest", type: 'equipment', slot: 'accessory',
    price: 0, bonus: { atk: 6, mag: 6, luk: 4 }, description: 'A crest worn by the Undead Warlord.',
  },
  bone_ward: {
    id: 'bone_ward', name: 'Bone Ward', type: 'equipment', slot: 'armor',
    price: 580, bonus: { def: 32, hp: 50, res: 6 }, description: 'Armor grafted with warded bone plates.',
    craft: { gold: 360, materials: { zombie_sinew: 3 }, upgradeFrom: 'legion_plate' },
  },
  dragon_fang: {
    id: 'dragon_fang', name: 'Dragon Fang', type: 'equipment', slot: 'weapon',
    price: 950, bonus: { atk: 55, luk: 4 }, description: 'A blade forged from a dragon fang.',
    craft: { gold: 600, materials: { dragon_scale: 4 }, upgradeFrom: 'grave_edge' },
  },
  dragon_scale_mail: {
    id: 'dragon_scale_mail', name: 'Dragon Scale Mail', type: 'equipment', slot: 'armor',
    price: 900, bonus: { def: 42, hp: 70, res: 10 }, description: 'Armor plated with dragon scale.',
    craft: { gold: 560, materials: { dragon_scale: 4 }, upgradeFrom: 'bone_ward' },
  },
  overlord_crown: {
    id: 'overlord_crown', name: "Overlord's Crown", type: 'equipment', slot: 'accessory',
    price: 0, bonus: { atk: 10, def: 10, mag: 10, res: 10, spd: 10, luk: 10 },
    description: 'The crown of the Zombie Overlord Dragon. A trophy worthy of legend.',
  },

  // --- materials ---
  iron_scrap: {
    id: 'iron_scrap', name: 'Iron Scrap', type: 'material',
    sellPrice: 5, buyPrice: 12, description: 'Scavenged iron, useful for forging.',
  },
  bear_pelt: {
    id: 'bear_pelt', name: 'Bear Pelt', type: 'material',
    sellPrice: 8, buyPrice: 18, description: 'A thick hide, good for armor.',
  },
  thick_pelt: {
    id: 'thick_pelt', name: 'Thick Pelt', type: 'material',
    sellPrice: 12, buyPrice: 26, description: 'A dense polar hide, good insulation for armor.',
  },
  roman_steel: {
    id: 'roman_steel', name: 'Roman Steel', type: 'material',
    sellPrice: 18, buyPrice: 38, description: 'Well-tempered legionary steel.',
  },
  zombie_sinew: {
    id: 'zombie_sinew', name: 'Zombie Sinew', type: 'material',
    sellPrice: 24, buyPrice: 50, description: 'Unnaturally tough undead tissue.',
  },
  dragon_scale: {
    id: 'dragon_scale', name: 'Dragon Scale', type: 'material',
    sellPrice: 40, buyPrice: 85, description: 'A scale harder than any steel.',
  },
};
