/**
 * 哈希表视图：一排桶，每个桶里挂着若干键。
 *
 * 链地址法的关键就是"同一个桶里挂了多少个"——装填因子大、桶链变长，
 * 查询就退化成链表。所以这里按桶分列，链长一眼能看出来。
 */
import { el, empty, label } from '../core/svg.js';

const W = 900;
const H = 400;

export function render(svg, state) {
  empty(svg);

  const buckets = state.buckets ?? [];
  const n = buckets.length;
  if (!n) return;

  const padX = 90;
  const colW = (W - padX * 2) / n;
  const boxW = Math.min(64, colW * 0.72);
  const top = 64;
  const itemH = 32;

  const active = state.activeBucket ?? -1;
  const highlightKey = state.highlightKey;

  buckets.forEach((bucket, i) => {
    const cx = padX + colW * (i + 0.5);

    // 桶口
    svg.appendChild(el('rect', {
      class: i === active ? 'cell is-active' : 'cell',
      x: cx - boxW / 2,
      y: top - 38,
      width: boxW,
      height: 28,
      rx: 6,
    }));
    svg.appendChild(label(cx, top - 19, `桶 ${i}`, { size: 10.5, mono: true, fill: 'var(--ink-2)' }));

    bucket.forEach((item, k) => {
      const y = top + k * itemH;
      const isHit = highlightKey != null && item.key === highlightKey;
      svg.appendChild(el('rect', {
        class: isHit ? 'node is-moved' : 'node',
        x: cx - boxW / 2,
        y,
        width: boxW,
        height: itemH - 4,
        rx: 5,
      }));
      svg.appendChild(label(cx, y + itemH / 2 + 3, String(item.key), {
        size: 12, mono: true, fill: 'var(--ink)', weight: 600,
      }));
      if (k < bucket.length - 1) {
        svg.appendChild(el('line', {
          class: 'ptr-line', x1: cx, x2: cx, y1: y + itemH - 4, y2: y + itemH,
        }));
      }
    });
  });

  if (state.container?.items) {
    const box = state.container;
    const cy = H - 30;
    svg.appendChild(label(72, cy + 18, box.label, { size: 11, fill: 'var(--ink-3)', anchor: 'end' }));
    box.items.forEach((it, i) => {
      const cw = 44;
      const x = 86 + i * (cw + 4);
      if (x + cw > W - 20) return;
      svg.appendChild(el('rect', {
        class: it?.hot ? 'cell is-active' : 'cell', x, y: cy, width: cw, height: 26, rx: 5,
      }));
      svg.appendChild(label(x + cw / 2, cy + 18, String(it?.text ?? it), {
        size: 11, mono: true, fill: 'var(--ink)',
      }));
    });
  }
}

export const geometry = { W, H };
