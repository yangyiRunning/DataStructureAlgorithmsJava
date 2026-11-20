/**
 * LeetCode 高频题（第九批）：树 9 道 + 删除重复项 II。
 */

let uidA = 0;
function build(order) {
  const pool = new Map();
  const nodes = order.map((v) => {
    const n = { id: `a${++uidA}`, val: v, left: null, right: null };
    pool.set(n.id, n);
    return n;
  });
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].val == null) continue;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < nodes.length && nodes[l].val != null) nodes[i].left = nodes[l];
    if (r < nodes.length && nodes[r].val != null) nodes[i].right = nodes[r];
  }
  return { root: nodes[0] ?? null, pool };
}
const snap = (pool) => [...pool.values()].map((n) => ({
  id: n.id, val: n.val,
  left: n.left ? n.left.id : null, right: n.right ? n.right.id : null,
}));

/** 层序序列化，去掉尾部 null */
function levelOrder(root) {
  const out = [];
  const q = [root];
  while (q.length) {
    const n = q.shift();
    if (!n) { out.push('null'); continue; }
    out.push(String(n.val));
    q.push(n.left, n.right);
  }
  while (out.length && out[out.length - 1] === 'null') out.pop();
  return out;
}

const TL = [
  { cls: 'tnode', text: '节点' },
  { cls: 'tnode is-active', text: '当前节点' },
  { cls: 'tnode is-visited', text: '已访问' },
];

const L = [
  { cls: 'bar', text: '元素' },
  { cls: 'bar is-compare', text: '正在看' },
  { cls: 'bar is-pivot', text: '当前处理' },
  { cls: 'bar is-settled', text: '已确定' },
];

const stSteps = (pool, root) => {
  const steps = [];
  return {
    steps,
    push(state, note, line, counters = { 访问: 0 }) {
      steps.push({ state: { nodes: snap(pool), root: root ? root.id : null, ...state }, note, line, counters });
    },
  };
};

// ── 700. 二叉搜索树中的搜索 ─────────────────────────────
const searchBstCode = [
  'function searchBST(node, val) {',
  '  while (node) {',
  '    if (val === node.val) return node;',
  '    node = val < node.val ? node.left : node.right;   // 按大小决定往哪走',
  '  }',
  '  return null;',
  '}',
];

function searchBST(input) {
  const { levels, val } = input;
  const { root, pool } = build(levels);
  const out = stSteps(pool, root);
  out.push({}, `在 BST 里找 ${val}：比当前节点小就往左，大就往右，一路只走一条路。`, 0);
  let node = root;
  while (node) {
    out.push({ highlight: [node.id] }, `看 ${node.val}，和 ${val} 比。`, 2);
    if (val === node.val) {
      out.push({ highlight: [node.id], visited: [node.id] }, `找到 ${val}。`, 2);
      return { steps: out.steps, result: { ok: 'true' } };
    }
    node = val < node.val ? node.left : node.right;
  }
  out.push({}, `走到空节点，说明树里没有 ${val}。`, 5);
  return { steps: out.steps, result: { ok: 'false' } };
}

// ── 235. BST 的最近公共祖先 ─────────────────────────────
const bstLcaCode = [
  'function lowestCommonAncestor(node, p, q) {',
  '  while (node) {',
  '    if (p.val < node.val && q.val < node.val) node = node.left;',
  '    else if (p.val > node.val && q.val > node.val) node = node.right;',
  '    else return node;          // 分叉了，或者其中一个就是当前节点',
  '  }',
  '}',
];

function bstLca(input) {
  const { levels, p, q } = input;
  const { root, pool } = build(levels);
  const out = stSteps(pool, root);
  out.push({}, `利用 BST 有序：p 和 q 都比当前节点小就往左，都大就往右，一旦分开（或命中）当前就是答案。`, 0);

  let node = root;
  while (node) {
    out.push({ highlight: [node.id] }, `看 ${node.val}：p=${p}，q=${q}。`, 2);
    if (p < node.val && q < node.val) { node = node.left; out.push({}, '两个都更小，往左。', 2); }
    else if (p > node.val && q > node.val) { node = node.right; out.push({}, '两个都更大，往右。', 3); }
    else {
      out.push({ highlight: [node.id], visited: [node.id] }, `左右分开了，最近公共祖先是 ${node.val}。`, 4);
      return { steps: out.steps, result: { lca: node.val } };
    }
  }
  out.push({}, '没找到。', 4);
  return { steps: out.steps, result: { lca: -1 } };
}

