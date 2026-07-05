import { recomputeStats } from './systems/stats.js';

// Single mutable game-state object shared by every screen/system. Screens
// read/write this directly rather than each keeping their own copy.
export const state = {
  screen: 'title',
  player: { name: 'Erik', gender: 'boy' },
  party: [],
  inventory: {
    gold: 100,
    diamonds: 0, // stubbed premium currency, no earn/spend paths yet
    items: { potion_health: 3 },
    gear: {},
    materials: {},
  },
  progress: {
    stageId: 1,
    stagesCleared: [],
    currentMap: 'hub',
    spawnMarker: null, // which marker to spawn the player near when a map loads
    defeatedMarkers: [], // `${mapKey}:${type}:${x}` for permanently cleared encounters
    collectedLoot: [],
    recruited: [],
  },
  market: { prices: {} },
};

let nextMemberUid = 1;

export function createMember(name, classId, level = 1) {
  const member = {
    uid: nextMemberUid++,
    name,
    classId,
    level,
    exp: 0,
    equipment: { weapon: null, armor: null, accessory: null },
    currentHp: 0,
    currentMp: 0,
  };
  recomputeStats(member);
  member.currentHp = member.maxHp;
  member.currentMp = member.maxMp;
  return member;
}

export function startNewGame(name, gender) {
  state.player.name = name || 'Erik';
  state.player.gender = gender || 'boy';
  state.party = [createMember(state.player.name, 'warrior', 1)];
  state.party[0].equipment.weapon = 'rusty_sword';
  recomputeStats(state.party[0]);
  state.inventory.gold = 100;
  state.inventory.diamonds = 0;
  state.inventory.items = { potion_health: 3 };
  state.inventory.gear = {};
  state.inventory.materials = {};
  state.progress = {
    stageId: 1,
    stagesCleared: [],
    currentMap: 'hub',
    spawnMarker: null,
    defeatedMarkers: [],
    collectedLoot: [],
    recruited: [],
  };
}

export function loadFromSnapshot(snapshot) {
  state.player = snapshot.player;
  state.party = snapshot.party;
  state.party.forEach(recomputeStats);
  state.inventory = snapshot.inventory;
  state.progress = snapshot.progress;
}

export function markerKey(mapKey, poi) {
  return `${mapKey}:${poi.type}:${poi.x}`;
}
