/**
 * 二叉搜索树插入，和 AVL 插入（含四种旋转）。
 *
 * 两条实现上的硬约束，都是为了画面不说谎：
 *
 * 1) 快照里的根节点从"没有父节点的那个节点"现场推出来，不靠一个全局 root 变量。
 *    AVL 的旋转发生在递归回溯的路上，root 变量的赋值在外层还没执行完，
 *    这时候读 root 会读到一个已经被转下去的旧根——画面上就会出现两个根、或者树断成两半。
 *
 * 2) 旋转必须同步改 parent 指针。少了这一步，结构看着对，
 *    但下一次失衡判断会顺着错误的父链往上找，表现为"该转的没转、不该转的乱转"。
 *    这也是学生手写 AVL 最常见的错，动画里专门标出来。
 */

let uid = 0;
const nextId = () => `t${++uid}`;

function makeNode(val) {
  return { id: nextId(), val, left: null, right: null, parent: null };
}

function buildSnap(pool) {
  return [...pool.values()].map((n) => ({
    id: n.id,
    val: n.val,
    left: n.left ? n.left.id : null,
    right: n.right ? n.right.id : null,
  }));
}

function rootOf(pool) {
  for (const n of pool.values()) if (!n.parent) return n;
  return null;
}

function heightOf(node) {
  return node ? 1 + Math.max(heightOf(node.left), heightOf(node.right)) : 0;
}

const randomSeq = (n = 8, max = 99) => {
  const s = new Set();
  while (s.size < n) s.add(10 + Math.floor(Math.random() * max));
  return [...s];
};

// ─────────────────────────────────────────────────────────────
// 二叉搜索树插入
// ─────────────────────────────────────────────────────────────

const bstCode = [
  'function insert(root, val) {',
  '  const node = newNode(val);',
  '  if (root === null) return node;',
  '  let cur = root;',
  '  while (true) {',
  '    if (val < cur.val) {',
  '      if (cur.left === null) {',
  '        cur.left = node; break;',
  '      }',
  '      cur = cur.left;',
  '    } else if (val > cur.val) {',
  '      if (cur.right === null) {',
  '        cur.right = node; break;',
  '      }',
  '      cur = cur.right;',
  '    } else {',
  '      return root;    // 重复不插',
  '    }',
  '  }',
  '  return root;',
  '}',
];

function bstInsert(seq) {
  const pool = new Map();
  let root = null;
  const steps = [];
  let cmp = 0;

  const push = (state, note, line) => steps.push({
    state: { nodes: buildSnap(pool), root: rootOf(pool)?.id ?? null, showMeta: true, ...state },
    note,
    line,
    counters: { 比较: cmp, 节点数: pool.size },
  });

  push({}, `空树，依次插入 ${seq.join(', ')}。`, 0);

  for (const val of seq) {
    const node = makeNode(val);
    pool.set(node.id, node);

    if (root === null) {
      root = node;
      push({ highlight: [node.id] }, `${val} 是第一个节点，直接当根。`, 2);
      continue;
    }

    let cur = root;
    push({ highlight: [cur.id] }, `插入 ${val}：从根 ${cur.val} 开始往下比。`, 3);

    while (true) {
      cmp += 1;
      if (val < cur.val) {
        push({ highlight: [cur.id] }, `${val} < ${cur.val}，往左走。`, 5);
        if (cur.left === null) {
          cur.left = node;
          node.parent = cur;
          push({ highlight: [node.id], moving: [cur.id] }, `左边是空的，${val} 挂到 ${cur.val} 的左子树。`, 7);
          break;
        }
        cur = cur.left;
        push({ highlight: [cur.id] }, `继续往下：当前节点 ${cur.val}。`, 8);
      } else if (val > cur.val) {
        push({ highlight: [cur.id] }, `${val} > ${cur.val}，往右走。`, 10);
        if (cur.right === null) {
          cur.right = node;
          node.parent = cur;
          push({ highlight: [node.id], moving: [cur.id] }, `右边是空的，${val} 挂到 ${cur.val} 的右子树。`, 12);
          break;
        }
        cur = cur.right;
        push({ highlight: [cur.id] }, `继续往下：当前节点 ${cur.val}。`, 13);
      } else {
        pool.delete(node.id); // 重复值不插，把临时节点撤掉
        push({ highlight: [cur.id] }, `${val} 已经存在，什么都不做。`, 15);
        break;
      }
    }
  }

  push({}, `插完。中序遍历一定是升序——这是 BST 的定义性质，也是判断树有没有建错的检查手段。`, 19);
  return {
    steps,
    result: { inorder: inorder(root).join(','), height: heightOf(root), size: pool.size },
  };
}

