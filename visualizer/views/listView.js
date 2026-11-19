/**
 * 链表视图：一排方框，箭头按每个节点当前的 next 画。
 *
 * 两个设计决定：
 *
 * 1) 布局顺序由 state.order 指定，不按节点的 next 走。
 *    反转过程中指针是往回指的，按 next 布局会把框的位置也跟着换，看着像"节点在乱跳"。
 *    固定框的位置、只让箭头掉头，才是反转真正发生的事。
 *
 * 2) 往回指的箭头必须画到框下面去（二次贝塞尔弧），不能画成直线。
 *    直线会从别的框身上穿过去，读者分不清哪根箭头连哪两个框。
 */
import { el, empty, label } from '../core/svg.js';

const W = 900;
// 链表是横排内容，节点只占中间一条；画布给 210 就够，多出来的高度只会变成空白
const H = 210;

export function render(svg, state) {
  empty(svg);

  const all = state.nodes ?? [];

  // 多行模式：state.rows = [[id...], [id...]]，每行一条链（合并两个链表时用）
  if (state.rows) {
    renderRows(svg, state, all);
    return;
  }

  const order = state.order ?? all.map((n) => n.id);
  const byId = new Map(all.map((n) => [n.id, n]));
  const nodes = order.map((id) => byId.get(id)).filter(Boolean);

  svg.appendChild(el('defs', {}, [
    el('marker', {
      id: 'arrow',
      viewBox: '0 0 10 10',
      refX: '9',
      refY: '5',
      markerWidth: '6',
      markerHeight: '6',
      orient: 'auto-start-reverse',
    }, [el('path', { d: 'M 0 0 L 10 5 L 0 10 z', class: 'arrow-head' })]),
    // 往回指的箭头单独一个 marker：marker 的颜色不能跟随引用它的线，只能各建一个
    el('marker', {
      id: 'arrow-back',
      viewBox: '0 0 10 10',
      refX: '9',
      refY: '5',
      markerWidth: '6',
      markerHeight: '6',
      orient: 'auto-start-reverse',
    }, [el('path', { d: 'M 0 0 L 10 5 L 0 10 z', class: 'arrow-head-back' })]),
  ]));

  if (!nodes.length) {
    svg.appendChild(label(W / 2, H / 2, '空链表', { size: 13, fill: 'var(--ink-3)' }));
    return;
  }

  const pad = 44;
  const gap = Math.min(58, Math.max(34, (W - pad * 2) / nodes.length * 0.42));
  const boxW = Math.min(92, (W - pad * 2 - gap * (nodes.length - 1)) / nodes.length);
  const boxH = 54;
  const totalW = boxW * nodes.length + gap * (nodes.length - 1);
  const startX = Math.max(pad, (W - totalW) / 2);
  const y = 72;

  const xOf = (i) => startX + i * (boxW + gap);
  const idxOf = new Map(nodes.map((n, i) => [n.id, i]));

  const highlight = new Set(state.highlight ?? []);
  const moved = new Set(state.moved ?? []);
  const removed = new Set(state.removed ?? []);

  // ── 先画箭头，压在框下面，避免箭头盖住文字 ──
  for (const node of nodes) {
    const i = idxOf.get(node.id);
    const x = xOf(i);
    const cx = x + boxW / 2;

    if (node.next == null) {
      // 指空：短虚线 + ∅
      svg.appendChild(el('line', {
        class: 'edge is-tail',
        x1: x + boxW,
        y1: y + boxH / 2,
        x2: x + boxW + 13,
        y2: y + boxH / 2,
        'stroke-dasharray': '3 3',
      }));
      svg.appendChild(label(x + boxW + 19, y + boxH / 2 + 5, '∅', { size: 13, fill: 'var(--ink-3)' }));
      continue;
    }

    const j = idxOf.get(node.next);
    if (j == null) continue; // 指向的节点已被摘掉，不画（下一步它就不在池里了）

    if (j > i) {
      // 正向：框与框之间的水平箭头
      svg.appendChild(el('line', {
        class: 'edge',
        x1: x + boxW + 1,
        y1: y + boxH / 2,
        x2: xOf(j) - 2,
        y2: y + boxH / 2,
        'marker-end': 'url(#arrow)',
      }));
    } else {
      // 反向：从源框底部绕到目标框底部，弧线画在下方
      const sx = cx;
      const tx = xOf(j) + boxW / 2;
      const bottom = y + boxH;
      const dip = bottom + 30 + Math.min(24, Math.abs(i - j) * 4);
      svg.appendChild(el('path', {
        class: 'edge is-back',
        d: `M ${sx} ${bottom} Q ${(sx + tx) / 2} ${dip} ${tx} ${bottom}`,
        fill: 'none',
        'marker-end': 'url(#arrow-back)',
      }));
    }
  }

  // ── 再画框和文字 ──
  nodes.forEach((node, i) => {
    const x = xOf(i);

    let cls = 'node';
    if (highlight.has(node.id)) cls += ' is-active';
    if (moved.has(node.id)) cls += ' is-moved';
    if (removed.has(node.id)) cls += ' is-removed';

    svg.appendChild(el('rect', { class: cls, x, y, width: boxW, height: boxH, rx: 7 }));
    svg.appendChild(label(x + boxW / 2, y + boxH / 2 + 5, String(node.val), {
      size: 15, mono: true, fill: 'var(--ink)', weight: 600,
    }));
    svg.appendChild(label(x + boxW / 2, y + boxH + 16, String(i), {
      size: 10, mono: true, fill: 'var(--ink-3)',
    }));
  });

  // ── 指针挂在框上方，同一框上多个指针并排写 ──
  const byNode = new Map();
  for (const p of state.pointers ?? []) {
    if (p.on == null || !idxOf.has(p.on)) continue;
    if (!byNode.has(p.on)) byNode.set(p.on, []);
    byNode.get(p.on).push(p.text);
  }
  for (const [id, names] of byNode) {
    const i = idxOf.get(id);
    const cx = xOf(i) + boxW / 2;
    svg.appendChild(el('line', {
      class: 'ptr-line', x1: cx, x2: cx, y1: y - 13, y2: y - 3,
    }));
    svg.appendChild(el('path', {
      class: 'ptr-arrow',
      d: `M ${cx - 4.5} ${y - 13} L ${cx + 4.5} ${y - 13} L ${cx} ${y - 4} Z`,
    }));
    svg.appendChild(label(cx, y - 21, names.join(' / '), {
      size: 11, mono: true, fill: 'var(--accent)', weight: 600,
    }));
  }

}

