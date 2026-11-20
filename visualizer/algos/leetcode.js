/**
 * LeetCode 高频题（第一批）。
 *
 * 这些题和前面的"知识点演示"不一样：它们不是一种数据结构，而是一道具体的题。
 * 但套路仍然落在前面讲过的技巧上——三数之和就是对撞双指针套一层循环，
 * 盛水容器就是双指针的贪心，最大子数组和就是最简单的 DP。
 * 所以每道题的 brief 里都会点明"它其实考的是哪个知识点"。
 */

// ─────────────────────────────────────────────────────────────
// 三数之和
// ─────────────────────────────────────────────────────────────

const threeSumCode = [
  'function threeSum(nums) {',
  '  nums.sort((a, b) => a - b);',
  '  const res = [];',
  '  for (let i = 0; i < nums.length - 2; i++) {',
  '    if (i > 0 && nums[i] === nums[i - 1]) continue;   // 跳过重复的第一个数',
  '    let lo = i + 1, hi = nums.length - 1;',
  '    while (lo < hi) {',
  '      const sum = nums[i] + nums[lo] + nums[hi];',
  '      if (sum === 0) {',
  '        res.push([nums[i], nums[lo], nums[hi]]);',
  '        while (lo < hi && nums[lo] === nums[lo + 1]) lo++;   // 去重',
  '        while (lo < hi && nums[hi] === nums[hi - 1]) hi--;',
  '        lo++; hi--;',
  '      } else if (sum < 0) lo++;',
  '      else hi--;',
  '    }',
  '  }',
  '  return res;',
  '}',
];

function threeSum(input) {
  const a = input.slice().sort((x, y) => x - y);
  const steps = [];
  let cmp = 0;
  const found = [];

  const push = (state, note, line) => steps.push({
    state: {
      values: a,
      settled: state?.fixed ? Array.from({ length: state.fixed + 1 }, (_, k) => k) : [],
      ...state,
    },
    note,
    line,
    counters: { 比较: cmp, 解: found.length },
  });

  push({}, `先排序（${a.join(',')}），然后固定第一个数，剩下两个用对撞双指针找。排序是前提——不排序就没法用"和太小就挪小的"这条推理。`, 1);

  for (let i = 0; i < a.length - 2; i++) {
    if (i > 0 && a[i] === a[i - 1]) {
      push({ fixed: i, pivot: i }, `${a[i]} 和上一个固定数相同，跳过整轮，否则会出重复解。`, 4);
      continue;
    }
    let lo = i + 1;
    let hi = a.length - 1;
    push({ fixed: i, pivot: i, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
      `固定 a[${i}] = ${a[i]}，在右边找两数之和等于 ${-a[i]}。`, 5);

    while (lo < hi) {
      const sum = a[i] + a[lo] + a[hi];
      cmp += 1;
      push({ fixed: i, pivot: i, compare: [lo, hi], pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
        `${a[i]} + ${a[lo]} + ${a[hi]} = ${sum}。`, 8);
      if (sum === 0) {
        found.push([a[i], a[lo], a[hi]]);
        push({ fixed: i, settled: [i, lo, hi], pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
          `找到一个解 [${a[i]}, ${a[lo]}, ${a[hi]}]，然后两边都跳过重复值。`, 9);
        while (lo < hi && a[lo] === a[lo + 1]) lo += 1;
        while (lo < hi && a[hi] === a[hi - 1]) hi -= 1;
        lo += 1;
        hi -= 1;
      } else if (sum < 0) {
        lo += 1;
        push({ fixed: i, pivot: i, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] }, '和偏小，lo 右移。', 14);
      } else {
        hi -= 1;
        push({ fixed: i, pivot: i, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] }, '和偏大，hi 左移。', 15);
      }
    }
  }

  push({}, `共 ${found.length} 组解。总复杂度 O(n²)：外层 n 次，内层双指针一趟。`, 17);
  return { steps, result: { count: found.length } };
}

// ─────────────────────────────────────────────────────────────
// 盛最多水的容器
// ─────────────────────────────────────────────────────────────

const containerCode = [
  'function maxArea(height) {',
  '  let lo = 0, hi = height.length - 1, best = 0;',
  '  while (lo < hi) {',
  '    const area = Math.min(height[lo], height[hi]) * (hi - lo);',
  '    best = Math.max(best, area);',
  '    if (height[lo] < height[hi]) lo++;   // 挪矮的那边',
  '    else hi--;',
  '  }',
  '  return best;',
  '}',
];

function maxArea(input) {
  const h = input.slice();
  const steps = [];
  let cmp = 0;

  const push = (state, note, line) => steps.push({
    state: { values: h, ...state },
    note,
    line,
    counters: { 比较: cmp },
  });

  let lo = 0;
  let hi = h.length - 1;
  let best = 0;

  push({ pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }], window: { lo, hi } },
    '面积 = 两边较矮的那个 × 间距。一开始取最宽的两根柱子。', 1);

  while (lo < hi) {
    const area = Math.min(h[lo], h[hi]) * (hi - lo);
    cmp += 1;
    if (area > best) best = area;
    push({ compare: [lo, hi], pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }], window: { lo, hi } },
      `宽 ${hi - lo} × 高 ${Math.min(h[lo], h[hi])} = ${area}，目前最大 ${best}。`, 3);

    if (h[lo] < h[hi]) {
      lo += 1;
      push({ pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }], window: { lo, hi }, settled: [lo - 1] },
        `左边矮，挪它——挪高的那边只会让宽度变小、高度还受矮的限制，不可能更好。`, 5);
    } else {
      hi -= 1;
      push({ pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }], window: { lo, hi }, settled: [hi + 1] },
        `右边矮，挪它。`, 6);
    }
  }

  push({}, `最大面积 ${best}。双指针各走一遍，O(n)。为什么只挪矮的那边能不漏解？因为留下的那边已经不可能和矮的组成更大面积了。`, 8);
  return { steps, result: { max: best } };
}

