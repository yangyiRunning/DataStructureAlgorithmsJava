/**
 * 回溯三件套：全排列、子集、N 皇后。
 *
 * 三个演示讲的是同一个骨架：
 *   做出一个选择 → 递归 → 撤销这个选择（回溯）
 * 差别只在"选择"是什么、以及什么时候剪枝。所以每步都同时显示两样东西：
 * 当前路径（已经选了的）和候选集合（还能选的），撤销那一步单独记一帧。
 */

// ─────────────────────────────────────────────────────────────
// 全排列
// ─────────────────────────────────────────────────────────────

const permuteCode = [
  'function permute(nums) {',
  '  const path = [], used = new Array(nums.length).fill(false);',
  '  const res = [];',
  '  const dfs = () => {',
  '    if (path.length === nums.length) { res.push([...path]); return; }',
  '    for (let i = 0; i < nums.length; i++) {',
  '      if (used[i]) continue;',
  '      used[i] = true; path.push(nums[i]);   // 选',
  '      dfs();',
  '      path.pop(); used[i] = false;          // 撤销',
  '    }',
  '  };',
  '  dfs();',
  '  return res;',
  '}',
];

function permute(input) {
  const nums = input.slice();
  const steps = [];
  let picks = 0;
  let found = 0;

  const path = [];
  const used = new Array(nums.length).fill(false);
  const results = [];

  const push = (state, note, line) => steps.push({
    state: { values: nums, ...state },
    note,
    line,
    counters: { 选择次数: picks, 已找到: found },
  });

  const pathItems = () => path.map((v) => ({ text: String(v) }));
  const usedIdx = () => used.map((u, i) => (u ? i : -1)).filter((i) => i >= 0);

  push({ container: { label: '当前排列', items: [] } },
    `求 ${nums.length} 个数的全排列。每层从还没用过的数里挑一个，挑完就往下递归，回来时撤销。`, 0);

  const dfs = () => {
    if (path.length === nums.length) {
      found += 1;
      results.push([...path]);
      push({ settled: usedIdx(), container: { label: '当前排列', items: pathItems() } },
        `凑满 ${nums.length} 个数，得到一个完整排列 [${path.join(' ')}]，记下来然后返回。`, 4);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) {
        push({ settled: usedIdx(), compare: [i], container: { label: '当前排列', items: pathItems() } },
          `${nums[i]} 已经用过了，跳过。`, 7);
        continue;
      }

      used[i] = true;
      path.push(nums[i]);
      picks += 1;
      push({ settled: usedIdx(), pivot: i, container: { label: '当前排列', items: pathItems() } },
        `选 ${nums[i]}，进入下一层。当前路径 [${path.join(' ')}]。`, 8);

      dfs();

      const undone = path.pop();
      used[i] = false;
      push({ settled: usedIdx(), move: [i], container: { label: '当前排列', items: pathItems() } },
        `撤销 ${undone}——回到上一层，把它放回候选池。这一步就是"回溯"三个字的由来。`, 9);
    }
  };

  dfs();

  push({ container: { label: '全部排列', items: results.slice(0, 8).map((r) => ({ text: r.join('') })) } },
    `共 ${found} 个排列（n! = ${nums.length}!）。每一条从根到叶的路径就是一个排列。`, 12);
  return { steps, result: { count: found } };
}

// ─────────────────────────────────────────────────────────────
// 子集
// ─────────────────────────────────────────────────────────────

const subsetCode = [
  'function subsets(nums) {',
  '  const path = [], res = [];',
  '  const dfs = (i) => {',
  '    if (i === nums.length) { res.push([...path]); return; }',
  '    path.push(nums[i]);       // 选 nums[i]',
  '    dfs(i + 1);',
  '    path.pop();               // 撤销',
  '    dfs(i + 1);               // 不选 nums[i]',
  '  };',
  '  dfs(0);',
  '  return res;',
  '}',
];

