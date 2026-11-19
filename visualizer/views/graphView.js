/**
 * 图视图：节点坐标由算法数据自己给定，不做自动布局。
 *
 * 为什么不自动布局（力导向之类）：
 *   教学图上"谁在谁上面"是有讲究的——拓扑排序那张必须画成从左到右的层，
 *   Dijkstra 的路径要让近的先出来。自动布局每次跑都换个形状，
 *   讲解的人自己都得先找一遍节点在哪，谈不上演示。
 *   所以坐标手写死在数据里，稳定优先。
 */
import { el, empty, label } from '../core/svg.js';

const W = 900;
const H = 380;

export function render(svg, state) {
  empty(svg);

  const nodes = state.nodes ?? [];
  const edges = state.edges ?? [];
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const directed = Boolean(state.directed);

  svg.appendChild(el('defs', {}, [
    el('marker', {
      id: 'g-arrow',
      viewBox: '0 0 10 10',
      refX: '9',
      refY: '5',
      markerWidth: '6',
      markerHeight: '6',
      orient: 'auto-start-reverse',
    }, [el('path', { d: 'M 0 0 L 10 5 L 0 10 z', class: 'arrow-head' })]),
    el('marker', {
      id: 'g-arrow-on',
      viewBox: '0 0 10 10',
      refX: '9',
      refY: '5',
      markerWidth: '6',
      markerHeight: '6',
      orient: 'auto-start-reverse',
    }, [el('path', { d: 'M 0 0 L 10 5 L 0 10 z', class: 'arrow-head-on' })]),
  ]));

  const r = 21;
  const edgeState = new Map();
  for (const e of edges) edgeState.set(`${e.u}-${e.v}`, e);

  const stateOfEdge = (e) => e.state ?? 'idle';

  // 边。无向图两条方向只画一次，靠 u<v 去重
  const drawn = new Set();
  for (const e of edges) {
    const a = byId.get(e.u);
    const b = byId.get(e.v);
    if (!a || !b) continue;
    const key = directed ? `${e.u}>${e.v}` : [e.u, e.v].sort().join('-');
    if (drawn.has(key)) continue;
    drawn.add(key);

    // 缩到圆周上，箭头才不会被节点盖住
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const st = stateOfEdge(e);

    // 反向边在无向图里也要画（Dijkstra 松弛时两个方向都关心）
    svg.appendChild(el('line', {
      class: `gedge is-${st}`,
      x1: a.x + ux * (r + 2),
      y1: a.y + uy * (r + 2),
      x2: b.x - ux * (r + 3),
      y2: b.y - uy * (r + 3),
      'marker-end': directed ? `url(#${st === 'tree' || st === 'relax' ? 'g-arrow-on' : 'g-arrow'})` : null,
    }));

    if (e.w != null) {
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      // 权重标签底色用白，压在线上也读得清
      svg.appendChild(el('rect', {
        class: 'wbg', x: mx - 11, y: my - 10, width: 22, height: 16, rx: 4,
      }));
      svg.appendChild(label(mx, my + 2, String(e.w), {
        size: 10.5, mono: true, fill: 'var(--ink-2)',
      }));
    }
  }

  // 节点
  const current = state.current;
  const visited = new Set(state.visited ?? []);
  const frontier = new Set(state.frontier ?? []);
  const dist = state.dist ?? {};
  const distLabel = state.distLabel;

  for (const n of nodes) {
    let cls = 'gnode';
    if (n.id === current) cls += ' is-current';
    else if (visited.has(n.id)) cls += ' is-visited';
    else if (frontier.has(n.id)) cls += ' is-frontier';

    svg.appendChild(el('circle', { class: cls, cx: n.x, cy: n.y, r }));
    svg.appendChild(label(n.x, n.y + 5, String(n.label ?? n.id), {
      size: 13, mono: true, fill: 'var(--ink)', weight: 600,
    }));

    if (distLabel && dist[n.id] != null) {
      svg.appendChild(label(n.x, n.y + r + 15, dist[n.id] === Infinity ? '∞' : `${distLabel}${dist[n.id]}`, {
        size: 10, mono: true, fill: 'var(--accent)',
      }));
    }
  }

  // 底部容器条：队列 / 栈 / 优先队列里现在是什么
  const box = state.container;
  if (box && box.items) {
    const y = H - 46;
    svg.appendChild(label(70, y + 5, box.label, { size: 11, fill: 'var(--ink-3)', anchor: 'end' }));
    const items = box.items;
    const cellW = 44;
    const totalW = Math.max(cellW, items.length * (cellW + 4));
    const startX = 82;
    if (!items.length) {
      svg.appendChild(label(startX, y + 5, '（空）', { size: 11, fill: 'var(--ink-3)', anchor: 'start' }));
    }
    items.forEach((it, i) => {
      const x = startX + i * (cellW + 4);
      svg.appendChild(el('rect', {
        class: it.hot ? 'cell is-active' : 'cell',
        x, y, width: cellW, height: 26, rx: 5,
      }));
      svg.appendChild(label(x + cellW / 2, y + 18, String(it.text ?? it), {
        size: 11, mono: true, fill: 'var(--ink)',
      }));
    });
    if (items.length * (cellW + 4) < totalW) {
      // 不需要额外占位，留着这句给以后加"更多"提示用
    }
  }
}

export const geometry = { W, H };
