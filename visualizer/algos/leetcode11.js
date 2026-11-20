/**
 * LeetCode 高频题（第十批，收官）：字符串 1 + DP 5 + 数学 6。
 */

const L = [
  { cls: 'bar', text: '元素' },
  { cls: 'bar is-compare', text: '正在看' },
  { cls: 'bar is-pivot', text: '当前处理' },
  { cls: 'bar is-settled', text: '已确定' },
];

const CELL = [
  { cls: 'cell', text: '格子' },
  { cls: 'cell is-active', text: '正在算' },
  { cls: 'cell is-compare', text: '依赖格' },
  { cls: 'cell is-settled', text: '已填' },
];

// ── 383. 赎金信 ─────────────────────────────────────────
const ransomCode = [
  'function canConstruct(ransom, mag) {',
  '  const cnt = new Array(26).fill(0);',
  '  for (const ch of mag) cnt[ch.charCodeAt(0) - 97]++;',
  '  for (const ch of ransom) {',
  '    if (--cnt[ch.charCodeAt(0) - 97] < 0) return false;',
  '  }',
  '  return true;',
  '}',
];

function canConstruct(input) {
  const { ransom, mag } = input;
  const cnt = new Array(26).fill(0);
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: {
      chars: [...ransom],
      container: { label: '杂志字母余额（前 10 个）', items: cnt.slice(0, 10).map((v, i) => ({ text: `${String.fromCharCode(97 + i)}:${v}` })) },
      ...state,
    },
    note, line, counters: { 已用: 0 },
  });

  push({}, '先把杂志的字母数一遍，再拿赎金信去扣。扣成负数就说明不够。', 0);
  for (const ch of mag) cnt[ch.charCodeAt(0) - 97] += 1;
  push({}, `杂志统计完成。`, 2);

  let used = 0;
  for (let i = 0; i < ransom.length; i++) {
    cnt[ransom.charCodeAt(i) - 97] -= 1;
    used += 1;
    if (cnt[ransom.charCodeAt(i) - 97] < 0) {
      push({ compare: [i] }, `"${ransom[i]}" 不够用了，拼不出来。`, 4);
      return { steps, result: { ok: 'false' } };
    }
    push({ current: i, counters: { 已用: used } }, `用掉一个 "${ransom[i]}"。`, 4);
  }
  push({}, '字母够用，能拼出来。', 6);
  return { steps, result: { ok: 'true' } };
}

// ── 213. 打家劫舍 II ────────────────────────────────────
const rob2Code = [
  'function rob(nums) {',
  '  if (nums.length === 1) return nums[0];',
  '  const robLine = (arr) => {',
  '    let prev = 0, cur = 0;',
  '    for (const x of arr) { const t = Math.max(cur, prev + x); prev = cur; cur = t; }',
  '    return cur;',
  '  };',
  '  // 首尾不能同时偷：要么不偷第一家，要么不偷最后一家',
  '  return Math.max(robLine(nums.slice(0, -1)), robLine(nums.slice(1)));',
  '}',
];

function rob2(nums) {
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { values: nums, container: { label: '方案 A / 方案 B', items: [{ text: String(state?.a ?? 0), hot: true }, { text: String(state?.b ?? 0) }] }, ...state },
    note, line, counters: { 访问: 0 },
  });

  push({}, '房子围成一圈，首尾相邻。所以拆成两种：不偷第一家、不偷最后一家，取较大值。', 0);

  const robLine = (arr) => {
    let prev = 0;
    let cur = 0;
    for (const x of arr) {
      const t = Math.max(cur, prev + x);
      prev = cur;
      cur = t;
    }
    return cur;
  };

  const a = nums.length === 1 ? nums[0] : robLine(nums.slice(0, -1));
  push({ a }, `不偷最后一家：最多 ${a}。`, 7);
  const b = nums.length === 1 ? nums[0] : robLine(nums.slice(1));
  push({ a, b }, `不偷第一家：最多 ${b}。`, 7);
  const ans = Math.max(a, b);
  push({ a, b }, `取大的：${ans}。`, 8);
  return { steps, result: { ans } };
}

