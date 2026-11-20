/**
 * LeetCode 高频题（第七批，扩到 100 道的第二批）。
 */

const L = [
  { cls: 'bar', text: '元素' },
  { cls: 'bar is-compare', text: '正在看' },
  { cls: 'bar is-pivot', text: '当前处理' },
  { cls: 'bar is-settled', text: '已确定' },
];

const C = [
  { cls: 'cell', text: '格子' },
  { cls: 'cell is-active', text: '当前格' },
  { cls: 'cell is-move', text: '要置零' },
  { cls: 'cell is-settled', text: '已处理' },
];

// ── 448. 找到所有数组中消失的数字 ────────────────────────
const disappearedCode = [
  'function findDisappeared(nums) {',
  '  const n = nums.length;',
  '  for (const x of nums) {',
  '    const i = (x - 1) % n;',
  '    nums[i] += n;              // 出现过的打个标记',
  '  }',
  '  const res = [];',
  '  for (let i = 0; i < n; i++) if (nums[i] <= n) res.push(i + 1);',
  '  return res;',
  '}',
];

function findDisappeared(input) {
  const a = input.slice();
  const n = a.length;
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { values: a.map((v) => ((v - 1) % n) + 1), ...state },
    note, line, counters: { 标记: 0 },
  });

  push({}, `值域是 1..${n}。出现过的数就让下标 x-1 加上 n 作标记，最后扫一遍谁没被加过。O(n) 时间 O(1) 空间。`, 0);
  for (let k = 0; k < n; k++) {
    const idx = (a[k] - 1) % n;
    a[idx] += n;
    push({ pivot: idx }, `${a[k] - n} 出现过，给下标 ${idx} 加 ${n} 作标记。`, 3);
  }

  const res = [];
  for (let i = 0; i < n; i++) {
    if (a[i] <= n) res.push(i + 1);
  }
  push({ settled: res.map((v) => v - 1) }, `没被标记的下标对应 ${res.join(',') || '（无）'}。`, 7);
  return { steps, result: { arr: res.join(',') } };
}

// ── 560. 和为 K 的子数组 ────────────────────────────────
const subarraySumCode = [
  'function subarraySum(nums, k) {',
  '  const seen = new Map([[0, 1]]);   // 前缀和 -> 出现次数',
  '  let sum = 0, count = 0;',
  '  for (const x of nums) {',
  '    sum += x;',
  '    count += seen.get(sum - k) || 0;   // 之前有没有 sum-k',
  '    seen.set(sum, (seen.get(sum) || 0) + 1);',
  '  }',
  '  return count;',
  '}',
];

function subarraySum(input) {
  const { nums, k } = input;
  const seen = new Map([[0, 1]]);
  const steps = [];
  let sum = 0;
  let count = 0;
  const push = (state, note, line) => steps.push({
    state: { values: nums, container: { label: '前缀和 → 次数', items: [...seen.entries()].map(([s, c]) => ({ text: `${s}:${c}` })) }, ...state },
    note, line, counters: { 命中: count },
  });

  push({}, `子数组和 = 两个前缀和之差。所以扫一遍，边走边查"前面有没有 sum-k 这个前缀和"。`, 0);
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    const hit = seen.get(sum - k) || 0;
    count += hit;
    push({ current: i, pivot: i }, `前缀和 ${sum}，要凑 k=${k} 需要之前的 ${sum - k}，出现过 ${hit} 次。`, 5);
    seen.set(sum, (seen.get(sum) || 0) + 1);
    push({ current: i }, `把前缀和 ${sum} 记一次。`, 6);
  }
  push({}, `共 ${count} 个和为 ${k} 的子数组。`, 7);
  return { steps, result: { count } };
}

// ── 209. 长度最小的子数组 ───────────────────────────────
const minSubArrayCode = [
  'function minSubArrayLen(target, nums) {',
  '  let left = 0, sum = 0, best = Infinity;',
  '  for (let right = 0; right < nums.length; right++) {',
  '    sum += nums[right];',
  '    while (sum >= target) {                  // 满足就试着缩短',
  '      best = Math.min(best, right - left + 1);',
  '      sum -= nums[left++];',
  '    }',
  '  }',
  '  return best === Infinity ? 0 : best;',
  '}',
];

