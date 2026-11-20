/**
 * LeetCode 高频题（第五批，收尾）。
 *
 * 矩阵题复用表格视图（本来就支持任意网格 + 高亮），
 * 字符串题复用数组视图的字符模式，不需要新视图。
 */

const arrLegend5 = [
  { cls: 'bar', text: '元素' },
  { cls: 'bar is-compare', text: '正在看' },
  { cls: 'bar is-pivot', text: '当前处理' },
  { cls: 'bar is-settled', text: '已确定' },
];

const cellLegend = [
  { cls: 'cell', text: '格子' },
  { cls: 'cell is-active', text: '当前格' },
  { cls: 'cell is-compare', text: '依赖格' },
  { cls: 'cell is-settled', text: '已访问' },
];

let uid5 = 0;
const mkNode5 = (val, next = null) => ({ id: `m${++uid5}`, val, next });

// ── 41. 缺失的第一个正数 ────────────────────────────────

const firstMissingCode = [
  'function firstMissingPositive(nums) {',
  '  const n = nums.length;',
  '  for (let i = 0; i < n; i++) {',
  '    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {',
  '      [nums[nums[i] - 1], nums[i]] = [nums[i], nums[nums[i] - 1]];   // 把 x 放到下标 x-1',
  '    }',
  '  }',
  '  for (let i = 0; i < n; i++) if (nums[i] !== i + 1) return i + 1;',
  '  return n + 1;',
  '}',
];

function firstMissingPositive(input) {
  const a = input.slice();
  const n = a.length;
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { values: a.slice(), ...state },
    note,
    line,
    counters: { 交换: 0 },
  });

  push({}, '要求 O(1) 空间，所以就地"归位"：把值 x 换到下标 x-1 上。归好位以后，第一个对不上的下标就是答案。', 0);

  let swaps = 0;
  for (let i = 0; i < n; i++) {
    while (a[i] > 0 && a[i] <= n && a[a[i] - 1] !== a[i]) {
      const x = a[i];
      [a[x - 1], a[i]] = [a[i], a[x - 1]];
      swaps += 1;
      push({ move: [i, x - 1], pivot: i }, `${x} 应该在下标 ${x - 1}，换过去。`, 4);
    }
  }

  for (let i = 0; i < n; i++) {
    if (a[i] !== i + 1) {
      push({ settled: Array.from({ length: i }, (_, k) => k), compare: [i] },
        `下标 ${i} 上放的是 ${a[i]}，不是 ${i + 1}，所以缺失的最小正数是 ${i + 1}。`, 7);
      return { steps, result: { ans: i + 1 } };
    }
  }

  push({ settled: a.map((_, i) => i) }, `1..${n} 都在位，答案是 ${n + 1}。`, 8);
  return { steps, result: { ans: n + 1 } };
}

// ── 5. 最长回文子串 ────────────────────────────────────

const longestPalinCode = [
  'function longestPalindrome(s) {',
  '  let best = "";',
  '  for (let c = 0; c < s.length; c++) {',
  '    for (const half of [0, 1]) {            // 奇数长度 / 偶数长度',
  '      let l = c, r = c + half;',
  '      while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }',
  '      if (r - l - 1 > best.length) best = s.slice(l + 1, r);',
  '    }',
  '  }',
  '  return best;',
  '}',
];

function longestPalindrome(input) {
  const chars = [...input];
  const steps = [];
  let best = '';
  const push = (state, note, line) => steps.push({
    state: { chars, container: { label: '最长', items: best ? [...best].map((c) => ({ text: c })) : [] }, ...state },
    note,
    line,
    counters: { 中心: 0 },
  });

  push({}, '中心扩展：每个位置都当作中心往两边扩，奇数长度和偶数长度各试一次。O(n²)，比 DP 好写。', 0);

  for (let c = 0; c < chars.length; c++) {
    for (const half of [0, 1]) {
      let l = c;
      let r = c + half;
      while (l >= 0 && r < chars.length && chars[l] === chars[r]) {
        l -= 1;
        r += 1;
      }
      const len = r - l - 1;
      if (len > best.length) best = chars.slice(l + 1, r).join('');
      push({ window: { lo: l + 1, hi: r - 1 }, pivot: c },
        `以 ${c} 为中心（${half ? '偶数' : '奇数'}长）：扩出 "${chars.slice(l + 1, r).join('')}"，长 ${len}，目前最长 "${best}"。`, 5);
    }
  }

  push({}, `最长回文子串是 "${best}"。`, 7);
  return { steps, result: { len: best.length } };
}

