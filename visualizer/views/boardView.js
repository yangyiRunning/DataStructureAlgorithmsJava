/**
 * 棋盘视图：N 皇后、岛屿这类网格题用。
 *
 * 格子状态用四种底色区分就够，不额外画线：
 *   普通格 / 已被攻击的格 / 当前正在试的格 / 放了皇后的格。
 * 皇后用字母 Q 而不是 ♛：这个字在部分系统字体里缺字形，会渲染成豆腐块。
 */
import { el, empty, label } from '../core/svg.js';

const W = 900;
const H = 400;

export function render(svg, state) {
  empty(svg);

  const n = state.n ?? 4;
  const size = Math.min(74, (H - 150) / n, (W - 240) / n);
  const x0 = (W - size * n) / 2;
  const y0 = 56;

  const queens = state.queens ?? [];          // queens[r] = c 或 -1
  const attacked = new Set((state.attacked ?? []).map(([r, c]) => `${r},${c}`));
  const cur = state.current;                  // [r, c]
  const bad = state.bad ? new Set(state.bad.map(([r, c]) => `${r},${c}`)) : null;

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const key = `${r},${c}`;
      let cls = 'cell board';
      if (attacked.has(key)) cls += ' is-compare';
      if (bad && bad.has(key)) cls += ' is-move';
      if (queens[r] === c) cls += ' is-settled';
      if (cur && cur[0] === r && cur[1] === c) cls += ' is-active';

      svg.appendChild(el('rect', {
        class: cls,
        x: x0 + c * size,
        y: y0 + r * size,
        width: size - 3,
        height: size - 3,
        rx: 5,
      }));

      if (queens[r] === c) {
        svg.appendChild(label(x0 + c * size + (size - 3) / 2, y0 + r * size + size / 2 + 8, 'Q', {
          size: Math.min(22, size * 0.5), mono: true, fill: 'var(--ink)', weight: 700,
        }));
      }
    }
  }

  // 行号贴在左边，便于讲解时说"第几行"
  for (let r = 0; r < n; r++) {
    svg.appendChild(label(x0 - 14, y0 + r * size + size / 2 + 4, String(r), {
      size: 10, mono: true, fill: 'var(--ink-3)', anchor: 'end',
    }));
  }

  if (state.container?.items) {
    const box = state.container;
    const cy = H - 30;
    svg.appendChild(label(72, cy + 18, box.label, { size: 11, fill: 'var(--ink-3)', anchor: 'end' }));
    box.items.forEach((it, i) => {
      const cw = 38;
      const x = 86 + i * (cw + 4);
      if (x + cw > W - 20) return;
      svg.appendChild(el('rect', {
        class: it?.hot ? 'cell is-active' : 'cell', x, y: cy, width: cw, height: 26, rx: 5,
      }));
      svg.appendChild(label(x + cw / 2, cy + 18, String(it?.text ?? it), {
        size: 11, mono: true, fill: 'var(--ink)',
      }));
    });
  }
}

export const geometry = { W, H };