function minSubArray(input) {
  const { target, nums } = input;
  const steps = [];
  let left = 0;
  let sum = 0;
  let best = Infinity;
  const push = (state, note, line) => steps.push({
    state: { values: nums, window: { lo: left, hi: state?.hi ?? left }, container: { label: '和 / 最短', items: [{ text: String(sum), hot: true }, { text: best === Infinity ? '∞' : String(best) }] }, ...state },
    note, line, counters: { 收缩: 0 },
  });

  push({}, `滑动窗口：右边界一直加，一旦和不小于 target 就收缩左边界，同时更新最短长度。`, 2);
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    push({ hi: right, pivot: right }, `右边界扩到 ${right}，当前和 ${sum}。`, 3);
    while (sum >= target) {
      best = Math.min(best, right - left + 1);
      push({ hi: right, move: [left] }, `和不小于 ${target}，长度 ${right - left + 1}，最短更新为 ${best === Infinity ? '∞' : best}；左边界右移。`, 5);
      sum -= nums[left];
      left += 1;
    }
  }
  push({}, best === Infinity ? `没有和不小于 ${target} 的子数组。` : `最短长度是 ${best}。`, 8);
  return { steps, result: { len: best === Infinity ? 0 : best } };
}

// ── 485. 最大连续 1 的个数 ──────────────────────────────
const maxConsecutiveCode = [
  'function findMaxConsecutiveOnes(nums) {',
  '  let cur = 0, best = 0;',
  '  for (const x of nums) {',
  '    cur = x === 1 ? cur + 1 : 0;',
  '    best = Math.max(best, cur);',
  '  }',
  '  return best;',
  '}',
];

function maxConsecutive(nums) {
  const steps = [];
  let cur = 0;
  let best = 0;
  const push = (state, note, line) => steps.push({
    state: { values: nums, container: { label: '当前 / 最大', items: [{ text: String(cur), hot: true }, { text: String(best) }] }, ...state },
    note, line, counters: { 访问: 0 },
  });

  push({}, '一次遍历：遇到 1 就累加，遇到 0 就归零，随时记录最大值。', 1);
  for (let i = 0; i < nums.length; i++) {
    cur = nums[i] === 1 ? cur + 1 : 0;
    best = Math.max(best, cur);
    push({ current: i, pivot: i }, `${nums[i]} → 当前 ${cur}，最大 ${best}。`, 3);
  }
  push({ settled: nums.map((_, i) => i) }, `最长连续 1 的个数是 ${best}。`, 5);
  return { steps, result: { max: best } };
}

// ── 724. 寻找数组的中心下标 ─────────────────────────────
const pivotIndexCode = [
  'function pivotIndex(nums) {',
  '  const total = nums.reduce((a, b) => a + b, 0);',
  '  let left = 0;',
  '  for (let i = 0; i < nums.length; i++) {',
  '    if (left === total - left - nums[i]) return i;',
  '    left += nums[i];',
  '  }',
  '  return -1;',
  '}',
];

function pivotIndex(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  const steps = [];
  let left = 0;
  const push = (state, note, line) => steps.push({
    state: { values: nums, container: { label: '左和 / 总和', items: [{ text: String(left), hot: true }, { text: String(total) }] }, ...state },
    note, line, counters: { 比较: 0 },
  });

  push({}, `先算总和，再从左往右走：左边和 == 总和 - 左边和 - 当前值，就是中心下标。`, 0);
  for (let i = 0; i < nums.length; i++) {
    if (left === total - left - nums[i]) {
      push({ current: i, pivot: i }, `下标 ${i}：左边和 ${left}，右边和 ${total - left - nums[i]}，相等。`, 3);
      return { steps, result: { idx: i } };
    }
    left += nums[i];
    push({ current: i }, `下标 ${i} 不满足，左边和累加到 ${left}。`, 5);
  }
  push({}, '没有中心下标。', 6);
  return { steps, result: { idx: -1 } };
}

// ── 118. 杨辉三角 ───────────────────────────────────────
const pascalCode = [
  'function generate(n) {',
  '  const res = [];',
  '  for (let i = 0; i < n; i++) {',
  '    const row = new Array(i + 1).fill(1);',
  '    for (let j = 1; j < i; j++) row[j] = res[i - 1][j - 1] + res[i - 1][j];',
  '    res.push(row);',
  '  }',
  '  return res;',
  '}',
];

