import { registerScreen, goto, getCurrentScreen } from './router.js';
import { Input } from './engine/input.js';

import titleScreen from './screens/titleScreen.js';
import characterCreate from './screens/characterCreate.js';
import overworld from './screens/overworld.js';
import battle from './screens/battle.js';
import shop from './screens/shop.js';
import blacksmith from './screens/blacksmith.js';
import auctionHouse from './screens/auctionHouse.js';
import recruiter from './screens/recruiter.js';
import pauseMenu from './screens/pauseMenu.js';
import victory from './screens/victory.js';

registerScreen('title', titleScreen);
registerScreen('characterCreate', characterCreate);
registerScreen('overworld', overworld);
registerScreen('battle', battle);
registerScreen('shop', shop);
registerScreen('blacksmith', blacksmith);
registerScreen('auction', auctionHouse);
registerScreen('recruiter', recruiter);
registerScreen('pauseMenu', pauseMenu);
registerScreen('victory', victory);

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

let lastTime = performance.now();

// setTimeout rather than requestAnimationFrame: rAF is fully suspended by
// browsers when the tab/document is hidden (e.g. automated preview/testing
// harnesses, or a backgrounded tab), which would silently stall the whole
// game. setTimeout keeps ticking either way and still runs at a smooth
// ~60fps in a normal focused tab.
function loop() {
  const now = performance.now();
  const dt = Math.min(0.25, (now - lastTime) / 1000);
  lastTime = now;

  const screen = getCurrentScreen();
  try {
    if (screen) {
      if (screen.update) screen.update(dt);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (screen.render) screen.render(ctx);
    }
  } catch (err) {
    // A single bad frame shouldn't silently freeze the whole game; log and
    // keep the loop alive so the rest of the app stays responsive.
    console.error('Game loop error:', err);
  }
  Input.endFrame();
  setTimeout(loop, 16);
}

goto('title');
setTimeout(loop, 16);