function subsets(input) {
  const nums = input.slice();
  const steps = [];
  let found = 0;

  const path = [];
  const results = [];

  const push = (state, note, line) => steps.push({
    state: { values: nums, ...state },
    note,
    line,
    counters: { 已找到: found },
  });

  const items = () => (path.length ? path.map((v) => ({ text: String(v) })) : []);

  push({ container: { label: '当前子集', items: [] } },
    '子集问题和全排列的区别：每个元素只有"选"和"不选"两种选择，不用考虑顺序，所以不需要 used 数组。', 0);

  const dfs = (i) => {
    if (i === nums.length) {
      found += 1;
      results.push([...path]);
      push({ settled: Array.from({ length: nums.length }, (_, k) => k), container: { label: '当前子集', items: items() } },
        `走到最后一个元素之后，得到一个子集 [${path.join(' ') || '空'}]。`, 4);
      return;
    }

    path.push(nums[i]);
    push({ pivot: i, container: { label: '当前子集', items: items() } },
      `第 ${i} 个元素 ${nums[i]}：选它。`, 5);

    dfs(i + 1);

    const undone = path.pop();
    push({ move: [i], container: { label: '当前子集', items: items() } },
      `撤销 ${undone}，回到"不选它"的分支。`, 7);

    dfs(i + 1);
  };

  dfs(0);

  push({ container: { label: '全部子集', items: results.slice(0, 8).map((r) => ({ text: r.join('') || '∅' })) } },
    `共 ${found} 个子集（2^${nums.length} = ${found}）。每个元素选或不选，就是一棵二叉决策树。`, 10);
  return { steps, result: { count: found } };
}

// ─────────────────────────────────────────────────────────────
// N 皇后
// ─────────────────────────────────────────────────────────────

const nqCode = [
  'function solve(n) {',
  '  const queens = new Array(n).fill(-1);   // queens[r] = c',
  '  let count = 0;',
  '  const dfs = (r) => {',
  '    if (r === n) { count++; return; }',
  '    for (let c = 0; c < n; c++) {',
  '      if (!safe(queens, r, c)) continue;  // 剪枝：这一格放不了',
  '      queens[r] = c;',
  '      dfs(r + 1);',
  '      queens[r] = -1;                     // 撤销',
  '    }',
  '  };',
  '  dfs(0);',
  '  return count;',
  '}',
];

function nQueens(input) {
  const n = input;
  const steps = [];
  let tries = 0;
  let count = 0;

  const queens = new Array(n).fill(-1);
  const solutions = [];

  // 被攻击的格子：同一列、两条对角线
  const attackedCells = (r, c) => {
    const out = [];
    for (let rr = 0; rr < n; rr++) {
      if (rr === r) continue;
      const cc = queens[rr];
      if (cc < 0) continue;
      if (cc === c || Math.abs(cc - c) === Math.abs(rr - r)) out.push([rr, cc]);
    }
    return out;
  };

  const push = (state, note, line) => steps.push({
    state: {
      n,
      queens: queens.slice(),
      ...state,
    },
    note,
    line,
    counters: { 尝试: tries, 解: count },
  });

  push({ container: { label: '已放的列', items: [] } },
    `${n} 皇后：每行放一个，且任意两个不能同列、不能同对角线。逐行往下试，放不下就回上一行换列。`, 0);

  const dfs = (r) => {
    if (r === n) {
      count += 1;
      solutions.push(queens.slice());
      push({ current: null, container: { label: '已放的列', items: queens.map((c) => ({ text: String(c) })) } },
        `第 ${n} 行也放下了，得到一个解。这是第 ${count} 个。`, 4);
      return;
    }

    for (let c = 0; c < n; c++) {
      tries += 1;
      const bad = attackedCells(r, c);
      if (bad.length) {
        push(
          {
            current: [r, c],
            attacked: bad,
            bad: bad,
            container: { label: '已放的列', items: queens.map((x, i) => ({ text: i < r ? String(x) : '·' })) },
          },
          `第 ${r} 行第 ${c} 列：和已放的皇后冲突（同列或同对角线），跳过。剪枝在这里省掉了整棵子树。`,
          7,
        );
        continue;
      }

      queens[r] = c;
      push(
        {
          current: [r, c],
          container: { label: '已放的列', items: queens.map((x) => ({ text: x < 0 ? '·' : String(x) })) },
        },
        `第 ${r} 行第 ${c} 列安全，放一个皇后，去下一行。`,
        8,
      );

      dfs(r + 1);

      queens[r] = -1;
      push(
        {
          current: null,
          move: [[r, c]],
          container: { label: '已放的列', items: queens.map((x) => ({ text: x < 0 ? '·' : String(x) })) },
        },
        `第 ${r} 行这条路走不通（或已经找完），把皇后拿走，试下一列。`,
        9,
      );
    }
  };

  dfs(0);

  push({ container: { label: '已放的列', items: queens.map(() => ({ text: '·' })) } },
    `搜完。${n} 皇后共 ${count} 个解，一共尝试了 ${tries} 次放置。`, 12);
  return { steps, result: { count } };
}

