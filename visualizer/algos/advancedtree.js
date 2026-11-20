/**
 * 两个区间查询结构：线段树、树状数组。
 *
 * 都用"区间求和"这一个场景讲，因为它们的价值全在"频繁的区间查询 + 单点修改"。
 * 线段树用树视图（每个节点存一段的和），树状数组用数组视图（lowbit 跳着加）。
 */

// ─────────────────────────────────────────────────────────────
// 线段树
// ─────────────────────────────────────────────────────────────

const segCode = [
  'function build(node, l, r) {',
  '  if (l === r) { tree[node] = a[l]; return; }',
  '  const mid = (l + r) >> 1;',
  '  build(node * 2, l, mid);',
  '  build(node * 2 + 1, mid + 1, r);',
  '  tree[node] = tree[node * 2] + tree[node * 2 + 1];',
  '}',
  'function query(node, l, r, ql, qr) {',
  '  if (ql <= l && r <= qr) return tree[node];   // 整段被包住',
  '  const mid = (l + r) >> 1;',
  '  let sum = 0;',
  '  if (ql <= mid) sum += query(node * 2, l, mid, ql, qr);',
  '  if (qr > mid) sum += query(node * 2 + 1, mid + 1, r, ql, qr);',
  '  return sum;',
  '}',
];

function segmentTree(input) {
  const { arr, ql, qr } = input;
  const n = arr.length;
  const size = 4 * n;
  const sums = new Array(size).fill(null);

  const pool = new Map();
  let uid = 0;
  const steps = [];
  let visited = 0;

  const mk = (l, r, parent) => {
    const node = { id: `s${++uid}`, val: 0, left: null, right: null, parent, l, r };
    pool.set(node.id, node);
    return node;
  };

  let root = null;
  const build = (parent, l, r) => {
    const node = mk(l, r, parent);
    if (parent) {
      if (!parent.left) parent.left = node; else parent.right = node;
    } else root = node;
    if (l === r) {
      node.val = arr[l];
      return node;
    }
    const mid = (l + r) >> 1;
    const L = build(node, l, mid);
    const R = build(node, mid + 1, r);
    node.val = L.val + R.val;
    return node;
  };

  const snap = () => [...pool.values()].map((x) => ({
    id: x.id, val: x.val,
    left: x.left ? x.left.id : null, right: x.right ? x.right.id : null,
  }));

  const push = (state, note, line) => steps.push({
    state: { nodes: snap(), root: root?.id ?? null, ...state },
    note,
    line,
    counters: { 访问节点: visited },
  });

  build(null, 0, n - 1);
  push({}, `先把线段树建起来：叶子是原数组，每个内部节点存它这一段的和。数组 ${arr.join(',')}，一共 ${n} 个叶子。`, 6);

  const byId = new Map([...pool.values()].map((x) => [x.id, x]));
  const hit = [];
  const query = (nodeId) => {
    const N = byId.get(nodeId);
    if (!N) return 0;
    if (qr < N.l || N.r < ql) return 0;              // 完全不相交，直接剪掉
    if (ql <= N.l && N.r <= qr) {                     // 整段被包住
      visited += 1;
      hit.push(N.id);
      push({ visited: [...hit], highlight: [N.id] },
        `[${N.l}, ${N.r}] 整段落在查询区间 [${ql}, ${qr}] 里，直接取它的和 ${N.val}，不用再往下走。`, 9);
      return N.val;
    }
    visited += 1;
    push({ highlight: [N.id] }, `[${N.l}, ${N.r}] 只有一部分在区间里，得往下分。`, 11);
    return query(N.left ? N.left.id : null) + query(N.right ? N.right.id : null);
  };

  const ans = query(root.id);
  push({ visited: [...hit] }, `查询 [${ql}, ${qr}] 的和是 ${ans}。只碰了 ${visited} 个节点——这就是线段树 O(log n) 的由来。`, 14);
  return { steps, result: { sum: ans } };
}

// ─────────────────────────────────────────────────────────────
// 树状数组
// ─────────────────────────────────────────────────────────────

