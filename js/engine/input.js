const keysDown = new Set();
const keysPressed = new Set();

window.addEventListener('keydown', (e) => {
  if (!keysDown.has(e.code)) keysPressed.add(e.code);
  keysDown.add(e.code);
});

window.addEventListener('keyup', (e) => {
  keysDown.delete(e.code);
});

export const Input = {
  isDown(code) {
    return keysDown.has(code);
  },
  wasPressed(code) {
    return keysPressed.has(code);
  },
  isMoveUp() { return keysDown.has('KeyW') || keysDown.has('ArrowUp'); },
  isMoveDown() { return keysDown.has('KeyS') || keysDown.has('ArrowDown'); },
  isMoveLeft() { return keysDown.has('KeyA') || keysDown.has('ArrowLeft'); },
  isMoveRight() { return keysDown.has('KeyD') || keysDown.has('ArrowRight'); },
  isConfirmPressed() { return keysPressed.has('Space') || keysPressed.has('Enter'); },
  isCancelPressed() { return keysPressed.has('Escape'); },
  // Call at end of each frame to clear the "just pressed" set.
  endFrame() {
    keysPressed.clear();
  }
};
