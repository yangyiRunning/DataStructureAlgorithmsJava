/**
 * LeetCode 高频题（第八批）：链表 5 道 + 栈 3 道 + 字符串 2 道。
 */

const L = [
  { cls: 'bar', text: '元素' },
  { cls: 'bar is-compare', text: '正在看' },
  { cls: 'bar is-pivot', text: '当前处理' },
  { cls: 'bar is-settled', text: '已确定' },
];

const NODE_LEGEND = [
  { cls: 'node', text: '节点' },
  { cls: 'node is-active', text: '当前节点' },
  { cls: 'node is-moved', text: '刚重连' },
];

let uid9 = 0;
const mk = (val, next = null) => ({ id: `x${++uid9}`, val, next });

function chain(vals) {
  const nodes = vals.map((v) => mk(v));
  nodes.forEach((n, i) => { n.next = nodes[i + 1] ?? null; });
  return { head: nodes[0] ?? null, nodes };
}

const idsOf = (head) => {
  const r = [];
  const seen = new Set();
  let p = head;
  while (p && !seen.has(p.id)) { seen.add(p.id); r.push(p.id); p = p.next; }
  return r;
};

const snapNodes = (all) => all.map((n) => ({ id: n.id, val: n.val, next: n.next ? n.next.id : null }));

// ── 143. 重排链表 ───────────────────────────────────────
const reorderCode = [
  'function reorderList(head) {',
  '  // 1) 找中点  2) 反转后半段  3) 交替合并',
  '  let slow = head, fast = head;',
  '  while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }',
  '  let second = slow.next; slow.next = null;',
  '  let prev = null;',
  '  while (second) { const nx = second.next; second.next = prev; prev = second; second = nx; }',
  '  let a = head, b = prev;',
  '  while (b) { const an = a.next, bn = b.next; a.next = b; b.next = an; a = an; b = bn; }',
  '}',
];

function reorderList(input) {
  const { head, nodes } = chain(input);
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { nodes: snapNodes(nodes), order: [...idsOf(head), ...idsOf(state?.tail ?? null)].filter((v, i, a) => a.indexOf(v) === i), ...state },
    note, line, counters: { 重连: 0 },
  });

  push({}, '三步：找中点、反转后半段、两条链交替合并。目标是 a1→an→a2→an-1…', 0);

  let slow = head;
  let fast = head;
  while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }
  push({ highlight: [slow.id] }, `中点是 ${slow.val}，后半段从它后面开始。`, 3);

  let second = slow.next;
  slow.next = null;
  let prev = null;
  while (second) {
    const nx = second.next;
    second.next = prev;
    prev = second;
    second = nx;
  }
  push({}, '后半段反转完成。', 6);

  // 交替合并：用哑头重新串。直接原地改 a.next 会在两半相邻时打出环
  //（a.next 本来就等于 b，再写 b.next = an 就自指了）
  const dummy = mk(0);
  nodes.push(dummy);
  let tail = dummy;
  let a = head;
  let b = prev;
  let last = null;
  while (a && b) {
    tail.next = a; tail = a; a = a.next;
    last = tail;
    tail.next = b; tail = b; b = b.next;
    last = tail;
    push({ highlight: [tail.id] }, '交替接上一对节点。', 8);
  }
  tail.next = a ?? b;
  if (a ?? b) push({ highlight: [(a ?? b).id] }, '把剩下的接上。', 8);

  const order = idsOf(dummy.next).map((id) => nodes.find((n) => n.id === id).val).join(',');
  push({}, `重排结果：${order}。`, 8);
  return { steps, result: { arr: order } };
}

// ── 148. 排序链表 ───────────────────────────────────────
const sortListCode = [
  'function sortList(head) {',
  '  if (!head || !head.next) return head;',
  '  // 找中点断开，两半各自排序，再合并',
  '  let slow = head, fast = head.next;',
  '  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }',
  '  const mid = slow.next; slow.next = null;',
  '  return merge(sortList(head), sortList(mid));',
  '}',
];

