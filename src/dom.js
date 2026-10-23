const SVG_NS = 'http://www.w3.org/2000/svg';

// Small element builder: h('button', { class: 'button', onclick }, 'Text').
function build(el, props, children) {
  for (const [key, value] of Object.entries(props || {})) {
    if (value == null || value === false) continue;
    if (key.startsWith('on')) el.addEventListener(key.slice(2), value);
    else el.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

export function h(tag, props, ...children) {
  return build(document.createElement(tag), props, children);
}

export function s(tag, props, ...children) {
  return build(document.createElementNS(SVG_NS, tag), props, children);
}
