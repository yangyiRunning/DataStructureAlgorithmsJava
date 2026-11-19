/**
 * 树视图：按中序遍历顺序横向排开。
 *
 * 为什么用中序铺开而不是手摆坐标：
 *   二叉搜索树的中序序列就是有序的，按这个顺序排，横向一眼能看出"左边都比根小"。
 *   AVL 旋转后节点会整体挪位——看着会跳，但那正是旋转改变形状的实情，
 *   强行做过渡动画反而会掩盖"它的中序序列没变、只是变矮了"这个关键点。
 *
 * 高度和平衡因子由结构现算，不读节点里存的字段：
 *   存下来的 height 一旦忘记更新，画面上就会出现"看着不平衡、数字说平衡"的矛盾。
 *   这里从结构推，永远自洽。
 */
import { el, empty, label } from '../core/svg.js';

const W = 900;
const H = 380;

/** 从结构推出位置与高度：返回 id→{x,y}、id→高度、id→平衡因子 */
function analyze(rootId, byId) {
  const pos = new Map();
  const height = new Map();
  const bf = new Map();
  let i = 0;

  const walk = (id) => {
    const node = byId.get(id);
    if (!node) return 0;
    const hl = node.left ? walk(node.left) : 0;
    pos.set(id, { col: i, depth: 0 });
    i += 1;
    const hr = node.right ? walk(node.right) : 0;
    height.set(id, 1 + Math.max(hl, hr));
    bf.set(id, hl - hr);
    return 1 + Math.max(hl, hr);
  };
  if (rootId) walk(rootId);

  // 深度单独一遍：上面那遍给 col 时还不知道自己在第几层
  const depthOf = (id, d = 0) => {
    const n = byId.get(id);
    if (!n) return;
    pos.get(id).depth = d;
    if (n.left) depthOf(n.left, d + 1);
    if (n.right) depthOf(n.right, d + 1);
  };
  if (rootId) depthOf(rootId);

  return { pos, height, bf };
}

export function render(svg, state) {
  empty(svg);

  const nodes = state.nodes ?? [];
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const rootId = state.root;

  svg.appendChild(el('defs', {}, [
    el('marker', {
      id: 'tree-arrow',
      viewBox: '0 0 10 10',
      refX: '9',
      refY: '5',
      markerWidth: '6',
      markerHeight: '6',
      orient: 'auto-start-reverse',
    }, [el('path', { d: 'M 0 0 L 10 5 L 0 10 z', class: 'arrow-head' })]),
  ]));

  if (!rootId || !byId.has(rootId)) {
    svg.appendChild(label(W / 2, H / 2, '空树', { size: 13, fill: 'var(--ink-3)' }));
    return;
  }

  const { pos, height, bf } = analyze(rootId, byId);
  const count = nodes.length;
  const maxDepth = Math.max(...[...pos.values()].map((p) => p.depth));
  const cols = Math.max(...[...pos.values()].map((p) => p.col)) + 1;

  // 列宽固定上限、整体居中：早先按 (W-2pad)/(cols-1) 拉满，两个节点的树会被撑到
  // 画面最左最右，中间空一大片，看着像布局坏了。列宽封顶 112，剩下的空均匀留在两边。
  const slotW = Math.min(112, (W - 100) / Math.max(1, cols));
  const startX = (W - slotW * cols) / 2;
  const levelH = Math.min(70, (H - 130) / Math.max(1, maxDepth || 1));
  const cx = (col) => startX + (col + 0.5) * slotW;
  const cy = (depth) => 52 + depth * levelH;
  const r = count > 11 ? 15 : 18;

  const highlight = new Set(state.highlight ?? []);
  const moving = new Set(state.moving ?? []);
  const visited = new Set(state.visited ?? []);

  // 先画边
  for (const node of nodes) {
    for (const childId of [node.left, node.right]) {
      if (!childId || !pos.has(node.id) || !pos.has(childId)) continue;
      const a = pos.get(node.id);
      const b = pos.get(childId);
      const x1 = cx(a.col);
      const y1 = cy(a.depth) + r;
      const x2 = cx(b.col);
      const y2 = cy(b.depth) - r - 2;
      const isMoving = moving.has(node.id) || moving.has(childId);
      svg.appendChild(el('line', {
        class: isMoving ? 'tree-edge is-moving' : 'tree-edge',
        x1, y1, x2, y2,
        'marker-end': 'url(#tree-arrow)',
      }));
    }
  }

  // 再画节点
  for (const node of nodes) {
    const p = pos.get(node.id);
    if (!p) continue;
    const x = cx(p.col);
    const y = cy(p.depth);

    let cls = 'tnode';
    if (highlight.has(node.id)) cls += ' is-active';
    if (moving.has(node.id)) cls += ' is-moving';
    if (visited.has(node.id)) cls += ' is-visited';

    svg.appendChild(el('circle', { class: cls, cx: x, cy: y, r }));
    svg.appendChild(label(x, y + 5, String(node.val), {
      size: count > 11 ? 12 : 13, mono: true, fill: 'var(--ink)', weight: 600,
    }));

    // 高度 / 平衡因子挂在节点右下，只在需要看的时候画
    if (state.showMeta) {
      const h = height.get(node.id) ?? 0;
      const b = bf.get(node.id) ?? 0;
      svg.appendChild(label(x + r + 4, y - 3, `h${h}`, { size: 9.5, mono: true, fill: 'var(--ink-3)', anchor: 'start' }));
      svg.appendChild(label(x + r + 4, y + 10, `bf${b > 0 ? '+' : ''}${b}`, {
        size: 9.5, mono: true, anchor: 'start',
        fill: Math.abs(b) > 1 ? 'var(--swap)' : 'var(--ink-3)',
      }));
    }
  }

  if (state.note) {
    svg.appendChild(label(W / 2, H - 22, state.note, { size: 12, fill: 'var(--ink-3)' }));
  }
}

export const geometry = { W, H };