// ── 108. 有序数组转 BST ─────────────────────────────────
const sortedToBstCode = [
  'function sortedArrayToBST(nums) {',
  '  const build = (lo, hi) => {',
  '    if (lo > hi) return null;',
  '    const mid = Math.floor((lo + hi) / 2);   // 中点当根，两边高度才接近',
  '    const node = { val: nums[mid] };',
  '    node.left = build(lo, mid - 1);',
  '    node.right = build(mid + 1, hi);',
  '    return node;',
  '  };',
  '  return build(0, nums.length - 1);',
  '}',
];

function sortedArrayToBST(nums) {
  const pool = new Map();
  const seq = [];
  const steps = [];
  const push = (note, line) => steps.push({
    state: { nodes: snap(pool), root: seq[0] ? seq[0].id : null },
    note, line, counters: { 建节点: pool.size },
  });

  push('每次都取中点当根：这样左右两边元素个数最多差 1，树自然平衡。', 0);

  const buildTree = (lo, hi) => {
    if (lo > hi) return null;
    const mid = Math.floor((lo + hi) / 2);
    const n = { id: `b${++uidA}`, val: nums[mid], left: null, right: null };
    pool.set(n.id, n);
    if (!seq.length) seq.push(n);
    push(`取 [${lo}, ${hi}] 的中点 ${nums[mid]} 当根。`, 3);
    n.left = buildTree(lo, mid - 1);
    n.right = buildTree(mid + 1, hi);
    return n;
  };

  const root = buildTree(0, nums.length - 1);
  const order = levelOrder(root).join(',');
  push(`建好了，层序是 ${order}。`, 5);
  return { steps, result: { order } };
}

// ── 110. 平衡二叉树 ─────────────────────────────────────
const balancedCode = [
  'function isBalanced(node) {',
  '  let ok = true;',
  '  const depth = (n) => {',
  '    if (!n) return 0;',
  '    const l = depth(n.left), r = depth(n.right);',
  '    if (Math.abs(l - r) > 1) ok = false;    // 任何一处不平衡就废',
  '    return 1 + Math.max(l, r);',
  '  };',
  '  depth(node);',
  '  return ok;',
  '}',
];

function isBalanced(levels) {
  const { root, pool } = build(levels);
  const out = stSteps(pool, root);
  let ok = true;
  out.push({}, '平衡的定义是：每个节点左右子树高度差不超过 1。注意是"每个节点"，不是只看根。', 0);

  const depth = (n) => {
    if (!n) return 0;
    const l = depth(n.left);
    const r = depth(n.right);
    const bad = Math.abs(l - r) > 1;
    if (bad) ok = false;
    out.push({ highlight: [n.id] }, `${n.val}：左高 ${l}、右高 ${r}${bad ? '，差超过 1，不平衡' : '，平衡'}。`, 4);
    return 1 + Math.max(l, r);
  };
  depth(root);
  out.push({}, ok ? '整棵树是平衡的。' : '存在不平衡的节点。', 8);
  return { steps: out.steps, result: { ok: String(ok) } };
}

// ── 111. 最小深度 ───────────────────────────────────────
const minDepthCode = [
  'function minDepth(node) {',
  '  if (!node) return 0;',
  '  if (!node.left) return 1 + minDepth(node.right);    // 只有一边孩子',
  '  if (!node.right) return 1 + minDepth(node.left);',
  '  return 1 + Math.min(minDepth(node.left), minDepth(node.right));',
  '}',
];

function minDepth(levels) {
  const { root, pool } = build(levels);
  const out = stSteps(pool, root);
  out.push({}, '最小深度是到"最近叶子"的距离。注意单边孩子不能算 0——必须走到叶子，这和最大深度不一样。', 0);

  const dfs = (n) => {
    if (!n) return 0;
    if (!n.left) { out.push({ highlight: [n.id] }, `${n.val} 没有左孩子，只能往右。`, 2); return 1 + dfs(n.right); }
    if (!n.right) { out.push({ highlight: [n.id] }, `${n.val} 没有右孩子，只能往左。`, 3); return 1 + dfs(n.left); }
    const l = dfs(n.left);
    const r = dfs(n.right);
    out.push({ highlight: [n.id] }, `${n.val}：左 ${l}、右 ${r}，取小的 ${Math.min(l, r)}。`, 4);
    return 1 + Math.min(l, r);
  };
  const d = dfs(root);
  out.push({}, `最小深度是 ${d}。`, 4);
  return { steps: out.steps, result: { depth: d } };
}

