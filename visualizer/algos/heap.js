/**
 * 堆：插入上浮、弹出下沉、原地堆排序。
 *
 * 统一用大顶堆（父节点 >= 孩子），下面三处的比较方向必须一致，
 * 一处写成小顶堆就会得出"看着能跑但排序结果是倒的"这种最难查的错。
 * 下标关系只有两条：父 = (i-1)>>1，左孩子 = 2i+1，右孩子 = 2i+2。
 */

function snapshot(h) {
  return h.slice();
}

// ─────────────────────────────────────────────────────────────
// 插入 + 上浮
// ─────────────────────────────────────────────────────────────

const pushCode = [
  'function push(h, val) {',
  '  h.push(val);              // 先放末尾，保证完全树形',
  '  let i = h.length - 1;',
  '  while (i > 0) {',
  '    const p = (i - 1) >> 1;',
  '    if (h[p] >= h[i]) break; // 父不小于它就停了',
  '    [h[p], h[i]] = [h[i], h[p]];',
  '    i = p;',
  '  }',
  '}',
];

function heapPush(input) {
  const h = input.base.slice();
  const steps = [];
  let cmp = 0;
  let swap = 0;

  const push = (state, note, line) => steps.push({
    state: { values: snapshot(h), ...state },
    note,
    line,
    counters: { 比较: cmp, 交换: swap },
  });

  push({}, `已有大顶堆 ${h.join(', ')}。现在插入 ${input.val}。`, 0);

  h.push(input.val);
  let i = h.length - 1;
  push({ active: [i] }, `${input.val} 先放末尾（下标 ${i}）。放末尾是为了保持"完全二叉树"的形状，否则数组就不能当树用了。`, 1);

  while (i > 0) {
    const p = (i - 1) >> 1;
    cmp += 1;
    push(
      { active: [i], compare: [p, i] },
      `比较父 ${h[p]}（下标 ${p}）与子 ${h[i]}（下标 ${i}）。`,
      5,
    );
    if (h[p] >= h[i]) {
      push({ active: [i] }, `父已经不小于子，堆序恢复，上浮结束。`, 5);
      break;
    }
    [h[p], h[i]] = [h[i], h[p]];
    swap += 1;
    push(
      { active: [p, i], compare: [p, i] },
      `父比子小，交换。新值升到下标 ${p}。`,
      6,
    );
    i = p;
  }

  if (i === 0) push({ active: [0] }, `一路升到根，${input.val} 成了新的最大值。`, 8);

  return { steps, result: { values: h.slice() } };
}

// ─────────────────────────────────────────────────────────────
// 弹出堆顶 + 下沉
// ─────────────────────────────────────────────────────────────

const popCode = [
  'function pop(h) {',
  '  const top = h[0];',
  '  h[0] = h[h.length - 1];',
  '  h.pop();',
  '  let i = 0;',
  '  while (true) {',
  '    let big = i;',
  '    const l = 2 * i + 1, r = 2 * i + 2;',
  '    if (l < h.length && h[l] > h[big]) big = l;',
  '    if (r < h.length && h[r] > h[big]) big = r;',
  '    if (big === i) break;',
  '    [h[i], h[big]] = [h[big], h[i]];',
  '    i = big;',
  '  }',
  '  return top;',
  '}',
];

function heapPop(input) {
  const h = input.base.slice();
  const steps = [];
  let cmp = 0;
  let swap = 0;

  const push = (state, note, line) => steps.push({
    state: { values: snapshot(h), ...state },
    note,
    line,
    counters: { 比较: cmp, 交换: swap },
  });

  push({ active: [0] }, `大顶堆 ${h.join(', ')}。弹出堆顶 ${h[0]}。`, 0);

  const top = h[0];
  h[0] = h[h.length - 1];
  h.pop();
  push(
    { active: [0] },
    `把末尾的 ${h[0]} 挪到根，再删掉末尾——这样数组仍然连续，形状不会破。`,
    2,
  );

  let i = 0;
  while (true) {
    let big = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < h.length) {
      cmp += 1;
      push({ active: [i], compare: [l] }, `看左孩子 ${h[l]}（下标 ${l}）有没有比 ${h[i]} 大。`, 8);
      if (h[l] > h[big]) big = l;
    }
    if (r < h.length) {
      cmp += 1;
      push({ active: [i], compare: [r] }, `看右孩子 ${h[r]}（下标 ${r}）。`, 9);
      if (h[r] > h[big]) big = r;
    }

    if (big === i) {
      push({ active: [i] }, `两个子都不比 ${h[i]} 大，堆序恢复，下沉结束。`, 10);
      break;
    }

    [h[i], h[big]] = [h[big], h[i]];
    swap += 1;
    push({ active: [i, big], compare: [i, big] }, `和孩子里更大的那个换位，${h[big]} 沉下去一层。`, 11);
    i = big;
  }

  return { steps, result: { values: h.slice(), popped: top } };
}

// ─────────────────────────────────────────────────────────────
// 堆排序（原地）
// ─────────────────────────────────────────────────────────────