// ── 63. 不同路径 II ─────────────────────────────────────
const paths2Code = [
  'function uniquePathsWithObstacles(g) {',
  '  const dp = g.map((r) => r.map(() => 0));',
  '  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {',
  '    if (g[r][c] === 1) { dp[r][c] = 0; continue; }   // 障碍就是 0 条路',
  '    if (r === 0 && c === 0) { dp[r][c] = 1; continue; }',
  '    dp[r][c] = (r ? dp[r-1][c] : 0) + (c ? dp[r][c-1] : 0);',
  '  }',
  '  return dp[m-1][n-1];',
  '}',
];

const OBSTACLE_GRID = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
];

function uniquePathsWithObstacles() {
  const g = OBSTACLE_GRID;
  const m = g.length;
  const n = g[0].length;
  const dp = g.map((r) => r.map(() => 0));
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: {
      cells: dp.map((r) => r.slice()),
      rowHead: Array.from({ length: m }, (_, i) => `行${i}`),
      colHead: Array.from({ length: n }, (_, i) => `列${i}`),
      filled: g.flatMap((row, r) => row.map((_, c) => (g[r][c] === 1 ? -1 : [r, c]))).filter((v) => Array.isArray(v)),
      ...state,
    },
    note, line, counters: { 填表: 0 },
  });

  push({}, '有障碍的格子路径数是 0，其他格子和上一版一样：上面 + 左边。', 0);
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (g[r][c] === 1) {
        dp[r][c] = 0;
        push({ current: [r, c] }, `(${r},${c}) 是障碍，0 条路。`, 3);
        continue;
      }
      if (r === 0 && c === 0) { dp[r][c] = 1; push({ current: [r, c] }, '起点 1 条路。', 4); continue; }
      dp[r][c] = (r ? dp[r - 1][c] : 0) + (c ? dp[r][c - 1] : 0);
      push({ current: [r, c], deps: [[r - 1, c], [r, c - 1]].filter(([rr, cc]) => rr >= 0 && cc >= 0) },
        `(${r},${c}) = ${dp[r][c]}。`, 5);
    }
  }
  const ans = dp[m - 1][n - 1];
  push({}, `共 ${ans} 条不同的路。`, 7);
  return { steps, result: { paths: ans } };
}

// ── 64. 最小路径和 ──────────────────────────────────────
const minPathCode = [
  'function minPathSum(g) {',
  '  const dp = g.map((r) => r.slice());',
  '  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {',
  '    if (r === 0 && c === 0) continue;',
  '    dp[r][c] += Math.min(r ? dp[r-1][c] : Infinity, c ? dp[r][c-1] : Infinity);',
  '  }',
  '  return dp[m-1][n-1];',
  '}',
];

const COST_GRID = [
  [1, 3, 1],
  [1, 5, 1],
  [4, 2, 1],
];

function minPathSum() {
  const g = COST_GRID;
  const m = g.length;
  const n = g[0].length;
  const dp = g.map((r) => r.slice());
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: {
      cells: dp.map((r) => r.slice()),
      rowHead: Array.from({ length: m }, (_, i) => `行${i}`),
      colHead: Array.from({ length: n }, (_, i) => `列${i}`),
      filled: g.flatMap((row, r) => row.map((_, c) => [r, c])),
      ...state,
    },
    note, line, counters: { 填表: 0 },
  });

  push({}, '每个格子 = 自己 + 上面和左边里较小的那个。原地改，不用额外空间。', 0);
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (r === 0 && c === 0) continue;
      const up = r ? dp[r - 1][c] : Infinity;
      const left = c ? dp[r][c - 1] : Infinity;
      dp[r][c] += Math.min(up, left);
      push({ current: [r, c], deps: [[r - 1, c], [r, c - 1]].filter(([rr, cc]) => rr >= 0 && cc >= 0) },
        `(${r},${c})：上 ${up === Infinity ? '∞' : up}、左 ${left === Infinity ? '∞' : left}，取小的，得 ${dp[r][c]}。`, 4);
    }
  }
  push({}, `最小路径和 ${dp[m - 1][n - 1]}。`, 6);
  return { steps, result: { sum: dp[m - 1][n - 1] } };
}

