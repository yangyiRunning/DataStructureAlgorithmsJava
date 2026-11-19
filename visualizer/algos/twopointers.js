/**
 * 双指针与滑动窗口。
 *
 * 四道题共用"指针在数组上移动"这一个模型，所以都用数组视图：
 *   - 对撞（左右往中间收）
 *   - 快慢（一个记录写入位置，一个扫描）
 *   - 定长窗口（右进左出，窗口大小不变）
 *   - 变长窗口（窗口不满足条件时左边界才动）
 *
 * 滑动窗口最容易写错的地方是"什么时候收缩左边界"，
 * 所以每一步都把当前窗口用括号画出来，收缩那一步单独记一帧。
 */

// ─────────────────────────────────────────────────────────────
// 对撞双指针：有序数组两数之和
// ─────────────────────────────────────────────────────────────

const twoSumCode = [
  'function twoSum(nums, target) {',
  '  let lo = 0, hi = nums.length - 1;',
  '  while (lo < hi) {',
  '    const sum = nums[lo] + nums[hi];',
  '    if (sum === target) return [lo, hi];',
  '    if (sum < target) lo++;   // 和太小，只能把小的调大',
  '    else hi--;                // 和太大，只能把大的调小',
  '  }',
  '  return [];',
  '}',
];

function twoSum(input) {
  const { nums, target } = input;
  const steps = [];
  let cmp = 0;
  const push = (state, note, line) => steps.push({
    state: { values: nums, ...state },
    note,
    line,
    counters: { 比较: cmp },
  });

  let lo = 0;
  let hi = nums.length - 1;

  push({ pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }], range: { lo, hi }, rangeLabel: '搜索区间' },
    `有序数组，找两个数加起来等于 ${target}。因为有顺序，才能用"小的太小就换大的"这种推理。`, 1);

  while (lo < hi) {
    const sum = nums[lo] + nums[hi];
    cmp += 1;
    push({ compare: [lo, hi], pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }], range: { lo, hi } },
      `${nums[lo]} + ${nums[hi]} = ${sum}，与 ${target} 比较。`, 3);

    if (sum === target) {
      push({ settled: [lo, hi], pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
        `正好相等，答案是下标 ${lo} 和 ${hi}。`, 4);
      return { steps, result: { pair: `${lo},${hi}` } };
    }
    if (sum < target) {
      lo += 1;
      push({ pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }], range: { lo, hi } },
        `和偏小。hi 已经指向当前能取的最大值，换它只会更小，只能把 lo 往右挪。`, 5);
    } else {
      hi -= 1;
      push({ pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }], range: { lo, hi } },
        `和偏大。lo 已经是最小值，只能把 hi 往左挪。`, 6);
    }
  }

  push({ pointers: [] }, `指针相遇还没找到，说明不存在这样一对。`, 8);
  return { steps, result: { pair: 'none' } };
}

// ─────────────────────────────────────────────────────────────
// 快慢双指针：原地删除重复项
// ─────────────────────────────────────────────────────────────

const dedupeCode = [
  'function dedupe(nums) {',
  '  if (nums.length === 0) return 0;',
  '  let slow = 0;                      // 已去重区间的末尾',
  '  for (let fast = 1; fast < nums.length; fast++) {',
  '    if (nums[fast] !== nums[slow]) {',
  '      slow++;',
  '      nums[slow] = nums[fast];       // 写回，原地不动用额外空间',
  '    }',
  '  }',
  '  return slow + 1;                   // 新长度',
  '}',
];

function dedupe(input) {
  const nums = input.slice();
  const steps = [];
  let cmp = 0;
  let write = 0;
  const push = (state, note, line) => steps.push({
    state: { values: nums.slice(), ...state },
    note,
    line,
    counters: { 比较: cmp, 写入: write },
  });

  let slow = 0;
  push({ pointers: [{ i: 0, text: 'slow' }], settled: [0] },
    '快指针负责扫描，慢指针负责记录"下一个该放哪"。慢指针及左边永远是不重复的。', 2);

  for (let fast = 1; fast < nums.length; fast++) {
    cmp += 1;
    push({ compare: [fast], pointers: [{ i: slow, text: 'slow' }, { i: fast, text: 'fast' }], settled: Array.from({ length: slow + 1 }, (_, k) => k) },
      `比较 nums[${fast}] = ${nums[fast]} 与 nums[${slow}] = ${nums[slow]}。`, 4);
    if (nums[fast] !== nums[slow]) {
      slow += 1;
      nums[slow] = nums[fast];
      write += 1;
      push({ move: [slow], pointers: [{ i: slow, text: 'slow' }, { i: fast, text: 'fast' }], settled: Array.from({ length: slow + 1 }, (_, k) => k) },
        `不一样，slow 前进到 ${slow}，把这个新值写过去。`, 6);
    } else {
      push({ pointers: [{ i: slow, text: 'slow' }, { i: fast, text: 'fast' }], settled: Array.from({ length: slow + 1 }, (_, k) => k) },
        `重复，跳过。`, 4);
    }
  }

  push({ pointers: [] }, `新长度是 ${slow + 1}，前 ${slow + 1} 个元素就是不重复的序列。`, 9);
  return { steps, result: { arr: nums.slice(0, slow + 1).join(','), len: slow + 1 } };
}

