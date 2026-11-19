/**
 * 并查集视图：一排元素 + 每个元素指向父节点的箭头。
 *
 * 为什么不画成"森林"：并查集的核心操作是"顺着 parent 往上找根"，
 * 画成树要反复重排位置；画成一排 + 指向上方的箭头，父链一眼能跟到底，
 * 路径压缩时箭头被压平的过程也看得见。
 *
 * 根节点没有父，画一个"根"标记，别让它看起来是断掉的。
 */
import { el, empty, label } from '../core/svg.js';

const W = 900;
const H = 380;

export function render(svg, state) {
  empty(svg);

  const order = state.order ?? (state.elements ?? []).map((e) => e.id);
  const byId = new Map((state.elements ?? []).map((e) => [e.id, e]));
  const n = order.length;
  if (!n) {
    svg.appendChild(label(W / 2, H / 2, '没有元素', { size: 13, fill: 'var(--ink-3)' }));
    return;
  }

  const padX = 60;
  const boxW = Math.min(72, (W - padX * 2) / n);
  const boxH = 46;
  const gap = (W - padX * 2 - boxW * n) / Math.max(1, n - 1);
  const y = 232;
  const xOf = (i) => padX + i * (boxW + gap);
  const idx = new Map(order.map((id, i) => [id, i]));

  const highlight = new Set(state.highlight ?? []);
  const compressed = new Set(state.compressed ?? []);

  svg.appendChild(el('defs', {}, [
    el('marker', {
      id: 'uf-arrow',
      viewBox: '0 0 10 10',
      refX: '9',
      refY: '5',
      markerWidth: '6',
      markerHeight: '6',
      orient: 'auto-start-reverse',
    }, [el('path', { d: 'M 0 0 L 10 5 L 0 10 z', class: 'arrow-head' })]),
    el('marker', {
      id: 'uf-arrow-hot',
      viewBox: '0 0 10 10',
      refX: '9',
      refY: '5',
      markerWidth: '6',
      markerHeight: '6',
      orient: 'auto-start-reverse',
    }, [el('path', { d: 'M 0 0 L 10 5 L 0 10 z', class: 'arrow-head-back' })]),
  ]));

  // 箭头：从子节点顶部绕到父节点顶部
  order.forEach((id, i) => {
    const e = byId.get(id);
    if (!e || e.parent === id) return;
    const j = idx.get(e.parent);
    if (j == null) return;

    const x1 = xOf(i) + boxW / 2;
    const x2 = xOf(j) + boxW / 2;
    const hot = highlight.has(id) && highlight.has(e.parent);
    // 距离越远弧抬得越高，免得几条箭头叠在一起
    const lift = 34 + Math.abs(i - j) * 12;
    const top = y - 6;
    svg.appendChild(el('path', {
      class: hot ? 'uf-edge is-hot' : 'uf-edge',
      d: `M ${x1} ${top} Q ${(x1 + x2) / 2} ${top - lift} ${x2} ${top}`,
      fill: 'none',
      'marker-end': `url(#${hot ? 'uf-arrow-hot' : 'uf-arrow'})`,
    }));
  });

  // 元素
  order.forEach((id, i) => {
    const e = byId.get(id);
    const x = xOf(i);
    const isRoot = e.parent === id;

    let cls = 'uf-box';
    if (highlight.has(id)) cls += ' is-active';
    if (compressed.has(id)) cls += ' is-moved';

    svg.appendChild(el('rect', { class: cls, x, y, width: boxW, height: boxH, rx: 9 }));
    svg.appendChild(label(x + boxW / 2, y + boxH / 2 + 5, String(e.label ?? id), {
      size: 15, mono: true, fill: 'var(--ink)', weight: 600,
    }));
    if (String(e.label ?? id) !== id) {
      svg.appendChild(label(x + boxW / 2, y + boxH + 16, id, { size: 9.5, mono: true, fill: 'var(--ink-3)' }));
    }

    if (isRoot) {
      svg.appendChild(el('rect', {
        class: 'uf-root-ring',
        x: x - 4, y: y - 4, width: boxW + 8, height: boxH + 8, rx: 13, fill: 'none',
      }));
      svg.appendChild(label(x + boxW - 8, y + boxH - 7, '根', {
        size: 9, fill: 'var(--brand-2)', weight: 600, anchor: 'end',
      }));
    }
  });

  if (state.container?.items) {
    const box = state.container;
    const cy2 = H - 30;
    svg.appendChild(label(72, cy2 + 18, box.label, { size: 11, fill: 'var(--ink-3)', anchor: 'end' }));
    box.items.forEach((it, i) => {
      const cw = 40;
      const x = 86 + i * (cw + 4);
      if (x + cw > W - 20) return;
      svg.appendChild(el('rect', {
        class: it?.hot ? 'cell is-active' : 'cell', x, y: cy2, width: cw, height: 26, rx: 5,
      }));
      svg.appendChild(label(x + cw / 2, cy2 + 18, String(it?.text ?? it), {
        size: 11, mono: true, fill: 'var(--ink)',
      }));
    });
  }
}

export const geometry = { W, H };
