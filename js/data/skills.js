// type: 'physical' | 'magical' | 'heal'
// power is a multiplier applied to the caster's relevant offensive stat.

export const SKILLS = {
  power_strike: {
    id: 'power_strike', name: 'Power Strike', mpCost: 5,
    type: 'physical', power: 1.5, target: 'single',
    description: 'A heavy blow with the blade.',
  },
  reckless_swing: {
    id: 'reckless_swing', name: 'Reckless Swing', mpCost: 6,
    type: 'physical', power: 2.0, target: 'single',
    description: 'An all-out swing, sacrificing form for damage.',
  },
  shield_bash: {
    id: 'shield_bash', name: 'Shield Bash', mpCost: 5,
    type: 'physical', power: 1.3, target: 'single',
    description: 'Slam the target with a shield, drawing their focus.',
  },
  piercing_shot: {
    id: 'piercing_shot', name: 'Piercing Shot', mpCost: 6,
    type: 'physical', power: 1.7, target: 'single',
    description: 'An arrow aimed for the gaps in armor.',
  },
  frost_bolt: {
    id: 'frost_bolt', name: 'Frost Bolt', mpCost: 7,
    type: 'magical', power: 1.6, target: 'single',
    description: 'A bolt of freezing seidr magic.',
  },
  healing_rune: {
    id: 'healing_rune', name: 'Healing Rune', mpCost: 8,
    type: 'heal', power: 2.2, target: 'single-ally',
    description: 'Carve a rune of restoration.',
  },
  // --- enemy-only skills ---
  cleave: {
    id: 'cleave', name: 'Cleave', mpCost: 0,
    type: 'physical', power: 1.8, target: 'single',
    description: 'A wide, brutal axe swing.',
  },
  maul: {
    id: 'maul', name: 'Maul', mpCost: 0,
    type: 'physical', power: 1.6, target: 'single',
    description: 'Claws rake for heavy damage.',
  },
  fire_breath: {
    id: 'fire_breath', name: 'Fire Breath', mpCost: 10,
    type: 'magical', power: 2.2, target: 'single',
    description: 'A gout of searing dragonfire.',
  },
};
