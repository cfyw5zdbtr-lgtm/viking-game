const screens = {};
let currentName = null;

export function registerScreen(name, screen) {
  screens[name] = screen;
}

export function goto(name, params) {
  const prev = currentName ? screens[currentName] : null;
  if (prev && prev.onExit) prev.onExit();
  currentName = name;
  const screen = screens[name];
  if (!screen) throw new Error(`Unknown screen: ${name}`);
  if (screen.onEnter) screen.onEnter(params);
}

export function getCurrentScreen() {
  return currentName ? screens[currentName] : null;
}

export function getCurrentName() {
  return currentName;
}
