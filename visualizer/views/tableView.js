/**
 * 表格视图：DP 填表用。
 *
 * 一格里放一个数（或短字符串），行头列头标清楚"这一行/这一列代表什么"。
 * 当前格子用蓝框，它依赖的格子（左上/正上/左）用浅蓝底标出来——
 * DP 讲不清，十有八九是因为读者看不到"这一格是从哪几格算出来的"。
 */
import { el, empty, label } from '../core/svg.js';

const W = 900;
const H = 400;

export function render(svg, state) {
  empty(svg);

  const cells = state.cells ?? [];
  const rows = cells.length;
  const cols = rows ? cells[0].length : 0;
  if (!rows || !cols) {
    svg.appendChild(label(W / 2, H / 2, '空表', { size: 13, fill: 'var(--ink-3)' }));
    return;
  }

  const rowHead = state.rowHead ?? [];
  const colHead = state.colHead ?? [];
  const headW = 86;
  const headH = 40;

  const colW = Math.min(58, (W - headW - 40) / cols);
  const rowH = Math.min(40, (H - headH - 70) / rows);

  const x0 = (W - (headW + colW * cols)) / 2;
  const y0 = 46;

  // 未填的格子留空而不是显示 0：DP 表初始值也是 0，混在一起会让人以为"这一格已经算成 0 了"
  const filledSet = state.filled ? new Set(state.filled.map(([r, c]) => `${r},${c}`)) : null;
  const isFilled = (r, c) => !filledSet || filledSet.has(`${r},${c}`);

  const cur = state.current;
  const deps = new Set((state.deps ?? []).map(([r, c]) => `${r},${c}`));
  const done = new Set((state.done ?? []).map(([r, c]) => `${r},${c}`));

  // 角标
  svg.appendChild(el('rect', {
    class: 'cell head', x: x0, y: y0, width: headW, height: headH, rx: 6,
  }));

  // 列头
  colHead.forEach((h, c) => {
    svg.appendChild(el('rect', {
      class: 'cell head', x: x0 + headW + c * colW, y: y0, width: colW - 2, height: headH, rx: 6,
    }));
    svg.appendChild(label(x0 + headW + c * colW + (colW - 2) / 2, y0 + headH / 2 + 4, String(h), {
      size: 11, mono: true, fill: 'var(--sub)',
    }));
  });

  // 行头
  rowHead.forEach((h, r) => {
    svg.appendChild(el('rect', {
      class: 'cell head', x: x0, y: y0 + headH + r * rowH, width: headW, height: rowH - 2, rx: 6,
    }));
    svg.appendChild(label(x0 + 10, y0 + headH + r * rowH + rowH / 2 + 4, String(h), {
      size: 11, mono: true, fill: 'var(--sub)', anchor: 'start',
    }));
  });

  // 格子
  cells.forEach((row, r) => {
    row.forEach((v, c) => {
      const key = `${r},${c}`;
      let cls = 'cell';
      if (!isFilled(r, c)) cls += ' is-empty';
      if (done.has(key)) cls += ' is-settled';
      if (deps.has(key)) cls += ' is-compare';
      if (cur && cur[0] === r && cur[1] === c) cls += ' is-active';

      svg.appendChild(el('rect', {
        class: cls,
        x: x0 + headW + c * colW,
        y: y0 + headH + r * rowH,
        width: colW - 2,
        height: rowH - 2,
        rx: 5,
      }));
      if (isFilled(r, c)) {
        svg.appendChild(label(x0 + headW + c * colW + (colW - 2) / 2, y0 + headH + r * rowH + rowH / 2 + 4, String(v), {
          size: 12, mono: true, fill: 'var(--ink)', weight: 600,
        }));
      }
    });
  });

  if (state.container?.items) {
    const box = state.container;
    const cy = H - 30;
    svg.appendChild(label(72, cy + 18, box.label, { size: 11, fill: 'var(--ink-3)', anchor: 'end' }));
    box.items.forEach((it, i) => {
      const cw = Math.min(64, 44 + String(it?.text ?? it).length * 7);
      const x = 86 + box.items.slice(0, i).reduce((a, b) => a + Math.min(64, 44 + String(b?.text ?? b).length * 7) + 4, 0);
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