// ── 14. 最长公共前缀 ───────────────────────────────────

const commonPrefixCode = [
  'function longestCommonPrefix(strs) {',
  '  if (!strs.length) return "";',
  '  let i = 0;',
  '  for (; i < strs[0].length; i++) {',
  '    const ch = strs[0][i];',
  '    for (const s of strs) if (s[i] !== ch) return strs[0].slice(0, i);',
  '  }',
  '  return strs[0];',
  '}',
];

function longestCommonPrefix(strs) {
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: {
      chars: [...(strs[0] ?? '')],
      container: { label: '词表', items: strs.map((s) => ({ text: s })) },
      ...state,
    },
    note,
    line,
    counters: { 列: 0 },
  });

  push({}, '以第一个串为基准，一列一列比。某一列有人对不上，答案就到此为止。', 0);

  let i = 0;
  outer:
  for (; i < (strs[0] ?? '').length; i++) {
    const ch = strs[0][i];
    for (const s of strs) {
      if (s[i] !== ch) {
        push({ compare: [i] }, `"${s}" 的第 ${i} 个字符不是 "${ch}"，前缀到此为止。`, 5);
        break outer;
      }
    }
    push({ settled: Array.from({ length: i + 1 }, (_, k) => k) }, `第 ${i} 列全是 "${ch}"，前缀可以再长一位。`, 4);
  }

  const ans = (strs[0] ?? '').slice(0, i);
  push({ settled: Array.from({ length: i }, (_, k) => k) }, `最长公共前缀是 "${ans}"。`, 7);
  return { steps, result: { prefix: ans } };
}

// ── 151. 反转字符串中的单词 ────────────────────────────

const reverseWordsCode = [
  'function reverseWords(s) {',
  '  return s.trim().split(/\\s+/).reverse().join(" ");',
  '}',
];

function reverseWords(input) {
  const words = input.trim().split(/\s+/);
  const chars = [...input];
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: {
      chars,
      container: { label: '去重后的词（已反转）', items: [...words].reverse().map((w) => ({ text: w })) },
      ...state,
    },
    note,
    line,
    counters: { 词数: words.length },
  });

  push({}, '三步：去掉首尾和多余空格、按空格切词、整体反转再拼回去。', 0);
  push({ container: { label: '切出来的词', items: words.map((w) => ({ text: w })) } }, `切出 ${words.length} 个词：${words.join(' | ')}。`, 0);
  push({ container: { label: '反转后', items: [...words].reverse().map((w) => ({ text: w })) } }, '顺序整个倒过来。', 0);

  const ans = [...words].reverse().join(' ');
  push({}, `结果："${ans}"。`, 0);
  return { steps, result: { out: ans } };
}

// ── 461 / 338. 位运算 ──────────────────────────────────

const hammingCode = [
  'function hammingDistance(x, y) {',
  '  let z = x ^ y, count = 0;',
  '  while (z) {',
  '    z &= z - 1;      // 抹掉最低位的 1',
  '    count++;',
  '  }',
  '  return count;',
  '}',
];

function hammingDistance(input) {
  const { x, y } = input;
  const steps = [];
  let z = x ^ y;
  let count = 0;
  const push = (state, note, line) => steps.push({
    state: {
      chars: [...z.toString(2).padStart(8, '0')],
      container: { label: 'z / 计数', items: [{ text: z.toString(2), hot: true }, { text: String(count) }] },
      ...state,
    },
    note,
    line,
    counters: { 消位: 0 },
  });

  push({}, `${x} ^ ${y} 得到 ${z}（二进制 ${z.toString(2)}）。异或后为 1 的位就是两数不同的位。`, 0);

  while (z) {
    const before = z;
    z &= z - 1;
    count += 1;
    push({}, `z = ${before.toString(2)}，抹掉最低位的 1 得 ${z.toString(2)}，计数 ${count}。`, 3);
  }

  push({}, `汉明距离是 ${count}。z & (z-1) 每次消掉一个 1，所以循环次数就是 1 的个数。`, 5);
  return { steps, result: { dist: count } };
}

