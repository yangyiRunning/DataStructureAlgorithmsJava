/**
 * LeetCode 高频题（第四批）。
 *
 * 这一批把链表相关的三道补齐，再加上单调栈、哈希分组、回溯、网格搜索、DP。
 */

const arrLegend4 = [
  { cls: 'bar', text: '数组元素' },
  { cls: 'bar is-compare', text: '正在看' },
  { cls: 'bar is-pivot', text: '当前处理' },
  { cls: 'bar is-settled', text: '已确定' },
];

let lc4Uid = 0;
const mkNode = (val, next = null) => ({ id: `k${++lc4Uid}`, val, next });

// ── 2. 两数相加 ──────────────────────────────────────────

const addTwoCode = [
  'function addTwoNumbers(l1, l2) {',
  '  const dummy = {};',
  '  let tail = dummy, carry = 0;',
  '  while (l1 || l2 || carry) {',
  '    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;',
  '    carry = Math.floor(sum / 10);',
  '    tail.next = { val: sum % 10, next: null };   // 只留个位',
  '    tail = tail.next;',
  '    l1 = l1 ? l1.next : null;',
  '    l2 = l2 ? l2.next : null;',
  '  }',
  '  return dummy.next;',
  '}',
];

function addTwoNumbers(input) {
  const { a, b } = input;
  // 数组按"个位在前"给，和题目一致
  const la = a.map((v) => mkNode(v));
  const lb = b.map((v) => mkNode(v));
  la.forEach((n, i) => { n.next = la[i + 1] ?? null; });
  lb.forEach((n, i) => { n.next = lb[i + 1] ?? null; });

  const out = [];
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: {
      nodes: [...la, ...lb, ...out].map((n) => ({ id: n.id, val: n.val, next: n.next ? n.next.id : null })),
      rows: [
        walkIds(la[0]), walkIds(lb[0]), out.map((n) => n.id),
      ],
      rowLabels: ['l1', 'l2', '结果'],
      ...state,
    },
    note,
    line,
    counters: { 进位: 0 },
  });

  function walkIds(head) {
    const r = [];
    const seen = new Set();
    let p = head;
    while (p && !seen.has(p.id)) { seen.add(p.id); r.push(p.id); p = p.next; }
    return r;
  }

  push({}, '两个链表是"个位在前"存的，所以从前往后加正好是从低位往高位，进位往后带。', 0);

  let i = 0;
  let j = 0;
  let carry = 0;
  let tail = null;
  while (i < la.length || j < lb.length || carry) {
    const va = i < la.length ? a[i] : 0;
    const vb = j < lb.length ? b[j] : 0;
    const sum = va + vb + carry;
    carry = Math.floor(sum / 10);
    const node = mkNode(sum % 10);
    out.push(node);
    if (tail) tail.next = node;
    tail = node;
    push({ highlight: [node.id] }, `${va} + ${vb} + 进位 = ${sum}，记下个位 ${sum % 10}，进位 ${carry}。`, 6);
    i += 1;
    j += 1;
  }

  push({}, `结果是 ${out.map((n) => n.val).reverse().join('')}（从高位读）。`, 11);
  return { steps, result: { arr: out.map((n) => n.val).join(',') } };
}

// ── 160. 相交链表 ────────────────────────────────────────

const intersectCode = [
  'function getIntersectionNode(a, b) {',
  '  let pa = a, pb = b;',
  '  while (pa !== pb) {                 // 走到 null 就换到另一条链的头',
  '    pa = pa === null ? b : pa.next;',
  '    pb = pb === null ? a : b ? pb.next : pb.next;',
  '  }',
  '  return pa;',
  '}',
];