const sortCode = [
  'function heapSort(h) {',
  '  for (let i = (h.length >> 1) - 1; i >= 0; i--) {',
  '    siftDown(h, i, h.length);   // 自底向上建堆',
  '  }',
  '  for (let end = h.length - 1; end > 0; end--) {',
  '    [h[0], h[end]] = [h[end], h[0]];',
  '    siftDown(h, 0, end);        // 堆缩小一格再下沉',
  '  }',
  '}',
  '',
  'function siftDown(h, i, size) {',
  '  while (true) {',
  '    let big = i;',
  '    const l = 2 * i + 1, r = 2 * i + 2;',
  '    if (l < size && h[l] > h[big]) big = l;',
  '    if (r < size && h[r] > h[big]) big = r;',
  '    if (big === i) return;',
  '    [h[i], h[big]] = [h[big], h[i]];',
  '    i = big;',
  '  }',
  '}',
];

function heapSort(input) {
  const h = input.slice();
  const steps = [];
  let cmp = 0;
  let swap = 0;
  const settled = new Set();

  const push = (state, note, line) => steps.push({
    state: { values: snapshot(h), settled: [...settled], ...state },
    note,
    line,
    counters: { 比较: cmp, 交换: swap },
  });

  push({}, `原始数组 ${h.join(', ')}。堆排序分两步：先把它调整成大顶堆，再逐个把最大值换到末尾。`, 0);

  const siftDown = (i, size, line) => {
    while (true) {
      let big = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < size) {
        cmp += 1;
        push({ active: [i], compare: [l] }, `下标 ${i}：左孩子 ${h[l]} 比 ${h[big]} 大吗？`, line + 3);
        if (h[l] > h[big]) big = l;
      }
      if (r < size) {
        cmp += 1;
        push({ active: [i], compare: [r] }, `再看右孩子 ${h[r]}。`, line + 4);
        if (h[r] > h[big]) big = r;
      }
      if (big === i) {
        push({ active: [i] }, `下标 ${i} 已经是三者最大，停。`, line + 5);
        return;
      }
      [h[i], h[big]] = [h[big], h[i]];
      swap += 1;
      push({ active: [i, big], compare: [i, big] }, `换位：${h[big]} 下沉一层。`, line + 6);
      i = big;
    }
  };

  push({}, '第一步：建堆。从最后一个非叶子节点往回，每个都往下沉一次。', 1);
  for (let i = (h.length >> 1) - 1; i >= 0; i--) {
    push({ active: [i] }, `处理下标 ${i}（值 ${h[i]}）。`, 2);
    siftDown(i, h.length, 11);
  }

  push({}, `建堆完成，现在 ${h[0]} 是最大值。`, 3);

  push({}, '第二步：把堆顶换到末尾，堆的范围缩小一格，再让新堆顶下沉。', 4);
  for (let end = h.length - 1; end > 0; end--) {
    [h[0], h[end]] = [h[end], h[0]];
    swap += 1;
    settled.add(end);
    push(
      { active: [0, end], compare: [0, end] },
      `堆顶 ${h[end]} 换到下标 ${end}，它的最终位置就定了（后面不会再动它）。`,
      5,
    );
    siftDown(0, end, 11);
  }
  settled.add(0);

  push({}, `排序完成，结果 ${h.join('，')}。堆排序是原地排序，额外空间 O(1)，但它不稳定。`, 7);
  return { steps, result: { values: h.slice() } };
}


// ─────────────────────────────────────────────────────────────
// TopK：小顶堆维护前 K 大
// ─────────────────────────────────────────────────────────────

const topkCode = [
  'function topK(nums, k) {',
  '  const heap = [];                  // 小顶堆，最多放 k 个',
  '  for (const x of nums) {',
  '    if (heap.length < k) {',
  '      heap.push(x); siftUp(heap, heap.length - 1);',
  '    } else if (x > heap[0]) {       // 比堆顶（当前第 k 大）还大',
  '      heap[0] = x;                  // 顶掉堆顶',
  '      siftDown(heap, 0, heap.length);',
  '    }',
  '  }',
  '  return heap;                      // 堆里就是前 k 大',
  '}',
];

