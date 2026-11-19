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
// 归并排序
// ─────────────────────────────────────────────────────────────

const mergeCode = [
  'function mergeSort(a, lo, hi) {',
  '  if (lo >= hi) return;',
  '  const mid = (lo + hi) >> 1;',
  '  mergeSort(a, lo, mid);',
  '  mergeSort(a, mid + 1, hi);',
  '  merge(a, lo, mid, hi);',
  '}',
  'function merge(a, lo, mid, hi) {',
  '  const tmp = [];',
  '  let i = lo, j = mid + 1;',
  '  while (i <= mid && j <= hi) tmp.push(a[i] <= a[j] ? a[i++] : a[j++]);',
  '  while (i <= mid) tmp.push(a[i++]);',
  '  while (j <= hi) tmp.push(a[j++]);',
  '  for (let k = 0; k < tmp.length; k++) a[lo + k] = tmp[k];',
  '}',
];

function mergeSort(input) {
  const a = input.slice();
  const steps = [];
  let compare = 0;
  let write = 0;

  const push = (state, note, line) => steps.push({
    state: { values: a.slice(), ...state },
    note,
    line,
    counters: { 比较: compare, 写回: write },
  });

  push({}, '分治：先把区间对半切开，切到只剩一个元素，再两两合并。合并两个有序段时，左边取到小的就拿左边，这样天然稳定。', 0);

  const rec = (lo, hi) => {
    if (lo >= hi) return;
    const mid = (lo + hi) >> 1;
    push({ range: { lo, hi }, rangeLabel: `切分 ${lo}–${hi}`, compare: [mid] },
      `把 ${lo}–${hi} 从 ${mid} 切成两半。`, 2);
    rec(lo, mid);
    rec(mid + 1, hi);
    merge(lo, mid, hi);
  };

  const merge = (lo, mid, hi) => {
    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    const out = [];
    let i = 0;
    let j = 0;

    push({ range: { lo, hi }, rangeLabel: `合并 ${lo}–${hi}` },
      `合并两段：左 [${left.join(',')}]，右 [${right.join(',')}]。`, 7);

    while (i < left.length && j < right.length) {
      compare += 1;
      const takeLeft = left[i] <= right[j];
      const v = takeLeft ? left[i++] : right[j++];
      out.push(v);
      push(
        { range: { lo, hi }, rangeLabel: `合并 ${lo}–${hi}`, compare: [lo + i - (takeLeft ? 1 : 0)] },
        `${takeLeft ? `左 ${v} ≤ 右 ${right[j - 1] ?? '-'}` : `右 ${v} < 左 ${left[i - 1] ?? '-'}`}，取 ${v}。取等号时优先取左边，这就是归并稳定的原因。`,
        10,
      );
    }
    while (i < left.length) out.push(left[i++]);
    while (j < right.length) out.push(right[j++]);

    for (let k = 0; k < out.length; k++) {
      a[lo + k] = out[k];
      write += 1;
    }
    push(
      { range: { lo, hi }, rangeLabel: `合并 ${lo}–${hi}`, settled: Array.from({ length: hi - lo + 1 }, (_, k) => lo + k), container: { label: '合并结果', items: out.map((v) => ({ text: String(v) })) } },
      `写回原数组：${out.join('，')}。这两段现在是一个有序段了。`,
      13,
    );
  };

  rec(0, a.length - 1);

  push(
    { settled: a.map((_, k) => k) },
    `完成。比较 ${compare} 次、写回 ${write} 次。归并的代价是要一块临时空间，换来了稳定和稳定的 O(n log n)。`,
    13,
  );
  return { steps, result: { values: a } };
}

// ─────────────────────────────────────────────────────────────
// 计数排序
// ─────────────────────────────────────────────────────────────

const countCode = [
  'function countingSort(a) {',
  '  const max = Math.max(...a);',
  '  const cnt = new Array(max + 1).fill(0);',
  '  for (const v of a) cnt[v]++;          // 统计每个值出现几次',
  '  let k = 0;',
  '  for (let v = 0; v <= max; v++) {',
  '    while (cnt[v]-- > 0) a[k++] = v;     // 从小到大倒出来',
  '  }',
  '  return a;',
  '}',
];

