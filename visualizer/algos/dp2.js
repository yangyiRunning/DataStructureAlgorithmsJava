/**
 * 一维 DP 三题 + 完全背包。
 *
 * 爬楼梯、打家劫舍、LIS 都是一维递推，用数组视图：柱子是原始数组，
 * 底部条显示每一格的 dp 值。这样"dp[i] 从哪来"和"原数组长什么样"能同时看到。
 *
 * 完全背包放表格视图，和 01 背包摆在一起对照——两者代码只差一个下标，
 * 差别在于"这一件还能不能再装"，所以完全背包取的是**同一行**左边的值。
 */

const INF = Infinity;

// ─────────────────────────────────────────────────────────────
// 爬楼梯
// ─────────────────────────────────────────────────────────────

const climbCode = [
  'function climbStairs(n) {',
  '  if (n <= 2) return n;',
  '  let a = 1, b = 2;              // dp[1], dp[2]',
  '  for (let i = 3; i <= n; i++) {',
  '    const cur = a + b;           // 只能从 i-1 或 i-2 过来',
  '    a = b;',
  '    b = cur;',
  '  }',
  '  return b;',
  '}',
];

function climbStairs(n) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;

  const steps = [];
  let fill = 0;
  const push = (state, note, line) => steps.push({
    state: {
      values: dp.slice(0, n + 1),
      container: { label: 'dp', items: dp.slice(0, n + 1).map((v, i) => ({ text: `${i}:${v}` })) },
      ...state,
    },
    note,
    line,
    counters: { 填表: fill },
  });

  push({}, `上 ${n} 级台阶，每次走 1 或 2 级，问有几种走法。dp[i] = dp[i-1] + dp[i-2]——最后一步要么是一级要么是两级。`, 0);

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
    fill += 1;
    push(
      { current: i, deps: [i - 1, i - 2], pivot: i },
      `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}。`,
      4,
    );
  }

  push({}, `答案 ${dp[n]}。其实就是斐波那契，只用了两个变量就能滚动，空间 O(1)。`, 8);
  return { steps, result: { ans: dp[n] } };
}

function climbInputs() {
  return [
    { label: 'n = 5', make: () => 5 },
    { label: 'n = 8', make: () => 8 },
  ];
}

// ─────────────────────────────────────────────────────────────
// 打家劫舍
// ─────────────────────────────────────────────────────────────

const robCode = [
  'function rob(nums) {',
  '  let prev = 0, cur = 0;         // dp[i-2], dp[i-1]',
  '  for (const x of nums) {',
  '    const take = prev + x;       // 抢这一家，上一家就不能抢',
  '    prev = cur;',
  '    cur = Math.max(cur, take);',
  '  }',
  '  return cur;',
  '}',
];

function rob(nums) {
  const n = nums.length;
  const dp = new Array(n).fill(0);

  const steps = [];
  let fill = 0;
  const push = (state, note, line) => steps.push({
    state: {
      values: nums,
      container: { label: 'dp', items: dp.map((v, i) => ({ text: `${i}:${v}` })) },
      settled: Array.from({ length: fill }, (_, i) => i),
      ...state,
    },
    note,
    line,
    counters: { 填表: fill },
  });

  push({}, `一排房子，相邻两家不能同时抢。dp[i] = max(dp[i-1], dp[i-2] + nums[i])：抢这家就放弃上一家，不抢就继承上一家。`, 0);

  for (let i = 0; i < n; i++) {
    const take = (i >= 2 ? dp[i - 2] : 0) + nums[i];
    dp[i] = Math.max(i >= 1 ? dp[i - 1] : 0, take);
    fill += 1;
    push(
      { current: i, deps: i >= 2 ? [i - 1, i - 2] : i >= 1 ? [i - 1] : [], pivot: i },
      i === 0
        ? `第 0 家：抢它得 ${nums[i]}。`
        : `第 ${i} 家：抢它得 dp[${i - 2}] + ${nums[i]} = ${take}，不抢继承 ${dp[i - 1]}，取大的 ${dp[i]}。`,
      5,
    );
  }

  push({}, `最多抢到 ${dp[n - 1]}。`, 7);
  return { steps, result: { ans: dp[n - 1] } };
}

function robInputs() {
  return [
    { label: '2 1 5 3', make: () => [2, 1, 5, 3] },
    { label: '随机 6 家', make: () => Array.from({ length: 6 }, () => 1 + Math.floor(Math.random() * 20)) },
  ];
}