function topK(input) {
  const { nums, k } = input;
  const heap = [];
  const steps = [];
  let cmp = 0;
  let swap = 0;

  const push = (state, note, line) => steps.push({
    state: { values: heap.slice(), ...state },
    note,
    line,
    counters: { 比较: cmp, 交换: swap },
  });

  push({}, `找前 ${k} 大。用一个容量只有 ${k} 的小顶堆：堆顶就是"目前第 ${k} 名"，新来的比它大才有资格进堆。`, 0);

  const siftUp = (i) => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      cmp += 1;
      if (heap[p] <= heap[i]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      swap += 1;
      i = p;
    }
  };

  const siftDown = (i, size) => {
    while (true) {
      let small = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < size) { cmp += 1; if (heap[l] < heap[small]) small = l; }
      if (r < size) { cmp += 1; if (heap[r] < heap[small]) small = r; }
      if (small === i) return;
      [heap[i], heap[small]] = [heap[small], heap[i]];
      swap += 1;
      i = small;
    }
  };

  for (const x of nums) {
    if (heap.length < k) {
      heap.push(x);
      siftUp(heap.length - 1);
      push({ active: [heap.indexOf(x)] }, `${x} 进堆（还没满 ${k} 个），上浮到该待的位置。`, 5);
    } else if (x > heap[0]) {
      push({ active: [0], compare: [0] }, `${x} 比堆顶 ${heap[0]} 大，有资格挤进去。`, 6);
      heap[0] = x;
      siftDown(0, heap.length);
      push({ active: [0] }, `顶掉堆顶，新值下沉到该待的位置。`, 8);
    } else {
      push({ compare: [0] }, `${x} 不比堆顶 ${heap[0]} 大，直接丢掉。`, 6);
    }
  }

  push({}, `堆里剩下的就是前 ${k} 大：${heap.slice().sort((a, b) => b - a).join('，')}。整个过程只扫一遍数组，堆大小固定为 ${k}。`, 10);
  return { steps, result: { top: heap.slice().sort((a, b) => b - a).join(',') } };
}

function topkInputs() {
  return [
    { label: 'k = 3', make: () => ({ nums: [3, 2, 1, 5, 6, 4], k: 3 }) },
    { label: '随机 8 个', make: () => ({ nums: Array.from({ length: 8 }, () => 1 + Math.floor(Math.random() * 40)), k: 3 }) },
  ];
}

// ─────────────────────────────────────────────────────────────

const heapLegend = [
  { cls: 'tnode', text: '堆内元素' },
  { cls: 'tnode is-active', text: '正在处理' },
  { cls: 'tnode is-compare', text: '正在比较' },
  { cls: 'tnode is-settled', text: '已就位（不再参与）' },
];

export const heapAlgorithms = [
  {
    id: 'heap-push',
    group: '堆',
    title: '插入 · 上浮',
    brief: '新元素先塞到数组末尾（保持完全二叉树形状），然后一层层和父节点比，比父大就往上换，直到父比它大为止。',
    view: 'heap',
    facts: [['时间', 'O(log n)'], ['空间', 'O(1)'], ['父下标', '(i-1) >> 1'], ['顺序', '大顶堆']],
    counters: '比较、交换',
    legend: heapLegend,
    inputs: [
      { label: '插入更大的值', make: () => ({ base: [90, 70, 80, 40, 50, 60], val: 95 }) },
      { label: '插入很小的值', make: () => ({ base: [90, 70, 80, 40, 50, 60], val: 10 }) },
      { label: '插入中间值', make: () => ({ base: [90, 70, 80, 40, 50, 60], val: 75 }) },
    ],
    code: pushCode,
    run: heapPush,
  },
  {
    id: 'heap-pop',
    group: '堆',
    title: '弹出堆顶 · 下沉',
    brief: '把末尾元素挪到根、删掉末尾，再让孩子里更大的那个上来，一层层沉下去。挪末尾而不是整体前移，是为了保持完全树形。',
    view: 'heap',
    facts: [['时间', 'O(log n)'], ['空间', 'O(1)'], ['左孩子', '2i + 1'], ['特点', '取最值 O(1)']],
    counters: '比较、交换',
    legend: heapLegend,
    inputs: [
      { label: '弹出最大值', make: () => ({ base: [95, 70, 80, 40, 50, 60, 30] }) },
      { label: '更大的堆', make: () => ({ base: [99, 88, 77, 66, 55, 44, 33, 22] }) },
    ],
    code: popCode,
    run: heapPop,
  },
  {
    id: 'heap-sort',
    group: '堆',
    title: '堆排序',
    brief: '先把数组调成大顶堆，然后反复"堆顶换末尾 + 缩小堆 + 下沉"，末尾就攒出有序区。原地排序，但会打乱相等元素的相对次序。',
    view: 'heap',
    facts: [['时间', 'O(n log n)'], ['空间', 'O(1)'], ['稳定', '否'], ['两步', '建堆 + 逐个取出']],
    counters: '比较、交换',
    legend: heapLegend,
    inputs: [
      { label: '随机 9 个', make: () => { const s = new Set(); while (s.size < 9) s.add(10 + Math.floor(Math.random() * 89)); return [...s]; } },
      { label: '完全逆序', make: () => [90, 80, 70, 60, 50, 40, 30, 20, 10] },
    ],
    code: sortCode,
    run: heapSort,
  },
  {
    id: 'heap-topk',
    group: '堆',
    title: 'TopK（小顶堆）',
    brief: '容量只有 k 的小顶堆，堆顶就是"目前第 k 名"。新元素比堆顶大才进堆、顶掉堆顶。比全排序 O(n log n) 快，是 O(n log k)。',
    view: 'heap',
    heapKind: 'min',
    facts: [['时间', 'O(n log k)'], ['空间', 'O(k)'], ['为什么是小顶堆', '堆顶就是第 k 名'], ['对比', '全排序 O(n log n)']],
    counters: '比较、交换',
    legend: heapLegend,
    inputs: topkInputs(),
    code: topkCode,
    run: topK,
  },
];