/**
 * 多行模式：每行一条独立的链，行首有标签。
 * 合并有序链表这类"两条链一起看"的题需要它，单行视图塞不下两条。
 */
function renderRows(svg, state, all) {
  const byId = new Map(all.map((n) => [n.id, n]));
  const rows = state.rows;
  const labels = state.rowLabels ?? [];

  svg.appendChild(el('defs', {}, [
    el('marker', {
      id: 'arrow', viewBox: '0 0 10 10', refX: '9', refY: '5',
      markerWidth: '6', markerHeight: '6', orient: 'auto-start-reverse',
    }, [el('path', { d: 'M 0 0 L 10 5 L 0 10 z', class: 'arrow-head' })]),
  ]));

  const rowH = Math.min(96, (H - 80) / rows.length);
  const boxW = 62;
  const boxH = 40;
  const gap = 24;

  rows.forEach((rowIds, ri) => {
    const y = 44 + ri * rowH;
    svg.appendChild(label(48, y + boxH / 2 + 4, labels[ri] ?? '', {
      size: 11, mono: true, fill: 'var(--ink-3)', anchor: 'end',
    }));

    rowIds.forEach((id, i) => {
      const n = byId.get(id);
      if (!n) return;
      const x = 62 + i * (boxW + gap);
      let cls = 'node';
      if ((state.highlight ?? []).includes(id)) cls += ' is-active';
      if ((state.moved ?? []).includes(id)) cls += ' is-moved';

      svg.appendChild(el('rect', { class: cls, x, y, width: boxW, height: boxH, rx: 6 }));
      svg.appendChild(label(x + boxW / 2, y + boxH / 2 + 5, String(n.val), {
        size: 12, mono: true, fill: 'var(--ink)', weight: 600,
      }));

      const nextId = n.next;
      const nextIdx = nextId ? rowIds.indexOf(nextId) : -1;
      if (nextIdx === i + 1) {
        svg.appendChild(el('line', {
          class: 'edge', x1: x + boxW + 1, y1: y + boxH / 2,
          x2: x + boxW + gap - 2, y2: y + boxH / 2, 'marker-end': 'url(#arrow)',
        }));
      } else if (nextId == null) {
        svg.appendChild(label(x + boxW + 10, y + boxH / 2 + 4, '∅', { size: 12, fill: 'var(--ink-3)' }));
      }
    });
  });
}

export const geometry = { W, H };