function generate(n) {
  const res = [];
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { values: state?.row ?? [1], ...state },
    note, line, counters: { 行数: res.length },
  });

  push({ row: [1] }, `第 0 行是 [1]。每行首尾是 1，中间每个数等于上一行相邻两个数之和。`, 0);
  res.push([1]);
  for (let i = 1; i < n; i++) {
    const row = new Array(i + 1).fill(1);
    for (let j = 1; j < i; j++) row[j] = res[i - 1][j - 1] + res[i - 1][j];
    res.push(row);
    push({ row, pivot: row.length - 1 }, `第 ${i} 行：${row.join(', ')}。`, 4);
  }
  push({ row: res[res.length - 1] ?? [1] }, `共 ${n} 行，最后一行是 ${(res[res.length - 1] ?? []).join(', ')}。`, 6);
  return { steps, result: { arr: (res[res.length - 1] ?? []).join(',') } };
}

// ── 73. 矩阵置零 ────────────────────────────────────────
const setZeroCode = [
  'function setZeroes(m) {',
  '  const rows = new Set(), cols = new Set();',
  '  for (r) for (c) if (m[r][c] === 0) { rows.add(r); cols.add(c); }   // 先记录',
  '  for (r) for (c) if (rows.has(r) || cols.has(c)) m[r][c] = 0;        // 再置零',
  '}',
];

const ZERO_M = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
];

function setZeroes() {
  const m = ZERO_M.map((r) => r.slice());
  const steps = [];
  const rows = new Set();
  const cols = new Set();
  const push = (state, note, line) => steps.push({
    state: {
      cells: m.map((r) => r.slice()),
      rowHead: m.map((_, i) => `行${i}`),
      colHead: m[0].map((_, i) => `列${i}`),
      filled: m.flatMap((row, r) => row.map((_, c) => [r, c])),
      ...state,
    },
    note, line, counters: { 行: rows.size, 列: cols.size },
  });

  push({}, '不能边扫边置零——会把后面本来不是零的格子也误判成零。必须先记录哪些行和列要清零。', 1);
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m[0].length; c++) {
      if (m[r][c] === 0) { rows.add(r); cols.add(c); }
    }
  }
  push({ done: [...rows].flatMap((r) => m[0].map((_, c) => [r, c])) }, `第 ${[...rows].join('、')} 行和第 ${[...cols].join('、')} 列要清零。`, 2);
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m[0].length; c++) {
      if (rows.has(r) || cols.has(c)) m[r][c] = 0;
    }
  }
  push({}, `置零后：${m.map((r) => r.join(',')).join(' / ')}。`, 3);
  return { steps, result: { arr: m.flat().join(',') } };
}

// ── 58. 最后一个单词的长度 ──────────────────────────────
const lastWordCode = [
  'function lengthOfLastWord(s) {',
  '  let i = s.length - 1;',
  '  while (i >= 0 && s[i] === " ") i--;   // 跳过尾部空格',
  '  let len = 0;',
  '  while (i >= 0 && s[i] !== " ") { len++; i--; }',
  '  return len;',
  '}',
];

function lengthOfLastWord(input) {
  const chars = [...input];
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { chars, ...state }, note, line, counters: { 长度: 0 },
  });

  push({}, '从后往前：先跳过尾部空格，再数到上一个空格为止。', 0);
  let i = chars.length - 1;
  while (i >= 0 && chars[i] === ' ') i -= 1;
  push({ current: Math.max(i, 0) }, `尾部空格跳过，从下标 ${i} 开始数。`, 2);
  let len = 0;
  while (i >= 0 && chars[i] !== ' ') {
    len += 1;
    push({ settled: Array.from({ length: len }, (_, k) => i + k) }, `数到 "${chars[i]}"，长度 ${len}。`, 4);
    i -= 1;
  }
  push({}, `最后一个单词长度是 ${len}。`, 5);
  return { steps, result: { len } };
}

// ── 28. 找出字符串第一个匹配项 ─────────────────────────
const strStrCode = [
  'function strStr(haystack, needle) {',
  '  const n = needle.length;',
  '  for (let i = 0; i + n <= haystack.length; i++) {',
  '    if (haystack.slice(i, i + n) === needle) return i;',
  '  }',
  '  return -1;',
  '}',
];