// ─────────────────────────────────────────────────────────────
// 最长递增子序列 LIS
// ─────────────────────────────────────────────────────────────

const lisCode = [
  'function lengthOfLIS(nums) {',
  '  const dp = new Array(nums.length).fill(1);   // 每个数自己至少是长度 1',
  '  for (let i = 1; i < nums.length; i++) {',
  '    for (let j = 0; j < i; j++) {',
  '      if (nums[j] < nums[i]) {',
  '        dp[i] = Math.max(dp[i], dp[j] + 1);     // 接在 j 后面',
  '      }',
  '    }',
  '  }',
  '  return Math.max(...dp);',
  '}',
];

function lis(nums) {
  const dp = new Array(nums.length).fill(1);

  const steps = [];
  let cmp = 0;
  const push = (state, note, line) => steps.push({
    state: {
      values: nums,
      container: { label: 'dp', items: dp.map((v, i) => ({ text: `${i}:${v}` })) },
      ...state,
    },
    note,
    line,
    counters: { 比较: cmp },
  });

  push({}, `求最长递增子序列（可以不连续）。dp[i] = 以 nums[i] 结尾的最长长度，初始都是 1。`, 1);

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      cmp += 1;
      push({ current: i, compare: [j], pivot: i },
        `看 nums[${j}]=${nums[j]} 能不能接在 nums[${i}]=${nums[i]} 前面。`, 4);
      if (nums[j] < nums[i]) {
        const cand = dp[j] + 1;
        if (cand > dp[i]) {
          dp[i] = cand;
          push({ current: i, deps: [j], pivot: i },
            `能接：${dp[j]} + 1 = ${cand}，比 dp[${i}] 大，更新。`, 5);
        }
      }
    }
  }

  const ans = Math.max(...dp);
  push({ settled: dp.map((_, i) => i) }, `最长递增子序列长度是 ${ans}。这是 O(n²) 的写法，贪心+二分可以做到 O(n log n)。`, 8);
  return { steps, result: { ans } };
}

function lisInputs() {
  const make = () => {
    const s = new Set();
    while (s.size < 8) s.add(5 + Math.floor(Math.random() * 90));
    return [...s];
  };
  return [
    { label: '经典 10 9 2 5 3 7', make: () => [10, 9, 2, 5, 3, 7, 101, 18] },
    { label: '随机 8 个', make },
  ];
}

// ─────────────────────────────────────────────────────────────
// 完全背包
// ─────────────────────────────────────────────────────────────

const unboundedCode = [
  'function unboundedKnapsack(w, v, C) {',
  '  const n = w.length;',
  '  const dp = Array.from({ length: n + 1 }, () => new Array(C + 1).fill(0));',
  '  for (let i = 1; i <= n; i++) {',
  '    for (let c = 0; c <= C; c++) {',
  '      dp[i][c] = dp[i - 1][c];              // 不装这件',
  '      if (c >= w[i - 1]) {',
  '        dp[i][c] = Math.max(dp[i][c], dp[i][c - w[i - 1]] + v[i - 1]);',
  '      }                                  // 注意是 dp[i][...]，同一行！',
  '    }',
  '  }',
  '  return dp[n][C];',
  '}',
];

