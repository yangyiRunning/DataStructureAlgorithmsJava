/**
 * LeetCode 高频题（第三批）。
 *
 * 这一批分布在链表、哈希、栈、树、网格、堆六块，都尽量复用已有视图：
 * 需要两条链并排的（两数相加、相交链表）用链表视图的多行模式。
 */

const arrLegend = [
  { cls: 'bar', text: '数组元素' },
  { cls: 'bar is-compare', text: '正在看' },
  { cls: 'bar is-pivot', text: '当前处理' },
  { cls: 'bar is-settled', text: '已确定' },
];

const treeLegend3 = [
  { cls: 'tnode', text: '节点' },
  { cls: 'tnode is-active', text: '当前处理' },
  { cls: 'tnode is-visited', text: '已排除' },
];

let lc3Uid = 0;
function buildTree3(order) {
  const pool = new Map();
  const nodes = order.map((v) => {
    const n = { id: `t${++lc3Uid}`, val: v, left: null, right: null };
    pool.set(n.id, n);
    return n;
  });
  for (let i = 0; i < nodes.length; i++) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < nodes.length && nodes[l].val != null) nodes[i].left = nodes[l];
    if (r < nodes.length && nodes[r].val != null) nodes[i].right = nodes[r];
  }
  return { root: nodes[0], pool };
}
const snap3 = (pool) => [...pool.values()].map((n) => ({
  id: n.id, val: n.val,
  left: n.left ? n.left.id : null, right: n.right ? n.right.id : null,
}));

// ── 128. 最长连续序列 ────────────────────────────────────

const longestCode = [
  'function longestConsecutive(nums) {',
  '  const set = new Set(nums);',
  '  let best = 0;',
  '  for (const x of set) {',
  '    if (set.has(x - 1)) continue;   // 不是序列起点，跳过',
  '    let y = x;',
  '    while (set.has(y + 1)) y++;     // 从这个起点一路往上数',
  '    best = Math.max(best, y - x + 1);',
  '  }',
  '  return best;',
  '}',
];

function longestConsecutive(nums) {
  const set = new Set(nums);
  const steps = [];
  let best = 0;

  const push = (state, note, line) => steps.push({
    state: { values: nums, container: { label: '最长', items: [{ text: String(best), hot: true }] }, ...state },
    note,
    line,
    counters: { 起点: 0 },
  });

  push({}, '要找的是"数值上连续"的最长序列，和原数组顺序无关。所以先扔进集合，只从"没有前驱"的位置起头。', 0);

  let starts = 0;
  nums.forEach((x, i) => {
    if (set.has(x - 1)) {
      push({ compare: [i] }, `${x} 有前驱 ${x - 1}，它会从更小的数开始数，这里跳过。`, 4);
      return;
    }
    starts += 1;
    let y = x;
    const chain = [x];
    while (set.has(y + 1)) {
      y += 1;
      chain.push(y);
    }
    best = Math.max(best, y - x + 1);
    push({ pivot: i, settled: nums.map((v, k) => (chain.includes(v) ? k : -1)).filter((k) => k >= 0) },
      `从 ${x} 起头，往上数到 ${y}，这一段长 ${y - x + 1}，当前最长 ${best}。`, 7);
  });

  push({}, `最长连续序列长度 ${best}。只从起点出发，每个数最多被扫两次，所以是 O(n)。`, 9);
  return { steps, result: { len: best } };
}

// ── 155. 最小栈 ──────────────────────────────────────────

const minStackCode = [
  'function push(x) {',
  '  stack.push(x);',
  '  minStack.push(Math.min(x, minStack.length ? minStack[minStack.length - 1] : x));',
  '}',
  'function pop() { stack.pop(); minStack.pop(); }',
  'function top() { return stack[stack.length - 1]; }',
  'function getMin() { return minStack[minStack.length - 1]; }',
];

