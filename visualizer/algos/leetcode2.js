/**
 * LeetCode 高频题（第二批）。
 *
 * 这一批尽量复用现有视图：数组题用数组视图，树题用树视图，分组题用哈希桶视图。
 * 每道题仍然在 brief 里点明它考的是哪个知识点。
 */

// ── 121. 买卖股票的最佳时机 ──────────────────────────────

const stockCode = [
  'function maxProfit(prices) {',
  '  let minPrice = Infinity, best = 0;',
  '  for (const p of prices) {',
  '    minPrice = Math.min(minPrice, p);   // 历史最低价',
  '    best = Math.max(best, p - minPrice);',
  '  }',
  '  return best;',
  '}',
];

function maxProfit(prices) {
  const steps = [];
  let minPrice = Infinity;
  let best = 0;

  const push = (state, note, line) => steps.push({
    state: {
      values: prices,
      container: { label: '最低 / 最大收益', items: [{ text: `min ${minPrice === Infinity ? '∞' : minPrice}`, hot: true }, { text: `best ${best}` }] },
      ...state,
    },
    note,
    line,
    counters: { 访问: 0 },
  });

  push({}, '只能买卖一次，且买在卖之前。扫一遍，边走边记历史最低价，每天都算"今天卖能赚多少"。', 0);

  prices.forEach((p, i) => {
    const beforeMin = minPrice;
    minPrice = Math.min(minPrice, p);
    const gain = p - minPrice;
    const before = best;
    best = Math.max(best, gain);
    push({ current: i, pivot: i, settled: minPrice === p ? [i] : [] },
      `今天 ${p}：最低价 ${beforeMin === Infinity ? '∞' : beforeMin} → ${minPrice === Infinity ? '∞' : minPrice}，今天卖能赚 ${gain}，最大收益 ${best}${best > before ? '（更新了）' : ''}。`,
      3);
  });

  push({}, `最大收益 ${best}。一趟 O(n)，两个变量。`, 6);
  return { steps, result: { profit: best } };
}

// ── 152. 乘积最大子数组 ──────────────────────────────────

const maxProductCode = [
  'function maxProduct(nums) {',
  '  let curMax = nums[0], curMin = nums[0], best = nums[0];',
  '  for (let i = 1; i < nums.length; i++) {',
  '    const a = curMax * nums[i], b = curMin * nums[i];',
  '    curMax = Math.max(nums[i], a, b);   // 也要看最小值乘负数',
  '    curMin = Math.min(nums[i], a, b);',
  '    best = Math.max(best, curMax);',
  '  }',
  '  return best;',
  '}',
];

function maxProduct(nums) {
  const steps = [];
  let curMax = nums[0];
  let curMin = nums[0];
  let best = nums[0];

  const push = (state, note, line) => steps.push({
    state: {
      values: nums,
      container: { label: 'max / min / best', items: [{ text: `${curMax}/${curMin}/${best}`, hot: true }] },
      ...state,
    },
    note,
    line,
    counters: { 访问: 0 },
  });

  push({ current: 0, pivot: 0 }, '乘积和求和不一样：负负得正，所以"最小值"也可能是潜力股，必须同时维护最大和最小两个量。', 0);

  for (let i = 1; i < nums.length; i++) {
    const a = curMax * nums[i];
    const b = curMin * nums[i];
    curMax = Math.max(nums[i], a, b);
    curMin = Math.min(nums[i], a, b);
    best = Math.max(best, curMax);
    push({ current: i, pivot: i },
      `${nums[i]}：接前面的最大得 ${a}、最小得 ${b}，新 max = ${curMax}，min = ${curMin}。全局最好 ${best}。`, 3);
  }

  push({}, `最大乘积 ${best}。`, 6);
  return { steps, result: { product: best } };
}

// ── 283. 移动零 ──────────────────────────────────────────

const moveZeroCode = [
  'function moveZeroes(nums) {',
  '  let slow = 0;                       // 下一个非零该放的位置',
  '  for (let fast = 0; fast < nums.length; fast++) {',
  '    if (nums[fast] !== 0) {',
  '      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];',
  '      slow++;',
  '    }',
  '  }',
  '}',
];