function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out);
  out.push(node.val);
  inorder(node.right, out);
  return out;
}

// ─────────────────────────────────────────────────────────────
// AVL 插入
// ─────────────────────────────────────────────────────────────

const avlCode = [
  'function insert(node, val) {',
  '  if (node === null) {',
  '    return newNode(val);',
  '  }',
  '  if (val < node.val) {',
  '    node.left = insert(node.left, val);',
  '  } else if (val > node.val) {',
  '    node.right = insert(node.right, val);',
  '  } else {',
  '    return node;      // 重复值不插',
  '  }',
  '  const hl = h(node.left);',
  '  const hr = h(node.right);',
  '  node.height = 1 + max(hl, hr);',
  '  const bf = hl - hr;',
  '  if (bf > 1 && val < node.left.val) {',
  '    return rotateRight(node);          // LL',
  '  }',
  '  if (bf < -1 && val > node.right.val) {',
  '    return rotateLeft(node);           // RR',
  '  }',
  '  if (bf > 1 && val > node.left.val) {',
  '    node.left = rotateLeft(node.left);',
  '    return rotateRight(node);          // LR',
  '  }',
  '  if (bf < -1 && val < node.right.val) {',
  '    node.right = rotateRight(node.right);',
  '    return rotateLeft(node);           // RL',
  '  }',
  '  return node;',
  '}',
];

function avlInsert(seq) {
  const pool = new Map();
  let root = null;
  const steps = [];
  let rotations = 0;
  let cmp = 0;

  const push = (state, note, line) => steps.push({
    state: {
      nodes: buildSnap(pool),
      root: rootOf(pool)?.id ?? null,
      showMeta: true,
      ...state,
    },
    note,
    line,
    counters: { 比较: cmp, 旋转: rotations, 节点数: pool.size },
  });

  const relink = (child, parent) => {
    child.parent = parent;
  };

  function rotateRight(y) {
    const x = y.left;
    y.left = x.right;
    if (x.right) relink(x.right, y);
    x.parent = y.parent;
    if (y.parent === null) root = x;
    else if (y.parent.left === y) y.parent.left = x;
    else y.parent.right = x;
    x.right = y;
    y.parent = x;
    return x;
  }

  function rotateLeft(x) {
    const y = x.right;
    x.right = y.left;
    if (y.left) relink(y.left, x);
    y.parent = x.parent;
    if (x.parent === null) root = y;
    else if (x.parent.left === x) x.parent.left = y;
    else x.parent.right = y;
    y.left = x;
    x.parent = y;
    return y;
  }

  const insert = (node, val, depth) => {
    if (node === null) {
      const n = makeNode(val);
      pool.set(n.id, n);
      push({ highlight: [n.id] }, `走到空位，${val} 作为新叶子挂上。`, 2);
      return n;
    }

    cmp += 1;
    push({ highlight: [node.id] }, `在 ${node.val} 处比较：${val} ${val < node.val ? '<' : val > node.val ? '>' : '='} ${node.val}`,
      val < node.val ? 5 : 7);

    if (val < node.val) {
      node.left = insert(node.left, val, depth + 1);
      if (node.left) node.left.parent = node;   // 普通挂接也要维护 parent
    } else if (val > node.val) {
      node.right = insert(node.right, val, depth + 1);
      if (node.right) node.right.parent = node;
    } else {
      return node;
    }

    const hl = heightOf(node.left);
    const hr = heightOf(node.right);
    const bf = hl - hr;

    push(
      { highlight: [node.id] },
      `回溯到 ${node.val}：左高 ${hl}、右高 ${hr}，平衡因子 bf = ${bf}。`,
      14,
    );

    if (bf > 1 && val < node.left.val) {
      push({ highlight: [node.id, node.left.id], moving: [node.id] },
        `${node.val} 左边比右边高两层，且新节点落在左孩子的左边 —— LL 型，一次右旋。`, 15);
      const newRoot = rotateRight(node);
      rotations += 1;
      push({ highlight: [newRoot.id, node.id], moving: [newRoot.id, node.id] },
        `右旋完成：${newRoot.val} 升上来当这棵子树的根，${node.val} 变成它的右孩子。`, 16);
      return newRoot;
    }

    if (bf < -1 && val > node.right.val) {
      push({ highlight: [node.id, node.right.id], moving: [node.id] },
        `${node.val} 右边比左边高两层，新节点在右孩子的右边 —— RR 型，一次左旋。`, 18);
      const newRoot = rotateLeft(node);
      rotations += 1;
      push({ highlight: [newRoot.id, node.id], moving: [newRoot.id, node.id] },
        `左旋完成：${newRoot.val} 升上来，${node.val} 变成它的左孩子。`, 19);
      return newRoot;
    }

    if (bf > 1 && val > node.left.val) {
      push({ highlight: [node.id, node.left.id], moving: [node.id] },
        `${node.val} 左高两层，但新节点在左孩子的右边 —— LR 型。一次右旋解决不了，要先把左孩子左旋成 LL 型。`, 21);
      node.left = rotateLeft(node.left);
      rotations += 1;
      push({ highlight: [node.left.id, node.id], moving: [node.left.id] },
        `第一步：左孩子左旋，树形从 LR 变成 LL。`, 22);
      const newRoot = rotateRight(node);
      rotations += 1;
      push({ highlight: [newRoot.id, node.id], moving: [newRoot.id, node.id] },
        `第二步：再对 ${node.val} 右旋，平衡恢复。`, 23);
      return newRoot;
    }

    if (bf < -1 && val < node.right.val) {
      push({ highlight: [node.id, node.right.id], moving: [node.id] },
        `${node.val} 右高两层，新节点在右孩子的左边 —— RL 型。先右旋右孩子。`, 25);
      node.right = rotateRight(node.right);
      rotations += 1;
      push({ highlight: [node.right.id, node.id], moving: [node.right.id] },
        `第一步：右孩子右旋，树形从 RL 变成 RR。`, 26);
      const newRoot = rotateLeft(node);
      rotations += 1;
      push({ highlight: [newRoot.id, node.id], moving: [newRoot.id, node.id] },
        `第二步：再对 ${node.val} 左旋，平衡恢复。`, 27);
      return newRoot;
    }

    return node;
  };

  push({}, `空树，依次插入 ${seq.join(', ')}。每插一个都要沿回溯路径检查平衡。`, 0);

  for (const val of seq) {
    root = insert(root, val, 0);
    // 递归里改了 root，这里再校准一次：根永远是没有父节点的那个
    root = rootOf(pool) ?? root;
    push({}, `${val} 插入完成。`, 29);
  }

  return {
    steps,
    result: { inorder: inorder(root).join(','), height: heightOf(root), rotations, size: pool.size },
  };
}

