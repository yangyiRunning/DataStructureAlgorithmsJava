/**
 * 汉诺塔视图：三根柱子 + 圆盘。
 *
 * 圆盘用宽度编码大小（宽 = 盘号），而不是画成实心圆片——
 * 讲汉诺塔时最常被问的是"哪个盘能放到哪个盘上"，宽度一眼能比出来。
 */
import { el, empty, label } from '../core/svg.js';

const W = 900;
const H = 380;

export function render(svg, state) {
  empty(svg);

  const pegs = state.pegs ?? [[], [], []];
  const names = state.names ?? ['A', 'B', 'C'];
  const total = state.total ?? Math.max(...pegs.flat(), 1);

  const n = pegs.length;
  const colW = W / (n + 1);
  const baseY = H - 84;
  const maxDiskW = colW * 0.82;
  const minDiskW = maxDiskW * 0.32;
  const diskH = Math.min(22, (baseY - 60) / Math.max(1, total));

  const moving = new Set(state.moving ?? []);

  pegs.forEach((peg, pi) => {
    const cx = colW * (pi + 0.5);

    // 柱子
    svg.appendChild(el('rect', {
      class: 'peg', x: cx - 3, y: 70, width: 6, height: baseY - 70, rx: 3,
    }));
    // 底座
    svg.appendChild(el('rect', {
      class: 'peg-base', x: cx - maxDiskW / 2 - 10, y: baseY, width: maxDiskW + 20, height: 8, rx: 4,
    }));
    svg.appendChild(label(cx, baseY + 30, names[pi], { size: 13, mono: true, fill: 'var(--ink-2)', weight: 600 }));

    peg.forEach((disk, di) => {
      const w = minDiskW + ((maxDiskW - minDiskW) * (disk - 1)) / Math.max(1, total - 1);
      const y = baseY - (di + 1) * diskH;
      const isMoving = moving.has(disk) && di === peg.length - 1;
      svg.appendChild(el('rect', {
        class: isMoving ? 'disk is-moved' : 'disk',
        x: cx - w / 2,
        y: y + 1,
        width: w,
        height: diskH - 3,
        rx: 4,
      }));
      svg.appendChild(label(cx, y + diskH / 2 + 4, String(disk), {
        size: Math.min(11, diskH * 0.6), mono: true, fill: 'var(--ink)', weight: 600,
      }));
    });
  });

  if (state.container?.items) {
    const box = state.container;
    const cy = 24;
    svg.appendChild(label(72, cy + 18, box.label, { size: 11, fill: 'var(--ink-3)', anchor: 'end' }));
    box.items.forEach((it, i) => {
      const cw = 40;
      const x = 86 + i * (cw + 4);
      if (x + cw > W - 20) return;
      svg.appendChild(el('rect', {
        class: 'cell', x, y: cy, width: cw, height: 26, rx: 5,
      }));
      svg.appendChild(label(x + cw / 2, cy + 18, String(it?.text ?? it), {
        size: 11, mono: true, fill: 'var(--ink)',
      }));
    });
  }
}

export const geometry = { W, H };