function minStack(ops) {
  const stack = [];
  const mins = [];
  const steps = [];
  const results = [];

  const push = (state, note, line) => steps.push({
    state: {
      values: stack.slice(),
      container: { label: '辅助栈（当前最小）', items: mins.map((v) => ({ text: String(v) })) },
      ...state,
    },
    note,
    line,
    counters: { 操作: results.length },
  });

  push({}, 'O(1) 拿到最小值的办法：再开一个辅助栈，同步记录"到这里为止的最小值"。空间换时间。', 0);

  for (const [op, v] of ops) {
    if (op === 'push') {
      stack.push(v);
      mins.push(mins.length ? Math.min(v, mins[mins.length - 1]) : v);
      push({ pivot: stack.length - 1 }, `push(${v})：辅助栈也压入 min(${v}, 上一个最小) = ${mins[mins.length - 1]}。`, 2);
    } else if (op === 'pop') {
      const popped = stack.pop();
      mins.pop();
      // pop 本身没有返回值，不记进 results——记了就会多出一项
      // 弹出的那个已经不在数组里了，别用 stack.length 当下标（会越界一格）
      push(stack.length ? { move: [stack.length - 1] } : {}, `pop() 弹出 ${popped}，两个栈一起弹。`, 4);
    } else if (op === 'top') {
      results.push(stack[stack.length - 1]);
      push({ pivot: stack.length - 1 }, `top() = ${stack[stack.length - 1]}。`, 5);
    } else {
      results.push(mins[mins.length - 1]);
      push({}, `getMin() = ${mins[mins.length - 1]}，直接看辅助栈顶，O(1)。`, 6);
    }
  }

  push({}, `操作完成。辅助栈是关键：它让"历史最小值"随时可取，而不是每次遍历一遍。`, 6);
  return { steps, result: { out: results.join(',') } };
}

// ── 394. 字符串解码 ──────────────────────────────────────

const decodeCode = [
  'function decodeString(s) {',
  '  const stack = [];',
  '  let cur = "", num = 0;',
  '  for (const ch of s) {',
  '    if (ch >= "0" && ch <= "9") { num = num * 10 + Number(ch); }',
  '    else if (ch === "[") { stack.push([cur, num]); cur = ""; num = 0; }',
  '    else if (ch === "]") { const [prev, n] = stack.pop(); cur = prev + cur.repeat(n); }',
  '    else cur += ch;',
  '  }',
  '  return cur;',
  '}',
];

function decodeString(s) {
  const chars = [...s];
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { chars, ...state },
    note,
    line,
    counters: { 栈深: 0 },
  });

  push({ container: { label: '栈（外层，重复次数）', items: [] } },
    '遇到数字攒数字，遇到 [ 就把"当前串 + 次数"压栈，遇到 ] 就弹出来重复拼接。', 0);

  const stack = [];
  let cur = '';
  let num = 0;
  const items = () => stack.map(([prev, n]) => ({ text: `${prev || '∅'}×${n}` }));

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    push({ current: i, container: { label: '栈（外层，重复次数）', items: items() } },
      `读到 "${ch}"。`, 3);
    if (ch >= '0' && ch <= '9') {
      num = num * 10 + Number(ch);
    } else if (ch === '[') {
      stack.push([cur, num]);
      cur = '';
      num = 0;
      push({ current: i, container: { label: '栈（外层，重复次数）', items: items() } },
        `入栈：外层串留底，重复次数 ${stack[stack.length - 1][1]}。`, 5);
    } else if (ch === ']') {
      const [prev, n] = stack.pop();
      cur = prev + cur.repeat(n);
      push({ current: i, container: { label: '栈（外层，重复次数）', items: items() } },
        `出栈：把里面这段重复 ${n} 次接到外层串后面，得到 "${cur}"。`, 6);
    } else {
      cur += ch;
    }
  }

  push({}, `解码结果：${cur}。栈里存的是"还没拼完的外层"，遇到 ] 才合拢。`, 8);
  return { steps, result: { out: cur } };
}

// ── 236. 最近公共祖先 ────────────────────────────────────

const lcaCode = [
  'function lowestCommonAncestor(node, p, q) {',
  '  if (!node || node === p || node === q) return node;',
  '  const l = lowestCommonAncestor(node.left, p, q);',
  '  const r = lowestCommonAncestor(node.right, p, q);',
  '  if (l && r) return node;      // 两边各找到一个，当前就是答案',
  '  return l || r;                // 否则答案在找到的那一边',
  '}',
];