function sortList(input) {
  const { head, nodes } = chain(input);
  const steps = [];
  let merges = 0;
  const push = (state, note, line) => steps.push({
    state: { nodes: snapNodes(nodes), order: idsOf(state?.resultHead ?? head), ...state },
    note, line, counters: { 合并: merges },
  });

  push({}, '链表归并排序：快慢指针找中点断开，两半递归排好，再合并。O(n log n) 时间，递归栈 O(log n)。', 0);

  const split = (h) => {
    if (!h || !h.next) return h;
    let slow = h;
    let fast = h.next;
    while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
    const mid = slow.next;
    slow.next = null;
    push({ highlight: [h.id, mid ? mid.id : h.id] }, `把这一段从 ${h.val} 里断开。`, 5);
    return mergeList(split(h), split(mid));
  };

  const mergeList = (a, b) => {
    const dummy = mk(0);
    let tail = dummy;
    while (a && b) {
      if (a.val <= b.val) { tail.next = a; a = a.next; }
      else { tail.next = b; b = b.next; }
      tail = tail.next;
      merges += 1;
    }
    tail.next = a ?? b;
    return dummy.next;
  };

  const sorted = split(head);
  const order = idsOf(sorted).map((id) => nodes.find((n) => n.id === id).val).join(',');
  push({ resultHead: sorted }, `排序结果：${order}。`, 6);
  return { steps, result: { arr: order } };
}

// ── 328. 奇偶链表 ───────────────────────────────────────
const oddEvenCode = [
  'function oddEvenList(head) {',
  '  if (!head) return head;',
  '  let odd = head, even = head.next, evenHead = even;',
  '  while (even && even.next) {',
  '    odd.next = even.next; odd = odd.next;',
  '    even.next = odd.next; even = even.next;',
  '  }',
  '  odd.next = evenHead;      // 偶数链接到奇数链尾部',
  '  return head;',
  '}',
];

function oddEvenList(input) {
  const { head, nodes } = chain(input);
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { nodes: snapNodes(nodes), order: idsOf(state?.h ?? head), ...state },
    note, line, counters: { 步进: 0 },
  });

  push({}, '把奇数位节点串成一条、偶数位串成另一条，最后偶数链接到奇数链尾巴上。原地，O(1) 空间。', 0);

  let odd = head;
  let even = head.next;
  const evenHead = even;
  while (even && even.next) {
    odd.next = even.next;
    odd = odd.next;
    even.next = odd.next;
    even = even.next;
    push({ highlight: [odd.id] }, `奇数链到 ${odd.val}，偶数链到 ${even ? even.val : '尾'}。`, 4);
  }
  odd.next = evenHead;
  const order = idsOf(head).map((id) => nodes.find((n) => n.id === id).val).join(',');
  push({}, `结果：${order}。`, 6);
  return { steps, result: { arr: order } };
}

// ── 86. 分隔链表 ────────────────────────────────────────
const partitionCode = [
  'function partition(head, x) {',
  '  const small = {}, big = {};          // 两条哑链',
  '  let s = small, b = big;',
  '  for (let p = head; p; p = p.next) {',
  '    if (p.val < x) { s.next = p; s = p; }',
  '    else { b.next = p; b = p; }',
  '  }',
  '  b.next = null; s.next = big.next;    // 大链结尾必须断开',
  '  return small.next;',
  '}',
];

function partition(input) {
  const { vals, x } = input;
  const { head, nodes } = chain(vals);
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { nodes: snapNodes(nodes), order: idsOf(state?.h ?? head), ...state },
    note, line, counters: { 分类: 0 },
  });

  push({}, `小于 ${x} 的接一条链，其余接另一条，最后拼起来。注意大链的结尾要置空，否则会成环。`, 0);

  const smallDummy = mk(0);
  const bigDummy = mk(0);
  nodes.push(smallDummy, bigDummy);
  let s = smallDummy;
  let b = bigDummy;
  let p = head;
  while (p) {
    if (p.val < x) { s.next = p; s = p; }
    else { b.next = p; b = p; }
    push({ highlight: [p.id] }, `${p.val} ${p.val < x ? '<' : '≥'} ${x}，接入${p.val < x ? '小' : '大'}链。`, 5);
    p = p.next;
  }
  b.next = null;
  s.next = bigDummy.next;
  const order = idsOf(smallDummy.next).map((id) => nodes.find((n) => n.id === id).val).join(',');
  push({ h: smallDummy.next }, `结果：${order}。`, 6);
  return { steps, result: { arr: order } };
}