// ─────────────────────────────────────────────────────────────

const btLegend = [
  { cls: 'bar', text: '候选元素' },
  { cls: 'bar is-settled', text: '已使用 / 已放置' },
  { cls: 'bar is-move', text: '刚撤销' },
  { cls: 'bar is-pivot', text: '本次选择' },
];

const boardLegend = [
  { cls: 'cell board', text: '空格' },
  { cls: 'cell board is-settled', text: '已放皇后' },
  { cls: 'cell board is-active', text: '正在试' },
  { cls: 'cell board is-move', text: '冲突（被剪枝）' },
];

function permuteInputs() {
  return [
    { label: '3 个数', make: () => [1, 2, 3] },
    { label: '4 个数', make: () => [1, 2, 3, 4] },
  ];
}

function subsetInputs() {
  return [
    { label: '3 个元素', make: () => [1, 2, 3] },
    { label: '4 个元素', make: () => [1, 2, 3, 4] },
  ];
}

export const backtrackingAlgorithms = [
  {
    id: 'bt-permute',
    group: '回溯',
    title: '全排列',
    brief: '每层从没用过的数里挑一个，递归进去，回来以后把选择撤销。撤销那一步才是回溯的灵魂——不撤销，后面的分支就全错了。',
    view: 'array',
    facts: [['时间', 'O(n!·n)'], ['空间', 'O(n)'], ['选择', '没用过的都要试'], ['撤销', '必须成对']],
    counters: '选择次数、已找到',
    legend: btLegend,
    inputs: permuteInputs(),
    code: permuteCode,
    run: permute,
  },
  {
    id: 'bt-subsets',
    group: '回溯',
    title: '子集',
    brief: '每个元素只有"选"和"不选"两条路，不需要 used 数组。整棵树有 2^n 个叶子，每个叶子就是一个子集。',
    view: 'array',
    facts: [['时间', 'O(2^n·n)'], ['空间', 'O(n)'], ['选择', '选 / 不选'], ['叶子数', '2^n']],
    counters: '已找到',
    legend: btLegend,
    inputs: subsetInputs(),
    code: subsetCode,
    run: subsets,
  },
  {
    id: 'bt-nqueens',
    group: '回溯',
    title: 'N 皇后',
    brief: '逐行放皇后，每行试所有列，冲突就跳过——剪枝省掉的是整棵子树。放满 n 行就是一个解，然后回上一行换列继续。',
    view: 'board',
    facts: [['时间', '指数级'], ['空间', 'O(n)'], ['剪枝', '列 + 两条对角线'], ['n=8', '92 个解']],
    counters: '尝试、解',
    legend: boardLegend,
    inputs: [
      { label: '4 皇后', make: () => 4 },
      { label: '5 皇后', make: () => 5 },
      { label: '6 皇后', make: () => 6 },
    ],
    code: nqCode,
    run: nQueens,
  },
];