// ── 257. 二叉树的所有路径 ───────────────────────────────
const allPathsCode = [
  'function binaryTreePaths(root) {',
  '  const res = [];',
  '  const dfs = (node, path) => {',
  '    if (!node) return;',
  '    path = [...path, node.val];',
  '    if (!node.left && !node.right) { res.push(path.join("->")); return; }   // 叶子才收',
  '    dfs(node.left, path);',
  '    dfs(node.right, path);',
  '  };',
  '  dfs(root, []);',
  '  return res;',
  '}',
];

function binaryTreePaths(levels) {
  const { root, pool } = build(levels);
  const out = stSteps(pool, root);
  const res = [];
  out.push({}, '从根往下走，把路径记在参数里。只有走到叶子才把它收进结果。', 0);

  const dfs = (n, path) => {
    if (!n) return;
    const p = [...path, n.val];
    out.push({ highlight: p.map((v) => [...pool.values()].find((x) => x.val === v)?.id).filter(Boolean) },
      `走到 ${n.val}，当前路径 ${p.join('->')}。`, 3);
    if (!n.left && !n.right) {
      res.push(p.join('->'));
      out.push({ visited: [n.id] }, `是叶子，收下 "${p.join('->')}"。`, 4);
      return;
    }
    dfs(n.left, p);
    dfs(n.right, p);
  };
  dfs(root, []);
  out.push({}, `共 ${res.length} 条路径：${res.join('；')}。`, 8);
  return { steps: out.steps, result: { count: res.length } };
}

// ── 199. 二叉树的右视图 ─────────────────────────────────
const rightViewCode = [
  'function rightSideView(root) {',
  '  const res = [], q = [root];',
  '  while (q.length) {',
  '    const size = q.length,',
  '    for (let i = 0; i < size; i++) {',
  '      const n = q.shift();',
  '      if (i === size - 1) res.push(n.val);   // 每层最后一个',
  '      if (n.left) q.push(n.left);',
  '      if (n.right) q.push(n.right);',
  '    }',
  '  }',
  '  return res;',
  '}',
];

function rightSideView(levels) {
  const { root, pool } = build(levels);
  const out = stSteps(pool, root);
  const res = [];
  out.push({}, '层序遍历，每层只记最后一个节点——那就是从右边看过去能看见的。', 0);

  let q = root ? [root] : [];
  let level = 0;
  while (q.length) {
    const size = q.length;
    const next = [];
    for (let i = 0; i < size; i++) {
      const n = q[i];
      if (i === size - 1) {
        res.push(n.val);
        out.push({ highlight: [n.id], visited: [n.id] }, `第 ${level} 层最右是 ${n.val}，记下来。`, 5);
      }
      if (n.left) next.push(n.left);
      if (n.right) next.push(n.right);
    }
    q = next;
    level += 1;
  }
  out.push({}, `右视图：${res.join(',')}。`, 8);
  return { steps: out.steps, result: { arr: res.join(',') } };
}

// ── 617. 合并二叉树 ─────────────────────────────────────
const mergeTreesCode = [
  'function mergeTrees(a, b) {',
  '  if (!a) return b;',
  '  if (!b) return a;',
  '  a.val += b.val;             // 两个都有就相加',
  '  a.left = mergeTrees(a.left, b.left);',
  '  a.right = mergeTrees(a.right, b.right);',
  '  return a;',
  '}',
];

function mergeTrees(input) {
  const { a, b } = input;
  const t1 = build(a);
  const t2 = build(b);
  const pool = new Map([...t1.pool, ...t2.pool]);
  const out = stSteps(pool, t1.root);
  out.push({}, '两棵树同时往下走：一边空就返回另一边，两边都有就把值相加。', 0);

  const walk = (x, y) => {
    if (!x) return y;
    if (!y) return x;
    x.val += y.val;
    out.push({ highlight: [x.id] }, `节点值相加：${x.val}。`, 3);
    x.left = walk(x.left, y.left);
    x.right = walk(x.right, y.right);
    return x;
  };
  const root = walk(t1.root, t2.root);
  const order = levelOrder(root).join(',');
  out.push({}, `合并后层序：${order}。`, 5);
  return { steps: out.steps, result: { order } };
}

// ── 230. BST 中第 K 小的元素 ────────────────────────────
const kthSmallestCode = [
  'function kthSmallest(root, k) {',
  '  const st = [];',
  '  let node = root;',
  '  while (node || st.length) {',
  '    while (node) { st.push(node); node = node.left; }   // 一路压左',
  '    node = st.pop();',
  '    if (--k === 0) return node.val;                     // 中序第 k 个',
  '    node = node.right;',
  '  }',
  '}',
];

