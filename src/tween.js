const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

// Calls step(progress) every frame for `ms` and resolves when done.
// With reduced motion the final frame is drawn at once.
export function tween(ms, step) {
  if (reduceMotion.matches || ms <= 0) {
    step(1);
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const start = performance.now();
    const frame = (now) => {
      const t = Math.min(1, (now - start) / ms);
      step(ease(t));
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });
}

export function wait(ms) {
  if (reduceMotion.matches) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const lerp = (a, b, t) => a + (b - a) * t;
