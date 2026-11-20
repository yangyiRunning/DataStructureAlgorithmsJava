/**
 * 哈希表两题：链地址法处理冲突、LRU 缓存。
 *
 * 冲突处理用桶视图（链地址法一眼看出链长）；
 * LRU 用链表视图表示"最近使用顺序"，底部条显示哈希表里有什么。
 * LRU 之所以能用 O(1) 做完三件事，靠的就是"哈希给位置、双向链表给顺序"。
 */

// ─────────────────────────────────────────────────────────────
// 链地址法
// ─────────────────────────────────────────────────────────────

const chainCode = [
  'function put(table, key) {',
  '  const i = hash(key) % N;',
  '  const bucket = table[i];',
  '  for (const node of bucket) {',
  '    if (node.key === key) return;      // 已存在，更新即可',
  '  }',
  '  bucket.push({ key });                 // 挂到桶尾',
  '}',
  'function get(table, key) {',
  '  const bucket = table[hash(key) % N];',
  '  for (const node of bucket) if (node.key === key) return node;',
  '  return null;',
  '}',
];

function chaining(input) {
  const N = 5;
  const buckets = Array.from({ length: N }, () => []);
  const steps = [];
  let collisions = 0;

  const push = (state, note, line) => steps.push({
    state: { buckets: buckets.map((b) => b.map((x) => ({ ...x }))), ...state },
    note,
    line,
    counters: { 冲突: collisions, 元素数: buckets.reduce((a, b) => a + b.length, 0) },
  });

  push({}, `${N} 个桶，key 用 key % ${N} 定位。冲突了就挂到同一个桶后面——这就是链地址法。`, 0);

  for (const key of input) {
    const i = key % N;
    const existed = buckets[i].some((x) => x.key === key);
    if (existed) {
      push({ activeBucket: i, highlightKey: key }, `${key} 已经在了，不重复插入。`, 4);
      continue;
    }
    if (buckets[i].length) collisions += 1;
    buckets[i].push({ key });
    push(
      { activeBucket: i, highlightKey: key },
      buckets[i].length > 1
        ? `${key} 落在桶 ${i}，但那里已经有 ${buckets[i].length - 1} 个了，链变长——这就是冲突。`
        : `${key} 落在桶 ${i}，空的，直接放。`,
      6,
    );
  }

  const maxChain = Math.max(...buckets.map((b) => b.length));
  push({ activeBucket: -1 }, `插入完成，发生 ${collisions} 次冲突，最长链 ${maxChain}。链越长查询越慢，所以桶数要跟着元素数涨（装载因子）。`, 8);
  return { steps, result: { collisions, maxChain, total: buckets.reduce((a, b) => a + b.length, 0) } };
}

// ─────────────────────────────────────────────────────────────
// LRU 缓存
// ─────────────────────────────────────────────────────────────

const lruCode = [
  'function get(key) {',
  '  if (!map.has(key)) return -1;',
  '  moveToHead(map.get(key));   // 用过就变成最新',
  '  return map.get(key).val;',
  '}',
  'function put(key, val) {',
  '  if (map.has(key)) { map.get(key).val = val; moveToHead(map.get(key)); return; }',
  '  if (map.size === capacity) {',
  '    const last = tail.prev;   // 最久没用的',
  '    remove(last); map.delete(last.key);',
  '  }',
  '  const node = { key, val };',
  '  addToHead(node); map.set(key, node);',
  '}',
];

function lru(input) {
  const capacity = 3;
  const order = [];                 // 最近使用在前
  const store = new Map();
  const steps = [];
  let hits = 0;
  let misses = 0;

  const snap = () => {
    let uid = 0;
    const nodes = [];
    const ids = [];
    for (const key of order) {
      const id = `k${uid++}`;
      ids.push(id);
      nodes.push({ id, val: key, next: null });
    }
    for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1].id;
    return { nodes, order: ids };
  };

  const push = (state, note, line) => steps.push({
    state: {
      ...snap(),
      container: { label: '缓存', items: order.map((k) => ({ text: `${k}:${store.get(k)}` })) },
      ...state,
    },
    note,
    line,
    counters: { 命中: hits, 淘汰: misses },
  });

  push({}, `容量 ${capacity} 的 LRU。链表头部是最新用过的，尾部是最久没用的；底部条是哈希表里的内容。`, 0);

  for (const [op, key] of input) {
    if (op === 'get') {
      if (!store.has(key)) {
        misses += 1;
        push({}, `get(${key}) 不存在，返回 -1。`, 0);
        continue;
      }
      hits += 1;
      order.splice(order.indexOf(key), 1);
      order.unshift(key);
      push({ highlight: [snap().order[0]] }, `get(${key}) 命中，把它移到链表头部（最近使用）。`, 3);
    } else {
      const val = key * 10;
      if (store.has(key)) {
        store.set(key, val);
        order.splice(order.indexOf(key), 1);
        order.unshift(key);
        push({}, `put(${key}, ${val})：已存在，更新值并移到头部。`, 0);
        continue;
      }
      if (order.length === capacity) {
        const victim = order.pop();
        store.delete(victim);
        push({ move: [snap().order[snap().order.length - 1]].filter(Boolean) },
          `容量满了，淘汰最久没用的 ${victim}。`, 8);
      }
      order.unshift(key);
      store.set(key, val);
      push({ highlight: [snap().order[0]] }, `put(${key}, ${val})：插到头部。`, 11);
    }
  }

  push({}, `结束。命中 ${hits} 次，淘汰 ${misses} 次。LRU 三个操作都要求 O(1)：哈希给位置、双向链表给顺序，缺一不可。`, 11);
  return { steps, result: { order: order.join(',') } };
}

function chainInputs() {
  return [
    { label: '插入 8 个键', make: () => [7, 12, 17, 22, 3, 8, 13, 18] },
    { label: '重复键', make: () => [1, 6, 11, 6, 16, 1] },
  ];
}

function lruInputs() {
  return [
    { label: '经典 put/get', make: () => [['put', 1], ['put', 2], ['get', 1], ['put', 3], ['put', 4], ['get', 2]] },
    { label: '全是命中', make: () => [['put', 1], ['put', 2], ['get', 1], ['get', 2], ['get', 1]] },
  ];
}

export const hashAlgorithms = [
  {
    id: 'hash-chaining',
    group: '哈希表',
    title: '哈希冲突 · 链地址法',
    brief: 'key 取模定位到桶，撞了就挂到同一个桶后面。链越长查询越慢，所以桶数要跟元素数一起涨——这就是装载因子。',
    view: 'hash',
    facts: [['时间', '平均 O(1) / 最坏 O(n)'], ['空间', 'O(n)'], ['关键', '装载因子']],
    counters: '冲突、元素数',
    legend: [{ cls: 'node', text: '桶里的键' }, { cls: 'node is-moved', text: '本次插入 / 命中' }],
    inputs: chainInputs(),
    code: chainCode,
    run: chaining,
  },
  {
    id: 'hash-lru',
    group: '哈希表',
    title: 'LRU 缓存',
    brief: '哈希表给位置、双向链表给顺序。get 和 put 都要 O(1)：靠哈希找到节点，靠链表把节点挪到头部或从尾部淘汰。',
    view: 'list',
    facts: [['时间', 'get / put 都 O(1)'], ['空间', 'O(容量)'], ['结构', '哈希 + 双向链表']],
    counters: '命中、淘汰',
    legend: [{ cls: 'node', text: '缓存项（头部最新）' }, { cls: 'node is-active', text: '刚访问' }],
    inputs: lruInputs(),
    code: lruCode,
    run: lru,
  },
];