function moveZeroes(input) {
  const nums = input.slice();
  const steps = [];
  let swaps = 0;
  const push = (state, note, line) => steps.push({
    state: { values: nums.slice(), ...state },
    note,
    line,
    counters: { 交换: swaps },
  });

  let slow = 0;
  push({ pointers: [{ i: slow, text: 'slow' }] },
    '快指针找非零，找到就换到慢指针的位置。慢指针左边永远是排好的非零段。', 0);

  for (let fast = 0; fast < nums.length; fast++) {
    push({ compare: [fast], pointers: [{ i: slow, text: 'slow' }, { i: fast, text: 'fast' }] },
      `看 nums[${fast}] = ${nums[fast]}。`, 2);
    if (nums[fast] !== 0) {
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
      swaps += 1;
      slow += 1;
      push({ move: [slow - 1], pointers: [{ i: slow, text: 'slow' }, { i: fast, text: 'fast' }], settled: Array.from({ length: slow }, (_, k) => k) },
        `非零，和 slow 位置交换，slow 前进到 ${slow}。`, 4);
    }
  }

  push({ settled: nums.map((_, i) => i) }, `完成：${nums.join(', ')}。零都被挤到了后面，而且保持非零元素的相对顺序。`, 6);
  return { steps, result: { arr: nums.join(',') } };
}

// ── 238. 除自身以外数组的乘积 ────────────────────────────

const productExceptCode = [
  'function productExceptSelf(nums) {',
  '  const n = nums.length;',
  '  const res = new Array(n).fill(1);',
  '  let left = 1;',
  '  for (let i = 0; i < n; i++) { res[i] = left; left *= nums[i]; }   // 左侧前缀积',
  '  let right = 1;',
  '  for (let i = n - 1; i >= 0; i--) { res[i] *= right; right *= nums[i]; }  // 右侧后缀积',
  '  return res;',
  '}',
];

function productExceptSelf(nums) {
  const n = nums.length;
  const res = new Array(n).fill(1);
  const steps = [];
  let ops = 0;
  const push = (state, note, line) => steps.push({
    state: { values: res.slice(), ...state },
    note,
    line,
    counters: { 乘算: ops },
  });

  push({}, '不能用除法（有 0 就废），做法是两趟：先从左往右填"左边所有数的积"，再从右往左乘上"右边所有数的积"。', 2);

  let left = 1;
  for (let i = 0; i < n; i++) {
    res[i] = left;
    left *= nums[i];
    ops += 1;
    push({ current: i, pivot: i }, `第 1 趟：res[${i}] = 左边所有数的积 = ${res[i]}。`, 4);
  }

  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    res[i] *= right;
    right *= nums[i];
    ops += 1;
    push({ current: i, pivot: i }, `第 2 趟：再乘上右边所有数的积 ${right / nums[i] || right}，res[${i}] = ${res[i]}。`, 6);
  }

  push({ settled: res.map((_, i) => i) }, `结果：${res.join(', ')}。没用到除法，额外空间只有两个变量。`, 7);
  return { steps, result: { arr: res.join(',') } };
}

// ── 189. 轮转数组 ────────────────────────────────────────

const rotateCode = [
  'function rotate(nums, k) {',
  '  k %= nums.length;',
  '  reverse(nums, 0, nums.length - 1);   // 整体反转',
  '  reverse(nums, 0, k - 1);             // 前 k 个反转',
  '  reverse(nums, k, nums.length - 1);   // 后面反转',
  '}',
];

function rotate(input) {
  const { nums, k } = input;
  const a = nums.slice();
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { values: a.slice(), ...state },
    note,
    line,
    counters: { 反转次数: 0 },
  });

  const kk = k % a.length;
  const rev = (lo, hi, label) => {
    push({ range: { lo, hi }, rangeLabel: label }, `${label}：反转区间 [${lo}, ${hi}]。`, 2);
    while (lo < hi) {
      [a[lo], a[hi]] = [a[hi], a[lo]];
      push({ move: [lo, hi], range: { lo, hi }, rangeLabel: label }, `交换 a[${lo}] 和 a[${hi}]。`, 2);
      lo += 1;
      hi -= 1;
    }
  };

  push({}, `把数组右移 ${kk} 位。三次反转就够了：整体翻、前 k 个翻、剩下的翻——不用额外数组。`, 0);
  rev(0, a.length - 1, '整体反转');
  rev(0, kk - 1, `前 ${kk} 个反转`);
  rev(kk, a.length - 1, `后面反转`);

  push({ settled: a.map((_, i) => i) }, `结果：${a.join(', ')}。`, 5);
  return { steps, result: { arr: a.join(',') } };
}