function getIntersection(input) {
  const { preA, preB, shared } = input;
  const sharedNodes = shared.map((v) => mkNode(v));
  sharedNodes.forEach((n, i) => { n.next = sharedNodes[i + 1] ?? null; });
  const aNodes = preA.map((v) => mkNode(v));
  const bNodes = preB.map((v) => mkNode(v));
  aNodes.forEach((n, i) => { n.next = aNodes[i + 1] ?? sharedNodes[0] ?? null; });
  if (aNodes.length) aNodes[aNodes.length - 1].next = sharedNodes[0] ?? null;
  bNodes.forEach((n, i) => { n.next = bNodes[i + 1] ?? null; });
  if (bNodes.length) bNodes[bNodes.length - 1].next = sharedNodes[0] ?? null;

  const steps = [];
  const ids = (head) => {
    const r = [];
    const seen = new Set();
    let p = head;
    while (p && !seen.has(p.id)) { seen.add(p.id); r.push(p.id); p = p.next; }
    return r;
  };
  const push = (state, note, line) => steps.push({
    state: {
      nodes: [...aNodes, ...bNodes, ...sharedNodes].map((n) => ({ id: n.id, val: n.val, next: n.next ? n.next.id : null })),
      rows: [ids(aNodes[0] ?? sharedNodes[0]), ids(bNodes[0] ?? sharedNodes[0])],
      rowLabels: ['A', 'B'],
      ...state,
    },
    note,
    line,
    counters: { 步数: 0 },
  });

  push({}, '两条链表可能在某个节点之后合并。关键技巧：指针走到头就换到另一条链的头，两个指针走的总长度相同，一定同时到达交点。', 0);

  let pa = aNodes[0] ?? sharedNodes[0] ?? null;
  let pb = bNodes[0] ?? sharedNodes[0] ?? null;
  const headA = pa;
  const headB = pb;
  let guard = 0;
  while (pa !== pb && guard < 100) {
    pa = pa === null ? headB : pa.next;
    pb = pb === null ? headA : pb.next;
    guard += 1;
    push({ highlight: pa ? [pa.id] : [] }, `各走一步：A 侧在 ${pa ? pa.val : '∅'}，B 侧在 ${pb ? pb.val : '∅'}。`, 3);
  }

  const hit = shared.length ? shared[0] : -1;
  push({}, shared.length ? `在节点 ${hit} 相遇，这就是交点。` : '两条链没有交点，最后同时变成 null。', 6);
  return { steps, result: { val: hit } };
}

// ── 234. 回文链表 ────────────────────────────────────────

const palinListCode = [
  'function isPalindrome(head) {',
  '  let slow = head, fast = head;',
  '  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }',
  '  let prev = null;                    // 反转后半段',
  '  while (slow) { const nx = slow.next; slow.next = prev; prev = slow; slow = nx; }',
  '  let left = head, right = prev;',
  '  while (right) {                     // 和前半段逐对比较',
  '    if (left.val !== right.val) return false;',
  '    left = left.next; right = right.next;',
  '  }',
  '  return true;',
  '}',
];

function palinList(input) {
  const nodes = input.map((v) => mkNode(v));
  nodes.forEach((n, i) => { n.next = nodes[i + 1] ?? null; });
  const order = nodes.map((n) => n.id);
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { nodes: nodes.map((n) => ({ id: n.id, val: n.val, next: n.next ? n.next.id : null })), order, ...state },
    note,
    line,
    counters: { 比较: 0 },
  });

  push({}, '三步：快慢指针找中点、反转后半段、两段逐对比较。空间 O(1)，比"复制到数组"更省。', 0);

  let slow = 0;
  let fast = 0;
  while (fast < nodes.length - 1) { slow += 1; fast += 2; }
  push({ highlight: [nodes[slow].id] }, `中点在下标 ${slow}（值 ${nodes[slow].val}），从这里开始反转后半段。`, 2);

  let prev = null;
  for (let i = slow; i < nodes.length; i++) {
    const nx = nodes[i].next;
    nodes[i].next = prev;
    prev = nodes[i];
    push({ moved: [nodes[i].id] }, `${nodes[i].val} 的 next 掉头。`, 4);
  }

  let ok = true;
  let l = 0;
  let r = nodes.length - 1;
  while (prev) {
    push({ compare: [l, r] }, `比较前半段的 ${nodes[l].val} 和后半段的 ${prev.val}。`, 6);
    if (nodes[l].val !== prev.val) { ok = false; break; }
    l += 1;
    prev = prev.next;
    r -= 1;
  }

  push({}, ok ? '是回文链表。' : '不是回文链表。', 8);
  return { steps, result: { ok: String(ok) } };
}