function kthSmallest(input) {
  const { levels, k } = input;
  const { root, pool } = build(levels);
  const out = stSteps(pool, root);
  out.push({}, `BST 的中序遍历是升序，所以第 k 个出栈的就是第 k 小。用栈模拟递归的中序，不用真的写递归。`, 0);

  const st = [];
  let node = root;
  let kk = k;
  const seen = [];
  while (node || st.length) {
    while (node) { st.push(node); node = node.left; }
    node = st.pop();
    seen.push(node.id);
    kk -= 1;
    out.push({ highlight: [node.id], visited: [...seen] }, `中序第 ${k - kk} 个是 ${node.val}。`, 6);
    if (kk === 0) {
      out.push({ highlight: [node.id], visited: [...seen] }, `第 ${k} 小就是 ${node.val}。`, 6);
      return { steps: out.steps, result: { num: node.val } };
    }
    node = node.right;
  }
  out.push({}, 'k 超出范围。', 9);
  return { steps: out.steps, result: { num: -1 } };
}

// ── 80. 删除有序数组中的重复项 II ───────────────────────
const removeDup2Code = [
  'function removeDuplicates(nums) {',
  '  let slow = 0;',
  '  for (const x of nums) {',
  '    if (slow < 2 || x !== nums[slow - 2]) {   // 最多留两个',
  '      nums[slow++] = x;',
  '    }',
  '  }',
  '  return slow;',
  '}',
];

function removeDuplicates2(nums) {
  const a = nums.slice();
  const steps = [];
  let slow = 0;
  const push = (state, note, line) => steps.push({
    state: { values: a.slice(), ...state },
    note, line, counters: { 保留: slow },
  });

  push({}, '每个元素最多留两次。slow 指向下一个写入位置：只要和 slow-2 位置的值不同，就可以留。', 0);
  for (let fast = 0; fast < a.length; fast++) {
    const x = a[fast];
    if (slow < 2 || x !== a[slow - 2]) {
      a[slow] = x;
      slow += 1;
      push({ move: [slow - 1], settled: Array.from({ length: slow }, (_, i) => i) }, `${x} 可以留，写到位置 ${slow - 1}。`, 4);
    } else {
      push({ compare: [fast] }, `${x} 已经留了两个，跳过。`, 3);
    }
  }
  push({ settled: Array.from({ length: slow }, (_, i) => i) }, `保留前 ${slow} 个：${a.slice(0, slow).join(',')}。`, 6);
  return { steps, result: { len: slow, arr: a.slice(0, slow).join(',') } };
}