function countingSort(input) {
  const a = input.slice();
  const steps = [];
  let fill = 0;

  const max = Math.max(...a);
  const cnt = new Array(max + 1).fill(0);

  const push = (state, note, line) => steps.push({
    state: { values: a.slice(), ...state },
    note,
    line,
    counters: { 计数: fill },
  });

  push({ container: { label: '计数桶', items: cnt.map((v, i) => ({ text: `${i}:${v}` })) } },
    `计数排序不比较大小，只数每个值出现几次。值域 0–${max}，所以要 ${max + 1} 个桶——值域一大就不可用了。`, 1);

  for (const v of a) {
    cnt[v] += 1;
    fill += 1;
    push(
      { compare: [a.indexOf(v)], container: { label: '计数桶', items: cnt.map((c, i) => ({ text: `${i}:${c}`, hot: i === v })) } },
      `${v} 进桶，现在桶里是 ${cnt[v]} 个。`,
      3,
    );
  }

  push({ settled: [], container: { label: '计数桶', items: cnt.map((c, i) => ({ text: `${i}:${c}` })) } },
    '统计完了。接下来从 0 号桶开始，每个桶里有几个就吐出几个。', 5);

  let k = 0;
  for (let v = 0; v <= max; v++) {
    while (cnt[v] > 0) {
      cnt[v] -= 1;
      a[k] = v;
      k += 1;
      push(
        {
          move: [k - 1],
          settled: Array.from({ length: k }, (_, x) => x),
          container: { label: '计数桶', items: cnt.map((c, i) => ({ text: `${i}:${c}`, hot: i === v })) },
        },
        `吐出 ${v}，放到下标 ${k - 1}。`,
        6,
      );
    }
  }

  push({ settled: a.map((_, x) => x) }, '完成。计数排序是稳定的（如果从后往前放），但只能排整数，而且值域不能太大。', 8);
  return { steps, result: { values: a } };
}

// ─────────────────────────────────────────────────────────────
// 希尔排序
// ─────────────────────────────────────────────────────────────

const shellCode = [
  'function shellSort(a) {',
  '  for (let gap = a.length >> 1; gap > 0; gap >>= 1) {',
  '    for (let i = gap; i < a.length; i++) {',
  '      const key = a[i];',
  '      let j = i - gap;',
  '      while (j >= 0 && a[j] > key) {',
  '        a[j + gap] = a[j];',
  '        j -= gap;',
  '      }',
  '      a[j + gap] = key;',
  '    }',
  '  }',
  '}',
];

function shellSort(input) {
  const a = input.slice();
  const steps = [];
  let compare = 0;
  let move = 0;

  const push = (state, note, line) => steps.push({
    state: { values: a.slice(), ...state },
    note,
    line,
    counters: { 比较: compare, 移动: move },
  });

  push({}, '希尔排序 = 分组插入排序。先用大间隔把远距离的元素排个大概，再逐步缩小间隔，最后一轮 gap=1 时数组已经接近有序，插入排序就很快了。', 0);

  for (let gap = a.length >> 1; gap > 0; gap >>= 1) {
    push({}, `这一轮间隔 gap = ${gap}，把数组分成 ${gap} 组，组内各自插入排序。`, 1);
    for (let i = gap; i < a.length; i++) {
      const key = a[i];
      let j = i - gap;
      push({ pivot: i, compare: [i] }, `取出 a[${i}] = ${key}，和它同组的前一个（下标 ${j}）比较。`, 3);
      while (j >= 0 && a[j] > key) {
        compare += 1;
        a[j + gap] = a[j];
        move += 1;
        push({ move: [j, j + gap] }, `${a[j + gap]} 比 ${key} 大，往后挪 ${gap} 位。`, 6);
        j -= gap;
      }
      if (j >= 0) compare += 1;
      a[j + gap] = key;
      push({ pivot: j + gap }, `${key} 落在下标 ${j + gap}。`, 9);
    }
  }

  push({ settled: a.map((_, k) => k) }, `完成。比较 ${compare} 次、移动 ${move} 次。希尔排序不稳定，复杂度取决于间隔序列，这里用的是最简单的折半。`, 11);
  return { steps, result: { values: a } };
}