const bitCode = [
  'function update(i, delta) {',
  '  while (i <= n) {',
  '    tree[i] += delta;',
  '    i += i & -i;        // 跳到下一个管着我的位置',
  '  }',
  '}',
  'function query(i) {',
  '  let sum = 0;',
  '  while (i > 0) {',
  '    sum += tree[i];',
  '    i -= i & -i;        // 去掉最低位的 1',
  '  }',
  '  return sum;',
  '}',
];

function fenwick(input) {
  const { arr, q } = input;
  const n = arr.length;
  const tree = new Array(n + 1).fill(0);

  const steps = [];
  let ops = 0;

  const push = (state, note, line) => steps.push({
    state: {
      values: tree.slice(1),
      container: { label: 'tree', items: tree.slice(1).map((v, i) => ({ text: `${i + 1}:${v}` })) },
      ...state,
    },
    note,
    line,
    counters: { 步数: ops },
  });

  // 建树：逐个 update
  for (let i = 1; i <= n; i++) {
    let j = i;
    const path = [];
    while (j <= n) {
      tree[j] += arr[i - 1];
      path.push(j);
      ops += 1;
      j += j & -j;
    }
    push({ settled: path.map((x) => x - 1), highlight: path.filter((x) => x <= n).map((x) => x - 1) },
      `放入 a[${i}] = ${arr[i - 1]}：它会累加到 ${path.join('、')} 号位置（lowbit 一路往上跳）。`, 3);
  }

  push({}, `树状数组建好了。第 i 个位置存的是"从 i 往前 lowbit(i) 个元素的和"——所以查询时能跳着取。`, 0);

  let i = q;
  const jumped = [];
  let sum = 0;
  while (i > 0) {
    sum += tree[i];
    jumped.push(i);
    ops += 1;
    push({ settled: jumped.map((x) => x - 1), pivot: i - 1 },
      `query(${q})：加上 tree[${i}] = ${tree[i]}，然后 i -= lowbit = ${i & -i}，跳到 ${i - (i & -i)}。`, 10);
    i -= i & -i;
  }

  push({ settled: jumped.map((x) => x - 1) }, `前缀和 [1..${q}] = ${sum}，只加了 ${jumped.length} 个数：${jumped.join('、')}。`, 12);
  return { steps, result: { sum } };
}

function segInputs() {
  return [
    { label: '查 [1, 3]', make: () => ({ arr: [1, 3, 5, 7, 9, 11], ql: 1, qr: 3 }) },
    { label: '查 [0, 5]（全段）', make: () => ({ arr: [1, 3, 5, 7, 9, 11], ql: 0, qr: 5 }) },
  ];
}

function bitInputs() {
  return [
    { label: '求前 6 个的和', make: () => ({ arr: [1, 3, 5, 7, 9, 11], q: 6 }) },
    { label: '求前 5 个的和', make: () => ({ arr: [2, 4, 6, 8, 10, 12], q: 5 }) },
  ];
}

export const advancedTreeAlgorithms = [
  {
    id: 'adv-segment-tree',
    group: '树',
    title: '线段树 · 区间查询',
    brief: '每个节点存一段区间的和。查询时整段被包住就直接取，只有部分相交才往下分——所以 O(log n) 而不是 O(n)。',
    view: 'tree',
    bst: false,          // 线段树不是二叉搜索树，中序不要求升序
    facts: [['时间', '建树 O(n) / 查询修改 O(log n)'], ['空间', 'O(4n)']],
    counters: '访问节点',
    legend: [{ cls: 'tnode', text: '节点' }, { cls: 'tnode is-active', text: '正在处理' }, { cls: 'tnode is-visited', text: '整段取用' }],
    inputs: segInputs(),
    code: segCode,
    run: segmentTree,
  },
  {
    id: 'adv-fenwick',
    group: '树',
    title: '树状数组 · lowbit',
    brief: '第 i 个位置存"从 i 往前 lowbit(i) 个元素的和"。查询时 i -= lowbit 往前跳，修改时 i += lowbit 往上跳，都是 O(log n)。',
    view: 'array',
    facts: [['时间', '建树 O(n log n) / 查询修改 O(log n)'], ['空间', 'O(n)'], ['代码量', '极短']],
    counters: '步数',
    legend: [{ cls: 'bar', text: 'tree 数组' }, { cls: 'bar is-settled', text: '本次用到的位置' }],
    inputs: bitInputs(),
    code: bitCode,
    run: fenwick,
  },
];