function strStr(input) {
  const { haystack, needle } = input;
  const chars = [...haystack];
  const steps = [];
  const n = needle.length;
  const push = (state, note, line) => steps.push({
    state: { chars, ...state }, note, line, counters: { 尝试: 0 },
  });

  push({}, `朴素匹配：每个起点都拿 ${n} 个字符和 needle 比一次。最坏 O(m·n)，KMP 能到 O(m+n)。`, 0);
  for (let i = 0; i + n <= chars.length; i++) {
    const seg = chars.slice(i, i + n).join('');
    push({ window: { lo: i, hi: i + n - 1 }, pivot: i }, `从 ${i} 开始比："${seg}" vs "${needle}"。`, 3);
    if (seg === needle) {
      push({ window: { lo: i, hi: i + n - 1 }, settled: Array.from({ length: n }, (_, k) => i + k) }, `匹配上了，返回 ${i}。`, 3);
      return { steps, result: { idx: i } };
    }
  }
  push({}, `没找到，返回 -1。`, 5);
  return { steps, result: { idx: -1 } };
}

// ── 205. 同构字符串 ─────────────────────────────────────
const isomorphicCode = [
  'function isIsomorphic(s, t) {',
  '  const m1 = new Map(), m2 = new Map();',
  '  for (let i = 0; i < s.length; i++) {',
  '    if (m1.has(s[i]) && m1.get(s[i]) !== t[i]) return false;',
  '    if (m2.has(t[i]) && m2.get(t[i]) !== s[i]) return false;   // 双向都要查',
  '    m1.set(s[i], t[i]); m2.set(t[i], s[i]);',
  '  }',
  '  return true;',
  '}',
];

function isIsomorphic(input) {
  const { s, t } = input;
  const m1 = new Map();
  const m2 = new Map();
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: {
      chars: [...s],
      container: { label: 's → t / t → s', items: [...m1.entries()].map(([a, b]) => ({ text: `${a}→${b}` })) },
      ...state,
    },
    note, line, counters: { 映射: m1.size },
  });

  push({}, '双向映射：s 的字符到 t 要唯一，t 到 s 也要唯一。只查一边会把 "ab" 和 "aa" 误判成同构。', 0);
  for (let i = 0; i < s.length; i++) {
    if (m1.has(s[i]) && m1.get(s[i]) !== t[i]) {
      push({ compare: [i] }, `${s[i]} 之前映射到 ${m1.get(s[i])}，现在却是 ${t[i]}，不同构。`, 3);
      return { steps, result: { ok: 'false' } };
    }
    if (m2.has(t[i]) && m2.get(t[i]) !== s[i]) {
      push({ compare: [i] }, `${t[i]} 之前映射到 ${m2.get(t[i])}，现在却是 ${s[i]}，不同构。`, 4);
      return { steps, result: { ok: 'false' } };
    }
    m1.set(s[i], t[i]);
    m2.set(t[i], s[i]);
    push({ current: i }, `记录 ${s[i]}↔${t[i]}。`, 5);
  }
  push({}, '两个方向都对得上，是同构的。', 7);
  return { steps, result: { ok: 'true' } };
}