// ── 1143. 最长公共子序列 ────────────────────────────────
const lcsCode = [
  'function longestCommonSubsequence(a, b) {',
  '  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));',
  '  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {',
  '    if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;',
  '    else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);',
  '  }',
  '  return dp[a.length][b.length];',
  '}',
];

function lcs(input) {
  const { a, b } = input;
  const A = [...a];
  const B = [...b];
  const dp = Array.from({ length: A.length + 1 }, () => new Array(B.length + 1).fill(0));
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: {
      cells: dp.map((r) => r.slice()),
      rowHead: ['∅', ...A],
      colHead: ['∅', ...B],
      filled: dp.flatMap((row, r) => row.map((_, c) => [r, c])),
      ...state,
    },
    note, line, counters: { 填表: 0 },
  });

  push({}, '二维 DP：字符相同就左上角加 1，不同就取上面和左边的较大值。', 0);
  for (let i = 1; i <= A.length; i++) {
    for (let j = 1; j <= B.length; j++) {
      if (A[i - 1] === B[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      push({ current: [i, j], deps: [[i - 1, j], [i, j - 1], [i - 1, j - 1]] },
        `${A[i - 1]} 对 ${B[j - 1]}：${A[i - 1] === B[j - 1] ? '相同，左上 +1' : '不同，取较大'} → ${dp[i][j]}。`, 4);
    }
  }
  push({}, `最长公共子序列长度 ${dp[A.length][B.length]}。`, 6);
  return { steps, result: { len: dp[A.length][B.length] } };
}

// ── 122. 买卖股票的最佳时机 II ──────────────────────────
const stock2Code = [
  'function maxProfit(prices) {',
  '  let profit = 0;',
  '  for (let i = 1; i < prices.length; i++) {',
  '    if (prices[i] > prices[i-1]) profit += prices[i] - prices[i-1];   // 只吃上涨段',
  '  }',
  '  return profit;',
  '}',
];

function maxProfit2(prices) {
  const steps = [];
  let profit = 0;
  const push = (state, note, line) => steps.push({
    state: { values: prices, container: { label: '累计收益', items: [{ text: String(profit), hot: true }] }, ...state },
    note, line, counters: { 上涨: 0 },
  });

  push({}, '可以买卖多次，所以把所有上涨段都吃下来就行。等价于"每天都比前一天贵就买"。', 0);
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1];
      push({ current: i, compare: [i - 1] }, `${prices[i - 1]} → ${prices[i]} 上涨，赚 ${prices[i] - prices[i - 1]}，累计 ${profit}。`, 3);
    } else {
      push({ current: i }, `不涨，跳过。`, 3);
    }
  }
  push({}, `最大收益 ${profit}。`, 5);
  return { steps, result: { profit } };
}

// ── 231. 2 的幂 ─────────────────────────────────────────
const powerOfTwoCode = [
  'function isPowerOfTwo(n) {',
  '  return n > 0 && (n & (n - 1)) === 0;   // 只有一个 1 才是 2 的幂',
  '}',
];

function isPowerOfTwo(n) {
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { chars: [...(n > 0 ? n.toString(2).padStart(8, '0') : '00000000')], container: { label: 'n', items: [{ text: String(n), hot: true }] }, ...state },
    note, line, counters: { 判断: 0 },
  });

  push({}, `${n} 的二进制是 ${n > 0 ? n.toString(2) : '—'}。2 的幂的二进制只有一个 1，所以 n & (n-1) 一定是 0。`, 0);
  const ok = n > 0 && (n & (n - 1)) === 0;
  push({}, ok ? `${n} 是 2 的幂。` : `${n} 不是 2 的幂。`, 1);
  return { steps, result: { ok: String(ok) } };
}

// ── 9. 回文数 ───────────────────────────────────────────
const palinNumCode = [
  'function isPalindrome(x) {',
  '  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;   // 负数、末尾是 0',
  '  let rev = 0;',
  '  while (x > rev) { rev = rev * 10 + x % 10; x = Math.floor(x / 10); }',
  '  return x === rev || x === Math.floor(rev / 10);',
  '}',
];

