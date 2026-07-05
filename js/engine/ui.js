const uiRoot = document.getElementById('ui-root');

export function setInteractive(interactive) {
  uiRoot.classList.toggle('interactive', interactive);
}

export function clearUI() {
  uiRoot.innerHTML = '';
}

export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'style') Object.assign(node.style, value);
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key === 'className') node.className = value;
    else if (key === 'html') node.innerHTML = value;
    else node.setAttribute(key, value);
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

export function mount(node) {
  uiRoot.appendChild(node);
  return node;
}

export { uiRoot };