// ── 84. 柱状图中最大的矩形 ──────────────────────────────

const largestRectCode = [
  'function largestRectangleArea(h) {',
  '  const stack = [];            // 存下标，高度单调递增',
  '  let best = 0;',
  '  for (let i = 0; i <= h.length; i++) {',
  '    const cur = i === h.length ? 0 : h[i];   // 末尾补个 0 把栈清空',
  '    while (stack.length && h[stack[stack.length - 1]] > cur) {',
  '      const height = h[stack.pop()];',
  '      const left = stack.length ? stack[stack.length - 1] + 1 : 0;',
  '      best = Math.max(best, height * (i - left));',
  '    }',
  '    stack.push(i);',
  '  }',
  '  return best;',
  '}',
];

function largestRect(input) {
  const h = input.slice();
  const steps = [];
  const stack = [];
  let best = 0;
  const push = (state, note, line) => steps.push({
    state: { values: h, container: { label: '栈（下标）', items: stack.map((i) => ({ text: String(i) })) }, ...state },
    note,
    line,
    counters: { 弹出: 0 },
  });

  push({}, '单调递增栈：遇到比栈顶矮的柱子，就把栈顶那根"能撑多宽"算出来。每根柱子只进栈出栈一次，O(n)。', 0);

  let pops = 0;
  for (let i = 0; i <= h.length; i++) {
    const cur = i === h.length ? 0 : h[i];
    while (stack.length && h[stack[stack.length - 1]] > cur) {
      const top = stack.pop();
      const height = h[top];
      const left = stack.length ? stack[stack.length - 1] + 1 : 0;
      const area = height * (i - left);
      best = Math.max(best, area);
      pops += 1;
      push({ pivot: top, compare: [i < h.length ? i : top] },
        `弹出 ${top}（高 ${height}），它能撑的宽度是 ${i - left}，面积 ${area}，目前最大 ${best}。`, 9);
    }
    stack.push(i);
  }

  push({}, `最大矩形面积 ${best}。`, 12);
  return { steps, result: { area: best } };
}

// ── 49. 字母异位词分组 ──────────────────────────────────

const groupCode = [
  'function groupAnagrams(strs) {',
  '  const map = new Map();',
  '  for (const s of strs) {',
  '    const key = [...s].sort().join("");   // 排序后的串当键',
  '    if (!map.has(key)) map.set(key, []);',
  '    map.get(key).push(s);',
  '  }',
  '  return [...map.values()];',
  '}',
];

function groupAnagrams(strs) {
  const buckets = [];
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { buckets: buckets.map((b) => b.map((w) => ({ key: w }))), ...state },
    note,
    line,
    counters: { 分组: buckets.length },
  });

  push({}, '两个词是异位词，当且仅当"字母排序后一样"。所以把排序后的串当哈希键。', 0);

  const map = new Map();
  for (const s of strs) {
    const key = [...s].sort().join('');
    if (!map.has(key)) {
      map.set(key, []);
      buckets.push(map.get(key));
    }
    map.get(key).push(s);
    push({ activeBucket: buckets.indexOf(map.get(key)), highlightKey: s },
      `"${s}" 的排序键是 "${key}"，归到第 ${buckets.indexOf(map.get(key))} 组。`, 5);
  }

  push({ activeBucket: -1 }, `共分成 ${buckets.length} 组。`, 6);
  return { steps, result: { count: buckets.length } };
}

// ── 22. 括号生成 ────────────────────────────────────────

const genParenCode = [
  'function generate(n) {',
  '  const res = [];',
  '  const dfs = (cur, open, close) => {',
  '    if (cur.length === n * 2) { res.push(cur); return; }',
  '    if (open < n) dfs(cur + "(", open + 1, close);      // 左括号没满就能加',
  '    if (close < open) dfs(cur + ")", open, close + 1);  // 右括号少于左括号才能加',
  '  };',
  '  dfs("", 0, 0);',
  '  return res;',
  '}',
];