// ─────────────────────────────────────────────────────────────
// 最大子数组和
// ─────────────────────────────────────────────────────────────

const maxSubCode = [
  'function maxSubArray(nums) {',
  '  let cur = nums[0], best = nums[0];',
  '  for (let i = 1; i < nums.length; i++) {',
  '    cur = Math.max(nums[i], cur + nums[i]);   // 接着前面，还是从这里重开',
  '    best = Math.max(best, cur);',
  '  }',
  '  return best;',
  '}',
];

function maxSubArray(nums) {
  const steps = [];
  let cur = nums[0];
  let best = nums[0];

  const push = (state, note, line) => steps.push({
    state: { values: nums, container: { label: 'cur / best', items: [{ text: `cur ${cur}`, hot: true }, { text: `best ${best}` }] }, ...state },
    note,
    line,
    counters: { 比较: 0 },
  });

  push({ current: 0, pivot: 0 }, `dp 的典型题：dp[i] = max(nums[i], dp[i-1] + nums[i])。要么接着前面的连续段，要么从当前重新开始。`, 0);

  for (let i = 1; i < nums.length; i++) {
    const carry = cur + nums[i];
    const restart = nums[i];
    cur = Math.max(restart, carry);
    best = Math.max(best, cur);
    push(
      {
        current: i,
        pivot: i,
        settled: Array.from({ length: i }, (_, k) => k),
      },
      `接前面得 ${carry}，从 ${nums[i]} 重新开始；取大的 ${cur}。${restart > carry ? '前面那段和是负的，丢掉更划算。' : ''}`,
      3,
    );
  }

  push({ settled: nums.map((_, i) => i) }, `最大子数组和是 ${best}。`, 6);
  return { steps, result: { sum: best } };
}

// ─────────────────────────────────────────────────────────────
// 不同路径
// ─────────────────────────────────────────────────────────────

const pathsCode = [
  'function uniquePaths(m, n) {',
  '  const dp = Array.from({ length: m }, () => new Array(n).fill(1));',
  '  for (let r = 1; r < m; r++) {',
  '    for (let c = 1; c < n; c++) {',
  '      dp[r][c] = dp[r - 1][c] + dp[r][c - 1];   // 从上面或左边来',
  '    }',
  '  }',
  '  return dp[m - 1][n - 1];',
  '}',
];

