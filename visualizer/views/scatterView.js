/**
 * 散点视图：平面上的点，外加一条线 / 几个质心 / 一条分界线。
 *
 * 机器学习里很多算法的"状态"就是这个：一批样本 + 一个正在收敛的东西。
 * 所以这里不做成通用绘图库，只认四种装饰物：
 *   line       —— 拟合直线（y = m x + b）
 *   centroids  —— 聚类质心
 *   boundary   —— 分类边界（同样用 y = m x + b 表示）
 *   highlight  —— 被选中的点（最近邻、本轮分到的点）
 */
import { el, empty, label } from '../core/svg.js';

const W = 900;
const H = 440;
const PAD = { left: 58, right: 28, top: 30, bottom: 44 };

function niceTicks(min, max, count = 6) {
  const span = max - min || 1;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
  const start = Math.ceil(min / step) * step;
  const ticks = [];
  for (let v = start; v <= max + 1e-9; v += step) ticks.push(Number(v.toFixed(6)));
  return ticks;
}

export function render(svg, state) {
  empty(svg);

  const pts = state.points ?? [];
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  // 坐标范围：优先用调用方给的，否则按点自动取，并留一点余量
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const xMin = state.xMin ?? Math.min(0, ...xs);
  const xMax = state.xMax ?? Math.max(1, ...xs);
  const yMin = state.yMin ?? Math.min(0, ...ys);
  const yMax = state.yMax ?? Math.max(1, ...ys);
  const spanX = (xMax - xMin) || 1;
  const spanY = (yMax - yMin) || 1;

  const sx = (x) => PAD.left + ((x - xMin) / spanX) * plotW;
  const sy = (y) => PAD.top + plotH - ((y - yMin) / spanY) * plotH;

  // 网格与刻度
  for (const t of niceTicks(xMin, xMax)) {
    svg.appendChild(el('line', {
      x1: sx(t), x2: sx(t), y1: PAD.top, y2: PAD.top + plotH,
      stroke: 'var(--axis)', 'stroke-width': 1, 'stroke-dasharray': '2 5',
    }));
    svg.appendChild(label(sx(t), PAD.top + plotH + 18, String(t), {
      size: 10.5, mono: true, anchor: 'middle', fill: 'var(--ink-3)',
    }));
  }
  for (const t of niceTicks(yMin, yMax, 5)) {
    svg.appendChild(el('line', {
      x1: PAD.left, x2: PAD.left + plotW, y1: sy(t), y2: sy(t),
      stroke: 'var(--axis)', 'stroke-width': 1, 'stroke-dasharray': '2 5',
    }));
    svg.appendChild(label(PAD.left - 10, sy(t) + 4, String(t), {
      size: 10.5, mono: true, anchor: 'end', fill: 'var(--ink-3)',
    }));
  }

  // 坐标轴
  svg.appendChild(el('line', {
    x1: PAD.left, x2: PAD.left + plotW, y1: PAD.top + plotH, y2: PAD.top + plotH,
    stroke: 'var(--axis-strong)', 'stroke-width': 1.4,
  }));
  svg.appendChild(el('line', {
    x1: PAD.left, x2: PAD.left, y1: PAD.top, y2: PAD.top + plotH,
    stroke: 'var(--axis-strong)', 'stroke-width': 1.4,
  }));

  // 分界线（分类器）：先画，压在点下面
  if (state.boundary) {
    const { m, b } = state.boundary;
    const x1 = xMin;
    const x2 = xMax;
    svg.appendChild(el('line', {
      x1: sx(x1), y1: sy(m * x1 + b), x2: sx(x2), y2: sy(m * x2 + b),
      stroke: 'var(--viz-compare-edge)', 'stroke-width': 3,
      'stroke-linecap': 'round', opacity: .9,
    }));
  }

  // 拟合直线
  if (state.line) {
    const { m, b } = state.line;
    svg.appendChild(el('line', {
      x1: sx(xMin), y1: sy(m * xMin + b), x2: sx(xMax), y2: sy(m * xMax + b),
      stroke: 'var(--brand-2)', 'stroke-width': 3.2, 'stroke-linecap': 'round',
    }));
  }

  // 点
  const hot = new Set(state.highlight ?? []);
  pts.forEach((p, i) => {
    const cx = sx(p.x);
    const cy = sy(p.y);
    const isHot = hot.has(i);
    const cls = p.group === 1 ? 'is-class-1' : p.group === 2 ? 'is-class-2' : '';
    svg.appendChild(el('circle', {
      cx, cy, r: isHot ? 8.5 : 5.6,
      class: `scatter-dot ${cls}${isHot ? ' is-hot' : ''}`,
    }));
    if (p.tag) {
      svg.appendChild(label(cx + 11, cy - 9, p.tag, {
        size: 10, mono: true, fill: 'var(--ink-3)',
      }));
    }
  });

  // 质心：画成空心方块，和样本点区分开
  (state.centroids ?? []).forEach((c, i) => {
    const cx = sx(c.x);
    const cy = sy(c.y);
    svg.appendChild(el('rect', {
      x: cx - 8, y: cy - 8, width: 16, height: 16, rx: 3,
      class: 'scatter-centroid',
    }));
    svg.appendChild(label(cx + 12, cy + 16, `C${i + 1}`, {
      size: 10.5, mono: true, fill: 'var(--brand-2)', weight: 700,
    }));
  });

  if (!pts.length) {
    svg.appendChild(label(W / 2, H / 2, '当前还没有样本点', { size: 13, fill: 'var(--ink-3)' }));
  }
}

export const geometry = { W, H };