const countBitsCode = [
  'function countBits(n) {',
  '  const dp = new Array(n + 1).fill(0);',
  '  for (let i = 1; i <= n; i++) {',
  '    dp[i] = dp[i >> 1] + (i & 1);   // 右移一位的答案 + 最低位',
  '  }',
  '  return dp;',
  '}',
];

function countBits(n) {
  const dp = new Array(n + 1).fill(0);
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { values: dp.slice(), ...state },
    note,
    line,
    counters: { 填表: 0 },
  });

  push({}, 'dp[i] = dp[i >> 1] + (i & 1)：把 i 右移一位，只多了一个最低位。这样 O(n) 就能算出 0..n 的答案。', 0);

  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1);
    push({ current: i, deps: [i >> 1], pivot: i }, `dp[${i}] = dp[${i >> 1}] + (${i} & 1) = ${dp[i]}。`, 3);
  }

  push({ settled: dp.map((_, i) => i) }, `结果：${dp.join(', ')}。`, 5);
  return { steps, result: { arr: dp.join(',') } };
}

// ── 54. 螺旋矩阵 ───────────────────────────────────────

const spiralCode = [
  'function spiralOrder(m) {',
  '  const out = [];',
  '  let top = 0, bottom = m.length - 1, left = 0, right = m[0].length - 1;',
  '  while (top <= bottom && left <= right) {',
  '    for (let c = left; c <= right; c++) out.push(m[top][c]);   top++;',
  '    for (let r = top; r <= bottom; r++) out.push(m[r][right]); right--;',
  '    if (top <= bottom) { for (let c = right; c >= left; c--) out.push(m[bottom][c]); bottom--; }',
  '    if (left <= right) { for (let r = bottom; r >= top; r--) out.push(m[r][left]); left++; }',
  '  }',
  '  return out;',
  '}',
];

const SPIRAL_M = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

function spiralOrder() {
  const m = SPIRAL_M;
  const out = [];
  const visited = [];
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: {
      cells: m.map((r) => r.slice()),
      rowHead: m.map((_, i) => `行${i}`),
      colHead: m[0].map((_, i) => `列${i}`),
      filled: m.flatMap((row, r) => row.map((_, c) => [r, c])),
      done: visited.slice(),
      container: { label: '输出', items: out.map((v) => ({ text: String(v) })) },
      ...state,
    },
    note,
    line,
    counters: { 已输出: out.length },
  });

  push({}, '四条边轮流走：上边左→右、右边上→下、下边右→左、左边下→上。走完就收缩边界。', 1);

  let top = 0;
  let bottom = m.length - 1;
  let left = 0;
  let right = m[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) { out.push(m[top][c]); visited.push([top, c]); }
    push({ current: [top, Math.min(right, m[0].length - 1)] }, `走完上边，输出 ${out.join(',')}。`, 4);
    top += 1;
    for (let r = top; r <= bottom; r++) { out.push(m[r][right]); visited.push([r, right]); }
    if (top <= bottom + 1) push({ current: [Math.max(top, 0), right] }, `走完右边。`, 5);
    right -= 1;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) { out.push(m[bottom][c]); visited.push([bottom, c]); }
      push({ current: [bottom, Math.max(left, 0)] }, `走完下边。`, 6);
      bottom -= 1;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) { out.push(m[r][left]); visited.push([r, left]); }
      push({ current: [Math.max(top, 0), left] }, `走完左边，一圈结束。`, 7);
      left += 1;
    }
  }

  push({}, `螺旋顺序：${out.join(', ')}。`, 9);
  return { steps, result: { out: out.join(',') } };
}

// ── 48. 旋转图像 ───────────────────────────────────────

const rotateImageCode = [
  'function rotate(m) {',
  '  const n = m.length;',
  '  for (let i = 0; i < n; i++)                 // 先沿主对角线翻转',
  '    for (let j = i + 1; j < n; j++) [m[i][j], m[j][i]] = [m[j][i], m[i][j]];',
  '  for (let i = 0; i < n; i++)                 // 再每行左右翻转',
  '    m[i].reverse();',
  '}',
];