export const leetcode10Algorithms = [
  { id: 'lc-search-bst', group: '热门题', title: '700. 二叉搜索树中的搜索', brief: 'BST 有序：比当前节点小往左、大往右，一路只走一条路，O(h)。', view: 'tree', facts: [['时间', 'O(h)'], ['空间', 'O(1) 迭代'], ['依据', 'BST 有序']], counters: '访问', legend: TL,
    inputs: [{ label: '找 2', make: () => ({ levels: [4, 2, 7, 1, 3], val: 2 }) }, { label: '找 5（不存在）', make: () => ({ levels: [4, 2, 7, 1, 3], val: 5 }) }], code: searchBstCode, run: searchBST },
  { id: 'lc-bst-lca', group: '热门题', title: '235. BST 的最近公共祖先', brief: '利用有序性：两个都小就往左、都大就往右，一旦分开当前节点就是答案。O(h)，不需要后序。', view: 'tree', facts: [['时间', 'O(h)'], ['空间', 'O(1)'], ['对比', '236 普通二叉树要后序']], counters: '访问', legend: TL,
    inputs: [{ label: '6 2 8 0 4 7 9，找 2 和 8', make: () => ({ levels: [6, 2, 8, 0, 4, 7, 9], p: 2, q: 8 }) }, { label: '同一棵树，找 2 和 4', make: () => ({ levels: [6, 2, 8, 0, 4, 7, 9], p: 2, q: 4 }) }], code: bstLcaCode, run: bstLca },
  { id: 'lc-sorted-to-bst', group: '热门题', title: '108. 有序数组转 BST', brief: '每次取中点当根，左右元素个数最多差 1，树自然平衡。O(n)。', view: 'tree', bst: false, facts: [['时间', 'O(n)'], ['空间', 'O(log n) 递归栈'], ['技巧', '取中点']], counters: '建节点', legend: TL,
    inputs: [{ label: '-10 -3 0 5 9', make: () => [-10, -3, 0, 5, 9] }, { label: '1 2 3', make: () => [1, 2, 3] }], code: sortedToBstCode, run: sortedArrayToBST },
  { id: 'lc-balanced', group: '热门题', title: '110. 平衡二叉树', brief: '平衡要求每个节点左右子树高度差不超过 1，不是只看根。后序一次算完。', view: 'tree', bst: false, facts: [['时间', 'O(n)'], ['空间', 'O(h)'], ['易错', '只看根']], counters: '访问', legend: TL,
    inputs: [{ label: '平衡的树', make: () => [3, 9, 20, null, null, 15, 7] }, { label: '不平衡', make: () => [1, 2, 2, 3, 3, null, null, 4, 4] }], code: balancedCode, run: isBalanced },
  { id: 'lc-min-depth', group: '热门题', title: '111. 二叉树的最小深度', brief: '到最近叶子的距离。单边孩子不能算 0——必须走到叶子，这跟最大深度不一样。', view: 'tree', bst: false, facts: [['时间', 'O(n)'], ['空间', 'O(h)'], ['坑', '单边孩子']], counters: '访问', legend: TL,
    inputs: [{ label: '3 9 20 null null 15 7', make: () => [3, 9, 20, null, null, 15, 7] }, { label: '单链表', make: () => [1, 2, null, 3, null] }], code: minDepthCode, run: minDepth },
  { id: 'lc-tree-paths', group: '热门题', title: '257. 二叉树的所有路径', brief: '从根往下走，把路径记在参数里；只有走到叶子才收进结果。', view: 'tree', bst: false, facts: [['时间', 'O(n)'], ['空间', 'O(h)'], ['关键', '叶子才收']], counters: '访问', legend: TL,
    inputs: [{ label: '1 2 3 null 5', make: () => [1, 2, 3, null, 5] }], code: allPathsCode, run: binaryTreePaths },
  { id: 'lc-right-view', group: '热门题', title: '199. 二叉树的右视图', brief: '层序遍历，每层只记最后一个节点——就是从右边看过去能看见的。', view: 'tree', bst: false, facts: [['时间', 'O(n)'], ['空间', 'O(w) 队列'], ['方法', 'BFS 每层取尾']], counters: '访问', legend: TL,
    inputs: [{ label: '1 2 3 null 5 null 4', make: () => [1, 2, 3, null, 5, null, 4] }], code: rightViewCode, run: rightSideView },
  { id: 'lc-merge-trees', group: '热门题', title: '617. 合并二叉树', brief: '两棵树同时往下走：一边空就返回另一边，两边都有就把值相加。', view: 'tree', bst: false, facts: [['时间', 'O(n)'], ['空间', 'O(h)'], ['规则', '空缺取另一边']], counters: '访问', legend: TL,
    inputs: [{ label: '两棵小树', make: () => ({ a: [1, 3, 2, 5], b: [2, 1, 3, null, 4, null, 7] }) }], code: mergeTreesCode, run: mergeTrees },
  { id: 'lc-kth-smallest', group: '热门题', title: '230. BST 中第 K 小的元素', brief: 'BST 中序遍历是升序，用栈模拟中序，第 k 次出栈的就是答案。', view: 'tree', facts: [['时间', 'O(h+k)'], ['空间', 'O(h) 栈'], ['依据', '中序升序']], counters: '访问', legend: TL,
    inputs: [{ label: 'k=1', make: () => ({ levels: [3, 1, 4, null, 2], k: 1 }) }, { label: 'k=3', make: () => ({ levels: [5, 3, 6, 2, 4, null, null, 1], k: 3 }) }], code: kthSmallestCode, run: kthSmallest },
  { id: 'lc-remove-dup-2', group: '热门题', title: '80. 删除有序数组中的重复项 II', brief: '每个元素最多留两次。slow 指向写入位置，只要和 slow-2 的值不同就能留。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['技巧', '和 slow-2 比较']], counters: '保留', legend: L,
    inputs: [{ label: '1 1 1 2 2 3', make: () => [1, 1, 1, 2, 2, 3] }, { label: '0 0 1 1 1 1 2 3 3', make: () => [0, 0, 1, 1, 1, 1, 2, 3, 3] }], code: removeDup2Code, run: removeDuplicates2 },
];