function uniquePaths(input) {
  const { m, n } = input;
  const dp = Array.from({ length: m }, () => new Array(n).fill(1));
  const steps = [];
  let filled = 0;
  const filledCells = [];
  for (let r = 0; r < m; r++) filledCells.push([r, 0]);
  for (let c = 1; c < n; c++) filledCells.push([0, c]);

  const push = (state, note, line) => steps.push({
    state: {
      cells: dp.map((r) => r.slice()),
      rowHead: Array.from({ length: m }, (_, r) => `行${r}`),
      colHead: Array.from({ length: n }, (_, c) => `列${c}`),
      filled: filledCells.slice(),
      ...state,
    },
    note,
    line,
    counters: { 填表: filled },
  });

  push({}, `${m}×${n} 的网格，从左上到右下只能往右或往下。第一行第一列都只有一种走法，先填 1。`, 1);

  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
      filledCells.push([r, c]);
      filled += 1;
      push({ current: [r, c], deps: [[r - 1, c], [r, c - 1]] },
        `(${r},${c}) 只能从上面 ${dp[r - 1][c]} 种或左边 ${dp[r][c - 1]} 种过来，合起来 ${dp[r][c]} 种。`, 4);
    }
  }

  push({}, `右下角一共 ${dp[m - 1][n - 1]} 条路径。这是最简单的二维 DP：每个格子只依赖上面和左边。`, 6);
  return { steps, result: { paths: dp[m - 1][n - 1] } };
}

// ─────────────────────────────────────────────────────────────

const lcLegend = [
  { cls: 'bar', text: '数组元素' },
  { cls: 'bar is-compare', text: '正在比较' },
  { cls: 'bar is-pivot', text: '固定的那个数' },
  { cls: 'bar is-settled', text: '已确定 / 命中' },
];

export const leetcodeAlgorithms = [
  {
    id: 'lc-three-sum',
    group: '热门题',
    title: '15. 三数之和',
    brief: '排序 + 固定第一个数 + 对撞双指针。考的还是双指针，难点全在去重：第一个数要跳重复，双指针找到解之后两边也要跳重复。',
    view: 'array',
    facts: [['时间', 'O(n²)'], ['空间', 'O(1) 除结果'], ['前提', '先排序'], ['坑', '三处去重']],
    counters: '比较、解',
    legend: lcLegend,
    inputs: [
      { label: '经典 -1 0 1 2 -1 -4', make: () => [-1, 0, 1, 2, -1, -4] },
      { label: '全是 0', make: () => [0, 0, 0, 0] },
      { label: '随机 8 个', make: () => Array.from({ length: 8 }, () => Math.floor(Math.random() * 9) - 4) },
    ],
    code: threeSumCode,
    run: threeSum,
  },
  {
    id: 'lc-container',
    group: '热门题',
    title: '11. 盛最多水的容器',
    brief: '双指针从两端往中间收，每次挪矮的那根。挪高的没有意义：宽度一定变小，高度还受矮的限制。',
    view: 'array',
    facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['贪心', '挪矮的'], ['关键', '为什么可以这样挪']],
    counters: '比较',
    legend: lcLegend,
    inputs: [
      { label: '经典 1 8 6 2 5 4 8 3 7', make: () => [1, 8, 6, 2, 5, 4, 8, 3, 7] },
      { label: '随机 9 根', make: () => Array.from({ length: 9 }, () => 1 + Math.floor(Math.random() * 9)) },
    ],
    code: containerCode,
    run: maxArea,
  },
  {
    id: 'lc-max-subarray',
    group: '热门题',
    title: '53. 最大子数组和',
    brief: 'dp[i] = max(nums[i], dp[i-1] + nums[i])：前面那段和是负的就丢掉，从当前重开。一行循环，O(n)。',
    view: 'array',
    facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['递推', '接着 or 重开'], ['同型', '股票 / 乘积最大']],
    counters: '比较',
    legend: lcLegend,
    inputs: [
      { label: '经典 -2 1 -3 4 -1 2 1 -5 4', make: () => [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
      { label: '全是负数', make: () => [-5, -2, -8, -1] },
      { label: '随机正负', make: () => Array.from({ length: 8 }, () => Math.floor(Math.random() * 13) - 6) },
    ],
    code: maxSubCode,
    run: maxSubArray,
  },
  {
    id: 'lc-unique-paths',
    group: '热门题',
    title: '62. 不同路径',
    brief: '最简单的二维 DP：每个格子只能从上面或左边来，所以 dp[r][c] = 上 + 左。第一行第一列只有一种走法。',
    view: 'table',
    facts: [['时间', 'O(m·n)'], ['空间', 'O(m·n)'], ['转移', '上 + 左'], ['边界', '第一行第一列']],
    counters: '填表',
    legend: [{ cls: 'cell', text: '已填' }, { cls: 'cell is-active', text: '正在算' }, { cls: 'cell is-compare', text: '依赖格' }],
    inputs: [
      { label: '3×7', make: () => ({ m: 3, n: 7 }) },
      { label: '4×5', make: () => ({ m: 4, n: 5 }) },
    ],
    code: pathsCode,
    run: uniquePaths,
  },
];
