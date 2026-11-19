/**
 * 堆视图：上面是完全二叉树，下面是同一份数据的数组。
 *
 * 为什么必须两个一起画：
 *   堆的巧妙之处就在于"树是数组、数组是树"——下标 i 的父是 (i-1)>>1，孩子是 2i+1 / 2i+2。
 *   只画树，看不出它其实存在一段连续内存里；只画数组，上浮下沉的方向感全丢了。
 *   两栏同色联动，学生才能一眼把"往下沉一层"和"下标往上走一位"对起来。
 */
import { el, empty, label } from '../core/svg.js';

const W = 900;
const H = 380;

export function render(svg, state) {
  empty(svg);

  const values = state.values ?? [];
  const n = values.length;
  if (!n) {
    svg.appendChild(label(W / 2, H / 2, '空堆', { size: 13, fill: 'var(--ink-3)' }));
    return;
  }

  const active = new Set(state.active ?? []);
  const compare = new Set(state.compare ?? []);
  const settled = new Set(state.settled ?? []);

  const maxLevel = Math.floor(Math.log2(n));
  const treeTop = 34;
  const treeBottom = 236;
  const levelH = maxLevel > 0 ? (treeBottom - treeTop) / maxLevel : 0;
  const r = n > 15 ? 14 : 17;

  const pos = new Map();
  for (let i = 0; i < n; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const first = 2 ** level - 1;                 // 这一层第一个下标
    const count = Math.min(2 ** level, n - first); // 这一层实际有几个
    const k = i - first;
    const spacing = Math.min(118, (W - 90) / Math.max(1, count));
    const x = W / 2 + (k - (count - 1) / 2) * spacing;
    const y = maxLevel > 0 ? treeTop + level * levelH : treeBottom;
    pos.set(i, { x, y });
  }

  const clsOf = (i) => {
    if (active.has(i)) return 'is-active';
    if (compare.has(i)) return 'is-compare';
    if (settled.has(i)) return 'is-settled';
    return '';
  };

  // 边
  for (let i = 1; i < n; i++) {
    const p = (i - 1) >> 1;
    const a = pos.get(p);
    const b = pos.get(i);
    svg.appendChild(el('line', {
      class: 'tree-edge',
      x1: a.x, y1: a.y + r, x2: b.x, y2: b.y - r - 1,
    }));
  }

  // 树节点
  for (let i = 0; i < n; i++) {
    const { x, y } = pos.get(i);
    svg.appendChild(el('circle', { class: `tnode ${clsOf(i)}`.trim(), cx: x, cy: y, r }));
    svg.appendChild(label(x, y + 5, String(values[i]), {
      size: n > 15 ? 11 : 12, mono: true, fill: 'var(--ink)', weight: 600,
    }));
    // 下标写在节点外围，和值分开
    svg.appendChild(label(x, y - r - 4, String(i), { size: 8.5, mono: true, fill: 'var(--ink-3)' }));
  }

  // 数组带
  const stripY = H - 74;
  const cellW = Math.min(46, (W - 120) / n);
  const stripX = (W - cellW * n) / 2;
  svg.appendChild(label(stripX - 14, stripY + 26, '数组', { size: 10, fill: 'var(--ink-3)', anchor: 'end' }));

  for (let i = 0; i < n; i++) {
    const x = stripX + i * cellW;
    const base = clsOf(i);
    const cls = base ? `cell ${base}` : 'cell';
    svg.appendChild(el('rect', {
      class: cls, x, y: stripY, width: cellW - 3, height: 34, rx: 5,
    }));
    svg.appendChild(label(x + (cellW - 3) / 2, stripY + 22, String(values[i]), {
      size: 11.5, mono: true, fill: 'var(--ink)', weight: 600,
    }));
    svg.appendChild(label(x + (cellW - 3) / 2, stripY + 48, String(i), {
      size: 9, mono: true, fill: 'var(--ink-3)',
    }));
  }
}

export const geometry = { W, H };