function isPalindromeNum(x) {
  const steps = [];
  let rev = 0;
  let cur = x;
  const push = (state, note, line) => steps.push({
    state: { container: { label: '原数 / 反转', items: [{ text: String(cur), hot: true }, { text: String(rev) }] }, ...state },
    note, line, counters: { 位: 0 },
  });

  push({}, '只反转一半就够：反转到反转值追上原数为止，再比较。负数直接不是回文。', 0);
  if (x < 0 || (x % 10 === 0 && x !== 0)) {
    push({}, `${x} ${x < 0 ? '是负数' : '末尾是 0'}，不可能是回文。`, 1);
    return { steps, result: { ok: 'false' } };
  }
  while (cur > rev) {
    rev = rev * 10 + (cur % 10);
    cur = Math.floor(cur / 10);
    push({}, `反转一位：剩 ${cur}，反转值 ${rev}。`, 4);
  }
  const ok = cur === rev || cur === Math.floor(rev / 10);
  push({}, ok ? `${x} 是回文数。` : `${x} 不是回文数。`, 4);
  return { steps, result: { ok: String(ok) } };
}

// ── 13. 罗马数字转整数 ──────────────────────────────────
const romanCode = [
  'function romanToInt(s) {',
  '  const val = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };',
  '  let sum = 0;',
  '  for (let i = 0; i < s.length; i++) {',
  '    // 小值在大值左边就是减，否则加',
  '    sum += val[s[i]] < val[s[i+1]] ? -val[s[i]] : val[s[i]];',
  '  }',
  '  return sum;',
  '}',
];

function romanToInt(s) {
  const val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const chars = [...s];
  const steps = [];
  let sum = 0;
  const push = (state, note, line) => steps.push({
    state: { chars, container: { label: '累计', items: [{ text: String(sum), hot: true }] }, ...state },
    note, line, counters: { 字符: 0 },
  });

  push({}, '规则只有一条：小的数字在大数字左边就减，否则加。IV = 5-1，VI = 5+1。', 0);
  for (let i = 0; i < chars.length; i++) {
    const cur = val[chars[i]];
    const nxt = val[chars[i + 1]] ?? 0;
    const add = cur < nxt ? -cur : cur;
    sum += add;
    push({ current: i }, `${chars[i]}：${add > 0 ? '加' : '减'} ${Math.abs(add)}，累计 ${sum}。`, 5);
  }
  push({}, `结果是 ${sum}。`, 6);
  return { steps, result: { num: sum } };
}

// ── 7. 整数反转 ─────────────────────────────────────────
const reverseIntCode = [
  'function reverse(x) {',
  '  let rev = 0;',
  '  while (x !== 0) {',
  '    rev = rev * 10 + (x % 10);',
  '    x = Math.trunc(x / 10);',
  '    if (rev < -2147483648 || rev > 2147483647) return 0;   // 溢出返回 0',
  '  }',
  '  return rev;',
  '}',
];

function reverseInt(x) {
  const steps = [];
  let rev = 0;
  let cur = x;
  const push = (state, note, line) => steps.push({
    state: { container: { label: '原数 / 反转', items: [{ text: String(cur), hot: true }, { text: String(rev) }] }, ...state },
    note, line, counters: { 位: 0 },
  });

  push({}, '每次取最后一位接到反转值后面。要注意溢出：超出 32 位范围就返回 0。', 0);
  while (cur !== 0) {
    rev = rev * 10 + (cur % 10);
    cur = Math.trunc(cur / 10);
    push({}, `取一位：剩 ${cur}，反转值 ${rev}。`, 3);
    if (rev < -2147483648 || rev > 2147483647) {
      push({}, `反转值 ${rev} 溢出，返回 0。`, 5);
      return { steps, result: { num: 0 } };
    }
  }
  push({}, `结果是 ${rev}。`, 7);
  return { steps, result: { num: rev } };
}

// ── 168. Excel 表列名称 ────────────────────────────────
const excelCode = [
  'function convertToTitle(n) {',
  '  let s = "";',
  '  while (n > 0) {',
  '    n -= 1;                                // 先减一，把 1..26 变成 0..25',
  '    s = String.fromCharCode(65 + (n % 26)) + s;',
  '    n = Math.floor(n / 26);',
  '  }',
  '  return s;',
  '}',
];