export const leetcode8Algorithms = [
  { id: 'lc-disappeared', group: '热门题', title: '448. 找到所有数组中消失的数字', brief: '值域是 1..n，所以让下标 x-1 加上 n 当标记。最后谁没被加过，谁就是消失的数字。原地，O(1) 额外空间。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1) 除结果'], ['技巧', '原地打标记']], counters: '标记', legend: L,
    inputs: [{ label: '4 3 2 7 8 2 3 1', make: () => [4, 3, 2, 7, 8, 2, 3, 1] }, { label: '1 1', make: () => [1, 1] }], code: disappearedCode, run: findDisappeared },
  { id: 'lc-subarray-sum', group: '热门题', title: '560. 和为 K 的子数组', brief: '子数组和 = 两个前缀和之差。扫一遍，边走边查"前面出现过几次 sum-k"。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(n)'], ['技巧', '前缀和 + 哈希']], counters: '命中', legend: L,
    inputs: [{ label: '1 1 1, k=2', make: () => ({ nums: [1, 1, 1], k: 2 }) }, { label: '1 2 3, k=3', make: () => ({ nums: [1, 2, 3], k: 3 }) }], code: subarraySumCode, run: subarraySum },
  { id: 'lc-min-subarray', group: '热门题', title: '209. 长度最小的子数组', brief: '滑动窗口：右边界一直加，一旦和不小于 target 就收缩左边界，同时更新最短长度。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['技巧', '滑动窗口']], counters: '收缩', legend: L,
    inputs: [{ label: 'target 7, 2 3 1 2 4 3', make: () => ({ target: 7, nums: [2, 3, 1, 2, 4, 3] }) }, { label: '凑不出来', make: () => ({ target: 100, nums: [1, 2, 3] }) }], code: minSubArrayCode, run: minSubArray },
  { id: 'lc-max-consecutive', group: '热门题', title: '485. 最大连续 1 的个数', brief: '一次遍历：遇到 1 就累加、遇到 0 就归零，随时记录最大值。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['技巧', '一次遍历']], counters: '访问', legend: L,
    inputs: [{ label: '1 1 0 1 1 1', make: () => [1, 1, 0, 1, 1, 1] }, { label: '全 0', make: () => [0, 0, 0] }], code: maxConsecutiveCode, run: maxConsecutive },
  { id: 'lc-pivot-index', group: '热门题', title: '724. 寻找数组的中心下标', brief: '先算总和，再从左往右走：左边和 == 总和 - 左边和 - 当前值 时就是中心下标。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['技巧', '前缀和']], counters: '比较', legend: L,
    inputs: [{ label: '1 7 3 6 5 6', make: () => [1, 7, 3, 6, 5, 6] }, { label: '没有中心', make: () => [1, 2, 3] }], code: pivotIndexCode, run: pivotIndex },
  { id: 'lc-pascal', group: '热门题', title: '118. 杨辉三角', growable: true, brief: '每行首尾是 1，中间每个数等于上一行相邻两数之和。', view: 'array', facts: [['时间', 'O(n²)'], ['空间', 'O(n²) 输出'], ['递推', '上一行相邻相加']], counters: '行数', legend: L,
    inputs: [{ label: '5 行', make: () => 5 }, { label: '1 行', make: () => 1 }], code: pascalCode, run: generate },
  { id: 'lc-set-zeroes', group: '热门题', title: '73. 矩阵置零', brief: '不能边扫边置零——会把后面本来不是零的格子误判。必须先记录要清零的行列，再统一置零。', view: 'table', facts: [['时间', 'O(m·n)'], ['空间', 'O(m+n)'], ['坑', '边扫边改']], counters: '行/列', legend: C,
    inputs: [{ label: '3×3 中间是 0', make: () => true }], code: setZeroCode, run: setZeroes },
  { id: 'lc-last-word', group: '热门题', title: '58. 最后一个单词的长度', brief: '从后往前：先跳过尾部空格，再数到上一个空格为止。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['坑', '尾部空格']], counters: '长度', legend: [{ cls: 'cell', text: '字符' }, { cls: 'cell is-settled', text: '已数到' }],
    inputs: [{ label: 'Hello World', make: () => 'Hello World' }, { label: '带尾部空格', make: () => '   fly me   to   the moon  ' }], code: lastWordCode, run: lengthOfLastWord },
  { id: 'lc-strstr', group: '热门题', title: '28. 找出字符串第一个匹配项', brief: '朴素匹配每个起点比一次，最坏 O(m·n)。KMP 用 next 数组能到 O(m+n)——那个演示在"字符串"组里。', view: 'array', facts: [['时间', 'O(m·n) 朴素'], ['空间', 'O(1)'], ['优化', 'KMP O(m+n)']], counters: '尝试', legend: [{ cls: 'cell', text: '字符' }, { cls: 'cell is-settled', text: '匹配上了' }, { cls: 'cell is-active', text: '当前起点' }],
    inputs: [{ label: 'sadbutsad 找 sad', make: () => ({ haystack: 'sadbutsad', needle: 'sad' }) }, { label: '找不到', make: () => ({ haystack: 'leetcode', needle: 'leeto' }) }], code: strStrCode, run: strStr },
  { id: 'lc-isomorphic', group: '热门题', title: '205. 同构字符串', brief: '双向映射：s→t 要唯一，t→s 也要唯一。只查一边会把 "ab" 和 "aa" 误判成同构。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(字符集)'], ['坑', '只查单向']], counters: '映射', legend: [{ cls: 'cell', text: 's 的字符' }, { cls: 'cell is-active', text: '正在建立映射' }],
    inputs: [{ label: 'egg / add', make: () => ({ s: 'egg', t: 'add' }) }, { label: 'foo / bar', make: () => ({ s: 'foo', t: 'bar' }) }, { label: 'badc / baba', make: () => ({ s: 'badc', t: 'baba' }) }], code: isomorphicCode, run: isIsomorphic },
];