// ── 104 / 101 / 543 / 98：树 ────────────────────────────

let treeUid = 0;
function buildTreeFromLevel(order) {
  const pool = new Map();
  const nodes = order.map((v) => {
    const n = { id: `n${++treeUid}`, val: v, left: null, right: null };
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

const snapTree = (pool) => [...pool.values()].map((n) => ({
  id: n.id, val: n.val,
  left: n.left ? n.left.id : null, right: n.right ? n.right.id : null,
}));

const depthCode = [
  'function maxDepth(node) {',
  '  if (node === null) return 0;',
  '  return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));',
  '}',
];

function maxDepth(levels) {
  const { root, pool } = buildTreeFromLevel(levels);
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { nodes: snapTree(pool), root: root.id, ...state },
    note,
    line,
    counters: { 访问: 0 },
  });

  push({}, '最大深度 = 1 + 左右子树里更深的那个。后序遍历：先拿到子树的结果，再算自己。', 0);

  let visited = 0;
  const dfs = (node) => {
    if (!node) return 0;
    visited += 1;
    push({ highlight: [node.id] }, `进入 ${node.val}，先算它的左右子树。`, 0);
    const l = dfs(node.left);
    const r = dfs(node.right);
    const d = 1 + Math.max(l, r);
    push({ highlight: [node.id], visited: [node.id] }, `${node.val} 的左深 ${l}、右深 ${r}，所以它的深度是 ${d}。`, 2);
    return d;
  };

  const d = dfs(root);
  push({}, `最大深度 ${d}。`, 2);
  return { steps, result: { depth: d } };
}

const symmetricCode = [
  'function isSymmetric(root) {',
  '  const walk = (a, b) => {',
  '    if (!a && !b) return true;',
  '    if (!a || !b) return false;',
  '    return a.val === b.val && walk(a.left, b.right) && walk(a.right, b.left);',
  '  };',
  '  return walk(root.left, root.right);   // 注意是左对右、右对左',
  '}',
];

function isSymmetric(levels) {
  const { root, pool } = buildTreeFromLevel(levels);
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { nodes: snapTree(pool), root: root.id, ...state },
    note,
    line,
    counters: { 比较: 0 },
  });

  push({}, '对称不是"左右子树各自对称"，而是"左子树的左边对右子树的右边"。所以要比两棵镜像的子树。', 0);

  let cmp = 0;
  const walk = (a, b) => {
    cmp += 1;
    if (!a && !b) {
      push({}, '两边都是空，这一对算对上。', 2);
      return true;
    }
    if (!a || !b) {
      push({ highlight: a ? [a.id] : b ? [b.id] : [] }, '一边空一边不空，不对称。', 2);
      return false;
    }
    push({ highlight: [a.id, b.id] }, `比较 ${a.val} 和 ${b.val}。`, 4);
    if (a.val !== b.val) return false;
    return walk(a.left, b.right) && walk(a.right, b.left);
  };

  const ok = walk(root.left, root.right);
  push({}, ok ? '是对称的。' : '不是对称的。', 6);
  return { steps, result: { ok: String(ok) } };
}

const diameterCode = [
  'function diameterOfBinaryTree(root) {',
  '  let best = 0;',
  '  const depth = (node) => {',
  '    if (!node) return 0;',
  '    const l = depth(node.left), r = depth(node.right);',
  '    best = Math.max(best, l + r);      // 经过当前节点的最长路径',
  '    return 1 + Math.max(l, r);',
  '  };',
  '  depth(root);',
  '  return best;',
  '}',
];

function diameter(levels) {
  const { root, pool } = buildTreeFromLevel(levels);
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { nodes: snapTree(pool), root: root.id, ...state },
    note,
    line,
    counters: { 访问: 0 },
  });

  push({}, '直径不一定经过根。所以递归时在每个节点都算一次"左深 + 右深"，取全局最大。', 0);

  let best = 0;
  const depth = (node) => {
    if (!node) return 0;
    const l = depth(node.left);
    const r = depth(node.right);
    if (l + r > best) best = l + r;
    push({ highlight: [node.id] }, `经过 ${node.val} 的路径长 ${l} + ${r} = ${l + r}，当前最大 ${best}。`, 4);
    return 1 + Math.max(l, r);
  };

  depth(root);
  push({}, `直径 ${best}。`, 6);
  return { steps, result: { diameter: best } };
}

// ── 322. 零钱兑换 ────────────────────────────────────────