function lca(input) {
  const { levels, p, q } = input;
  const { root, pool } = buildTree3(levels);
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { nodes: snap3(pool), root: root.id, ...state },
    note,
    line,
    counters: { 访问: 0 },
  });

  push({}, `找 ${p} 和 ${q} 的最近公共祖先。递归返回"这一子树里找到了谁"，两边都找到就说明分叉点在当前节点。`, 0);

  const find = (v) => [...pool.values()].find((n) => n.val === v);
  const P = find(p);
  const Q = find(q);

  const dfs = (node) => {
    if (!node) return null;
    if (node === P || node === Q) {
      push({ highlight: [node.id] }, `${node.val} 就是目标之一，直接返回它。`, 1);
      return node;
    }
    push({ highlight: [node.id] }, `处理 ${node.val}，先看左右子树各能找到谁。`, 2);
    const l = dfs(node.left);
    const r = dfs(node.right);
    if (l && r) {
      push({ highlight: [node.id], visited: [l.id, r.id] }, `${node.val} 的左边找到 ${l.val}、右边找到 ${r.val}，分叉点就是 ${node.val}。`, 4);
      return node;
    }
    return l || r;
  };

  const ans = dfs(root);
  push({ highlight: [ans.id] }, `最近公共祖先是 ${ans.val}。`, 6);
  return { steps, result: { lca: ans.val } };
}

// ── 98. 验证二叉搜索树 ──────────────────────────────────

const validBstCode = [
  'function isValidBST(node, low = -Infinity, high = Infinity) {',
  '  if (!node) return true;',
  '  if (node.val <= low || node.val >= high) return false;',
  '  return isValidBST(node.left, low, node.val)',
  '      && isValidBST(node.right, node.val, high);',
  '}',
];

function isValidBst(levels) {
  const { root, pool } = buildTree3(levels);
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { nodes: snap3(pool), root: root.id, ...state },
    note,
    line,
    counters: { 访问: 0 },
  });

  push({}, '别只比"左孩子 < 自己 < 右孩子"——那不够。正确做法是带着区间往下递归：每个节点都必须落在它被允许的范围里。', 0);

  const walk = (node, low, high) => {
    if (!node) return true;
    push({ highlight: [node.id] },
      `${node.val} 必须在 (${low === -Infinity ? '-∞' : low}, ${high === Infinity ? '∞' : high}) 之间。`, 2);
    if (node.val <= low || node.val >= high) {
      push({ highlight: [node.id], visited: [node.id] }, `${node.val} 越界了，不是 BST。`, 2);
      return false;
    }
    return walk(node.left, low, node.val) && walk(node.right, node.val, high);
  };

  const ok = walk(root, -Infinity, Infinity);
  push({}, ok ? '整棵树满足 BST 定义。' : '不满足。', 4);
  return { steps, result: { ok: String(ok) } };
}

// ── 994. 腐烂的橘子 ──────────────────────────────────────

const orangeCode = [
  'function orangesRotting(grid) {',
  '  let fresh = 0; const q = [];',
  '  for (r) for (c) { if (grid[r][c] === 1) fresh++; if (grid[r][c] === 2) q.push([r, c]); }',
  '  let minutes = 0;',
  '  while (q.length && fresh > 0) {',
  '    for (let i = q.length; i > 0; i--) {   // 一层就是一轮',
  '      const [r, c] = q.shift();',
  '      for (const [nr, nc] of neighbors(r, c)) {',
  '        if (grid[nr][nc] === 1) { grid[nr][nc] = 2; fresh--; q.push([nr, nc]); }',
  '      }',
  '    }',
  '    minutes++;',
  '  }',
  '  return fresh === 0 ? minutes : -1;',
  '}',
];

const ORANGE_GRID = [
  [2, 1, 1, 1, 2],
  [1, 1, 0, 1, 1],
  [0, 1, 1, 0, 1],
];

