// Side-scrolling map descriptors (Kingdom-style: a single horizontal ground
// line per map, camera pans left/right only). Each map is:
//   worldWidth   - px, total scrollable width
//   groundY      - px, the y-coordinate characters' feet stand on
//   sky          - { top, bottom } vertical gradient colors
//   waterColor   - tint applied to the mirrored reflection band below ground
//   decorations  - non-interactive parallax atmosphere (mountains/moon/trees/
//                  statues/campfires), each { type, x, ...extras }
//   pois         - interactive points of interest, each { type, x }; type is
//                  one of shop/blacksmith/auction/recruiter/stage_gate/
//                  hub_return/boss_gate/enemy_a/enemy_b/loot_node/player_spawn
//                  (enemy_a/enemy_b resolve to whichever stage's enemyIds[0]/
//                  [1] are current - see data/stages.js)

const GROUND_Y = 340;

function stageLayout({ worldWidth = 3500, sky, waterColor, decorations }) {
  return {
    worldWidth,
    groundY: GROUND_Y,
    sky,
    waterColor,
    decorations,
    pois: [
      { type: 'hub_return', x: 100 },
      { type: 'enemy_a', x: 450 },
      { type: 'enemy_b', x: 800 },
      { type: 'loot_node', x: 1150 },
      { type: 'enemy_a', x: 1500 },
      { type: 'enemy_b', x: 1850 },
      { type: 'loot_node', x: 2200 },
      { type: 'enemy_a', x: 2550 },
      { type: 'enemy_b', x: 2900 },
      { type: 'boss_gate', x: 3300 },
    ],
  };
}

const HUB_MAP = {
  worldWidth: 1800,
  groundY: GROUND_Y,
  sky: { top: '#6a4a5a', bottom: '#d89a6a' },
  waterColor: '#3a4a3a',
  decorations: [
    { type: 'mountain', x: -100, height: 160, width: 260 },
    { type: 'mountain', x: 900, height: 130, width: 300 },
    { type: 'tree', x: 250 },
    { type: 'tree', x: 620 },
    { type: 'tree', x: 980 },
    { type: 'tree', x: 1350 },
    { type: 'tree', x: 1650 },
    { type: 'campfire', x: 1575 },
  ],
  pois: [
    { type: 'player_spawn', x: 100 },
    { type: 'shop', x: 400 },
    { type: 'blacksmith', x: 750 },
    { type: 'auction', x: 1100 },
    { type: 'recruiter', x: 1450 },
    { type: 'stage_gate', x: 1700 },
  ],
};

export const MAPS = {
  hub: HUB_MAP,
  stage1: stageLayout({
    sky: { top: '#3a5a6a', bottom: '#8ab0a8' },
    waterColor: '#2f5d3a',
    decorations: [
      { type: 'mountain', x: 200, height: 150, width: 280 },
      { type: 'mountain', x: 1800, height: 180, width: 320 },
      { type: 'mountain', x: 3000, height: 140, width: 260 },
      { type: 'tree', x: 650 }, { type: 'tree', x: 1350 }, { type: 'tree', x: 2050 }, { type: 'tree', x: 2750 },
    ],
  }),
  stage2: stageLayout({
    sky: { top: '#1a2a40', bottom: '#4a6a7a' },
    waterColor: '#2a3a42',
    decorations: [
      { type: 'moon', x: 2600, y: 90, radius: 40 },
      { type: 'mountain', x: 100, height: 170, width: 300 },
      { type: 'mountain', x: 1600, height: 200, width: 340 },
      { type: 'mountain', x: 2900, height: 160, width: 280 },
    ],
  }),
  stage3: stageLayout({
    sky: { top: '#5a4530', bottom: '#c8975a' },
    waterColor: '#5a4a30',
    decorations: [
      { type: 'statue', x: 900, height: 220 },
      { type: 'statue', x: 2500, height: 220 },
      { type: 'mountain', x: 1700, height: 130, width: 260 },
    ],
  }),
  stage4: stageLayout({
    sky: { top: '#201a2a', bottom: '#4a3a4a' },
    waterColor: '#241f2e',
    decorations: [
      { type: 'moon', x: 1200, y: 100, radius: 36 },
      { type: 'mountain', x: 300, height: 140, width: 260 },
      { type: 'mountain', x: 2400, height: 160, width: 300 },
      { type: 'tree', x: 1000 }, { type: 'tree', x: 2000 },
    ],
  }),
  stage5: stageLayout({
    sky: { top: '#3a1a10', bottom: '#c85a2f' },
    waterColor: '#4a2010',
    decorations: [
      { type: 'mountain', x: 400, height: 200, width: 340 },
      { type: 'mountain', x: 1900, height: 220, width: 360 },
      { type: 'mountain', x: 3100, height: 180, width: 300 },
      { type: 'campfire', x: 1150 },
    ],
  }),
  stage6: stageLayout({
    sky: { top: '#200808', bottom: '#8a2a1f' },
    waterColor: '#301008',
    decorations: [
      { type: 'mountain', x: 250, height: 240, width: 380 },
      { type: 'mountain', x: 1700, height: 260, width: 400 },
      { type: 'mountain', x: 3000, height: 230, width: 360 },
    ],
  }),
  stage7: stageLayout({
    sky: { top: '#050a0a', bottom: '#1a2a2a' },
    waterColor: '#0a1515',
    decorations: [
      { type: 'moon', x: 1800, y: 80, radius: 44 },
      { type: 'statue', x: 700, height: 260 },
      { type: 'statue', x: 2900, height: 260 },
    ],
  }),
};