// ─────────────────────────────────────────────────────────────
// 定长滑动窗口：子数组最大平均数
// ─────────────────────────────────────────────────────────────

const fixedCode = [
  'function maxAverage(nums, k) {',
  '  let sum = 0;',
  '  for (let i = 0; i < k; i++) sum += nums[i];   // 第一个窗口',
  '  let best = sum;',
  '  for (let i = k; i < nums.length; i++) {',
  '    sum += nums[i] - nums[i - k];               // 进一个出一个',
  '    if (sum > best) best = sum;',
  '  }',
  '  return best / k;',
  '}',
];

function maxAverage(input) {
  const { nums, k } = input;
  const steps = [];
  let cmp = 0;
  const push = (state, note, line) => steps.push({
    state: { values: nums, ...state },
    note,
    line,
    counters: { 比较: cmp },
  });

  let sum = 0;
  for (let i = 0; i < k; i++) {
    sum += nums[i];
    push({ window: { lo: 0, hi: i }, settled: Array.from({ length: i + 1 }, (_, x) => x), container: { label: '窗口和', items: [{ text: String(sum), hot: true }] } },
      `先把前 ${k} 个加起来，当前和 ${sum}。`, 2);
  }
  let best = sum;
  push({ window: { lo: 0, hi: k - 1 }, container: { label: '窗口和', items: [{ text: String(sum), hot: true }] } },
    `第一个窗口 [0, ${k - 1}] 的和是 ${sum}，先当作目前最好。`, 3);

  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    cmp += 1;
    push(
      {
        window: { lo: i - k + 1, hi: i },
        compare: [i],
        move: [i - k],
        container: { label: '窗口和', items: [{ text: String(sum), hot: true }] },
      },
      `窗口右移：加进 nums[${i}] = ${nums[i]}，移出 nums[${i - k}] = ${nums[i - k]}，和变成 ${sum}。`,
      5,
    );
    if (sum > best) {
      best = sum;
      push({ window: { lo: i - k + 1, hi: i }, container: { label: '窗口和', items: [{ text: String(sum), hot: true }] } },
        `比之前大，记住这个 ${sum}。`, 6);
    }
  }

  push({ settled: [] }, `最大和是 ${best}，平均 ${(best / k).toFixed(4)}。定长窗口的关键：进来一个就必须出去一个，窗口宽度始终是 ${k}。`, 8);
  // 结果只交出"最大和"这个整数：平均值交给界面显示。
  // 对拍要逐字比对，浮点格式化两端舍入规则不一样，会误报。
  return { steps, result: { sum: best } };
}

// ─────────────────────────────────────────────────────────────
// 变长滑动窗口：无重复字符的最长子串
// ─────────────────────────────────────────────────────────────

const varCode = [
  'function longestUnique(s) {',
  '  const last = new Map();   // 字符 -> 上次出现的下标',
  '  let left = 0, best = 0;',
  '  for (let right = 0; right < s.length; right++) {',
  '    const c = s[right];',
  '    if (last.has(c) && last.get(c) >= left) {',
  '      left = last.get(c) + 1;   // 窗口左边界跳到重复字符之后',
  '    }',
  '    last.set(c, right);',
  '    if (right - left + 1 > best) best = right - left + 1;',
  '  }',
  '  return best;',
  '}',
];

function longestUnique(input) {
  const s = [...input];
  const steps = [];
  let cmp = 0;
  const push = (state, note, line) => steps.push({
    state: { chars: s, ...state },
    note,
    line,
    counters: { 比较: cmp },
  });

  const last = new Map();
  let left = 0;
  let best = 0;

  push({ window: { lo: 0, hi: 0 }, pointers: [{ i: 0, text: 'left' }], container: { label: '最长', items: [{ text: '0', hot: true }] } },
    '右指针负责扩张，发现重复就把左指针跳到重复字符的下一位。窗口内永远无重复。', 1);

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    const dup = last.has(c) && last.get(c) >= left;
    cmp += 1;
    push(
      {
        window: { lo: left, hi: right },
        compare: [right],
        pointers: [{ i: left, text: 'left' }, { i: right, text: 'right' }],
        container: { label: '最长', items: [{ text: String(best), hot: true }] },
      },
      `右指针到下标 ${right}（字符 ${c}）。${dup ? `这个字符在上次出现在 ${last.get(c)}，在窗口内，重复了。` : '窗口里没有这个字符，可以继续扩。'}`,
      4,
    );

    if (dup) {
      left = last.get(c) + 1;
      push(
        {
          window: { lo: left, hi: right },
          pointers: [{ i: left, text: 'left' }, { i: right, text: 'right' }],
          moved: [left],
          container: { label: '最长', items: [{ text: String(best), hot: true }] },
        },
        `左边界跳到 ${left}——直接跳过去，不是一格一格挪，这是这道题能做到 O(n) 的关键。`,
        6,
      );
    }

    last.set(c, right);
    if (right - left + 1 > best) best = right - left + 1;
    push(
      {
        window: { lo: left, hi: right },
        pointers: [{ i: left, text: 'left' }, { i: right, text: 'right' }],
        container: { label: '最长', items: [{ text: String(best), hot: true }] },
      },
      `当前窗口长度 ${right - left + 1}，最长记录 ${best}。`,
      9,
    );
  }

  push({}, `最长无重复子串长度是 ${best}。`, 11);
  return { steps, result: { len: best } };
}

