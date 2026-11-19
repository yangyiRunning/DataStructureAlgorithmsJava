/**
 * 四个基础排序。
 *
 * 三件事在这一个文件里同时成立，不能有一样飘：
 *   1. 屏幕上显示的代码（code 数组）就是下面真正执行的逻辑，逐行对应；
 *      每一步 step.line 指的是 code 里的行号，所以改逻辑必须同步改 code，否则会指到错的行。
 *   2. 每一步都是完整快照（values 用 slice 复制一份），不是增量补丁。
 *      数组最长十来个数，快照的开销可以忽略，换来的是"回退到任意一步"永远正确——
 *      增量补丁一旦漏记一个字段，往回拖进度条就会看到上一个算法的残留状态。
 *   3. 每次比较/移动都计数，界面上显示的数就是真实执行次数，用来对照复杂度推导
 *      （比如冒泡在已排好的输入上只比较 n-1 次，因为记到 swapped=false 就提前跳出）。
 */

const N = 12;

/** 一排长度 N 的随机数组，值域 5..99，允许重复（重复值才看得出稳定性的差别） */
function randomArray() {
  return Array.from({ length: N }, () => 5 + Math.floor(Math.random() * 95));
}

function sortedArray() {
  return randomArray().sort((x, y) => x - y);
}

function reversedArray() {
  return randomArray().sort((x, y) => y - x);
}

function sameArray() {
  const v = 5 + Math.floor(Math.random() * 90);
  return Array.from({ length: N }, () => v);
}

/** 只在最后一次点击时算一次，别每次渲染都生成新输入，否则同一组用例会自己变 */
function makeInputs() {
  return [
    { label: '随机', make: randomArray },
    { label: '已排好', make: sortedArray },
    { label: '完全逆序', make: reversedArray },
    { label: '全部相同', make: sameArray },
  ];
}

const COUNTER_KEYS = '比较、移动';

// ─────────────────────────────────────────────────────────────
// 冒泡排序
// ─────────────────────────────────────────────────────────────

const bubbleCode = [
  'function bubbleSort(a) {',
  '  for (let end = a.length - 1; end > 0; end--) {',
  '    let swapped = false;',
  '    for (let i = 0; i < end; i++) {',
  '      if (a[i] > a[i + 1]) {',
  '        [a[i], a[i + 1]] = [a[i + 1], a[i]];',
  '        swapped = true;',
  '      }',
  '    }',
  '    if (!swapped) break;',
  '  }',
  '  return a;',
  '}',
];

function bubbleSort(input) {
  const a = input.slice();
  const steps = [];
  let compare = 0;
  let move = 0;
  const settled = new Set();

  const push = (state, note, line) => steps.push({
    state: { values: a.slice(), settled: [...settled], ...state },
    note,
    line,
    counters: { 比较: compare, 移动: move },
  });

  push({}, `开始。共 ${a.length} 个元素，从右往左逐个确定位置。`, 1);

  for (let end = a.length - 1; end > 0; end--) {
    let swapped = false;
    for (let i = 0; i < end; i++) {
      compare += 1;
      push(
        { compare: [i, i + 1], range: { lo: 0, hi: end }, rangeLabel: `本轮比较区间 0–${end}` },
        `比较 a[${i}]=${a[i]} 与 a[${i + 1}]=${a[i + 1]}`,
        4,
      );
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        move += 1;
        swapped = true;
        push(
          { move: [i, i + 1], range: { lo: 0, hi: end } },
          `${a[i + 1]} > ${a[i]}，交换，大的继续往后冒`,
          5,
        );
      }
    }
    settled.add(end);
    push(
      { range: { lo: 0, hi: end - 1 } },
      `a[${end}]=${a[end]} 是本轮最大的，位置定死。剩下 ${end} 个待排。`,
      9,
    );
    if (!swapped) {
      for (let k = 0; k < end; k++) settled.add(k);
      push({}, '本轮一次交换都没发生，说明数组已经有序，直接结束——这就是冒泡的提前退出。', 9);
      break;
    }
  }

  for (let k = 0; k < a.length; k++) settled.add(k);
  push({}, `完成。共比较 ${compare} 次、移动 ${move} 次。已排好时只比较 ${a.length - 1} 次。`, 11);
  return { steps, result: { values: a } };
}