const ROTATE_M = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

function rotateImage() {
  const m = ROTATE_M.map((r) => r.slice());
  const n = m.length;
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: {
      cells: m.map((r) => r.slice()),
      rowHead: Array.from({ length: n }, (_, i) => `行${i}`),
      colHead: Array.from({ length: n }, (_, i) => `列${i}`),
      filled: m.flatMap((row, r) => row.map((_, c) => [r, c])),
      ...state,
    },
    note,
    line,
    counters: { 交换: 0 },
  });

  push({}, '顺时针旋转 90° = 先沿主对角线转置，再每行左右翻转。两步都是原地交换。', 0);

  let swaps = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [m[i][j], m[j][i]] = [m[j][i], m[i][j]];
      swaps += 1;
      push({ current: [i, j], deps: [[j, i]] }, `转置：a[${i}][${j}] 和 a[${j}][${i}] 交换。`, 3);
    }
  }

  for (let i = 0; i < n; i++) {
    m[i].reverse();
    push({ current: [i, n - 1] }, `第 ${i} 行左右翻转。`, 5);
  }

  push({}, `结果：${m.flat().join(', ')}（按行读）。`, 5);
  return { steps, result: { arr: m.flat().join(',') } };
}

// ── 240. 搜索二维矩阵 II ───────────────────────────────

const searchMatrixCode = [
  'function searchMatrix(m, target) {',
  '  let r = 0, c = m[0].length - 1;      // 从右上角出发',
  '  while (r < m.length && c >= 0) {',
  '    if (m[r][c] === target) return true;',
  '    if (m[r][c] > target) c--;         // 这一列下面都更大，往左',
  '    else r++;                          // 这一行左边都更小，往下',
  '  }',
  '  return false;',
  '}',
];

const SORTED_M = [
  [1, 4, 7, 11],
  [2, 5, 8, 12],
  [3, 6, 9, 16],
  [10, 13, 14, 17],
];

function searchMatrix(target) {
  const m = SORTED_M;
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: {
      cells: m.map((r) => r.slice()),
      rowHead: Array.from({ length: m.length }, (_, i) => `行${i}`),
      colHead: Array.from({ length: m[0].length }, (_, i) => `列${i}`),
      filled: m.flatMap((row, r) => row.map((_, c) => [r, c])),
      container: { label: '目标', items: [{ text: String(target), hot: true }] },
      ...state,
    },
    note,
    line,
    counters: { 步数: 0 },
  });

  push({}, '从右上角出发：这个位置往左都更小、往下都更大，所以每比较一次就能排除一整行或一整列。', 1);

  let r = 0;
  let c = m[0].length - 1;
  let steps2 = 0;
  while (r < m.length && c >= 0) {
    steps2 += 1;
    push({ current: [r, c] }, `看 (${r},${c}) = ${m[r][c]}，与目标 ${target} 比较。`, 3);
    if (m[r][c] === target) {
      push({ current: [r, c], done: [[r, c]] }, `命中 (${r},${c})。`, 3);
      return { steps, result: { ok: 'true' } };
    }
    if (m[r][c] > target) c -= 1;
    else r += 1;
  }

  push({}, `越界了，${target} 不在矩阵里。`, 6);
  return { steps, result: { ok: 'false' } };
}

// ── 23. 合并 K 个升序链表 ──────────────────────────────

const mergeKCode = [
  'function mergeKLists(lists) {',
  '  const heap = new MinHeap();               // 里面有 k 个"当前头"',
  '  for (const h of lists) if (h) heap.push(h);',
  '  const dummy = {}; let tail = dummy;',
  '  while (heap.size) {',
  '    const node = heap.pop();                // 每次取最小的头',
  '    tail.next = node; tail = node;',
  '    if (node.next) heap.push(node.next);    // 它的下一个补进堆',
  '  }',
  '  return dummy.next;',
  '}',
];

