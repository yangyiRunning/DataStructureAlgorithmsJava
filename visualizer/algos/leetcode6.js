/**
 * LeetCode 高频题（补到 40 道独立演示）。
 *
 * 这两道都是树的题，复用树视图。
 */

let uid6 = 0;
function buildTree6(order) {
  const pool = new Map();
  const nodes = order.map((v) => {
    const n = { id: `u${++uid6}`, val: v, left: null, right: null };
    pool.set(n.id, n);
    return n;
  });
  for (let i = 0; i < nodes.length; i++) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < nodes.length && nodes[l].val != null) nodes[i].left = nodes[l];
    if (r < nodes.length && nodes[r].val != null) nodes[i].right = nodes[r];
  }
  return { root: nodes[0], pool };
}
const snap6 = (pool) => [...pool.values()].map((n) => ({
  id: n.id, val: n.val,
  left: n.left ? n.left.id : null, right: n.right ? n.right.id : null,
}));

const treeLegend6 = [
  { cls: 'tnode', text: '节点' },
  { cls: 'tnode is-active', text: '正在处理' },
  { cls: 'tnode is-moving', text: '交换了左右' },
];

// ── 226. 翻转二叉树 ─────────────────────────────────────

const invertCode = [
  'function invertTree(node) {',
  '  if (!node) return null;',
  '  [node.left, node.right] = [node.right, node.left];   // 交换左右子树',
  '  invertTree(node.left);',
  '  invertTree(node.right);',
  '  return node;',
  '}',
];

function invertTree(levels) {
  const { root, pool } = buildTree6(levels);
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { nodes: snap6(pool), root: root.id, ...state },
    note,
    line,
    counters: { 交换: 0 },
  });

  push({}, '每个节点都把自己的左右孩子换一下，递归到叶子为止。前序、后序都行，反正每个节点都要碰一次。', 0);

  let swaps = 0;
  const walk = (node) => {
    if (!node) return;
    const l = node.left;
    node.left = node.right;
    node.right = l;
    swaps += 1;
    push({ highlight: [node.id], moved: [node.id] }, `把 ${node.val} 的左右子树对调。`, 2);
    walk(node.left);
    walk(node.right);
  };
  walk(root);

  const order = [];
  const q = [root];
  while (q.length) {
    const n = q.shift();
    if (!n) { order.push('null'); continue; }
    order.push(String(n.val));
    q.push(n.left, n.right);
  }
  while (order[order.length - 1] === 'null') order.pop();
  push({}, `翻转完成，层序是 ${order.join(',')}。`, 5);
  return { steps, result: { order: order.join(',') } };
}

// ── 112. 路径总和 ───────────────────────────────────────

const hasPathCode = [
  'function hasPathSum(node, target) {',
  '  if (!node) return false;',
  '  if (!node.left && !node.right) return target === node.val;   // 到叶子才判',
  '  const rest = target - node.val;',
  '  return hasPathSum(node.left, rest) || hasPathSum(node.right, rest);',
  '}',
];

function hasPathSum(input) {
  const { levels, target } = input;
  const { root, pool } = buildTree6(levels);
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { nodes: snap6(pool), root: root.id, ...state },
    note,
    line,
    counters: { 访问: 0 },
  });

  push({ container: { label: '目标', items: [{ text: String(target), hot: true }] } },
    '从根往下减，减到叶子时刚好减成 0 才算找到一条路径。注意必须到叶子，不能在半路就相等。', 0);

  const path = [];
  const dfs = (node, rest) => {
    if (!node) return false;
    path.push(node.id);
    const left = rest - node.val;
    if (!node.left && !node.right) {
      const hit = left === 0;
      push({ highlight: [...path], moved: hit ? [...path] : [] },
        `走到叶子 ${node.val}，剩余 ${left}，${hit ? '正好为 0，找到一条路径。' : '不为 0，这条路径不算。'}`, 2);
      path.pop();
      return hit;
    }
    push({ highlight: [...path] }, `在 ${node.val} 处，剩余目标 ${left}，往两边找。`, 3);
    const ok = dfs(node.left, left) || dfs(node.right, left);
    path.pop();
    return ok;
  };

  const ok = dfs(root, target);
  push({}, ok ? `存在和为 ${target} 的根到叶路径。` : `不存在和为 ${target} 的根到叶路径。`, 4);
  return { steps, result: { ok: String(ok) } };
}

export const leetcode6Algorithms = [
  {
    id: 'lc-invert-tree',
    group: '热门题',
    title: '226. 翻转二叉树',
    brief: '每个节点把自己的左右孩子换一下，再递归处理孩子。前序后序都行——反正每个节点都要访问一次。',
    view: 'tree', bst: false,
    facts: [['时间', 'O(n)'], ['空间', 'O(h) 递归栈'], ['遍历序', '前序 / 后序均可'], ['易错', '忘了递归孩子']],
    counters: '交换', legend: treeLegend6,
    inputs: [
      { label: '4 2 7 1 3 6 9', make: () => [4, 2, 7, 1, 3, 6, 9] },
      { label: '单链', make: () => [1, 2, null, 3, null] },
    ],
    code: invertCode, run: invertTree,
  },
  {
    id: 'lc-path-sum',
    group: '热门题',
    title: '112. 路径总和',
    brief: '从根往下减，减到叶子时刚好为 0 才算找到。必须到叶子——半路相等不算，这是最容易错的地方。',
    view: 'tree', bst: false,
    facts: [['时间', 'O(n)'], ['空间', 'O(h) 递归栈'], ['关键', '必须到叶子'], ['易错', '半路相等就返回']],
    counters: '访问', legend: treeLegend6,
    inputs: [
      { label: '5 4 8 11 null 13 4 7 2 null null null 1，target 22', make: () => ({ levels: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], target: 22 }) },
      { label: '同一棵树，target 5', make: () => ({ levels: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], target: 5 }) },
    ],
    code: hasPathCode, run: hasPathSum,
  },
];