// ─────────────────────────────────────────────────────────────
// 插入排序
// ─────────────────────────────────────────────────────────────

const insertionCode = [
  'function insertionSort(a) {',
  '  for (let i = 1; i < a.length; i++) {',
  '    const key = a[i];',
  '    let j = i - 1;',
  '    while (j >= 0 && a[j] > key) {',
  '      a[j + 1] = a[j];',
  '      j--;',
  '    }',
  '    a[j + 1] = key;',
  '  }',
  '  return a;',
  '}',
];

function insertionSort(input) {
  const a = input.slice();
  const steps = [];
  let compare = 0;
  let move = 0;

  const push = (state, note, line) => steps.push({
    state,
    note,
    line,
    counters: { 比较: compare, 移动: move },
  });

  push({ values: a.slice(), settled: [] }, '开始。左边第一个元素自身算有序区，从第 2 个开始往左插。', 1);

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    const sortedPrefix = Array.from({ length: i }, (_, k) => k);
    push(
      {
        values: a.slice(),
        settled: sortedPrefix,
        pivot: i,
        pointers: [{ i, text: 'i' }],
        range: { lo: 0, hi: i },
        rangeLabel: `有序区 0–${i - 1}，把 a[${i}] 插进去`,
      },
      `取出 key = a[${i}] = ${key}，前面 ${i} 个元素已经有序，往左找它该待的位置。`,
      2,
    );

    while (j >= 0 && a[j] > key) {
      compare += 1;
      push(
        {
          values: a.slice(),
          settled: sortedPrefix,
          compare: [j],
          pivot: i,
          pointers: [{ i, text: 'i' }, { i: j, text: 'j' }],
        },
        `a[${j}]=${a[j]} > key=${key}，需要让位`,
        4,
      );
      a[j + 1] = a[j];
      move += 1;
      push(
        {
          values: a.slice(),
          settled: sortedPrefix,
          move: [j, j + 1],
          pointers: [{ i: j, text: 'j' }],
        },
        `把 ${a[j]} 右移到 a[${j + 1}]`,
        5,
      );
      j -= 1;
    }
    // 跳出循环有两种可能：j 越界，或者 a[j] <= key。后者也算一次比较，别漏计。
    if (j >= 0) compare += 1;

    a[j + 1] = key;
    push(
      {
        values: a.slice(),
        settled: Array.from({ length: i + 1 }, (_, k) => k),
        pivot: j + 1,
      },
      `key = ${key} 落在 a[${j + 1}]，前 ${i + 1} 个元素有序。`,
      8,
    );
  }

  push(
    { values: a.slice(), settled: a.map((_, k) => k) },
    `完成。共比较 ${compare} 次、移动 ${move} 次。已排好的输入下，每轮只比较 1 次就退出，是 O(n)。`,
    10,
  );
  return { steps, result: { values: a } };
}

// ─────────────────────────────────────────────────────────────
// 选择排序
// ─────────────────────────────────────────────────────────────

const selectionCode = [
  'function selectionSort(a) {',
  '  for (let i = 0; i < a.length - 1; i++) {',
  '    let min = i;',
  '    for (let j = i + 1; j < a.length; j++) {',
  '      if (a[j] < a[min]) min = j;',
  '    }',
  '    if (min !== i) [a[i], a[min]] = [a[min], a[i]];',
  '  }',
  '  return a;',
  '}',
];