function orangesRotting() {
  const src = ORANGE_GRID;
  const R = src.length;
  const C = src[0].length;
  const grid = src.map((r) => r.slice());

  const steps = [];
  let minutes = 0;
  let fresh = 0;
  let queue = [];

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === 1) fresh += 1;
      if (grid[r][c] === 2) queue.push([r, c]);
    }
  }

  const push = (state, note, line) => steps.push({
    state: {
      grid: grid.map((r) => r.slice()),
      land: src,
      container: { label: '分钟 / 剩新鲜', items: [{ text: `${minutes} / ${fresh}`, hot: true }] },
      ...state,
    },
    note,
    line,
    counters: { 分钟: minutes },
  });

  push({}, '腐烂是 BFS：所有腐烂橘子同时往外扩一圈，一圈就是一分钟。只要还有新鲜橘子而队列空了，说明有够不着的。', 0);

  while (queue.length && fresh > 0) {
    const next = [];
    for (const [r, c] of queue) {
      for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
        if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
        if (grid[nr][nc] !== 1) continue;
        grid[nr][nc] = 2;
        fresh -= 1;
        next.push([nr, nc]);
      }
    }
    minutes += 1;
    queue = next;
    push({ current: next[0] ?? null },
      `第 ${minutes} 分钟：这一圈又烂了 ${next.length} 个，还剩 ${fresh} 个新鲜。`, 6);
  }

  push({}, fresh === 0 ? `${minutes} 分钟全部烂完。` : `还剩 ${fresh} 个烂不到，返回 -1。`, 11);
  return { steps, result: { minutes: fresh === 0 ? minutes : -1 } };
}

// ── 347. 前 K 个高频元素 ────────────────────────────────

const topKfCode = [
  'function topKFrequent(nums, k) {',
  '  const cnt = new Map();',
  '  for (const x of nums) cnt.set(x, (cnt.get(x) || 0) + 1);',
  '  const heap = [];                       // 小顶堆，按频次，容量 k',
  '  for (const [x, c] of cnt) {',
  '    heap.push([x, c]); heap.sort((a, b) => a[1] - b[1]);',
  '    if (heap.length > k) heap.shift();   // 频次最小的淘汰',
  '  }',
  '  return heap.map(([x]) => x);',
  '}',
];

function topKFrequent(input) {
  const { nums, k } = input;
  const cnt = new Map();
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { values: nums, ...state },
    note,
    line,
    counters: { 元素种数: cnt.size },
  });

  push({}, `先数频次，再用容量 k 的小顶堆留下频次最高的 k 个。`, 1);

  for (const x of nums) {
    cnt.set(x, (cnt.get(x) || 0) + 1);
  }
  push({ container: { label: '频次', items: [...cnt.entries()].map(([x, c]) => ({ text: `${x}:${c}` })) } },
    `数完了：${[...cnt.entries()].map(([x, c]) => `${x}×${c}`).join('，')}。`, 2);

  const heap = [];
  for (const [x, c] of cnt) {
    heap.push([x, c]);
    heap.sort((a, b) => a[1] - b[1]);
    if (heap.length > k) heap.shift();
    push({ container: { label: '堆里前 K', items: heap.map(([v, n]) => ({ text: `${v}:${n}`, hot: true })) } },
      `${x}（${c} 次）进堆，超过 ${k} 个就把频次最小的挤出去。`, 6);
  }

  const ans = heap.map(([x]) => x).sort((a, b) => a - b);
  push({}, `前 ${k} 高频是 ${ans.join('、')}。`, 8);
  return { steps, result: { top: ans.join(',') } };
}

