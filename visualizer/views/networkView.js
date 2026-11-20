/**
 * 网络图视图：分层神经网络，节点之间带权重连线。
 *
 * 前向传播要看"数值怎么一层层算出来"，反向传播要看"梯度怎么一层层传回去"，
 * 所以这里把两件事都画在同一张图上：
 *   节点下面标激活值，边上标权重；当前活跃的节点/边高亮，
 *   反向时用虚线 + 不同颜色表示"误差在往回走"。
 */
import { el, empty, label } from '../core/svg.js';

const W = 900;
const H = 440;

export function render(svg, state) {
  empty(svg);

  const layers = state.layers ?? [];
  if (!layers.length) {
    svg.appendChild(label(W / 2, H / 2, '当前没有网络', { size: 13, fill: 'var(--ink-3)' }));
    return;
  }

  const padX = 120;
  const colW = layers.length > 1 ? (W - padX * 2) / (layers.length - 1) : 0;
  const pos = new Map();

  layers.forEach((layer, li) => {
    const x = padX + colW * li;
    const n = layer.nodes.length;
    const gap = Math.min(110, (H - 130) / Math.max(n, 1));
    const totalH = gap * (n - 1);
    const y0 = H / 2 - 20 - totalH / 2;
    layer.nodes.forEach((node, ni) => {
      pos.set(node.id, { x, y: y0 + gap * ni, node, layer: layer.name });
    });
  });

  const activeEdges = new Set(state.activeEdges ?? []);
  const activeNodes = new Set(state.activeNodes ?? []);
  const backward = state.phase === 'backward';

  // 边先画，压在节点下面
  for (const e of state.edges ?? []) {
    const a = pos.get(e.from);
    const b = pos.get(e.to);
    if (!a || !b) continue;
    const key = `${e.from}->${e.to}`;
    const hot = activeEdges.has(key);
    svg.appendChild(el('line', {
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      class: `nedge${hot ? ' is-active' : ''}${backward && hot ? ' is-back' : ''}`,
      'stroke-dasharray': backward && hot ? '6 5' : 'none',
    }));

    // 权重标签：放在边的中点，带一小块底，免得压在线上看不清
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const text = e.w != null ? (e.w >= 0 ? '+' : '') + e.w.toFixed(2) : '';
    if (text) {
      svg.appendChild(el('rect', {
        x: mx - 19, y: my - 9, width: 38, height: 18, rx: 5,
        fill: 'var(--card)', opacity: .92,
      }));
      svg.appendChild(label(mx, my + 4, text, {
        size: 10, mono: true, anchor: 'middle',
        fill: hot ? 'var(--brand-2)' : 'var(--ink-3)',
        weight: hot ? 700 : 400,
      }));
    }
  }

  // 节点
  for (const [id, p] of pos) {
    const { node } = p;
    const hot = activeNodes.has(id);
    svg.appendChild(el('circle', {
      cx: p.x, cy: p.y, r: 23,
      class: `nnode${hot ? ' is-active' : ''}`,
    }));
    svg.appendChild(label(p.x, p.y + 5, node.label, {
      size: 13, mono: true, anchor: 'middle', weight: 700,
      fill: 'var(--ink)',
    }));
    if (node.value != null) {
      svg.appendChild(label(p.x, p.y + 41, Number(node.value).toFixed(2), {
        size: 10.5, mono: true, anchor: 'middle',
        fill: hot ? 'var(--brand-2)' : 'var(--ink-3)',
      }));
    }
  }

  // 层名
  layers.forEach((layer, li) => {
    svg.appendChild(label(padX + colW * li, 42, layer.name, {
      size: 11.5, anchor: 'middle', fill: 'var(--ink-3)', weight: 600,
    }));
  });

  if (state.phase) {
    svg.appendChild(label(W - 30, H - 18, backward ? '误差反向传播 →' : '前向计算 →', {
      size: 11.5, anchor: 'end', fill: backward ? 'var(--viz-compare-edge)' : 'var(--brand-2)',
      weight: 700,
    }));
  }
}

export const geometry = { W, H };
