/**
 * 三个"预处理一下就好办了"的技巧：前缀和、差分数组、贪心跳跃。
 *
 * 共同点：都不改变原数组，而是额外存一份"辅助数组"，
 * 让后续的区间操作从 O(n) 降到 O(1)。所以每一步都把辅助数组放在底部条里，
 * 让人看到"多花的这点空间买到了什么"。
 */

// ─────────────────────────────────────────────────────────────
// 前缀和
// ─────────────────────────────────────────────────────────────

const prefixCode = [
  'function buildPrefix(nums) {',
  '  const pre = [0];                    // pre[i] = 前 i 个元素之和',
  '  for (let i = 0; i < nums.length; i++) {',
  '    pre.push(pre[i] + nums[i]);',
  '  }',
  '  return pre;',
  '}',
  'function rangeSum(pre, l, r) {',
  '  return pre[r + 1] - pre[l];         // O(1) 拿到任意区间和',
  '}',
];

function prefixSum(nums) {
  const pre = [0];
  const steps = [];
  let built = 0;
  const push = (state, note, line) => steps.push({
    state: {
      values: nums,
      container: { label: 'pre', items: pre.map((v, i) => ({ text: `${i}:${v}`, hot: state?.hotIdx === i })) },
      ...state,
    },
    note,
    line,
    counters: { 建表: built },
  });

  push({}, `前缀和 pre[i] 存的是前 i 个元素的和，所以 pre 比原数组长一位。先把它建出来。`, 0);

  for (let i = 0; i < nums.length; i++) {
    pre.push(pre[i] + nums[i]);
    built += 1;
    push({ current: i, pivot: i, hotIdx: i + 1 },
      `pre[${i + 1}] = pre[${i}] + nums[${i}] = ${pre[i]} + ${nums[i]} = ${pre[i + 1]}。`, 3);
  }

  // 演示一次区间查询：取中间一段
  const l = Math.max(0, Math.floor(nums.length / 4));
  const r = Math.min(nums.length - 1, Math.floor((nums.length * 3) / 4));
  push({ settled: Array.from({ length: r - l + 1 }, (_, k) => l + k) },
    `建好了。现在查区间 [${l}, ${r}] 的和：直接用 pre[${r + 1}] - pre[${l}] = ${pre[r + 1] - pre[l]}，不用再遍历这段。`, 8);

  push({ hotIdx: r + 1 }, `pre[${r + 1}] 是被减数（前 ${r + 1} 个的和），减去 pre[${l}] 就把前面多出来的截掉了。`, 8);
  return { steps, result: { pre: pre.join(','), total: pre[pre.length - 1] } };
}

// ─────────────────────────────────────────────────────────────
// 差分数组
// ─────────────────────────────────────────────────────────────

const diffCode = [
  'function rangeAdd(nums, ops) {',
  '  const d = new Array(nums.length + 1).fill(0);   // 多开一位给 r+1',
  '  for (const [l, r, v] of ops) {',
  '    d[l] += v;',
  '    d[r + 1] -= v;         // 出了区间就抵消掉',
  '  }',
  '  const res = [];',
  '  let cur = 0;',
  '  for (let i = 0; i < nums.length; i++) {',
  '    cur += d[i];           // 前缀和还原',
  '    res.push(cur);',
  '  }',
  '  return res;',
  '}',
];

function rangeAdd(input) {
  const { n, ops } = input;
  const d = new Array(n + 1).fill(0);
  const res = new Array(n).fill(0);

  const steps = [];
  let applied = 0;
  const push = (state, note, line) => steps.push({
    state: {
      values: res.map((v) => v || 0),
      container: { label: 'diff', items: d.map((v, i) => ({ text: `${i}:${v}` })) },
      ...state,
    },
    note,
    line,
    counters: { 操作数: applied },
  });

  push({}, `对长度为 ${n} 的全零数组做 ${ops.length} 次"区间加 v"。差分数组的玩法：只动两个点，最后扫一遍就还原。`, 1);

  for (const [l, r, v] of ops) {
    d[l] += v;
    applied += 1;
    push({ hotIdx: l }, `区间 [${l}, ${r}] 加 ${v}：在 d[${l}] 加上 ${v}（从 ${l} 开始生效）。`, 3);
    d[r + 1] -= v;
    push({ hotIdx: r + 1 }, `在 d[${r + 1}] 减去 ${v}（过了 ${r} 就抵消）。两个点就把整段改动记下来了。`, 4);
  }

  let cur = 0;
  for (let i = 0; i < n; i++) {
    cur += d[i];
    res[i] = cur;
    push({ current: i, settled: Array.from({ length: i + 1 }, (_, k) => k) },
      `扫到 ${i}：累加 d[${i}] = ${d[i]}，当前值 ${cur}，写回数组。`, 10);
  }

  push({ settled: res.map((_, i) => i) }, `还原完成：${res.join(', ')}。${ops.length} 次区间加，只花了 ${ops.length * 2} 次单点修改。`, 12);
  return { steps, result: { arr: res.join(',') } };
}