// ── 92. 反转链表 II ─────────────────────────────────────
const reverseBetweenCode = [
  'function reverseBetween(head, left, right) {',
  '  const dummy = { next: head };',
  '  let prev = dummy;',
  '  for (let i = 1; i < left; i++) prev = prev.next;',
  '  let cur = prev.next;',
  '  for (let i = 0; i < right - left; i++) {   // 头插法，每次把下一个挪到前面',
  '    const nx = cur.next; cur.next = nx.next; nx.next = prev.next; prev.next = nx;',
  '  }',
  '  return dummy.next;',
  '}',
];

function reverseBetween(input) {
  const { vals, left, right } = input;
  const { head, nodes } = chain(vals);
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { nodes: snapNodes(nodes), order: idsOf(state?.h ?? head), ...state },
    note, line, counters: { 插入: 0 },
  });

  push({}, `只反转第 ${left} 到第 ${right} 个节点。做法是先走到 left 前一个，再用头插法把后面的节点一个个挪到前面。`, 0);

  const dummy = mk(0);
  dummy.next = head;
  nodes.push(dummy);
  let prev = dummy;
  for (let i = 1; i < left; i++) prev = prev.next;
  let cur = prev.next;
  for (let i = 0; i < right - left; i++) {
    const nx = cur.next;
    cur.next = nx.next;
    nx.next = prev.next;
    prev.next = nx;
    push({ highlight: [nx.id] }, `把 ${nx.val} 挪到反转段的头部。`, 6);
  }
  const order = idsOf(dummy.next).map((id) => nodes.find((n) => n.id === id).val).join(',');
  push({ h: dummy.next }, `结果：${order}。`, 8);
  return { steps, result: { arr: order } };
}

// ── 225. 用队列实现栈 ───────────────────────────────────
const stackByQueueCode = [
  'function push(x) {',
  '  q.push(x);',
  '  for (let i = 0; i < q.length - 1; i++) q.push(q.shift());   // 把新元素转到队头',
  '}',
  'function pop() { return q.shift(); }',
  'function top() { return q[0]; }',
  'function empty() { return q.length === 0; }',
];

function stackByQueue(ops) {
  const q = [];
  const steps = [];
  const out = [];
  const push = (state, note, line) => steps.push({
    state: {
      values: q.slice(),
      container: { label: '队列（队头在左）', items: q.length ? q.map((v) => ({ text: String(v) })) : [{ text: '空' }] },
      ...state,
    },
    note, line, counters: { 操作: out.length },
  });

  push({}, '只用一个队列：push 时把新元素转一圈转到队头，pop 就直接从队头拿。这样队列就成了栈。', 0);

  for (const [op, v] of ops) {
    if (op === 'push') {
      q.push(v);
      for (let i = 0; i < q.length - 1; i++) q.push(q.shift());
      push({ pivot: 0 }, `push(${v})：把它转到队头，现在 [${q.join(',')}]。`, 2);
    } else if (op === 'pop') {
      const v = q.shift();
      out.push(v);
      push({}, `pop() = ${v}。`, 4);
    } else if (op === 'top') {
      out.push(q[0]);
      push({ pivot: 0 }, `top() = ${q[0]}。`, 5);
    } else {
      out.push(q.length === 0 ? 1 : 0);
      push({}, `empty() = ${q.length === 0}。`, 5);
    }
  }
  push({}, '操作完成。', 5);
  return { steps, result: { out: out.join(',') } };
}

