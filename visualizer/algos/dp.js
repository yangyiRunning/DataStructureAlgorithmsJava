/**
 * 动态规划：01 背包、编辑距离。
 *
 * 两个演示都用表格视图，因为它们讲的是同一件事：
 * 当前格子从哪几个格子推出来。看不看得懂 DP，全在于这一步能不能被看见。
 *
 * 表格一律多留一行一列（下标 0 那行/列）放"空"的边界值：
 * 边界写错是 DP 最常见的 bug，把边界摆在表里，比在推导里提一句强。
 */

// ─────────────────────────────────────────────────────────────
// 01 背包
// ─────────────────────────────────────────────────────────────

const knapCode = [
  'function knapsack(w, v, C) {',
  '  const n = w.length;',
  '  const dp = Array.from({ length: n + 1 }, () => new Array(C + 1).fill(0));',
  '  for (let i = 1; i <= n; i++) {',
  '    for (let c = 0; c <= C; c++) {',
  '      dp[i][c] = dp[i - 1][c];              // 不装第 i 件',
  '      if (c >= w[i - 1]) {',
  '        dp[i][c] = Math.max(dp[i][c], dp[i - 1][c - w[i - 1]] + v[i - 1]);',
  '      }',
  '    }',
  '  }',
  '  return dp[n][C];',
  '}',
];

function knapsack(input) {
  const { w, v, C } = input;
  const n = w.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(C + 1).fill(0));

  const steps = [];
  let filled = 0;
  // 边界：第 0 行（不选任何物品）和第 0 列（容量 0）本来就是 0，算已填
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

  push({}, `${n} 件物品，背包容量 ${C}。dp[i][c] 表示"只考虑前 i 件、容量 c 时能装的最大价值"。第一行第一列是空集，全是 0。`, 2);

  for (let i = 1; i <= n; i++) {
    for (let c = 0; c <= C; c++) {
      dp[i][c] = dp[i - 1][c];
      filledCells.push([i, c]);   // 这一格已经有值了，先记账，别被画成未填
      push(
        { current: [i, c], deps: [[i - 1, c]] },
        `第 ${i} 件（${w[i - 1]}kg / ${v[i - 1]}元）、容量 ${c}：先看"不装"，继承上一行同容量的 ${dp[i - 1][c]}。`,
        5,
      );

      if (c >= w[i - 1]) {
        const cand = dp[i - 1][c - w[i - 1]] + v[i - 1];
        if (cand > dp[i][c]) {
          dp[i][c] = cand;
          push(
            { current: [i, c], deps: [[i - 1, c], [i - 1, c - w[i - 1]]] },
            `装得下：剩下 ${c - w[i - 1]} 容量时的最优解 ${dp[i - 1][c - w[i - 1]]} 加上这件 ${v[i - 1]} 元 = ${cand}，比不装大，更新。`,
            7,
          );
        } else {
          push(
            { current: [i, c], deps: [[i - 1, c], [i - 1, c - w[i - 1]]] },
            `装得下，但 ${cand} 不比 ${dp[i][c]} 大，保持不装。`,
            7,
          );
        }
      }
      filled += 1;
    }
  }

  push({}, `填完。右下角 dp[${n}][${C}] = ${dp[n][C]} 就是答案。注意它是"只考虑前 i 件"的递推，所以每一格只依赖上一行，二维可以压成一维。`, 11);
  return { steps, result: { ans: dp[n][C] } };
}

function knapInputs() {
  const make = () => {
    const n = 3;
    const w = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 4));
    const v = Array.from({ length: n }, () => 2 + Math.floor(Math.random() * 8));
    const C = 4 + Math.floor(Math.random() * 3);
    return { w, v, C };
  };
  return [
    { label: '经典小例子', make: () => ({ w: [2, 3, 4], v: [3, 4, 5], C: 5 }) },
    { label: '随机一组', make },
  ];
}

// ─────────────────────────────────────────────────────────────
// 编辑距离
// ─────────────────────────────────────────────────────────────

const editCode = [
  'function editDistance(a, b) {',
  '  const m = a.length, n = b.length;',
  '  const dp = Array.from({ length: m + 1 }, (_, i) => { ',
  '    const row = new Array(n + 1).fill(0);',
  '    row[0] = i;                    // 边界：a 的前 i 个字符变空要删 i 次',
  '    return row;',
  '  });',
  '  for (let j = 0; j <= n; j++) dp[0][j] = j;   // 空串变 b 的前 j 个要插 j 次',
  '  for (let i = 1; i <= m; i++) {',
  '    for (let j = 1; j <= n; j++) {',
  '      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];',
  '      else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);',
  '    }',
  '  }',
  '  return dp[m][n];',
  '}',
];