function generateParenthesis(n) {
  const steps = [];
  const res = [];
  const push = (state, note, line) => steps.push({
    state: { values: new Array(n * 2).fill(0), container: { label: '当前串', items: (state?.cur ? [...state.cur] : []).map((c) => ({ text: c })) }, ...state },
    note,
    line,
    counters: { 解: res.length },
  });

  push({}, `${n} 对括号，左括号数不能超过 ${n}，右括号数不能超过左括号数——两条剪枝。`, 2);

  const dfs = (cur, open, close) => {
    if (cur.length === n * 2) {
      res.push(cur);
      push({ cur }, `凑满 ${n * 2} 个字符：${cur}。`, 4);
      return;
    }
    if (open < n) {
      push({ cur: cur + '(' }, `${cur} 还能加左括号（已有 ${open} 个）。`, 5);
      dfs(cur + '(', open + 1, close);
    }
    if (close < open) {
      push({ cur: cur + ')' }, `${cur} 可以加右括号（左 ${open} > 右 ${close}）。`, 6);
      dfs(cur + ')', open, close + 1);
    }
  };

  dfs('', 0, 0);
  push({}, `共 ${res.length} 种组合。个数的通项是第 n 个卡特兰数。`, 9);
  return { steps, result: { count: res.length } };
}

// ── 79. 单词搜索 ────────────────────────────────────────

const wordSearchCode = [
  'function exist(board, word) {',
  '  const dfs = (r, c, i) => {',
  '    if (i === word.length) return true;',
  '    if (越界 || board[r][c] !== word[i]) return false;',
  '    const tmp = board[r][c];',
  '    board[r][c] = "#";                 // 标记已用，防止走回头路',
  '    for (const [nr, nc] of 四个方向) if (dfs(nr, nc, i + 1)) return true;',
  '    board[r][c] = tmp;                 // 撤销',
  '    return false;',
  '  };',
  '  for (每个格子) if (dfs(r, c, 0)) return true;',
  '  return false;',
  '}',
];

const BOARD = [
  ['A', 'B', 'C', 'E'],
  ['S', 'F', 'C', 'S'],
  ['A', 'D', 'E', 'E'],
];

function exist(word) {
  const board = BOARD.map((r) => r.slice());
  const steps = [];
  const path = [];
  let found = false;
  let walked = 0;          // 累计走过的格数：只增不减，适合当计数器

  const push = (state, note, line) => steps.push({
    state: {
      grid: board.map((row) => row.map((ch) => (ch === '#' ? 0 : 1))),
      gridText: board.map((row) => row.map((ch) => (ch === '#' ? '·' : ch))),
      visited: path.map(([r, c]) => [r, c]),
      ...state,
    },
    note,
    line,
    counters: { 走过: walked },
  });

  push({}, `在 ${BOARD.length}×${BOARD[0].length} 的棋盘里找 "${word}"，可以上下左右走，但不能重复用同一格。`, 0);

  const dfs = (r, c, i) => {
    if (i === word.length) return true;
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return false;
    if (board[r][c] !== word[i]) return false;
    const tmp = board[r][c];
    board[r][c] = '#';
    path.push([r, c]);
    walked += 1;
    push({ current: [r, c] }, `(${r},${c}) 匹配 "${word[i]}"，占住它，继续找下一个字符。`, 5);
    for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
      if (dfs(nr, nc, i + 1)) return true;
    }
    path.pop();
    board[r][c] = tmp;
    push({}, `(${r},${c}) 这条路走不通，撤销。`, 7);
    return false;
  };

  for (let r = 0; r < board.length && !found; r++) {
    for (let c = 0; c < board[0].length; c++) {
      if (dfs(r, c, 0)) { found = true; break; }
    }
  }

  push({}, found ? `找到了 "${word}"。` : `棋盘里拼不出 "${word}"。`, 10);
  return { steps, result: { ok: String(found) } };
}

// ── 139. 单词拆分 ───────────────────────────────────────