function mergeKLists(input) {
  const lists = input;
  const heads = lists.map((vals) => {
    const nodes = vals.map((v) => mkNode5(v));
    nodes.forEach((n, i) => { n.next = nodes[i + 1] ?? null; });
    return nodes[0] ?? null;
  });

  const out = [];
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
      nodes: [...heads, ...out].filter(Boolean).map((n) => ({ id: n.id, val: n.val, next: n.next ? n.next.id : null })),
      rows: [...heads.map((h) => ids(h)), out.map((n) => n.id)],
      rowLabels: [...lists.map((_, i) => `L${i}`), '结果'],
      ...state,
    },
    note,
    line,
    counters: { 已合并: out.length },
  });

  push({}, `${lists.length} 条升序链表，每次取所有"当前头"里最小的那个接到结果上。用堆的话是 O(N log k)。`, 0);

  let tail = null;
  while (true) {
    let best = -1;
    for (let i = 0; i < heads.length; i++) {
      if (!heads[i]) continue;
      if (best < 0 || heads[i].val < heads[best].val) best = i;
    }
    if (best < 0) break;
    const node = heads[best];
    heads[best] = node.next;
    out.push(node);
    if (tail) tail.next = node;
    tail = node;
    push({ highlight: [node.id] }, `最小的头是 L${best} 的 ${node.val}，接到结果上。`, 5);
  }

  push({}, `合并完成，共 ${out.length} 个节点。`, 7);
  return { steps, result: { arr: out.map((n) => n.val).join(',') } };
}