// ── 150. 逆波兰表达式求值 ───────────────────────────────
const evalRpnCode = [
  'function evalRPN(tokens) {',
  '  const st = [];',
  '  for (const t of tokens) {',
  '    if ("+-*/".includes(t) && t.length === 1) {',
  '      const b = st.pop(), a = st.pop();',
  '      st.push(t === "+" ? a + b : t === "-" ? a - b : t === "*" ? a * b : Math.trunc(a / b));',
  '    } else st.push(Number(t));',
  '  }',
  '  return st[0];',
  '}',
];

function evalRPN(tokens) {
  const st = [];
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { values: st.slice(), container: { label: '栈', items: st.map((v) => ({ text: String(v) })) }, ...state },
    note, line, counters: { 压入: 0 },
  });

  push({}, '后缀表达式：遇到数字压栈，遇到运算符就弹出两个数算完再压回去。注意先弹出来的是右操作数。', 0);
  for (const t of tokens) {
    if (t.length === 1 && '+-*/'.includes(t)) {
      const b = st.pop();
      const a = st.pop();
      const v = t === '+' ? a + b : t === '-' ? a - b : t === '*' ? a * b : Math.trunc(a / b);
      st.push(v);
      push({ pivot: st.length - 1 }, `${a} ${t} ${b} = ${v}，压回栈。`, 5);
    } else {
      st.push(Number(t));
      push({}, `数字 ${t} 压栈。`, 6);
    }
  }
  push({}, `结果 ${st[0]}。`, 8);
  return { steps, result: { num: st[0] } };
}

// ── 71. 简化路径 ────────────────────────────────────────
const simplifyPathCode = [
  'function simplifyPath(path) {',
  '  const st = [];',
  '  for (const part of path.split("/")) {',
  '    if (part === "" || part === ".") continue;',
  '    if (part === "..") st.pop();          // 回到上一级',
  '    else st.push(part);',
  '  }',
  '  return "/" + st.join("/");',
  '}',
];

function simplifyPath(path) {
  const chars = [...path];
  const st = [];
  const steps = [];
  let handled = 0;
  const push = (state, note, line) => steps.push({
    state: { chars, container: { label: '栈（路径段）', items: st.map((v) => ({ text: v })) }, ...state },
    note, line, counters: { 已处理: handled },
  });

  push({}, '按 / 切段：空串和 "." 跳过，".." 弹栈，其余压栈。最后拼回带前导斜杠的路径。', 0);
  for (const part of path.split('/')) {
    if (part === '' || part === '.') continue;
    handled += 1;
    if (part === '..') { st.pop(); push({}, `".." 回上一级，栈变 [${st.join(',')}]。`, 3); }
    else { st.push(part); push({}, `"${part}" 压栈。`, 4); }
  }
  const out = '/' + st.join('/');
  push({}, `简化后：${out}。`, 6);
  return { steps, result: { out } };
}

// ── 290. 单词规律 ───────────────────────────────────────
const wordPatternCode = [
  'function wordPattern(pattern, s) {',
  '  const words = s.split(" ");',
  '  if (words.length !== pattern.length) return false;',
  '  const m1 = new Map(), m2 = new Map();',
  '  for (let i = 0; i < words.length; i++) {',
  '    const a = pattern[i], b = words[i];',
  '    if ((m1.has(a) && m1.get(a) !== b) || (m2.has(b) && m2.get(b) !== a)) return false;',
  '    m1.set(a, b); m2.set(b, a);',
  '  }',
  '  return true;',
  '}',
];

function wordPattern(input) {
  const { pattern, s } = input;
  const words = s.split(' ');
  const m1 = new Map();
  const m2 = new Map();
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { chars: [...pattern], container: { label: '词', items: words.map((w) => ({ text: w })) }, ...state },
    note, line, counters: { 映射: m1.size },
  });

  push({}, '和同构字符串是同一套路：字母→单词、单词→字母双向都要唯一。先看长度是否相等。', 2);
  if (words.length !== pattern.length) {
    push({}, `单词数 ${words.length} 和模式长度 ${pattern.length} 不等，不匹配。`, 3);
    return { steps, result: { ok: 'false' } };
  }
  for (let i = 0; i < words.length; i++) {
    const a = pattern[i];
    const b = words[i];
    if ((m1.has(a) && m1.get(a) !== b) || (m2.has(b) && m2.get(b) !== a)) {
      push({ compare: [i] }, `${a}↔${b} 与之前的映射冲突。`, 6);
      return { steps, result: { ok: 'false' } };
    }
    m1.set(a, b);
    m2.set(b, a);
    push({ current: i }, `记录 ${a}↔${b}。`, 7);
  }
  push({}, '双向映射一致，匹配。', 8);
  return { steps, result: { ok: 'true' } };
}