export const leetcode3Algorithms = [
  {
    id: 'lc-longest-consecutive',
    group: '热门题',
    title: '128. 最长连续序列',
    brief: '先扔进集合，只从「没有前驱」的数起头往上数。每个数最多被扫两次，所以是 O(n)，不是排序后的 O(n log n)。',
    view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(n)'], ['关键', '只从起点数'], ['对比', '排序 O(n log n)']],
    counters: '起点', legend: arrLegend,
    inputs: [
      { label: '100 4 200 1 3 2', make: () => [100, 4, 200, 1, 3, 2] },
      { label: '有重复', make: () => [1, 2, 0, 1, 3, 4, 2] },
    ],
    code: longestCode, run: longestConsecutive,
  },
  {
    id: 'lc-min-stack',
    group: '热门题',
    title: '155. 最小栈',
    brief: '再开一个辅助栈，同步记录「到这里为止的最小值」。push 时两边一起压，pop 时一起弹，getMin 直接看辅助栈顶。',
    view: 'array', growable: true, facts: [['时间', 'push/pop/top/getMin 都 O(1)'], ['空间', 'O(n) 双栈'], ['思路', '空间换时间']],
    counters: '操作', legend: arrLegend,
    inputs: [
      { label: '压 3 5 2 再弹一次', make: () => [['push', 3], ['push', 5], ['push', 2], ['getMin'], ['pop'], ['getMin'], ['top']] },
      { label: '只压递减', make: () => [['push', 5], ['push', 4], ['push', 3], ['getMin']] },
    ],
    code: minStackCode, run: minStack,
  },
  {
    id: 'lc-decode-string',
    group: '热门题',
    title: '394. 字符串解码',
    brief: '数字攒着，遇到 [ 就把"外层串 + 次数"压栈，遇到 ] 弹出来重复拼接。栈里存的是还没拼完的外层。',
    view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(n) 栈'], ['结构', '字符串栈'], ['坑', '嵌套']],
    counters: '栈深', legend: [
      { cls: 'cell', text: '字符' }, { cls: 'cell is-active', text: '当前字符' },
    ],
    inputs: [
      { label: '3[a]2[bc]', make: () => '3[a]2[bc]' },
      { label: '3[a2[c]]', make: () => '3[a2[c]]' },
      { label: '2[abc]3[cd]ef', make: () => '2[abc]3[cd]ef' },
    ],
    code: decodeCode, run: decodeString,
  },
  {
    id: 'lc-lca',
    group: '热门题',
    title: '236. 二叉树的最近公共祖先',
    brief: '递归返回「这一子树里找到了谁」：两边各找到一个，当前节点就是分叉点；只有一边找到就把那边往上带。',
    view: 'tree', bst: false, facts: [['时间', 'O(n)'], ['空间', 'O(h)'], ['关键', '左右都非空'], ['同型', '235 BST 版']],
    counters: '访问', legend: treeLegend3,
    inputs: [
      { label: '3 5 1 6 2 0 8 null null 7 4，找 5 和 1', make: () => ({ levels: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 5, q: 1 }) },
      { label: '同一棵树，找 5 和 4', make: () => ({ levels: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 5, q: 4 }) },
    ],
    code: lcaCode, run: lca,
  },
  {
    id: 'lc-validate-bst',
    group: '热门题',
    title: '98. 验证二叉搜索树',
    brief: '不能只比父子！必须带着开区间往下递归：每个节点都要落在它被允许的范围里。只比父子会把 5,1,4,3,6 这种树误判成合法。',
    view: 'tree', bst: false, facts: [['时间', 'O(n)'], ['空间', 'O(h)'], ['关键', '上下界'], ['易错', '只比父子']],
    counters: '访问', legend: treeLegend3,
    inputs: [
      { label: '合法 2 1 3', make: () => [2, 1, 3] },
      { label: '非法 5 1 4 null null 3 6', make: () => [5, 1, 4, null, null, 3, 6] },
    ],
    code: validBstCode, run: isValidBst,
  },
  {
    id: 'lc-oranges',
    group: '热门题',
    title: '994. 腐烂的橘子',
    brief: '多源 BFS：所有腐烂橘子同时往外扩，一圈就是一分钟。队列空了还有新鲜的，说明有够不着的，返回 -1。',
    view: 'board', facts: [['时间', 'O(行×列)'], ['空间', 'O(行×列)'], ['模型', '多源 BFS'], ['判负', '剩新鲜橘子']],
    counters: '分钟', legend: [
      { cls: 'cell board', text: '新鲜' }, { cls: 'cell board is-water', text: '空格' },
      { cls: 'cell board is-settled', text: '已腐烂' }, { cls: 'cell board is-active', text: '本轮新烂' },
    ],
    inputs: [{ label: '这张网格', make: () => true }],
    code: orangeCode, run: orangesRotting,
  },
  {
    id: 'lc-top-k-frequent',
    group: '热门题',
    title: '347. 前 K 个高频元素',
    brief: '先数频次，再用容量 k 的小顶堆留前 k 个。和 215 是同一套思路：只要前 k 个，就用容量 k 的堆。',
    view: 'array', facts: [['时间', 'O(n log k)'], ['空间', 'O(n)'], ['结构', '哈希 + 小顶堆'], ['同型', '215 第 K 大']],
    counters: '元素种数', legend: arrLegend,
    inputs: [
      { label: '1 1 1 2 2 3, k=2', make: () => ({ nums: [1, 1, 1, 2, 2, 3], k: 2 }) },
      { label: '单元素, k=1', make: () => ({ nums: [1], k: 1 }) },
      { label: '随机 9 个, k=3', make: () => ({ nums: Array.from({ length: 9 }, () => 1 + Math.floor(Math.random() * 4)), k: 3 }) },
    ],
    code: topKfCode, run: topKFrequent,
  },
];
