/**
 * 二分查找的六种常见写法。
 *
 * 这一组放在一起是有原因的：二分的坑几乎全在"区间开闭"上。
 * 闭区间 [lo, hi] 用 lo <= hi，半开区间 [lo, hi) 用 lo < hi，
 * 混用就会出现死循环或者漏掉最后一个元素，而且只在边界用例上才崩。
 * 六个变体各自的区间约定都写进了代码注释和每步说明里，对照着看最省事。
 *
 * 所有用例都用**互不相同**的已排序数组，加一组带重复值的专门看左右边界差别。
 */

/** n 个互不相同的随机数并升序排列 */
function sortedUnique(n = 10) {
  const s = new Set();
  while (s.size < n) s.add(5 + Math.floor(Math.random() * 90));
  return [...s].sort((a, b) => a - b);
}

/** 带重复值的已排序数组 */
function sortedDup(n = 12) {
  const arr = [];
  let v = 10;
  while (arr.length < n) {
    const times = 1 + Math.floor(Math.random() * 3);
    for (let k = 0; k < times && arr.length < n; k++) arr.push(v);
    v += 5 + Math.floor(Math.random() * 12);
  }
  return arr.sort((a, b) => a - b);
}

/** 命中用例：目标一定存在 */
function hitInputs() {
  return [
    {
      label: '目标存在（中间）',
      make: () => { const a = sortedUnique(10); return { nums: a, target: a[Math.floor(a.length / 2)] }; },
    },
    {
      label: '目标存在（端点）',
      make: () => { const a = sortedUnique(10); return { nums: a, target: Math.random() < 0.5 ? a[0] : a[a.length - 1] }; },
    },
    {
      label: '目标不存在',
      make: () => { const a = sortedUnique(9); return { nums: a, target: a[0] - 3 }; },
    },
  ];
}

function dupInputs() {
  return [
    {
      label: '有重复值',
      make: () => { const a = sortedDup(12); return { nums: a, target: a[Math.floor(a.length / 2)] }; },
    },
  ];
}

/** 统一的步骤记录：每步都是完整快照，指针和区间都不省略 */
function makeSteps(counters = { 比较: 0 }) {
  const steps = [];
  const push = (state, note, line, extra) => steps.push({
    state: { ...state },
    note,
    line,
    counters: { ...counters, ...extra },
  });
  return { steps, push };
}

// ─────────────────────────────────────────────────────────────
// 1. 标准二分
// ─────────────────────────────────────────────────────────────

const stdCode = [
  'function search(nums, target) {',
  '  let lo = 0, hi = nums.length - 1;   // 闭区间 [lo, hi]',
  '  while (lo <= hi) {',
  '    const mid = lo + ((hi - lo) >> 1);',
  '    if (nums[mid] === target) return mid;',
  '    if (nums[mid] < target) lo = mid + 1;',
  '    else hi = mid - 1;',
  '  }',
  '  return -1;',
  '}',
];