// ─────────────────────────────────────────────────────────────
// 快速选择：第 K 大
// ─────────────────────────────────────────────────────────────

const selectCode = [
  'function quickSelect(a, k) {',
  '  let lo = 0, hi = a.length - 1;',
  '  while (true) {',
  '    const p = partition(a, lo, hi);   // 同快排的 Lomuto 分区',
  '    if (p === k) return a[p];',
  '    if (p < k) lo = p + 1;            // 答案在右半',
  '    else hi = p - 1;                  // 答案在左半',
  '  }',
  '}',
];

function quickSelect(input) {
  const { values, k } = input;
  const a = values.slice();
  const steps = [];
  let compare = 0;
  let move = 0;

  const push = (state, note, line) => steps.push({
    state: { values: a.slice(), ...state },
    note,
    line,
    counters: { 比较: compare, 移动: move },
  });

  // "第 k 大"是 1 起算的名次，数组下标是 0 起算，必须换算；直接拿 k 当下标会整体错一位
  const target = values.length - k;
  push({}, `找第 ${k} 大，也就是排好序后下标 ${target} 的位置。快排要排完两边，快速选择只往答案所在的那一边走，所以平均是 O(n)。`, 0);

  let lo = 0;
  let hi = a.length - 1;
  while (true) {
    const p = a[hi];
    let i = lo;
    push({ pivot: hi, range: { lo, hi }, rangeLabel: `区间 ${lo}–${hi}` }, `区间 ${lo}–${hi}，基准 ${p}。`, 3);

    for (let j = lo; j < hi; j++) {
      compare += 1;
      push({ pivot: hi, compare: [j], range: { lo, hi } }, `a[${j}]=${a[j]} 与基准 ${p} 比。`, 3);
      if (a[j] < p) {
        if (i !== j) { [a[i], a[j]] = [a[j], a[i]]; move += 1; }
        i += 1;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    move += 1;
    push({ settled: [i], pivot: i, range: { lo, hi } }, `基准落到 ${i}，它左边的都比它小。`, 3);

    if (i === target) {
      push({ settled: [i], pivot: i }, `下标 ${i} 正好是目标，答案是 ${a[i]}。只分区了一次，另一边完全没碰。`, 4);
      return { steps, result: { val: a[i] } };
    }
    if (i < target) {
      lo = i + 1;
      push({ range: { lo, hi } }, `目标在右边，丢掉左半，只处理 ${lo}–${hi}。`, 5);
    } else {
      hi = i - 1;
      push({ range: { lo, hi } }, `目标在左边，丢掉右半，只处理 ${lo}–${hi}。`, 6);
    }
  }
}

function selectInputs() {
  const make = () => {
    const s = new Set();
    while (s.size < 9) s.add(5 + Math.floor(Math.random() * 80));
    const values = [...s];
    return { values, k: 1 + Math.floor(Math.random() * values.length) };
  };
  return [{ label: '随机 9 个', make }, { label: '再试一组', make }];
}


// ─────────────────────────────────────────────────────────────
// 基数排序
// ─────────────────────────────────────────────────────────────

const radixCode = [
  'function radixSort(a) {',
  '  const max = Math.max(...a);',
  '  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {',
  '    const buckets = Array.from({ length: 10 }, () => []);',
  '    for (const v of a) buckets[Math.floor(v / exp) % 10].push(v);',
  '    let k = 0;',
  '    for (const b of buckets) for (const v of b) a[k++] = v;',
  '  }',
  '  return a;',
  '}',
];

function radixSort(input) {
  let a = input.slice();
  const steps = [];
  let moved = 0;

  const push = (state, note, line) => steps.push({
    state: { values: a.slice(), ...state },
    note,
    line,
    counters: { 写回: moved },
  });

  const max = Math.max(...a);
  push({}, `按位排序：先按个位分桶、收回来；再按十位分桶、收回来……从低位到高位走完，数组就正序了。`, 1);

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const digit = exp === 1 ? '个位' : exp === 10 ? '十位' : '百位';
    const buckets = Array.from({ length: 10 }, () => []);
    for (const v of a) buckets[Math.floor(v / exp) % 10].push(v);

    push(
      { container: { label: `按${digit}分桶`, items: buckets.map((b, i) => ({ text: `${i}:${b.length}` })) } },
      `这一轮看${digit}。每个桶就是一个数字 0–9，桶里按原顺序放着该位等于它的数。`,
      4,
    );

    let k = 0;
    for (const b of buckets) {
      for (const v of b) {
        a[k++] = v;
        moved += 1;
      }
    }
    push(
      { settled: a.map((_, i) => i), container: { label: `按${digit}收回`, items: a.map((v) => ({ text: String(v) })) } },
      `从 0 号桶到 9 号桶依次收回：${a.join('，')}。注意桶内保持原顺序——这是基数排序能稳定的原因。`,
      6,
    );
  }

  push({ settled: a.map((_, i) => i) }, `完成。d 位数就要跑 d 轮，每轮 O(n)，总计 O(d·n)。它不是比较排序，所以能突破 O(n log n)。`, 8);
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
  {
    id: 'sort-merge',
    group: '排序',
    title: '归并排序',
    brief: '先对半切到底，再两两合并。合并时左边取到相等就优先取左边——这一条就是归并能做到稳定的原因。代价是要一块临时空间。',
    view: 'array',
    facts: [['平均', 'O(n log n)'], ['最坏', 'O(n log n)'], ['空间', 'O(n)'], ['稳定', '是']],
    counters: '比较、写回',
    legend: arrayLegend,
    inputs: makeInputs(),
    code: mergeCode,
    run: mergeSort,
  },
  {
    id: 'sort-counting',
    group: '排序',
    title: '计数排序',
    brief: '不比较，只数每个值出现几次，然后从小到大地倒出来。值域有多大就要多少个桶，所以只能用于整数且值域小的场景。',
    view: 'array',
    facts: [['平均', 'O(n + k)'], ['空间', 'O(k) 值域'], ['稳定', '可以做到'], ['限制', '只能排整数']],
    counters: '计数',
    legend: arrayLegend,
    inputs: [
      { label: '值域 0–12', make: () => Array.from({ length: 10 }, () => Math.floor(Math.random() * 13)) },
      { label: '值域 0–9', make: () => Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)) },
    ],
    code: countCode,
    run: countingSort,
  },
  {
    id: 'sort-shell',
    group: '排序',
    title: '希尔排序',
    brief: '分组做插入排序，间隔从大往小收。大间隔先把远距离的元素大致归位，最后 gap=1 时数组接近有序，插入排序就不吃亏了。',
    view: 'array',
    facts: [['平均', '取决于间隔'], ['空间', 'O(1)'], ['稳定', '否'], ['本质', '分组插入']],
    counters: '比较、移动',
    legend: arrayLegend,
    inputs: makeInputs(),
    code: shellCode,
    run: shellSort,
  },
  {
    id: 'sort-quickselect',
    group: '排序',
    title: '快速选择 · 第 K 大',
    brief: '和快排同一套分区，但每次只往答案所在的那半边递归。快排两边都要排是 O(n log n)，快速选择只走一边，平均 O(n)。',
    view: 'array',
    facts: [['平均', 'O(n)'], ['最坏', 'O(n²)'], ['空间', 'O(1)'], ['对比', '排完再取是 O(n log n)']],
    counters: '比较、移动',
    legend: arrayLegend,
    inputs: selectInputs(),
    code: selectCode,
    run: quickSelect,
  },
  {
    id: 'sort-radix',
    group: '排序',
    title: '基数排序',
    brief: '从低位到高位，每轮按一位数字分十个桶再收回。不是比较排序，所以能突破 O(n log n)——代价是只能排非负整数，且要额外空间。',
    view: 'array',
    facts: [['时间', 'O(d·n)'], ['空间', 'O(n + 10)'], ['稳定', '是'], ['限制', '非负整数']],
    counters: '写回',
    legend: arrayLegend,
    inputs: [
      { label: '三位数 6 个', make: () => Array.from({ length: 6 }, () => 10 + Math.floor(Math.random() * 990)) },
      { label: '两位数 6 个', make: () => Array.from({ length: 6 }, () => 10 + Math.floor(Math.random() * 90)) },
    ],
    code: radixCode,
    run: radixSort,
  },
];