const wordBreakCode = [
  'function wordBreak(s, words) {',
  '  const set = new Set(words);',
  '  const dp = new Array(s.length + 1).fill(false);',
  '  dp[0] = true;',
  '  for (let i = 1; i <= s.length; i++) {',
  '    for (let j = 0; j < i; j++) {',
  '      if (dp[j] && set.has(s.slice(j, i))) { dp[i] = true; break; }',
  '    }',
  '  }',
  '  return dp[s.length];',
  '}',
];

function wordBreak(input) {
  const { s, words } = input;
  const set = new Set(words);
  const n = s.length;
  const dp = new Array(n + 1).fill(false);
  dp[0] = true;

  const steps = [];
  let checks = 0;
  const push = (state, note, line) => steps.push({
    state: {
      chars: [...s],
      settled: dp.map((v, i) => (v ? i - 1 : -1)).filter((i) => i >= 0 && i < n),
      container: { label: 'dp', items: dp.map((v, i) => ({ text: `${i}:${v ? 'T' : 'F'}` })) },
      ...state,
    },
    note,
    line,
    counters: { 检查: checks },
  });

  push({}, `dp[i] 表示"前 i 个字符能被拆开"。对每个 i 回头看所有 j：dp[j] 成立且 s[j..i) 是词表里的词，dp[i] 就成立。`, 3);

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      checks += 1;
      if (dp[j] && set.has(s.slice(j, i))) {
        dp[i] = true;
        push({ current: i - 1, compare: [j] }, `dp[${j}] 成立且 "${s.slice(j, i)}" 是词，所以 dp[${i}] = true。`, 6);
        break;
      }
    }
  }

  push({}, dp[n] ? `"${s}" 能被拆开。` : `"${s}" 拆不开。`, 9);
  return { steps, result: { ok: String(dp[n]) } };
}