// ── 219. 存在重复元素 II ────────────────────────────────
const containsNearbyCode = [
  'function containsNearbyDuplicate(nums, k) {',
  '  const win = new Set();',
  '  for (let i = 0; i < nums.length; i++) {',
  '    if (win.has(nums[i])) return true;',
  '    win.add(nums[i]);',
  '    if (win.size > k) win.delete(nums[i - k]);   // 窗口只留 k 个',
  '  }',
  '  return false;',
  '}',
];

function containsNearby(input) {
  const { nums, k } = input;
  const win = new Set();
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { values: nums, container: { label: '窗口', items: [...win].map((v) => ({ text: String(v) })) }, ...state },
    note, line, counters: { 窗口: win.size },
  });

  push({}, `要求两个相同元素的下标差不超过 ${k}。维护一个大小 ${k} 的窗口，超出就把旧的移出去。`, 0);
  for (let i = 0; i < nums.length; i++) {
    if (win.has(nums[i])) {
      push({ compare: [i] }, `${nums[i]} 在窗口里，返回 true。`, 3);
      return { steps, result: { ok: 'true' } };
    }
    win.add(nums[i]);
    if (win.size > k) win.delete(nums[i - k]);
    push({ current: i }, `${nums[i]} 进窗口，窗口 [${[...win].join(',')}]。`, 5);
  }
  push({}, '扫完没有距离内的重复。', 6);
  return { steps, result: { ok: 'false' } };
}