// ─────────────────────────────────────────────────────────────

const tpLegend = [
  { cls: 'bar', text: '未处理' },
  { cls: 'bar is-compare', text: '正在比较' },
  { cls: 'bar is-move', text: '写入 / 移出' },
  { cls: 'bar is-settled', text: '已确定（去重区 / 命中）' },
];

const charLegend = [
  { cls: 'cell', text: '字符' },
  { cls: 'cell is-compare', text: '当前字符' },
  { cls: 'cell is-move', text: '新起点' },
];

function twoSumInputs() {
  const make = () => {
    const s = new Set();
    while (s.size < 9) s.add(5 + Math.floor(Math.random() * 80));
    const nums = [...s].sort((a, b) => a - b);
    // 一半概率目标真实存在，一半概率不存在
    if (Math.random() < 0.7) {
      const i = Math.floor(Math.random() * nums.length);
      let j = Math.floor(Math.random() * nums.length);
      while (j === i) j = Math.floor(Math.random() * nums.length);
      return { nums, target: nums[i] + nums[j] };
    }
    return { nums, target: nums[0] + 1 };
  };
  return [{ label: '随机有序数组', make }, { label: '再试一组', make }];
}

function dedupeInputs() {
  const make = () => {
    const arr = [];
    let v = 5;
    while (arr.length < 12) {
      const t = 1 + Math.floor(Math.random() * 3);
      for (let k = 0; k < t && arr.length < 12; k++) arr.push(v);
      v += 4 + Math.floor(Math.random() * 10);
    }
    return arr;
  };
  return [{ label: '含重复（已排序）', make }, { label: '再试一组', make }];
}

function fixedWindowInputs() {
  const make = (k) => () => ({
    nums: Array.from({ length: 10 }, () => 1 + Math.floor(Math.random() * 40)),
    k,
  });
  return [
    { label: 'k = 3', make: make(3) },
    { label: 'k = 5', make: make(5) },
  ];
}

function varWindowInputs() {
  const gen = () => {
    const pool = 'abcde'.split('');
    return Array.from({ length: 11 }, () => pool[Math.floor(Math.random() * pool.length)]).join('');
  };
  return [{ label: '随机小写串', make: gen }, { label: '再试一组', make: gen }];
}

export const twoPointerAlgorithms = [
  {
    id: 'tp-two-sum',
    group: '双指针与滑窗',
    title: '对撞双指针 · 两数之和',
    brief: '有序数组里找两数之和：一个指针在头、一个在尾，和太小就把小的调大，太大就把大的调小。每步都能排除掉一整行不可能的组合。',
    view: 'array',
    facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['前提', '数组有序']],
    counters: '比较',
    legend: tpLegend,
    inputs: twoSumInputs(),
    code: twoSumCode,
    run: twoSum,
  },
  {
    id: 'tp-dedupe',
    group: '双指针与滑窗',
    title: '快慢双指针 · 原地去重',
    brief: '快指针扫描，慢指针记录下一个该写的位置。慢指针及左边永远是去重后的结果，全程不动用额外数组。',
    view: 'array',
    facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['要点', '原地覆盖']],
    counters: '比较、写入',
    legend: tpLegend,
    inputs: dedupeInputs(),
    code: dedupeCode,
    run: dedupe,
  },
  {
    id: 'tp-window-fixed',
    group: '双指针与滑窗',
    title: '定长滑动窗口',
    brief: '求长度为 k 的子数组最大平均数。窗口宽度恒定，右边界进一个、左边界就出一个，避免每次重新求和。',
    view: 'array',
    facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['要点', '进一个出一个']],
    counters: '比较',
    legend: tpLegend,
    inputs: fixedWindowInputs(),
    code: fixedCode,
    run: maxAverage,
  },
  {
    id: 'tp-window-var',
    group: '双指针与滑窗',
    title: '变长滑动窗口 · 无重复最长子串',
    brief: '右边界一直扩，碰到重复字符就把左边界直接跳到重复字符之后。是"跳"而不是"一格一格挪"，这才有 O(n)。',
    view: 'array',
    facts: [['时间', 'O(n)'], ['空间', 'O(字符集)'], ['要点', '左边界直接跳']],
    counters: '比较',
    legend: charLegend,
    inputs: varWindowInputs(),
    code: varCode,
    run: longestUnique,
  },
];