// ─────────────────────────────────────────────────────────────

const treeLegend = [
  { cls: 'tnode', text: '普通节点' },
  { cls: 'tnode is-active', text: '当前访问 / 新插入' },
  { cls: 'tnode is-moving', text: '参与旋转' },
];

export const treeAlgorithms = [
  {
    id: 'tree-bst-insert',
    group: '树',
    title: '二叉搜索树插入',
    brief: '比当前节点小就往左、大就往右，一路走到空位挂上去。代价是树形完全由插入顺序决定——顺序排好的输入会把树拉成一条链。',
    view: 'tree',
    facts: [['平均', 'O(log n)'], ['最坏', 'O(n) 退化成链'], ['空间', 'O(1) 迭代'], ['中序', '必为升序']],
    counters: '比较、节点数',
    legend: treeLegend,
    inputs: [
      { label: '均匀的 7 个', make: () => [50, 30, 70, 20, 40, 60, 80] },
      { label: '升序插入（最坏）', make: () => [10, 20, 30, 40, 50, 60] },
      { label: '随机 8 个', make: () => randomSeq(8) },
    ],
    code: bstCode,
    run: bstInsert,
  },
  {
    id: 'tree-avl-insert',
    group: '树',
    title: 'AVL 插入与旋转',
    brief: '每次插完沿回溯路径更新高度、算平衡因子，一旦某点两边高差超过 1 就旋转。四种失衡 LL / RR / LR / RL，前两个一次旋完，后两个要旋两次。',
    view: 'tree',
    facts: [['查找 / 插入', 'O(log n)'], ['平衡条件', '|bf| ≤ 1'], ['旋转', '单旋 O(1)'], ['LR/RL', '双旋']],
    counters: '比较、旋转、节点数',
    legend: treeLegend,
    inputs: [
      { label: 'LL（右旋）', make: () => [30, 20, 10] },
      { label: 'RR（左旋）', make: () => [10, 20, 30] },
      { label: 'LR（双旋）', make: () => [30, 10, 20] },
      { label: 'RL（双旋）', make: () => [10, 30, 20] },
      { label: '连续插入 8 个', make: () => randomSeq(8) },
    ],
    code: avlCode,
    run: avlInsert,
  },
];
