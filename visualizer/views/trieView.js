/**
 * Trie 视图：多叉树 + 字符。
 *
 * 和二叉树视图的区别只有一条：子节点数量不定，不能用 left/right 布局。
 * 这里按"叶子占槽、父节点取子节点中点"来放，同层的兄弟间距自然均匀，
 * 而且插入新词时原有节点的横向位置不会整体跳掉。
 *
 * 字符画在节点里而不是边上：小尺寸下把字符贴在线段中间，字号一小就糊了；
 * 放节点里配合"词尾"标记，读者一眼能看出从根到叶拼出的是哪个词。
 */
import { el, empty, label } from '../core/svg.js';

const W = 900;
const H = 380;

export function render(svg, state) {
  empty(svg);

  const nodes = state.nodes ?? [];
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const rootId = state.root;

  svg.appendChild(el('defs', {}, [
    el('marker', {
      id: 'trie-arrow',
      viewBox: '0 0 10 10',
      refX: '9',
      refY: '5',
      markerWidth: '6',
      markerHeight: '6',
      orient: 'auto-start-reverse',
    }, [el('path', { d: 'M 0 0 L 10 5 L 0 10 z', class: 'arrow-head' })]),
  ]));

  if (!rootId || !byId.has(rootId)) {
    svg.appendChild(label(W / 2, H / 2, '空 Trie', { size: 13, fill: 'var(--ink-3)' }));
    return;
  }

  // ── 布局：先数叶子，叶子均分槽位，父节点取子节点横坐标中点 ──
  const pos = new Map();
  let leafCount = 0;
  const slots = new Map();

  const countLeaves = (id) => {
    const n = byId.get(id);
    if (!n || !n.children || n.children.length === 0) {
      leafCount += 1;
      return 1;
    }
    return n.children.reduce((acc, c) => acc + countLeaves(c), 0);
  };
  countLeaves(rootId);
  leafCount = Math.max(1, leafCount);

  const padX = 60;
  const slotW = (W - padX * 2) / leafCount;

  const assign = (id, depth) => {
    const n = byId.get(id);
    if (!n) return padX;
    if (!n.children || n.children.length === 0) {
      const k = slots.size;
      const x = padX + (k + 0.5) * slotW;
      slots.set(id, k);
      pos.set(id, { x, depth });
      return x;
    }
    const xs = n.children.map((c) => assign(c, depth + 1));
    const x = xs.reduce((a, b) => a + b, 0) / xs.length;
    pos.set(id, { x, depth });
    return x;
  };
  assign(rootId, 0);

  const maxDepth = Math.max(...[...pos.values()].map((p) => p.depth));
  const levelH = Math.min(76, (H - 150) / Math.max(1, maxDepth));
  const cy = (d) => 58 + d * levelH;
  const r = 16;

  const highlight = new Set(state.highlight ?? []);
  const done = new Set(state.done ?? []);
  const leafIds = new Set(state.leaves ?? []);

  // 边
  for (const n of nodes) {
    for (const c of n.children ?? []) {
      if (!pos.has(n.id) || !pos.has(c)) continue;
      const a = pos.get(n.id);
      const b = pos.get(c);
      svg.appendChild(el('line', {
        class: 'tree-edge',
        x1: a.x,
        y1: cy(a.depth) + r,
        x2: b.x,
        y2: cy(b.depth) - r - 2,
        'marker-end': 'url(#trie-arrow)',
      }));
    }
  }

  // 节点
  for (const n of nodes) {
    const p = pos.get(n.id);
    if (!p) continue;
    const x = p.x;
    const y = cy(p.depth);

    let cls = 'tnode';
    if (highlight.has(n.id)) cls += ' is-active';
    if (done.has(n.id)) cls += ' is-visited';

    svg.appendChild(el('circle', { class: cls, cx: x, cy: y, r }));
    svg.appendChild(label(x, y + 5, n.id === rootId ? '∅' : n.ch, {
      size: 13, mono: true, fill: 'var(--ink)', weight: 600,
    }));

    // 词尾：外圈再加一道，比改颜色更不抢眼
    if (n.terminal) {
      svg.appendChild(el('circle', {
        class: 'trie-terminal',
        cx: x, cy: y, r: r + 4,
        fill: 'none',
      }));
      svg.appendChild(label(x, y + r + 16, '词尾', { size: 9, fill: 'var(--brand-2)' }));
    }
  }

  if (state.container?.items) {
    const box = state.container;
    const y = H - 30;
    svg.appendChild(label(72, y + 18, box.label, { size: 11, fill: 'var(--ink-3)', anchor: 'end' }));
    box.items.forEach((it, i) => {
      const cw = 38;
      const x = 86 + i * (cw + 4);
      if (x + cw > W - 20) return;
      svg.appendChild(el('rect', { class: 'cell', x, y, width: cw, height: 26, rx: 5 }));
      svg.appendChild(label(x + cw / 2, y + 18, String(it?.text ?? it), {
        size: 11, mono: true, fill: 'var(--ink)',
      }));
    });
  }
}

export const geometry = { W, H };