export const leetcode9Algorithms = [
  { id: 'lc-reorder-list', group: '热门题', title: '143. 重排链表', brief: '三步：找中点、反转后半段、两条链交替合并。目标是 a1→an→a2→an-1…', view: 'list', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['三步', '中点 + 反转 + 合并']], counters: '重连', legend: NODE_LEGEND,
    inputs: [{ label: '1 2 3 4', make: () => [1, 2, 3, 4] }, { label: '1 2 3 4 5', make: () => [1, 2, 3, 4, 5] }], code: reorderCode, run: reorderList },
  { id: 'lc-sort-list', group: '热门题', title: '148. 排序链表', brief: '链表归并排序：快慢指针找中点断开，两半递归排好再合并。O(n log n) 时间，递归栈 O(log n)。', view: 'list', facts: [['时间', 'O(n log n)'], ['空间', 'O(log n) 递归栈'], ['方法', '归并']], counters: '合并', legend: NODE_LEGEND,
    inputs: [{ label: '4 2 1 3', make: () => [4, 2, 1, 3] }, { label: '-1 5 3 4 0', make: () => [-1, 5, 3, 4, 0] }], code: sortListCode, run: sortList },
  { id: 'lc-odd-even-list', group: '热门题', title: '328. 奇偶链表', brief: '奇数位串一条、偶数位串一条，最后偶数链接到奇数链尾。原地，O(1) 空间。', view: 'list', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['技巧', '两条链']], counters: '步进', legend: NODE_LEGEND,
    inputs: [{ label: '1 2 3 4 5', make: () => [1, 2, 3, 4, 5] }, { label: '2 1 3 5 6 4 7', make: () => [2, 1, 3, 5, 6, 4, 7] }], code: oddEvenCode, run: oddEvenList },
  { id: 'lc-partition-list', group: '热门题', title: '86. 分隔链表', brief: '小于 x 的接一条链，其余接另一条，最后拼起来。注意大链结尾要置空，否则会成环。', view: 'list', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['坑', '结尾没断开会成环']], counters: '分类', legend: NODE_LEGEND,
    inputs: [{ label: 'x=3: 1 4 3 2 5 2', make: () => ({ vals: [1, 4, 3, 2, 5, 2], x: 3 }) }, { label: 'x=2: 2 1', make: () => ({ vals: [2, 1], x: 2 }) }], code: partitionCode, run: partition },
  { id: 'lc-reverse-between', group: '热门题', title: '92. 反转链表 II', brief: '走到 left 前一个，再用头插法把后面的节点一个个挪到反转段头部。', view: 'list', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['技巧', '头插法']], counters: '插入', legend: NODE_LEGEND,
    inputs: [{ label: '反转 2..4', make: () => ({ vals: [1, 2, 3, 4, 5], left: 2, right: 4 }) }, { label: '反转 1..2', make: () => ({ vals: [5, 3], left: 1, right: 2 }) }], code: reverseBetweenCode, run: reverseBetween },
  { id: 'lc-stack-by-queue', group: '热门题', title: '225. 用队列实现栈', brief: '只用一个队列：push 时把新元素转一圈到队头，pop 直接从队头拿。队列就变成了栈。', view: 'array', growable: true, facts: [['push', 'O(n)'], ['pop', 'O(1)'], ['空间', 'O(n)'], ['对比', '两个队列写法更绕']], counters: '操作', legend: L,
    inputs: [{ label: '压 1 2 弹 取顶', make: () => [['push', 1], ['push', 2], ['pop'], ['top'], ['empty']] }], code: stackByQueueCode, run: stackByQueue },
  { id: 'lc-eval-rpn', group: '热门题', title: '150. 逆波兰表达式求值', brief: '遇到数字压栈，遇到运算符弹两个数算完再压回。注意先弹出的是右操作数。', view: 'array', growable: true, facts: [['时间', 'O(n)'], ['空间', 'O(n) 栈'], ['坑', '左右操作数顺序']], counters: '压入', legend: L,
    inputs: [{ label: '2 1 + 3 *', make: () => ['2', '1', '+', '3', '*'] }, { label: '4 13 5 / +', make: () => ['4', '13', '5', '/', '+'] }], code: evalRpnCode, run: evalRPN },
  { id: 'lc-simplify-path', group: '热门题', title: '71. 简化路径', brief: '按 / 切段：空串和 "." 跳过，".." 弹栈，其余压栈。最后拼回带前导斜杠的路径。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(n) 栈'], ['结构', '字符串栈']], counters: '已处理', legend: [{ cls: 'cell', text: '字符' }],
    inputs: [{ label: '/a/./b/../../c/', make: () => '/a/./b/../../c/' }, { label: '/../', make: () => '/../' }], code: simplifyPathCode, run: simplifyPath },
  { id: 'lc-word-pattern', group: '热门题', title: '290. 单词规律', brief: '和同构字符串同一套路：字母↔单词双向都要唯一。先看单词数是否等于模式长度。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(n)'], ['坑', '只查单向 / 长度不等']], counters: '映射', legend: [{ cls: 'cell', text: 'pattern 字符' }],
    inputs: [{ label: 'abba / dog cat cat dog', make: () => ({ pattern: 'abba', s: 'dog cat cat dog' }) }, { label: 'abba / dog cat cat fish', make: () => ({ pattern: 'abba', s: 'dog cat cat fish' }) }], code: wordPatternCode, run: wordPattern },
  { id: 'lc-contains-nearby', group: '热门题', title: '219. 存在重复元素 II', brief: '要求两个相同元素下标差不超过 k。维护大小 k 的窗口集合，超出就把旧的移出去。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(k)'], ['技巧', '滑动窗口集合']], counters: '窗口', legend: L,
    inputs: [{ label: 'k=3: 1 2 3 1', make: () => ({ nums: [1, 2, 3, 1], k: 3 }) }, { label: 'k=2: 1 2 3 1 2 3', make: () => ({ nums: [1, 2, 3, 1, 2, 3], k: 2 }) }], code: containsNearbyCode, run: containsNearby },
];