function editDistance(input) {
  const { a, b } = input;
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => {
    const row = new Array(n + 1).fill(0);
    row[0] = i;
    return row;
  });
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  const steps = [];
  let filled = 0;
  // 第一行和第一列是边界，一开始就是有值的
  const filledCells = [];
  for (let i = 0; i <= m; i++) filledCells.push([i, 0]);
  for (let j = 1; j <= n; j++) filledCells.push([0, j]);

  const push = (state, note, line) => steps.push({
    state: {
      cells: dp.map((r) => r.slice()),
      colHead: ['∅', ...[...b]],
      rowHead: ['∅', ...[...a]],
      filled: filledCells.slice(),
      ...state,
    },
    note,
    line,
    counters: { 填表: filled },
  });

  push({}, `把 "${a}" 改成 "${b}"。第一行是空串变成 b 的前缀要插几个字符，第一列是 a 的前缀删成空串——边界先写好，后面才推得动。`, 0);

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const same = a[i - 1] === b[j - 1];
      if (same) {
        dp[i][j] = dp[i - 1][j - 1];
        filledCells.push([i, j]);
        push(
          { current: [i, j], deps: [[i - 1, j - 1]] },
          `"${a[i - 1]}" 和 "${b[j - 1]}" 相同，不用动，直接搬左上角的值 ${dp[i][j]}。`,
          11,
        );
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
        filledCells.push([i, j]);
        push(
          { current: [i, j], deps: [[i - 1, j - 1], [i - 1, j], [i, j - 1]] },
          `"${a[i - 1]}" ≠ "${b[j - 1]}"：左上（替换 ${dp[i - 1][j - 1]}）、上（删除 ${dp[i - 1][j]}）、左（插入 ${dp[i][j - 1]}）取最小再加 1，得 ${dp[i][j]}。`,
          12,
        );
      }
      filled += 1;
    }
  }

  push({}, `右下角 dp[${m}][${n}] = ${dp[m][n]}，"${a}" 和 "${b}" 的编辑距离是 ${dp[m][n]}。`, 14);
  return { steps, result: { dist: dp[m][n] } };
}

function editInputs() {
  return [
    { label: 'horse → ros', make: () => ({ a: 'horse', b: 'ros' }) },
    { label: 'cat → cats', make: () => ({ a: 'cat', b: 'cats' }) },
    { label: 'abc → abc', make: () => ({ a: 'abc', b: 'abc' }) },
    { label: 'kitten → sitting', make: () => ({ a: 'kitten', b: 'sitting' }) },
  ];
}

// ─────────────────────────────────────────────────────────────

const dpLegend = [
  { cls: 'cell', text: '已填的格子' },
  { cls: 'cell is-compare', text: '这一格依赖的格子' },
  { cls: 'cell is-active', text: '正在算的格子' },
];

export const dpAlgorithms = [
  {
    id: 'dp-knapsack',
    group: '动态规划',
    title: '01 背包',
    brief: 'dp[i][c] 只依赖上一行：要么不装（直接继承），要么装了（上一行往左退 w 格再加价值）。每件物品只能选一次，所以是"上一行"，完全背包才是"同一行"。',
    view: 'table',
    facts: [['时间', 'O(n·C)'], ['空间', 'O(n·C) 可压到 O(C)'], ['要点', '只依赖上一行'], ['对比', '完全背包用同一行']],
    counters: '填表',
    legend: dpLegend,
    inputs: knapInputs(),
    code: knapCode,
    run: knapsack,
  },
  {
    id: 'dp-edit-distance',
    group: '动态规划',
    title: '编辑距离',
    brief: '三种操作对应表里三个方向：左上=替换、上=删除、左=插入，取最小加一。字符相同就直接搬左上，不加代价。',
    view: 'table',
    facts: [['时间', 'O(m·n)'], ['空间', 'O(m·n)'], ['三方向', '替换 / 删除 / 插入'], ['边界', '第一行第一列']],
    counters: '填表',
    legend: dpLegend,
    inputs: editInputs(),
    code: editCode,
    run: editDistance,
  },
];