function standardSearch(input) {
  const { nums, target } = input;
  const c = { 比较: 0 };
  const { steps, push } = makeSteps(c);
  let lo = 0;
  let hi = nums.length - 1;

  push({ values: nums, range: { lo, hi }, rangeLabel: `闭区间 [${lo}, ${hi}]`, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
    `在 ${nums.length} 个有序数里找 ${target}。区间用闭区间：lo 和 hi 都可能就是答案。`, 1);

  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    c.比较 += 1;
    push(
      {
        values: nums, compare: [mid], pivot: mid,
        range: { lo, hi },
        pointers: [{ i: lo, text: 'lo' }, { i: mid, text: 'mid' }, { i: hi, text: 'hi' }],
      },
      `mid = ${mid}，nums[${mid}] = ${nums[mid]}，与目标 ${target} 比较。`,
      3,
    );

    if (nums[mid] === target) {
      push({ values: nums, settled: [mid], pivot: mid, pointers: [{ i: mid, text: 'mid' }] },
        `命中，返回 ${mid}。`, 4);
      return { steps, result: { idx: mid } };
    }
    if (nums[mid] < target) {
      lo = mid + 1;
      push({ values: nums, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
        `${nums[mid]} < ${target}，答案只可能在右边，lo 移到 ${lo}。`, 5);
    } else {
      hi = mid - 1;
      push({ values: nums, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
        `${nums[mid]} > ${target}，答案只可能在左边，hi 移到 ${hi}。`, 6);
    }
  }

  push({ values: nums, pointers: [] }, `lo(${lo}) > hi(${hi})，区间空了，说明不存在，返回 -1。`, 8);
  return { steps, result: { idx: -1 } };
}

// ─────────────────────────────────────────────────────────────
// 2. 左边界：第一个等于目标的位置
// ─────────────────────────────────────────────────────────────

const leftCode = [
  'function leftBound(nums, target) {',
  '  let lo = 0, hi = nums.length - 1, ans = -1;',
  '  while (lo <= hi) {',
  '    const mid = lo + ((hi - lo) >> 1);',
  '    if (nums[mid] === target) {',
  '      ans = mid; hi = mid - 1;    // 记下来，继续往左找',
  '    } else if (nums[mid] < target) {',
  '      lo = mid + 1;',
  '    } else {',
  '      hi = mid - 1;',
  '    }',
  '  }',
  '  return ans;',
  '}',
];

function leftBoundSearch(input) {
  const { nums, target } = input;
  const c = { 比较: 0 };
  const { steps, push } = makeSteps(c);
  let lo = 0;
  let hi = nums.length - 1;
  let ans = -1;

  push({ values: nums, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
    `找 ${target} 第一次出现的位置。命中不算完，要继续往左压缩区间。`, 1);

  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    c.比较 += 1;
    push({ values: nums, compare: [mid], pivot: mid, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: mid, text: 'mid' }, { i: hi, text: 'hi' }] },
      `mid = ${mid}，nums[${mid}] = ${nums[mid]}。`, 3);

    if (nums[mid] === target) {
      ans = mid;
      hi = mid - 1;
      push({ values: nums, settled: [mid], pivot: mid, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
        `命中下标 ${mid}，先记下 ans = ${mid}，然后把 hi 收到 ${hi} 继续往左找有没有更早的。`, 5);
    } else if (nums[mid] < target) {
      lo = mid + 1;
      push({ values: nums, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
        `偏小，lo 移到 ${lo}。`, 7);
    } else {
      hi = mid - 1;
      push({ values: nums, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
        `偏大，hi 移到 ${hi}。`, 9);
    }
  }

  push({ values: nums, pointers: [] }, ans >= 0 ? `左边界是 ${ans}。` : `没找到 ${target}，返回 -1。`, 12);
  return { steps, result: { idx: ans } };
}

// ─────────────────────────────────────────────────────────────
// 3. 右边界：最后一个等于目标的位置
// ─────────────────────────────────────────────────────────────

const rightCode = [
  'function rightBound(nums, target) {',
  '  let lo = 0, hi = nums.length - 1, ans = -1;',
  '  while (lo <= hi) {',
  '    const mid = lo + ((hi - lo) >> 1);',
  '    if (nums[mid] === target) {',
  '      ans = mid; lo = mid + 1;    // 记下来，继续往右找',
  '    } else if (nums[mid] > target) {',
  '      hi = mid - 1;',
  '    } else {',
  '      lo = mid + 1;',
  '    }',
  '  }',
  '  return ans;',
  '}',
];

function rightBoundSearch(input) {
  const { nums, target } = input;
  const c = { 比较: 0 };
  const { steps, push } = makeSteps(c);
  let lo = 0;
  let hi = nums.length - 1;
  let ans = -1;

  push({ values: nums, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
    `找 ${target} 最后一次出现的位置。跟左边界完全对称，只是命中后往右压。`, 1);

  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    c.比较 += 1;
    push({ values: nums, compare: [mid], pivot: mid, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: mid, text: 'mid' }, { i: hi, text: 'hi' }] },
      `mid = ${mid}，nums[${mid}] = ${nums[mid]}。`, 3);

    if (nums[mid] === target) {
      ans = mid;
      lo = mid + 1;
      push({ values: nums, settled: [mid], pivot: mid, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
        `命中下标 ${mid}，ans = ${mid}，lo 移到 ${lo} 继续往右找。`, 5);
    } else if (nums[mid] > target) {
      hi = mid - 1;
      push({ values: nums, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
        `偏大，hi 移到 ${hi}。`, 7);
    } else {
      lo = mid + 1;
      push({ values: nums, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
        `偏小，lo 移到 ${lo}。`, 9);
    }
  }

  push({ values: nums, pointers: [] }, ans >= 0 ? `右边界是 ${ans}。` : `没找到 ${target}，返回 -1。`, 12);
  return { steps, result: { idx: ans } };
}

// ─────────────────────────────────────────────────────────────
// 4. 下界：第一个 >= target 的位置
// ─────────────────────────────────────────────────────────────

const lowerCode = [
  'function lowerBound(nums, target) {',
  '  let lo = 0, hi = nums.length;   // 半开区间 [lo, hi)',
  '  while (lo < hi) {',
  '    const mid = lo + ((hi - lo) >> 1);',
  '    if (nums[mid] < target) lo = mid + 1;',
  '    else hi = mid;',
  '  }',
  '  return lo;   // 可能是 nums.length，表示没有比 target 大的',
  '}',
];

function lowerBoundSearch(input) {
  const { nums, target } = input;
  const c = { 比较: 0 };
  const { steps, push } = makeSteps(c);
  let lo = 0;
  let hi = nums.length;

  push({ values: nums, range: { lo, hi: hi - 1 }, rangeLabel: `半开区间 [${lo}, ${hi})`, pointers: [{ i: lo, text: 'lo' }, { i: Math.min(hi, nums.length - 1), text: 'hi', muted: true }] },
    `找第一个 ≥ ${target} 的位置。这是 STL 的 lower_bound，也是所有"找位置"类二分的母版。`, 1);

  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    c.比较 += 1;
    push({ values: nums, compare: [mid], pivot: mid, range: { lo, hi: hi - 1 }, pointers: [{ i: lo, text: 'lo' }, { i: mid, text: 'mid' }, { i: Math.min(hi, nums.length - 1), text: 'hi', muted: true }] },
      `mid = ${mid}，nums[${mid}] = ${nums[mid]}。`, 3);

    if (nums[mid] < target) {
      lo = mid + 1;
      push({ values: nums, range: { lo, hi: hi - 1 }, pointers: [{ i: lo, text: 'lo' }] },
        `${nums[mid]} < ${target}，mid 及其左边都不可能是答案，lo 移到 ${lo}。`, 4);
    } else {
      hi = mid;
      push({ values: nums, range: { lo, hi: hi - 1 }, pointers: [{ i: lo, text: 'lo' }, { i: Math.min(hi, nums.length - 1), text: 'hi', muted: true }] },
        `${nums[mid]} ≥ ${target}，mid 可能就是答案，所以 hi 收到 ${hi}（不是 mid-1，否则会把答案排除掉）。`, 5);
    }
  }

  push({ values: nums, pointers: [{ i: lo, text: 'ans' }] },
    lo < nums.length
      ? `答案是下标 ${lo}，值 ${nums[lo]}。`
      : `答案是 ${lo}，等于数组长度，说明所有元素都小于 ${target}。`, 7);
  return { steps, result: { idx: lo } };
}

// ─────────────────────────────────────────────────────────────
// 5. 上界：最后一个 <= target 的位置
// ─────────────────────────────────────────────────────────────

const upperCode = [
  'function upperBound(nums, target) {',
  '  let lo = 0, hi = nums.length - 1, ans = -1;',
  '  while (lo <= hi) {',
  '    const mid = lo + ((hi - lo) >> 1);',
  '    if (nums[mid] <= target) {',
  '      ans = mid; lo = mid + 1;   // 满足条件就记下，继续往右',
  '    } else {',
  '      hi = mid - 1;',
  '    }',
  '  }',
  '  return ans;',
  '}',
];

function upperBoundSearch(input) {
  const { nums, target } = input;
  const c = { 比较: 0 };
  const { steps, push } = makeSteps(c);
  let lo = 0;
  let hi = nums.length - 1;
  let ans = -1;

  push({ values: nums, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
    `找最后一个 ≤ ${target} 的位置。和下界一起用，就能框出"值落在某范围内"的一整段。`, 1);

  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    c.比较 += 1;
    push({ values: nums, compare: [mid], pivot: mid, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: mid, text: 'mid' }, { i: hi, text: 'hi' }] },
      `mid = ${mid}，nums[${mid}] = ${nums[mid]}。`, 3);

    if (nums[mid] <= target) {
      ans = mid;
      lo = mid + 1;
      push({ values: nums, settled: [mid], pivot: mid, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
        `${nums[mid]} ≤ ${target}，先记 ans = ${mid}，再往右看有没有更大的。`, 5);
    } else {
      hi = mid - 1;
      push({ values: nums, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
        `${nums[mid]} > ${target}，hi 移到 ${hi}。`, 7);
    }
  }

  push({ values: nums, pointers: [] }, ans >= 0 ? `答案是下标 ${ans}，值 ${nums[ans]}。` : `没有 ≤ ${target} 的元素，返回 -1。`, 10);
  return { steps, result: { idx: ans } };
}

// ─────────────────────────────────────────────────────────────
// 6. 旋转数组里二分
// ─────────────────────────────────────────────────────────────

const rotCode = [
  'function searchRotated(nums, target) {',
  '  let lo = 0, hi = nums.length - 1;',
  '  while (lo <= hi) {',
  '    const mid = lo + ((hi - lo) >> 1);',
  '    if (nums[mid] === target) return mid;',
  '    if (nums[lo] <= nums[mid]) {        // 左半段有序',
  '      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;',
  '      else lo = mid + 1;',
  '    } else {                            // 右半段有序',
  '      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;',
  '      else hi = mid - 1;',
  '    }',
  '  }',
  '  return -1;',
  '}',
];

function rotatedSearch(input) {
  const { nums, target } = input;
  const c = { 比较: 0 };
  const { steps, push } = makeSteps(c);
  let lo = 0;
  let hi = nums.length - 1;

  push({ values: nums, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
    `这是个被旋转过的有序数组（从中间某处切开换了位置）。找 ${target}。`, 1);

  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    c.比较 += 1;
    const leftSorted = nums[lo] <= nums[mid];
    push(
      {
        values: nums, compare: [mid], pivot: mid, range: { lo, hi },
        pointers: [{ i: lo, text: 'lo' }, { i: mid, text: 'mid' }, { i: hi, text: 'hi' }],
      },
      `mid = ${mid}（值 ${nums[mid]}）。判断哪一半有序：nums[lo]=${nums[lo]} ≤ nums[mid]=${nums[mid]}，所以${leftSorted ? '左' : '右'}半段有序。`,
      5,
    );

    if (nums[mid] === target) {
      push({ values: nums, settled: [mid], pivot: mid, pointers: [{ i: mid, text: 'mid' }] }, `命中，返回 ${mid}。`, 4);
      return { steps, result: { idx: mid } };
    }

    if (leftSorted) {
      if (nums[lo] <= target && target < nums[mid]) {
        hi = mid - 1;
        push({ values: nums, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
          `目标在有序的左半段范围内，hi 收到 ${hi}。`, 6);
      } else {
        lo = mid + 1;
        push({ values: nums, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
          `目标不在左半段，只能去右边，lo 移到 ${lo}。`, 7);
      }
    } else {
      if (nums[mid] < target && target <= nums[hi]) {
        lo = mid + 1;
        push({ values: nums, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
          `目标在有序的右半段范围内，lo 移到 ${lo}。`, 9);
      } else {
        hi = mid - 1;
        push({ values: nums, range: { lo, hi }, pointers: [{ i: lo, text: 'lo' }, { i: hi, text: 'hi' }] },
          `目标不在右半段，hi 收到 ${hi}。`, 10);
      }
    }
  }

  push({ values: nums, pointers: [] }, `区间空了，${target} 不存在，返回 -1。`, 13);
  return { steps, result: { idx: -1 } };
}

// ─────────────────────────────────────────────────────────────

const bsLegend = [
  { cls: 'bar', text: '数组元素' },
  { cls: 'bar is-compare', text: '正在比较' },
  { cls: 'bar is-pivot', text: '当前 mid' },
  { cls: 'bar is-settled', text: '命中位置' },
];

const bsFacts = [['时间', 'O(log n)'], ['空间', 'O(1)'], ['前提', '数组有序']];

/** 旋转用例：有序数组从某处切开交换两段 */
function rotatedInputs() {
  const make = () => {
    const a = sortedUnique(10);
    const cut = 1 + Math.floor(Math.random() * (a.length - 2));
    const nums = [...a.slice(cut), ...a.slice(0, cut)];
    const target = Math.random() < 0.75 ? nums[Math.floor(Math.random() * nums.length)] : a[0] - 1;
    return { nums, target };
  };
  return [{ label: '随机旋转', make }, { label: '再试一组', make }];
}

export const binarySearchAlgorithms = [
  {
    id: 'bs-standard',
    group: '查找',
    title: '二分查找（标准）',
    brief: '闭区间写法：lo 和 hi 都可能就是答案。mid 用 lo + (hi-lo)/2 算，避免 lo+hi 溢出。',
    view: 'array',
    facts: bsFacts,
    counters: '比较',
    legend: bsLegend,
    inputs: hitInputs(),
    code: stdCode,
    run: standardSearch,
  },
  {
    id: 'bs-left',
    group: '查找',
    title: '二分 · 左边界',
    brief: '找第一个等于目标的位置。命中之后不能马上返回，要记下来继续往左压——这是和标准二分最大的区别。',
    view: 'array',
    facts: bsFacts,
    counters: '比较',
    legend: bsLegend,
    inputs: dupInputs().concat([
      { label: '只有一个目标', make: () => { const a = sortedDup(10); return { nums: a, target: a[0] - 2 }; } },
    ]),
    code: leftCode,
    run: leftBoundSearch,
  },
  {
    id: 'bs-right',
    group: '查找',
    title: '二分 · 右边界',
    brief: '找最后一个等于目标的位置，和左边界完全对称，命中后往右压。左右边界一起用就能数出目标出现了几次。',
    view: 'array',
    facts: bsFacts,
    counters: '比较',
    legend: bsLegend,
    inputs: dupInputs().concat([
      { label: '目标不存在', make: () => { const a = sortedDup(10); return { nums: a, target: a[a.length - 1] + 2 }; } },
    ]),
    code: rightCode,
    run: rightBoundSearch,
  },
  {
    id: 'bs-lower',
    group: '查找',
    title: '二分 · 下界 lower_bound',
    brief: '第一个 ≥ target 的位置。半开区间 [lo, hi)，不满足就 lo=mid+1，满足就 hi=mid——注意是 mid 不是 mid-1，写成 mid-1 就把答案排除了。',
    view: 'array',
    facts: bsFacts,
    counters: '比较',
    legend: bsLegend,
    inputs: [
      { label: '目标在中间', make: () => { const a = sortedUnique(10); return { nums: a, target: a[4] }; } },
      { label: '目标在两端之间', make: () => { const a = sortedUnique(10); return { nums: a, target: a[3] + Math.max(1, Math.floor((a[4] - a[3]) / 2)) }; } },
      { label: '目标比所有数都大', make: () => { const a = sortedUnique(9); return { nums: a, target: a[a.length - 1] + 5 }; } },
    ],
    code: lowerCode,
    run: lowerBoundSearch,
  },
  {
    id: 'bs-upper',
    group: '查找',
    title: '二分 · 上界',
    brief: '最后一个 ≤ target 的位置。和下界配对使用，能直接框出"值落在某区间"的整段下标范围。',
    view: 'array',
    facts: bsFacts,
    counters: '比较',
    legend: bsLegend,
    inputs: [
      { label: '目标在中间', make: () => { const a = sortedUnique(10); return { nums: a, target: a[5] }; } },
      { label: '目标落在两数之间', make: () => { const a = sortedUnique(10); return { nums: a, target: a[5] + Math.max(1, Math.floor((a[6] - a[5]) / 2)) }; } },
      { label: '目标比所有数都小', make: () => { const a = sortedUnique(9); return { nums: a, target: a[0] - 5 }; } },
    ],
    code: upperCode,
    run: upperBoundSearch,
  },
  {
    id: 'bs-rotated',
    group: '查找',
    title: '二分 · 旋转数组',
    brief: '数组被旋转过，整体无序，但切开后必有一半是有序的。先判断哪半有序，再看目标在不在那半的范围内。',
    view: 'array',
    facts: [['时间', 'O(log n)'], ['空间', 'O(1)'], ['前提', '旋转过的有序数组']],
    counters: '比较',
    legend: bsLegend,
    inputs: rotatedInputs(),
    code: rotCode,
    run: rotatedSearch,
  },
];