function convertToTitle(n) {
  const steps = [];
  let cur = n;
  let s = '';
  const push = (state, note) => steps.push({
    state: { container: { label: 'n / 结果', items: [{ text: String(cur), hot: true }, { text: s || '∅' }] }, ...state },
    note, line: 3, counters: { 位: s.length },
  });

  push({}, '这是 26 进制，但字母是 1..26 而不是 0..25，所以要先把 n 减一。', 3);
  while (cur > 0) {
    cur -= 1;
    const ch = String.fromCharCode(65 + (cur % 26));
    s = ch + s;
    cur = Math.floor(cur / 26);
    push({}, `取 ${ch}，剩下 ${cur}，结果 "${s}"。`);
  }
  push({}, `结果是 "${s}"。`);
  return { steps, result: { out: s } };
}

// ── 412. Fizz Buzz ──────────────────────────────────────
const fizzCode = [
  'function fizzBuzz(n) {',
  '  const out = [];',
  '  for (let i = 1; i <= n; i++) {',
  '    if (i % 15 === 0) out.push("FizzBuzz");',
  '    else if (i % 3 === 0) out.push("Fizz");',
  '    else if (i % 5 === 0) out.push("Buzz");',
  '    else out.push(String(i));',
  '  }',
  '  return out;',
  '}',
];

function fizzBuzz(n) {
  const out = [];
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { values: new Array(n).fill(0).map((_, i) => i + 1), container: { label: '输出', items: out.map((t) => ({ text: t })) }, ...state },
    note, line, counters: { 已生成: out.length },
  });

  push({}, '先判 15 的倍数——如果先判 3 或 5，"FizzBuzz"永远轮不到。', 2);
  for (let i = 1; i <= n; i++) {
    let t;
    if (i % 15 === 0) t = 'FizzBuzz';
    else if (i % 3 === 0) t = 'Fizz';
    else if (i % 5 === 0) t = 'Buzz';
    else t = String(i);
    out.push(t);
    push({ current: i - 1, pivot: i - 1 }, `${i} → ${t}。`, i % 15 === 0 ? 3 : 4);
  }
  push({}, `共 ${n} 项。`, 8);
  return { steps, result: { out: out.join(',') } };
}

