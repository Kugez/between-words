import { h } from '../dom.js';

// A modal panel over the scene. Escape or the close button dismisses it.
export function openOverlay({ className = '', label, closeLabel, onClose, content }) {
  const close = () => {
    document.removeEventListener('keydown', onKey);
    root.remove();
    onClose?.();
  };
  const onKey = (e) => {
    if (e.key === 'Escape') close();
  };
  const root = h('div', { class: `overlay ${className}`, role: 'dialog', 'aria-modal': 'true', 'aria-label': label },
    h('div', { class: 'overlay__panel' },
      h('button', { class: 'overlay__close', 'data-action': 'close', 'aria-label': closeLabel, onclick: close }, '×'),
      content,
    ),
  );
  root.addEventListener('click', (e) => {
    if (e.target === root) close();
  });
  document.addEventListener('keydown', onKey);
  document.getElementById('app').append(root);
  return { root, close };
}