function selectionSort(input) {
  const a = input.slice();
  const steps = [];
  let compare = 0;
  let move = 0;
  const settled = new Set();

  const push = (state, note, line) => steps.push({
    state: { values: a.slice(), settled: [...settled], ...state },
    note,
    line,
    counters: { 比较: compare, 移动: move },
  });

  push({}, '开始。每一轮在未排序区里挑最小的，和未排序区的第一个交换。', 1);

  for (let i = 0; i < a.length - 1; i++) {
    let min = i;
    push(
      {
        pivot: min,
        pointers: [{ i, text: 'i', muted: true }, { i: min, text: 'min' }],
        range: { lo: i, hi: a.length - 1 },
        rangeLabel: `未排序区 ${i}–${a.length - 1}`,
      },
      `第 ${i + 1} 轮：先假定 a[${i}]=${a[i]} 最小。`,
      2,
    );

    for (let j = i + 1; j < a.length; j++) {
      compare += 1;
      push(
        {
          compare: [j],
          pivot: min,
          pointers: [{ i, text: 'i', muted: true }, { i: j, text: 'j' }, { i: min, text: 'min' }],
          range: { lo: i, hi: a.length - 1 },
        },
        `a[${j}]=${a[j]} 与当前最小 a[${min}]=${a[min]} 比`,
        4,
      );
      if (a[j] < a[min]) {
        min = j;
        push(
          {
            pivot: min,
            pointers: [{ i, text: 'i', muted: true }, { i: min, text: 'min' }],
            range: { lo: i, hi: a.length - 1 },
          },
          `更小，最小值改记为 a[${min}]=${a[min]}`,
          4,
        );
      }
    }

    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      move += 1;
      push(
        { move: [i, min], pointers: [{ i, text: 'i' }] },
        `把最小值 ${a[i]} 换到 a[${i}]`,
        6,
      );
    }
    settled.add(i);
    push({}, `a[${i}]=${a[i]} 就位。`,
      6);
  }

  settled.add(a.length - 1);
  push(
    {},
    `完成。比较次数恒为 n(n-1)/2 = ${compare} 次，与输入无关；移动最多 n-1 次（这里是 ${move} 次）。`,
    8,
  );
  return { steps, result: { values: a } };
}

// ─────────────────────────────────────────────────────────────
// 快速排序（Lomuto 分区）
// ─────────────────────────────────────────────────────────────

const quickCode = [
  'function quickSort(a, lo = 0, hi = a.length - 1) {',
  '  if (lo >= hi) return;',
  '  const p = a[hi];',
  '  let i = lo;',
  '  for (let j = lo; j < hi; j++) {',
  '    if (a[j] < p) {',
  '      [a[i], a[j]] = [a[j], a[i]];',
  '      i++;',
  '    }',
  '  }',
  '  [a[i], a[hi]] = [a[hi], a[i]];',
  '  quickSort(a, lo, i - 1);',
  '  quickSort(a, i + 1, hi);',
  '}',
];

function quickSort(input) {
  const a = input.slice();
  const steps = [];
  let compare = 0;
  let move = 0;
  const settled = new Set();

  const push = (state, note, line) => steps.push({
    state: { values: a.slice(), settled: [...settled], ...state },
    note,
    line,
    counters: { 比较: compare, 移动: move },
  });

  push({}, '开始。每轮取区间最右元素当基准（pivot），比它小的挪到左边。', 1);

  const rec = (lo, hi) => {
    if (lo >= hi) {
      if (lo >= 0 && lo < a.length) {
        settled.add(lo);
        push({ range: null }, `区间只剩 ${lo} 一个元素，天然有序。`, 1);
      }
      return;
    }

    const p = a[hi];
    let i = lo;

    push(
      {
        pivot: hi,
        range: { lo, hi },
        rangeLabel: `区间 ${lo}–${hi}`,
        pointers: [{ i: lo, text: 'i' }, { i: lo, text: 'j' }],
      },
      `区间 ${lo}–${hi}，取基准 p = a[${hi}] = ${p}。i 指向"比 p 小的区"的下一个空位。`,
      2,
    );

    for (let j = lo; j < hi; j++) {
      compare += 1;
      push(
        {
          pivot: hi,
          compare: [j],
          range: { lo, hi },
          pointers: [{ i, text: 'i' }, { i: j, text: 'j' }],
        },
        `a[${j}]=${a[j]} 与 p=${p} 比`,
        5,
      );
      if (a[j] < p) {
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          move += 1;
        }
        push(
          {
            pivot: hi,
            move: i === j ? [i] : [i, j],
            range: { lo, hi },
            pointers: [{ i, text: 'i' }, { i: j, text: 'j' }],
          },
          i === j
            ? `小于 p，本来就在正确位置，i 和 j 一起右移`
            : `小于 p，换到 a[${i}]（i 与 j 之间夹着的都是比 p 大的）`,
          6,
        );
        i += 1;
      }
    }

    [a[i], a[hi]] = [a[hi], a[i]];
    move += 1;
    settled.add(i);
    push(
      {
        move: [i, hi],
        range: { lo, hi },
        pointers: [{ i, text: 'i' }],
      },
      `基准 ${p} 换到 a[${i}]，它左边全比它小、右边全比它大。位置定死。`,
      10,
    );

    rec(lo, i - 1);
    rec(i + 1, hi);
  };

  rec(0, a.length - 1);

  push(
    {},
    `完成。比较 ${compare} 次、移动 ${move} 次。全部元素相同时 Lomuto 分区会退化成 O(n²)。`,
    12,
  );
  return { steps, result: { values: a } };
}