export const leetcode11Algorithms = [
  { id: 'lc-ransom', group: '热门题', title: '383. 赎金信', brief: '先把杂志字母数一遍，再拿赎金信去扣；扣成负数就是不够。', view: 'array', facts: [['时间', 'O(m+n)'], ['空间', 'O(1) 26 个桶'], ['技巧', '计数']], counters: '已用', legend: [{ cls: 'cell', text: '赎金信字符' }],
    inputs: [{ label: 'aa / aab', make: () => ({ ransom: 'aa', mag: 'aab' }) }, { label: 'aa / ab', make: () => ({ ransom: 'aa', mag: 'ab' }) }], code: ransomCode, run: canConstruct },
  { id: 'lc-rob-2', group: '热门题', title: '213. 打家劫舍 II', brief: '房子围成圈，首尾相邻。拆成"不偷第一家"和"不偷最后一家"两种情况取较大值。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['技巧', '环形拆两条线']], counters: '访问', legend: L,
    inputs: [{ label: '2 3 2', make: () => [2, 3, 2] }, { label: '1 2 3 1', make: () => [1, 2, 3, 1] }], code: rob2Code, run: rob2 },
  { id: 'lc-unique-paths-2', group: '热门题', title: '63. 不同路径 II', brief: '有障碍的格子路径数是 0，其余和上一版一样：上面 + 左边。', view: 'table', facts: [['时间', 'O(m·n)'], ['空间', 'O(m·n)'], ['坑', '障碍格清零']], counters: '填表', legend: CELL,
    inputs: [{ label: '中间有障碍', make: () => true }], code: paths2Code, run: uniquePathsWithObstacles },
  { id: 'lc-min-path-sum', group: '热门题', title: '64. 最小路径和', brief: '每个格子 = 自己 + 上面和左边较小的那个。原地改，不用额外空间。', view: 'table', facts: [['时间', 'O(m·n)'], ['空间', 'O(1) 原地']], counters: '填表', legend: CELL,
    inputs: [{ label: '3×3', make: () => true }], code: minPathCode, run: minPathSum },
  { id: 'lc-lcs', group: '热门题', title: '1143. 最长公共子序列', brief: '字符相同就左上角加 1，不同就取上面和左边的较大值。', view: 'table', facts: [['时间', 'O(m·n)'], ['空间', 'O(m·n)'], ['转移', '相同左上+1 / 不同取大']], counters: '填表', legend: CELL,
    inputs: [{ label: 'abcde / ace', make: () => ({ a: 'abcde', b: 'ace' }) }, { label: 'abc / abc', make: () => ({ a: 'abc', b: 'abc' }) }], code: lcsCode, run: lcs },
  { id: 'lc-stock-2', group: '热门题', title: '122. 买卖股票的最佳时机 II', brief: '可以买卖多次，把所有上涨段都吃下来就行。贪心，O(n)。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['对比', '121 只能交易一次']], counters: '上涨', legend: L,
    inputs: [{ label: '7 1 5 3 6 4', make: () => [7, 1, 5, 3, 6, 4] }, { label: '一路涨', make: () => [1, 2, 3, 4, 5] }], code: stock2Code, run: maxProfit2 },
  { id: 'lc-power-of-two', group: '热门题', title: '231. 2 的幂', brief: '2 的幂的二进制只有一个 1，所以 n & (n-1) 一定为 0。', view: 'array', facts: [['时间', 'O(1)'], ['空间', 'O(1)'], ['技巧', 'n & (n-1)']], counters: '判断', legend: [{ cls: 'cell', text: '二进制位' }],
    inputs: [{ label: '16', make: () => 16 }, { label: '18', make: () => 18 }], code: powerOfTwoCode, run: isPowerOfTwo },
  { id: 'lc-palindrome-number', group: '热门题', title: '9. 回文数', brief: '只反转一半就够：反转到追上原数为止再比较。负数直接不是。', view: 'array', facts: [['时间', 'O(log n)'], ['空间', 'O(1)'], ['技巧', '反转一半']], counters: '位', legend: [],
    inputs: [{ label: '121', make: () => 121 }, { label: '-121', make: () => -121 }, { label: '10', make: () => 10 }], code: palinNumCode, run: isPalindromeNum },
  { id: 'lc-roman', group: '热门题', title: '13. 罗马数字转整数', brief: '规则只有一条：小的数字在大数字左边就减，否则加。IV = 5-1，VI = 5+1。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['规则', '左小则减']], counters: '字符', legend: [{ cls: 'cell', text: '罗马字符' }],
    inputs: [{ label: 'MCMXCIV', make: () => 'MCMXCIV' }, { label: 'LVIII', make: () => 'LVIII' }], code: romanCode, run: romanToInt },
  { id: 'lc-reverse-int', group: '热门题', title: '7. 整数反转', brief: '每次取最后一位接到反转值后面。超出 32 位范围就返回 0。', view: 'array', facts: [['时间', 'O(log n)'], ['空间', 'O(1)'], ['坑', '溢出']], counters: '位', legend: [],
    inputs: [{ label: '123', make: () => 123 }, { label: '-123', make: () => -123 }, { label: '1534236469（溢出）', make: () => 1534236469 }], code: reverseIntCode, run: reverseInt },
  { id: 'lc-excel-title', group: '热门题', title: '168. Excel 表列名称', brief: '26 进制，但字母是 1..26 而不是 0..25，所以每轮要先减一。', view: 'array', facts: [['时间', 'O(log n)'], ['空间', 'O(1)'], ['坑', '忘了减一']], counters: '位', legend: [],
    inputs: [{ label: '28 → AB', make: () => 28 }, { label: '701 → ZY', make: () => 701 }], code: excelCode, run: convertToTitle },
  { id: 'lc-fizz-buzz', group: '热门题', title: '412. Fizz Buzz', brief: '先判 15 的倍数——先判 3 或 5 的话 "FizzBuzz" 永远轮不到。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(n) 输出'], ['坑', '判断顺序']], counters: '已生成', legend: L,
    inputs: [{ label: 'n = 15', make: () => 15 }], code: fizzCode, run: fizzBuzz },
];