export const leetcode4Algorithms = [
  {
    id: 'lc-add-two',
    group: '热门题',
    title: '2. 两数相加',
    brief: '两个链表是"个位在前"存的，所以从前往后加正好是低位到高位，进位往后带。别忘了最后可能还有一个进位。',
    view: 'list', facts: [['时间', 'O(max(m,n))'], ['空间', 'O(1) 除结果'], ['陷阱', '最后的进位'], ['结构', '哑头 + 尾插']],
    counters: '进位', legend: [
      { cls: 'node', text: '节点' }, { cls: 'node is-active', text: '刚生成' },
    ],
    inputs: [
      { label: '342 + 465', make: () => ({ a: [2, 4, 3], b: [5, 6, 4] }) },
      { label: '999 + 1（连续进位）', make: () => ({ a: [9, 9, 9], b: [1] }) },
    ],
    code: addTwoCode, run: addTwoNumbers,
  },
  {
    id: 'lc-intersection',
    group: '热门题',
    title: '160. 相交链表',
    brief: '走到头就换到另一条链的头。两个指针走的总长度相同，所以一定同时到达交点——不需要先求长度差。',
    view: 'list', facts: [['时间', 'O(m+n)'], ['空间', 'O(1)'], ['技巧', '换头'], ['坑', '无交点时判断 null']],
    counters: '步数', legend: [{ cls: 'node', text: '节点' }, { cls: 'node is-active', text: '当前节点' }],
    inputs: [
      { label: '交于 8', make: () => ({ preA: [4, 1], preB: [5, 0, 1], shared: [8, 4, 5] }) },
      { label: '没有交点', make: () => ({ preA: [4, 1], preB: [5, 0, 1], shared: [] }) },
    ],
    code: intersectCode, run: getIntersection,
  },
  {
    id: 'lc-palindrome-list',
    group: '热门题',
    title: '234. 回文链表',
    brief: '快慢指针找中点、反转后半段、两段逐对比较。全程 O(1) 额外空间，比"复制成数组再判断"更省。',
    view: 'list', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['三步', '找中点 + 反转 + 比较'], ['对比', '数组法 O(n) 空间']],
    counters: '比较', legend: [{ cls: 'node', text: '节点' }, { cls: 'node is-active', text: '正在比较' }, { cls: 'node is-moved', text: '翻转中' }],
    inputs: [
      { label: '1 2 2 1', make: () => [1, 2, 2, 1] },
      { label: '1 2 3', make: () => [1, 2, 3] },
      { label: '单节点', make: () => [7] },
    ],
    code: palinListCode, run: palinList,
  },
  {
    id: 'lc-largest-rect',
    group: '热门题',
    title: '84. 柱状图中最大的矩形',
    brief: '单调递增栈。遇到更矮的就弹出栈顶，算出它"能撑多宽"。每根柱子进出栈各一次，O(n)。',
    view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(n)'], ['结构', '单调栈'], ['技巧', '末尾补 0 清栈']],
    counters: '弹出', legend: arrLegend4,
    inputs: [
      { label: '2 1 5 6 2 3', make: () => [2, 1, 5, 6, 2, 3] },
      { label: '全相同', make: () => [4, 4, 4, 4] },
    ],
    code: largestRectCode, run: largestRect,
  },
  {
    id: 'lc-group-anagrams',
    group: '热门题',
    title: '49. 字母异位词分组',
    brief: '两个词是异位词，当且仅当字母排序后相同。所以把排序后的串当哈希键，一次遍历就分好组。',
    view: 'hash', facts: [['时间', 'O(n·k log k)'], ['空间', 'O(n)'], ['键', '排序后的串'], ['同型', '242 有效异位词']],
    counters: '分组', legend: [{ cls: 'node', text: '词' }, { cls: 'node is-moved', text: '本次归组' }],
    inputs: [
      { label: 'eat tea tan ate nat bat', make: () => ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'] },
      { label: '空串和单字符', make: () => ['', 'a', 'b', 'a'] },
    ],
    code: groupCode, run: groupAnagrams,
  },
  {
    id: 'lc-generate-parens',
    group: '热门题',
    title: '22. 括号生成',
    brief: '回溯加两条剪枝：左括号没满 n 才能加左，右括号少于左括号才能加右。个数是第 n 个卡特兰数。',
    view: 'array', facts: [['时间', 'O(4^n/√n)'], ['空间', 'O(n)'], ['剪枝', '左右各一条'], ['个数', '卡特兰数']],
    counters: '解', legend: arrLegend4,
    inputs: [
      { label: 'n = 2', make: () => 2 },
      { label: 'n = 3', make: () => 3 },
    ],
    code: genParenCode, run: generateParenthesis,
  },
  {
    id: 'lc-word-search',
    group: '热门题',
    title: '79. 单词搜索',
    brief: '网格上的回溯：匹配到字符就占住（标记 #），四个方向继续找，走不通就撤销。不标记会走回头路。',
    view: 'board', facts: [['时间', 'O(行×列×4^L)'], ['空间', 'O(L)'], ['技巧', '原地标记 + 撤销'], ['坑', '忘了撤销']],
    counters: '走过', legend: [
      { cls: 'cell board', text: '格子' }, { cls: 'cell board is-settled', text: '已占住' },
      { cls: 'cell board is-active', text: '当前格' },
    ],
    inputs: [
      { label: 'ABCCED', make: () => 'ABCCED' },
      { label: 'SEE', make: () => 'SEE' },
      { label: 'ABCB（拼不出）', make: () => 'ABCB' },
    ],
    code: wordSearchCode, run: exist,
  },
  {
    id: 'lc-word-break',
    group: '热门题',
    title: '139. 单词拆分',
    brief: 'dp[i] 表示前 i 个字符能拆开。每个 i 回头看所有 j：dp[j] 成立且 s[j..i) 是词表里的词，dp[i] 就成立。',
    view: 'array', facts: [['时间', 'O(n²)'], ['空间', 'O(n)'], ['类型', '一维 DP'], ['坑', '只看词表长度范围']],
    counters: '检查', legend: arrLegend4,
    inputs: [
      { label: 'leetcode + [leet code]', make: () => ({ s: 'leetcode', words: ['leet', 'code'] }) },
      { label: 'applepenapple', make: () => ({ s: 'applepenapple', words: ['apple', 'pen'] }) },
      { label: '拆不开', make: () => ({ s: 'catsandog', words: ['cats', 'dog', 'sand', 'and', 'cat'] }) },
    ],
    code: wordBreakCode, run: wordBreak,
  },
];
