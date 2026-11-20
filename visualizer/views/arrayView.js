/**
 * 数组视图：柱状图或字符格 + 下标 + 指针 + 底部容器条。
 *
 * 两种形态：
 *   - 有 state.values 时按柱状图画（数值有意义，比如排序、前缀和）
 *   - 有 state.chars 时按等高等宽的格子画字符（字符串题，柱子会变成一堆等高方块没有意义）
 *
 * 底部容器条（state.container）用来显示栈 / 队列 / 窗口内容。
 * 单调栈、单调队列这类题，光看指针动是看不懂的，必须同时看到容器里的东西。
 */
import { el, empty, label } from '../core/svg.js';

const W = 900;
const BASE_H = 430;   // 柱状模式
const CHAR_H = 300;   // 字符模式：格子高度固定，用不到那么高
const PAD = { top: 52, right: 34, bottom: 122, left: 34 };

export function render(svg, state) {
  empty(svg);

  const chars = state.chars ?? null;
  const values = state.values ?? (chars ? chars.map(() => 1) : []);
  const n = values.length;
  if (!n) return;

  // 画布高度必须在这里定下来：viewBox 由 geometryFor 报告同一个值，
  // 两边不一致的话，元素会按 430 的坐标画进 300 的视口，整体压扁。
  const H = chars ? CHAR_H : BASE_H;

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;   // 字符模式由 geometryFor 传入较矮的 H
  // 字符模式的格子高度固定，按柱子的底部对齐会把内容压到画布最下面，
  // 括号和格子之间空一大截。所以字符模式单独算基线，把内容顶到靠上的位置。
  const cellH = Math.min(64, Math.max(40, plotH * 0.34));
  const baseline = chars ? PAD.top + 60 + cellH : H - PAD.bottom;
  // 括号跟着内容走：柱状模式在画布顶部，字符模式贴在格子上面
  const bracketY = chars ? baseline - cellH - 18 : PAD.top - 16;

  const slot = plotW / n;
  const barW = Math.max(6, slot * 0.72);

  // 有负数时以 0 为基线双向画：正数往上、负数往下。
  // 只按最大值缩放的话，负数会被压成一条线，三数之和这类题根本看不出哪个是高是低。
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values, 1);
  const span = (maxVal - minVal) || 1;
  const plotH0 = plotH - 18;
  const yOf = (v) => baseline - ((v - minVal) / span) * plotH0;
  const zeroY = yOf(0);
  const hasNeg = minVal < 0;

  const settled = new Set(state.settled ?? []);
  const compare = new Set(state.compare ?? []);
  const move = new Set(state.move ?? []);
  const pivot = state.pivot ?? -1;
  const window_ = state.window ?? null;

  // 区间括号（递归范围 / 未处理段 / 当前窗口）
  const drawBracket = (lo, hi, text) => {
    if (hi < lo) return;
    const x1 = PAD.left + lo * slot + slot * 0.5 - barW * 0.5 - 2;
    const x2 = PAD.left + hi * slot + slot * 0.5 + barW * 0.5 + 2;
    const y = bracketY;
    svg.appendChild(el('path', {
      class: 'bracket',
      d: `M ${x1} ${y + 7} L ${x1} ${y} L ${x2} ${y} L ${x2} ${y + 7}`,
      fill: 'none',
      'stroke-width': 1.2,
    }));
    svg.appendChild(label((x1 + x2) / 2, y - 5, text, { size: 11, fill: 'var(--ink-3)' }));
  };

  if (state.range) drawBracket(state.range.lo, state.range.hi, state.rangeLabel ?? `区间 ${state.range.lo}–${state.range.hi}`);
  if (window_) drawBracket(window_.lo, window_.hi, state.windowLabel ?? `窗口 ${window_.lo}–${window_.hi}`);

  svg.appendChild(el('line', {
    x1: PAD.left - 6,
    x2: W - PAD.right + 6,
    y1: baseline,
    y2: baseline,
    class: 'axis',
    'stroke-width': 1,
  }));

  // 0 基线：只在有负数时单独画一条，正数时它和底轴重合
  if (hasNeg && !chars) {
    svg.appendChild(el('line', {
      class: 'axis zero',
      x1: PAD.left - 6,
      x2: W - PAD.right + 6,
      y1: zeroY,
      y2: zeroY,
      'stroke-width': 1,
    }));
  }

  values.forEach((v, i) => {
    const cx = PAD.left + i * slot + slot / 2;
    // 字符模式用固定高度的格子；柱状模式从 0 基线往上或往下画
    const yTop = chars ? baseline - cellH : yOf(Math.max(v, 0));
    const yBottom = chars ? baseline : yOf(Math.min(v, 0));
    const h = Math.max(chars ? cellH : 2, yBottom - yTop);
    const w = chars ? Math.min(52, slot * 0.78) : barW;
    const x = cx - w / 2;
    const y = chars ? baseline - cellH : Math.min(yTop, yBottom);

    let cls = chars ? 'cell' : 'bar';
    if (settled.has(i)) cls += ' is-settled';
    if (compare.has(i)) cls += ' is-compare';
    if (move.has(i)) cls += ' is-move';
    if (i === pivot) cls += ' is-pivot';

    svg.appendChild(el('rect', { class: cls, x, y, width: w, height: h, rx: chars ? 6 : 2 }));

    if (chars) {
      svg.appendChild(label(cx, baseline - h / 2 + 6, String(chars[i]), {
        size: 17, mono: true, fill: 'var(--ink)', weight: 600,
      }));
    } else if (v < 0) {
      svg.appendChild(label(cx, zeroY + 14, String(v), { size: 11, mono: true, fill: 'var(--ink-2)' }));
    } else {
      svg.appendChild(label(cx, yTop - 6, String(v), { size: 11, mono: true, fill: 'var(--ink-2)' }));
    }
    svg.appendChild(label(cx, baseline + 17, String(i), { size: 10, mono: true, fill: 'var(--ink-3)' }));
  });

  // 指针：同一个下标上可能同时站着两个（比如 left 和 right 撞在一起），
  // 各画各的会把文字叠成一坨看不清，所以按下标合并，名字用 / 连起来。
  const ptrAt = new Map();
  for (const p of state.pointers ?? []) {
    if (p.i == null || p.i < 0 || p.i >= n) continue;
    if (!ptrAt.has(p.i)) ptrAt.set(p.i, []);
    ptrAt.get(p.i).push(p);
  }
  for (const [i, group] of ptrAt) {
    const cx = PAD.left + i * slot + slot / 2;
    const y = baseline + 46;
    const muted = group.every((g) => g.muted);
    svg.appendChild(el('path', {
      class: 'ptr-arrow',
      d: `M ${cx} ${y - 9} l -4.5 7 l 9 0 Z`,
    }));
    svg.appendChild(label(cx, y + 16, group.map((g) => g.text).join(' / '), {
      size: 11, mono: true, weight: 600,
      fill: muted ? 'var(--ink-3)' : 'var(--brand-2)',
    }));
  }

  // 底部容器条：栈 / 队列 / 结果序列
  const box = state.container;
  if (box && box.items) {
    // 贴着指针下方放，不要钉在画布最底部——内容短的时候中间会空出一大块
    const y = Math.min(H - 34, baseline + 96);
    svg.appendChild(label(72, y + 18, box.label, { size: 11, fill: 'var(--ink-3)', anchor: 'end' }));
    const cellW = 42;
    if (!box.items.length) {
      svg.appendChild(label(86, y + 18, '（空）', { size: 11, fill: 'var(--ink-3)', anchor: 'start' }));
    }
    box.items.forEach((it, i) => {
      const x = 86 + i * (cellW + 4);
      if (x + cellW > W - 20) return;
      const hot = it && typeof it === 'object' && it.hot;
      svg.appendChild(el('rect', {
        class: hot ? 'cell is-active' : 'cell',
        x, y, width: cellW, height: 26, rx: 5,
      }));
      svg.appendChild(label(x + cellW / 2, y + 18, String(it?.text ?? it), {
        size: 11, mono: true, fill: 'var(--ink)',
      }));
    });
  }
}

export const geometry = { W, H: BASE_H };

/**
 * 字符模式用矮画布：格子高度固定，用 430 的柱子高度会把内容顶到中间留一大片空白。
 * 柱状模式仍然用满高度，不然数值大的柱子会被压扁。
 */
export function geometryFor(state) {
  return { W, H: state?.chars ? CHAR_H : BASE_H };
}
