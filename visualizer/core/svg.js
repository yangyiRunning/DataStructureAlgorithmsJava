/**
 * 极小的 SVG / DOM 构造工具。
 *
 * 为什么不用 innerHTML 拼字符串：
 *   视图每换一步就整棵重画，用字符串拼要先把所有值转义一遍（数组里的数字没问题，
 *   但图里的标签将来可能带 < > & 之类），一处漏转义就是一个安全洞。
 *   直接造节点天然免疫，代价是代码长一点。
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const HTML_NS = 'http://www.w3.org/1999/xhtml';

/** 创建节点。tag 以 svg 命名空间创建，方便在 <svg> 里直接用。 */
export function el(tag, attrs = {}, children = []) {
  const node = document.createElementNS(SVG_NS, tag);
  setAttrs(node, attrs);
  for (const child of [].concat(children)) {
    if (child == null || child === false) continue;
    node.appendChild(typeof child === 'string' || typeof child === 'number'
      ? document.createTextNode(String(child))
      : child);
  }
  return node;
}

/** 普通 HTML 节点（按钮、div 之类，不用于 SVG） */
export function h(tag, attrs = {}, children = []) {
  const node = document.createElementNS(HTML_NS, tag);
  setAttrs(node, attrs);
  for (const child of [].concat(children)) {
    if (child == null || child === false) continue;
    node.appendChild(typeof child === 'string' || typeof child === 'number'
      ? document.createTextNode(String(child))
      : child);
  }
  return node;
}

function setAttrs(node, attrs) {
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'text') node.textContent = v;
    else if (k === 'class') node.setAttribute('class', v);
    else node.setAttribute(k, String(v));
  }
}

/** 清空一个节点的所有子元素 */
export function empty(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

/** 一段文本，带可选的字号/颜色/对齐 */
export function label(x, y, content, opts = {}) {
  return el('text', {
    x,
    y,
    'font-size': opts.size ?? 12,
    fill: opts.fill ?? 'var(--ink-2)',
    'text-anchor': opts.anchor ?? 'middle',
    'font-family': opts.mono ? 'var(--mono)' : 'var(--sans)',
    'font-weight': opts.weight ?? 400,
    'paint-order': 'stroke',
    stroke: opts.halo ? 'var(--panel)' : 'none',
    'stroke-width': opts.halo ? 3 : 0,
  }, content);
}