const coinCode = [
  'function coinChange(coins, amount) {',
  '  const dp = new Array(amount + 1).fill(Infinity);',
  '  dp[0] = 0;',
  '  for (let a = 1; a <= amount; a++) {',
  '    for (const c of coins) {',
  '      if (a >= c) dp[a] = Math.min(dp[a], dp[a - c] + 1);',
  '    }',
  '  }',
  '  return dp[amount] === Infinity ? -1 : dp[amount];',
  '}',
];

function coinChange(input) {
  const { coins, amount } = input;
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  const steps = [];
  let filled = 0;
  const push = (state, note, line) => steps.push({
    state: {
      values: dp.map((v) => (v === Infinity ? 0 : v)),
      container: { label: 'dp', items: dp.map((v, i) => ({ text: `${i}:${v === Infinity ? '∞' : v}` })) },
      ...state,
    },
    note,
    line,
    counters: { 填表: filled },
  });

  push({}, `凑 ${amount} 元，硬币 ${coins.join('/')} 元，求最少几枚。完全背包的变形：dp[a] = min(dp[a], dp[a-c] + 1)。`, 0);

  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (a >= c && dp[a - c] + 1 < dp[a]) {
        dp[a] = dp[a - c] + 1;
      }
    }
    filled += 1;
    push({ current: a, pivot: a },
      `凑 ${a} 元：${dp[a] === Infinity ? '凑不出来' : `最少 ${dp[a]} 枚`}。`, 5);
  }

  const ans = dp[amount] === Infinity ? -1 : dp[amount];
  push({}, ans === -1 ? `凑不出 ${amount} 元。` : `${amount} 元最少要 ${ans} 枚。`, 8);
  return { steps, result: { coins: ans } };
}

const lc2Legend = [
  { cls: 'bar', text: '数组元素 / 结果' },
  { cls: 'bar is-compare', text: '正在看' },
  { cls: 'bar is-pivot', text: '当前处理' },
  { cls: 'bar is-settled', text: '已确定' },
];

const treeLegend2 = [
  { cls: 'tnode', text: '节点' },
  { cls: 'tnode is-active', text: '当前处理' },
  { cls: 'tnode is-visited', text: '已算完' },
];