export const leetcode5Algorithms = [
  {
    id: 'lc-first-missing',
    group: '热门题',
    title: '41. 缺失的第一个正数',
    brief: '要求 O(1) 空间，所以就地归位：把值 x 换到下标 x-1。归完位第一个对不上的下标就是答案。',
    view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['技巧', '原地哈希'], ['范围', '答案一定在 1..n+1']],
    counters: '交换', legend: arrLegend5,
    inputs: [
      { label: '3 4 -1 1', make: () => [3, 4, -1, 1] },
      { label: '1 2 0', make: () => [1, 2, 0] },
      { label: '7 8 9 11 12', make: () => [7, 8, 9, 11, 12] },
    ],
    code: firstMissingCode, run: firstMissingPositive,
  },
  {
    id: 'lc-longest-palindrome',
    group: '热门题',
    title: '5. 最长回文子串',
    brief: '中心扩展：每个位置当中心往两边扩，奇数长和偶数长各试一次。O(n²)，比区间 DP 好写也好记。',
    view: 'array', facts: [['时间', 'O(n²)'], ['空间', 'O(1)'], ['方法', '中心扩展'], ['对比', 'Manacher O(n)']],
    counters: '中心', legend: arrLegend5,
    inputs: [
      { label: 'babad', make: () => 'babad' },
      { label: 'cbbd', make: () => 'cbbd' },
    ],
    code: longestPalinCode, run: longestPalindrome,
  },
  {
    id: 'lc-common-prefix',
    group: '热门题',
    title: '14. 最长公共前缀',
    brief: '以第一个串为基准，一列一列往下比。某一列有人对不上，前缀就到头了。',
    view: 'array', facts: [['时间', 'O(n·m)'], ['空间', 'O(1)'], ['技巧', '按列比较'], ['注意', '空数组']],
    counters: '列', legend: [
      { cls: 'cell', text: '首串字符' }, { cls: 'cell is-settled', text: '确认相同' }, { cls: 'cell is-compare', text: '对不上' },
    ],
    inputs: [
      { label: 'flower flow flight', make: () => ['flower', 'flow', 'flight'] },
      { label: 'dog racecar car', make: () => ['dog', 'racecar', 'car'] },
    ],
    code: commonPrefixCode, run: longestCommonPrefix,
  },
  {
    id: 'lc-reverse-words',
    group: '热门题',
    title: '151. 反转字符串中的单词',
    brief: '去掉多余空格、按空格切词、整体反转再拼回去。注意要处理首尾和连续空格。',
    view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(n)'], ['坑', '多余空格'], ['变体', '原地 O(1) 版本']],
    counters: '词数', legend: [
      { cls: 'cell', text: '原串字符' },
    ],
    inputs: [
      { label: 'the sky is blue', make: () => 'the sky is blue' },
      { label: '  多空格  hello   world  ', make: () => '  hello   world  ' },
    ],
    code: reverseWordsCode, run: reverseWords,
  },
  {
    id: 'lc-hamming',
    group: '热门题',
    title: '461. 汉明距离',
    brief: '先异或，再数有几个 1。z & (z-1) 每次抹掉最低位的 1，循环次数就是 1 的个数。',
    view: 'array', facts: [['时间', 'O(1) 位宽'], ['空间', 'O(1)'], ['技巧', 'z & (z-1)'], ['口诀', '异或数 1']],
    counters: '消位', legend: [{ cls: 'cell', text: '二进制位' }],
    inputs: [
      { label: '1 和 4', make: () => ({ x: 1, y: 4 }) },
      { label: '3 和 1', make: () => ({ x: 3, y: 1 }) },
    ],
    code: hammingCode, run: hammingDistance,
  },
  {
    id: 'lc-count-bits',
    group: '热门题',
    title: '338. 比特位计数',
    brief: 'dp[i] = dp[i >> 1] + (i & 1)：右移一位的答案只多一个最低位。O(n) 一次算出 0..n 全部答案。',
    view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(n)'], ['递推', 'i>>1 与 i&1'], ['对比', '逐个算 O(n log n)']],
    counters: '填表', legend: arrLegend5,
    inputs: [
      { label: 'n = 5', make: () => 5 },
      { label: 'n = 8', make: () => 8 },
    ],
    code: countBitsCode, run: countBits,
  },
  {
    id: 'lc-spiral',
    group: '热门题',
    title: '54. 螺旋矩阵',
    brief: '上边左→右、右边上→下、下边右→左、左边下→上，走完一条边就收缩边界。注意最后可能只剩一行或一列，别重复走。',
    view: 'table', facts: [['时间', 'O(m·n)'], ['空间', 'O(1)'], ['技巧', '四边界'], ['坑', '单行单列']],
    counters: '已输出', legend: cellLegend,
    inputs: [{ label: '3×3', make: () => true }],
    code: spiralCode, run: spiralOrder,
  },
  {
    id: 'lc-rotate-image',
    group: '热门题',
    title: '48. 旋转图像',
    brief: '顺时针 90° = 先沿主对角线转置，再每行左右翻转。两步都是原地交换，不用额外矩阵。',
    view: 'table', facts: [['时间', 'O(n²)'], ['空间', 'O(1)'], ['两步', '转置 + 反转每行'], ['方向', '顺时针']],
    counters: '交换', legend: cellLegend,
    inputs: [{ label: '3×3', make: () => true }],
    code: rotateImageCode, run: rotateImage,
  },
  {
    id: 'lc-search-matrix',
    group: '热门题',
    title: '240. 搜索二维矩阵 II',
    brief: '从右上角出发：往左都更小、往下都更大。每比较一次排除一整行或一整列，所以是 O(m+n)。',
    view: 'table', facts: [['时间', 'O(m+n)'], ['空间', 'O(1)'], ['起点', '右上角'], ['坑', '别从左上角']],
    counters: '步数', legend: cellLegend,
    inputs: [
      { label: '找 5', make: () => 5 },
      { label: '找 20（不存在）', make: () => 20 },
    ],
    code: searchMatrixCode, run: searchMatrix,
  },
  {
    id: 'lc-merge-k',
    group: '热门题',
    title: '23. 合并 K 个升序链表',
    brief: '每次从 k 条链的"当前头"里取最小的接到结果上。用最小堆是 O(N log k)，两两合并是 O(N log k) 但常数更大。',
    view: 'list', facts: [['时间', 'O(N log k)'], ['空间', 'O(k)'], ['结构', '最小堆 / 分治'], ['N', '总节点数']],
    counters: '已合并', legend: [{ cls: 'node', text: '节点' }, { cls: 'node is-active', text: '本次选中' }],
    inputs: [
      { label: '三条链', make: () => [[1, 4, 5], [1, 3, 4], [2, 6]] },
      { label: '含空链', make: () => [[], [1, 2], [3]] },
    ],
    code: mergeKCode, run: mergeKLists,
  },
];
