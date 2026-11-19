/**
 * 数组视图：柱状图 + 下标 + 指针（i / j / key …）。
 *
 * 排序、二分查找这类"按下标操作"的算法都用它。
 * 视图只读 state，不改 state，也不关心哪个算法在跑——同一份 state 谁都能画。
 */
import { el, empty, label } from '../core/svg.js';

const W = 900;
const H = 380;
const PAD = { top: 46, right: 34, bottom: 86, left: 34 };

export function render(svg, state) {
  empty(svg);

  const values = state.values ?? [];
  const n = values.length;
  if (!n) return;

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const baseline = H - PAD.bottom;

  const slot = plotW / n;
  // 柱子占格子的 72%，两边留白，相邻柱子才不会糊成一片
  const barW = Math.max(6, slot * 0.72);
  const maxVal = Math.max(...values, 1);

  const settled = new Set(state.settled ?? []);
  const compare = new Set(state.compare ?? []);
  const move = new Set(state.move ?? []);
  const pivot = state.pivot ?? -1;

  // 当前处理区间的小括号，画在柱子上方
  if (state.range) {
    const { lo, hi } = state.range;
    if (hi >= lo) {
      const x1 = PAD.left + lo * slot + slot * 0.5 - barW * 0.5 - 2;
      const x2 = PAD.left + hi * slot + slot * 0.5 + barW * 0.5 + 2;
      const y = PAD.top - 16;
      svg.appendChild(el('path', {
        class: 'bracket',
        d: `M ${x1} ${y + 7} L ${x1} ${y} L ${x2} ${y} L ${x2} ${y + 7}`,
        fill: 'none',
        'stroke-width': 1.2,
      }));
      svg.appendChild(label((x1 + x2) / 2, y - 5,
        state.rangeLabel ?? `待处理 ${lo}–${hi}`, { size: 11, fill: 'var(--ink-3)' }));
    }
  }

  // 基线
  svg.appendChild(el('line', {
    x1: PAD.left - 6,
    x2: W - PAD.right + 6,
    y1: baseline,
    y2: baseline,
    class: 'axis',
    'stroke-width': 1,
  }));

  values.forEach((v, i) => {
    const h = Math.max(3, (v / maxVal) * (plotH - 18));
    const cx = PAD.left + i * slot + slot / 2;
    const x = cx - barW / 2;
    const y = baseline - h;

    let cls = 'bar';
    if (settled.has(i)) cls += ' is-settled';
    if (compare.has(i)) cls += ' is-compare';
    if (move.has(i)) cls += ' is-move';
    if (i === pivot) cls += ' is-pivot';

    svg.appendChild(el('rect', {
      class: cls,
      x,
      y,
      width: barW,
      height: h,
      rx: 2,
    }));

    svg.appendChild(label(cx, y - 6, String(v), { size: 11, mono: true, fill: 'var(--ink-2)' }));
    svg.appendChild(label(cx, baseline + 17, String(i), { size: 10, mono: true, fill: 'var(--ink-3)' }));
  });

  // 指针：key 用方括号包围，其余是普通字母，一眼能分清"值"和"游标"
  for (const p of state.pointers ?? []) {
    if (p.i == null || p.i < 0 || p.i >= n) continue;
    const cx = PAD.left + p.i * slot + slot / 2;
    const y = baseline + 44;
    svg.appendChild(el('path', {
      class: 'ptr-arrow',
      d: `M ${cx} ${y - 9} l -4.5 7 l 9 0 Z`,
    }));
    svg.appendChild(label(cx, y + 16, p.text, {
      size: 11,
      mono: true,
      fill: p.muted ? 'var(--ink-3)' : 'var(--accent)',
      weight: 600,
    }));
  }
}

export const geometry = { W, H };