// ─────────────────────────────────────────────────────────────
// 跳跃游戏
// ─────────────────────────────────────────────────────────────

const jumpCode = [
  'function canJump(nums) {',
  '  let reach = 0;                 // 目前能到达的最远下标',
  '  for (let i = 0; i < nums.length; i++) {',
  '    if (i > reach) return false; // 走不到这里',
  '    reach = Math.max(reach, i + nums[i]);',
  '  }',
  '  return true;',
  '}',
];

function canJump(nums) {
  const steps = [];
  let reach = 0;
  const push = (state, note, line) => steps.push({
    state: {
      values: nums,
      container: { label: '最远可达', items: [{ text: String(reach), hot: true }] },
      ...state,
    },
    note,
    line,
    counters: { 访问: 0 },
  });

  push({}, `每个格子写着从这儿最多能跳多远。只需要维护一个"最远能到哪"，不用管具体怎么跳。`, 0);

  for (let i = 0; i < nums.length; i++) {
    if (i > reach) {
      push({ current: i, move: [i] }, `下标 ${i} 已经超过了最远可达 ${reach}，跳不到这里，返回 false。`, 3);
      return { steps, result: { ok: 'false' } };
    }
    const before = reach;
    reach = Math.max(reach, i + nums[i]);
    push(
      {
        current: i,
        settled: Array.from({ length: Math.min(reach + 1, nums.length) }, (_, k) => k),
        pivot: i,
      },
      `站在 ${i}，能到 ${i + nums[i]}；原来的最远是 ${before}，现在更新成 ${reach}。`,
      4,
    );
  }

  push({ settled: nums.map((_, i) => i), container: { label: '最远可达', items: [{ text: String(reach), hot: true }] } },
    `走完了，每一步都没有超出当时的最远距离，所以能到终点。`, 6);
  return { steps, result: { ok: 'true' } };
}

function jumpInputs() {
  const ok = () => [2, 3, 1, 1, 4];
  const bad = () => [3, 2, 1, 0, 4];
  return [
    { label: '能跳过去', make: ok },
    { label: '跳不过去', make: bad },
    { label: '随机', make: () => Array.from({ length: 6 }, () => Math.floor(Math.random() * 4)) },
  ];
}

// ─────────────────────────────────────────────────────────────

const techLegend = [
  { cls: 'bar', text: '原数组 / 结果' },
  { cls: 'bar is-settled', text: '已确定' },
  { cls: 'bar is-pivot', text: '当前处理' },
  { cls: 'bar is-move', text: '跳不到这里' },
];

export const arrayTechAlgorithms = [
  {
    id: 'at-prefix-sum',
    group: '数组技巧',
    title: '前缀和',
    brief: 'pre[i] 存前 i 个元素之和。有了它，任意区间和在 O(1) 就能算出来：pre[r+1] - pre[l]。建表花 O(n)，之后每次查询都不用再遍历。',
    view: 'array',
    facts: [['建表', 'O(n)'], ['区间查询', 'O(1)'], ['空间', 'O(n)'], ['注意', 'pre 比原数组长一位']],
    counters: '建表',
    legend: techLegend,
    inputs: [
      { label: '随机 8 个', make: () => Array.from({ length: 8 }, () => 1 + Math.floor(Math.random() * 9)) },
      { label: '全正数 6 个', make: () => Array.from({ length: 6 }, () => 2 + Math.floor(Math.random() * 5)) },
    ],
    code: prefixCode,
    run: prefixSum,
  },
  {
    id: 'at-diff-array',
    group: '数组技巧',
    title: '差分数组',
    brief: '区间加 v 不用真去加整段，只在 d[l] 加 v、d[r+1] 减 v，最后扫一遍前缀和就还原了。m 次区间操作从 O(mn) 降到 O(m+n)。',
    view: 'array',
    facts: [['区间加', 'O(1)'], ['还原', 'O(n)'], ['空间', 'O(n)'], ['注意', 'r+1 别越界']],
    counters: '操作数',
    legend: techLegend,
    inputs: [
      {
        label: '三次区间加',
        make: () => ({ n: 7, ops: [[0, 2, 3], [2, 4, -2], [5, 6, 4]] }),
      },
      {
        label: '单点重叠',
        make: () => ({ n: 6, ops: [[1, 3, 5], [1, 1, 5], [2, 5, -3]] }),
      },
    ],
    code: diffCode,
    run: rangeAdd,
  },
  {
    id: 'at-jump-game',
    group: '数组技巧',
    title: '跳跃游戏（贪心）',
    brief: '维护"最远能到哪"就够了。遍历中一旦发现当前下标已经超过最远可达，说明断档，直接返回 false。O(n) 一趟走完。',
    view: 'array',
    facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['贪心量', '最远可达'], ['判负', 'i > reach']],
    counters: '访问',
    legend: techLegend,
    inputs: jumpInputs(),
    code: jumpCode,
    run: canJump,
  },
];