// ─────────────────────────────────────────────────────────────

const arrayLegend = [
  { cls: 'bar', text: '未处理' },
  { cls: 'bar is-compare', text: '正在比较' },
  { cls: 'bar is-move', text: '正在移动 / 交换' },
  { cls: 'bar is-pivot', text: '基准 / 当前关键元素' },
  { cls: 'bar is-settled', text: '已就位' },
];

const insertionLegend = arrayLegend.map((x) =>
  x.cls.includes('is-settled') ? { ...x, text: '有序区（已排好，不是最终位置）' } : x);

export const sortingAlgorithms = [
  {
    id: 'sort-bubble',
    group: '排序',
    title: '冒泡排序',
    brief: '相邻两个比大小，大的往后挪一格。每跑完一轮，未排序区里最大的那个就沉到末尾。',
    view: 'array',
    facts: [['平均', 'O(n²)'], ['最坏', 'O(n²)'], ['空间', 'O(1)'], ['稳定', '是']],
    counters: COUNTER_KEYS,
    legend: arrayLegend,
    inputs: makeInputs(),
    code: bubbleCode,
    run: bubbleSort,
  },
  {
    id: 'sort-insertion',
    group: '排序',
    title: '插入排序',
    brief: '像整理手里的扑克牌：左边永远是有序的一叠，每次抽一张，往左找到位置插进去。',
    view: 'array',
    facts: [['平均', 'O(n²)'], ['最坏', 'O(n²)'], ['空间', 'O(1)'], ['稳定', '是']],
    counters: COUNTER_KEYS,
    legend: insertionLegend,
    inputs: makeInputs(),
    code: insertionCode,
    run: insertionSort,
  },
  {
    id: 'sort-selection',
    group: '排序',
    title: '选择排序',
    brief: '每轮在未排序区里扫一遍找最小的，和未排序区第一个交换。比较次数与输入无关，移动次数很少。',
    view: 'array',
    facts: [['平均', 'O(n²)'], ['最坏', 'O(n²)'], ['空间', 'O(1)'], ['稳定', '否']],
    counters: COUNTER_KEYS,
    legend: arrayLegend,
    inputs: makeInputs(),
    code: selectionCode,
    run: selectionSort,
  },
  {
    id: 'sort-quick',
    group: '排序',
    title: '快速排序（Lomuto 分区）',
    brief: '选一个基准，把比它小的都挪到左边，基准落到最终位置，然后左右两段各自递归。分得越均匀越快。',
    view: 'array',
    facts: [['平均', 'O(n log n)'], ['最坏', 'O(n²)'], ['空间', 'O(log n) 栈'], ['稳定', '否']],
    counters: COUNTER_KEYS,
    legend: arrayLegend,
    inputs: makeInputs(),
    code: quickCode,
    run: quickSort,
  },
];