function unboundedKnapsack(input) {
  const { w, v, C } = input;
  const n = w.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(C + 1).fill(0));

  const steps = [];
  let filled = 0;
  const filledCells = [];
  for (let i = 0; i <= n; i++) filledCells.push([i, 0]);
  for (let c = 1; c <= C; c++) filledCells.push([0, c]);

  const push = (state, note, line) => steps.push({
    state: {
      cells: dp.map((r) => r.slice()),
      rowHead: ['空', ...w.map((wi, k) => `${wi}kg/${v[k]}`)],
      colHead: Array.from({ length: C + 1 }, (_, c) => String(c)),
      filled: filledCells.slice(),
      ...state,
    },
    note,
    line,
    counters: { 填表: filled },
  });

  push({}, `完全背包：每件物品可以拿无限次。和 01 背包只差一个下标——这里是 dp[i][c-w]（同一行），01 背包是 dp[i-1][c-w]（上一行）。`, 2);

  for (let i = 1; i <= n; i++) {
    for (let c = 0; c <= C; c++) {
      dp[i][c] = dp[i - 1][c];
      filledCells.push([i, c]);
      push({ current: [i, c], deps: [[i - 1, c]] },
        `第 ${i} 件（${w[i - 1]}kg / ${v[i - 1]}元）、容量 ${c}：先看不装，继承上一行 ${dp[i - 1][c]}。`, 5);

      if (c >= w[i - 1]) {
        const cand = dp[i][c - w[i - 1]] + v[i - 1];
        if (cand > dp[i][c]) {
          dp[i][c] = cand;
          push({ current: [i, c], deps: [[i - 1, c], [i, c - w[i - 1]]] },
            `装：同一行左边 ${dp[i][c - w[i - 1]]} 加上 ${v[i - 1]} = ${cand}（同一行说明这件可以再装），更大，更新。`, 7);
        } else {
          push({ current: [i, c], deps: [[i - 1, c], [i, c - w[i - 1]]] },
            `装也才 ${cand}，不比 ${dp[i][c]} 大，保持。`, 7);
        }
      }
      filled += 1;
    }
  }

  push({}, `答案 ${dp[n][C]}。同一个问题写成"恰好装满"或者求方案数时，边界初始化要跟着改——这是完全背包最容易错的地方。`, 10);
  return { steps, result: { ans: dp[n][C] } };
}

function unboundedInputs() {
  return [
    { label: '经典小例子', make: () => ({ w: [2, 3, 4], v: [3, 5, 7], C: 6 }) },
    { label: '随机一组', make: () => ({
      w: Array.from({ length: 3 }, () => 1 + Math.floor(Math.random() * 3)),
      v: Array.from({ length: 3 }, () => 2 + Math.floor(Math.random() * 6)),
      C: 5,
    }) },
  ];
}

// ─────────────────────────────────────────────────────────────

const dp1Legend = [
  { cls: 'bar', text: '原数组' },
  { cls: 'bar is-compare', text: '它依赖的格子' },
  { cls: 'bar is-pivot', text: '正在算的' },
];

export const dpOneDAlgorithms = [
  {
    id: 'dp-climb',
    group: '动态规划',
    title: '爬楼梯',
    brief: 'dp[i] = dp[i-1] + dp[i-2]：最后一步只能是一级或两级。本质是斐波那契，两个变量就能滚动。',
    view: 'array',
    facts: [['时间', 'O(n)'], ['空间', 'O(1) 滚动'], ['递推', 'dp[i-1] + dp[i-2]'], ['同型', '斐波那契']],
    counters: '填表',
    legend: dp1Legend,
    inputs: climbInputs(),
    code: climbCode,
    run: climbStairs,
  },
  {
    id: 'dp-rob',
    group: '动态规划',
    title: '打家劫舍',
    brief: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i])：抢这家就得放弃上一家。就是"相邻不能同时选"的模板。',
    view: 'array',
    facts: [['时间', 'O(n)'], ['空间', 'O(1) 滚动'], ['约束', '相邻不能同选'], ['同型', '删除并获得点数']],
    counters: '填表',
    legend: dp1Legend,
    inputs: robInputs(),
    code: robCode,
    run: rob,
  },
  {
    id: 'dp-lis',
    group: '动态规划',
    title: '最长递增子序列',
    brief: 'dp[i] = 以 nums[i] 结尾的最长长度。要拿每个 i 和它前面所有 j 比，所以是 O(n²)；贪心加二分能做到 O(n log n)。',
    view: 'array',
    facts: [['时间', 'O(n²)'], ['空间', 'O(n)'], ['定义', '以 i 结尾'], ['优化', '贪心 + 二分']],
    counters: '比较',
    legend: dp1Legend,
    inputs: lisInputs(),
    code: lisCode,
    run: lis,
  },
  {
    id: 'dp-unbounded',
    group: '动态规划',
    title: '完全背包',
    brief: '每件可以拿无限次。和 01 背包只差一个下标：这里用同一行的 dp[i][c-w]，01 背包用上一行的 dp[i-1][c-w]。',
    view: 'table',
    facts: [['时间', 'O(n·C)'], ['空间', 'O(n·C)'], ['差异', '同一行 vs 上一行'], ['一维写法', '正序遍历']],
    counters: '填表',
    legend: [{ cls: 'cell', text: '已填' }, { cls: 'cell is-active', text: '正在算' }, { cls: 'cell is-compare', text: '依赖格' }],
    inputs: unboundedInputs(),
    code: unboundedCode,
    run: unboundedKnapsack,
  },
];