export const leetcode2Algorithms = [
  {
    id: 'lc-stock',
    group: '热门题',
    title: '121. 买卖股票的最佳时机',
    brief: '一趟扫描，边走边记历史最低价，每天都算「今天卖能赚多少」。贪心里最简单的一类：维护一个前缀最优。',
    view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['技巧', '前缀最小值'], ['变体', '121/122/123/188']],
    counters: '访问', legend: lc2Legend,
    inputs: [
      { label: '7 1 5 3 6 4', make: () => [7, 1, 5, 3, 6, 4] },
      { label: '一路下跌', make: () => [7, 6, 4, 3, 1] },
    ],
    code: stockCode, run: maxProfit,
  },
  {
    id: 'lc-max-product',
    group: '热门题',
    title: '152. 乘积最大子数组',
    brief: '和最大子数组和不一样：负负得正，所以"最小值"也可能是潜力股。必须同时维护最大和最小两个量。',
    view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['关键', '同时维护 min'], ['对比', '53 只维护 max']],
    counters: '访问', legend: lc2Legend,
    inputs: [
      { label: '2 3 -2 4', make: () => [2, 3, -2, 4] },
      { label: '-2 0 -1', make: () => [-2, 0, -1] },
      { label: '带多个负数', make: () => [-2, 3, -4, 5, -1, 2] },
    ],
    code: maxProductCode, run: maxProduct,
  },
  {
    id: 'lc-move-zero',
    group: '热门题',
    title: '283. 移动零',
    brief: '快慢指针：快指针找非零，找到就换到慢指针位置。慢指针左边永远是排好的非零段，零自然被挤到后面。',
    view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['技巧', '快慢指针'], ['要求', '保持相对顺序']],
    counters: '交换', legend: lc2Legend,
    inputs: [
      { label: '0 1 0 3 12', make: () => [0, 1, 0, 3, 12] },
      { label: '随机含零', make: () => Array.from({ length: 8 }, () => (Math.random() < 0.4 ? 0 : 1 + Math.floor(Math.random() * 9))) },
    ],
    code: moveZeroCode, run: moveZeroes,
  },
  {
    id: 'lc-product-except-self',
    group: '热门题',
    title: '238. 除自身以外数组的乘积',
    brief: '不能用除法（有 0 就废）。两趟：先从左往右填左侧前缀积，再从右往左乘上右侧后缀积。',
    view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1) 除结果'], ['技巧', '前缀积 × 后缀积'], ['坑', '不能用除法']],
    counters: '乘算', legend: lc2Legend,
    inputs: [
      { label: '1 2 3 4', make: () => [1, 2, 3, 4] },
      { label: '含 0', make: () => [0, 2, 3, 4] },
    ],
    code: productExceptCode, run: productExceptSelf,
  },
  {
    id: 'lc-rotate',
    group: '热门题',
    title: '189. 轮转数组',
    brief: '三次反转：整体翻、前 k 个翻、剩下的翻。不用额外数组，O(1) 空间。',
    view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['技巧', '三次反转'], ['坑', 'k 要取模']],
    counters: '反转次数', legend: lc2Legend,
    inputs: [
      { label: '1..7 右移 3', make: () => ({ nums: [1, 2, 3, 4, 5, 6, 7], k: 3 }) },
      { label: 'k 大于长度', make: () => ({ nums: [1, 2, 3, 4], k: 6 }) },
    ],
    code: rotateCode, run: rotate,
  },
  {
    id: 'lc-max-depth',
    group: '热门题',
    title: '104. 二叉树的最大深度',
    brief: '1 + max(左深, 右深)。后序遍历的典型：先拿子树结果，再算自己。',
    view: 'tree',
    bst: false,   // 任意二叉树，不是 BST
    facts: [['时间', 'O(n)'], ['空间', 'O(h) 递归栈'], ['遍历序', '后序'], ['同型', '最小深度 / 平衡树']],
    counters: '访问', legend: treeLegend2,
    inputs: [
      { label: '3 9 20 null null 15 7', make: () => [3, 9, 20, null, null, 15, 7] },
      { label: '左斜树', make: () => [1, 2, null, 3, null] },
    ],
    code: depthCode, run: maxDepth,
  },
  {
    id: 'lc-symmetric',
    group: '热门题',
    title: '101. 对称二叉树',
    brief: '对称不是"左右子树各自对称"，而是"左子树的左边对右子树的右边"。所以比的是两棵镜像子树。',
    view: 'tree',
    bst: false,   // 任意二叉树，不是 BST
    facts: [['时间', 'O(n)'], ['空间', 'O(h) 递归栈'], ['关键', '左对右、右对左'], ['易错', '只比同侧']],
    counters: '比较', legend: treeLegend2,
    inputs: [
      { label: '对称 1 2 2 3 4 4 3', make: () => [1, 2, 2, 3, 4, 4, 3] },
      { label: '不对称 1 2 2 null 3 null 3', make: () => [1, 2, 2, null, 3, null, 3] },
    ],
    code: symmetricCode, run: isSymmetric,
  },
  {
    id: 'lc-diameter',
    group: '热门题',
    title: '543. 二叉树的直径',
    brief: '直径不一定过根。递归时在每个节点都算一次"左深 + 右深"，取全局最大——这就是树形 DP 的雏形。',
    view: 'tree',
    bst: false,   // 任意二叉树，不是 BST
    facts: [['时间', 'O(n)'], ['空间', 'O(h) 递归栈'], ['关键', '每个节点都要算'], ['易错', '只算根']],
    counters: '访问', legend: treeLegend2,
    inputs: [
      { label: '1 2 3 4 5', make: () => [1, 2, 3, 4, 5] },
      { label: '链状', make: () => [1, 2, null, 3, null, 4, null] },
    ],
    code: diameterCode, run: diameter,
  },
  {
    id: 'lc-coin-change',
    group: '热门题',
    title: '322. 零钱兑换',
    brief: '完全背包的变形：dp[a] = min(dp[a], dp[a-c] + 1)。凑不出来就返回 -1，所以初值要用无穷大。',
    view: 'array', facts: [['时间', 'O(amount×n)'], ['空间', 'O(amount)'], ['类型', '完全背包'], ['初值', '无穷大']],
    counters: '填表', legend: lc2Legend,
    inputs: [
      { label: '1 2 5 凑 11', make: () => ({ coins: [1, 2, 5], amount: 11 }) },
      { label: '2 凑 3（凑不出）', make: () => ({ coins: [2], amount: 3 }) },
    ],
    code: coinCode, run: coinChange,
  },
];
