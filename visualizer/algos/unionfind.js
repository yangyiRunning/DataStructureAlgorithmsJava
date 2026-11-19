/**
 * 并查集：合并与路径压缩。
 *
 * 两个演示分开：
 *   - 合并：带按秩合并，展示"为什么树不会变高"
 *   - 查找：先故意造一条又长又细的链，再走一遍路径压缩，
 *     展示"第二个 while 把路径上每个节点直接挂到根上"
 * 合在一起讲的话，压缩效果会被按秩合并的平整结构盖住，看不出它在干什么。
 */

const N = 7;

function initialState() {
  return Array.from({ length: N }, (_, i) => ({ id: String(i), label: String(i), parent: String(i) }));
}

function snap(elements) {
  return elements.map((e) => ({ ...e }));
}

// ─────────────────────────────────────────────────────────────
// 合并（按秩 + 路径压缩）
// ─────────────────────────────────────────────────────────────

const unionCode = [
  'function find(x) {',
  '  let r = x;',
  '  while (parent[r] !== r) r = parent[r];   // 一路找到根',
  '  while (parent[x] !== r) {                 // 顺手压缩',
  '    const nx = parent[x];',
  '    parent[x] = r;',
  '    x = nx;',
  '  }',
  '  return r;',
  '}',
  'function union(a, b) {',
  '  const ra = find(a), rb = find(b);',
  '  if (ra === rb) return false;              // 已经在一个集合',
  '  if (rank[ra] < rank[rb]) parent[ra] = rb;',
  '  else if (rank[ra] > rank[rb]) parent[rb] = ra;',
  '  else { parent[rb] = ra; rank[ra] += 1; }',
  '  return true;',
  '}',
];

function unionDemo(pairs) {
  const elements = initialState();
  const rank = new Map(elements.map((e) => [e.id, 0]));
  const byId = new Map(elements.map((e) => [e.id, e]));
  const order = elements.map((e) => e.id);

  const steps = [];
  let unions = 0;
  const push = (state, note, line) => steps.push({
    state: { elements: snap(elements), order, ...state },
    note,
    line,
    counters: { 合并成功: unions },
  });

  const findPath = (x) => {
    const path = [x];
    let r = x;
    while (byId.get(r).parent !== r) {
      r = byId.get(r).parent;
      path.push(r);
    }
    return { root: r, path };
  };

  push({ container: { label: '待合并', items: pairs.map(([a, b]) => ({ text: `${a}-${b}` })) } },
    `共 ${N} 个元素，每个自己一个集合（每个都是根）。按顺序合并 ${pairs.length} 对。`, 0);

  let done = 0;
  for (const [a, b] of pairs) {
    const sa = findPath(a);
    const sb = findPath(b);
    push({ highlight: sa.path }, `找 ${a} 的根：${sa.path.join(' → ')}，根是 ${sa.root}。`, 1);
    push({ highlight: sb.path }, `找 ${b} 的根：${sb.path.join(' → ')}，根是 ${sb.root}。`, 11);

    if (sa.root === sb.root) {
      push({ highlight: [...sa.path, ...sb.path] },
        `两边根相同（都是 ${sa.root}），已经在同一个集合里，这次合并不做任何事。`, 12);
      continue;
    }

    const ra = rank.get(sa.root);
    const rb = rank.get(sb.root);
    let target;
    let source;
    if (ra < rb) { target = sb.root; source = sa.root; }
    else if (ra > rb) { target = sa.root; source = sb.root; }
    else { target = sa.root; source = sb.root; rank.set(sa.root, ra + 1); }

    byId.get(source).parent = target;
    unions += 1;
    push(
      { highlight: [source, target], compressed: [source] },
      ra === rb
        ? `两边秩都是 ${ra}，随便挂一边，被挂的那个根的秩要加一（现在 ${target} 的秩是 ${ra + 1}）。`
        : `按秩合并：把矮的那棵树（根 ${source}，秩 ${Math.min(ra, rb)}）挂到高的（根 ${target}）下面，树高不会增加。`,
      ra === rb ? 15 : 13,
    );

    done += 1;
    push({ container: { label: '待合并', items: pairs.slice(done).map(([x, y]) => ({ text: `${x}-${y}` })) } },
      `合并完成。`, 16);
  }

  push({}, `全部处理完。共成功合并 ${unions} 次，剩下的重复合并都被跳过了——判环就是这么用的。`, 16);
  return { steps, result: { unions } };
}

// ─────────────────────────────────────────────────────────────
// 查找 + 路径压缩
// ─────────────────────────────────────────────────────────────

const findCode = [
  'function find(x) {',
  '  let r = x;',
  '  while (parent[r] !== r) r = parent[r];   // 先一路找到根',
  '  while (parent[x] !== r) {                 // 再把路径上每个节点挂到根',
  '    const next = parent[x];',
  '    parent[x] = r;',
  '    x = next;',
  '  }',
  '  return r;',
  '}',
];

function findDemo(target) {
  const elements = initialState();
  const byId = new Map(elements.map((e) => [e.id, e]));
  const order = elements.map((e) => e.id);

  // 故意造一条链：0 是根，1 挂 0，2 挂 1……这样查找代价最大，压缩效果最明显
  for (let i = 1; i < N; i++) byId.get(String(i)).parent = String(i - 1);

  const steps = [];
  let hops = 0;
  const push = (state, note, line) => steps.push({
    state: { elements: snap(elements), order, ...state },
    note,
    line,
    counters: { 走了几步: hops },
  });

  push({}, `这是一条特意造的链：0 是根，${N - 1} 挂在 ${N - 2} 下面，一层套一层。现在查 ${target} 的根。`, 0);

  let r = String(target);
  const path = [r];
  push({ highlight: [r] }, `从 ${r} 开始。`, 1);
  while (byId.get(r).parent !== r) {
    r = byId.get(r).parent;
    path.push(r);
    hops += 1;
    push({ highlight: [...path] }, `往上走到 ${r}。`, 2);
  }

  push({ highlight: [...path] }, `找到根 ${r}。这一趟走了 ${path.length - 1} 步——如果每次都这样，最坏就退化成 O(n)。`, 2);

  let x = String(target);
  while (byId.get(x).parent !== r) {
    const nx = byId.get(x).parent;
    byId.get(x).parent = r;
    hops += 1;
    push({ highlight: [x, r], compressed: [x] },
      `把 ${x} 直接挂到根 ${r} 下面。下次再查 ${x}，一步就到。`, 5);
    x = nx;
  }

  push({ highlight: [r], compressed: order }, `路径压缩完成。整条链被压平，之后再查这些元素基本就是常数步。`, 8);
  return { steps, result: { root: r } };
}

// ─────────────────────────────────────────────────────────────

const ufLegend = [
  { cls: 'uf-box', text: '元素' },
  { cls: 'uf-box is-active', text: '查找路径上' },
  { cls: 'uf-box is-moved', text: '刚被挂到新父节点' },
];

export const unionFindAlgorithms = [
  {
    id: 'uf-union',
    group: '树',
    title: '并查集 · 合并',
    brief: '按秩合并：把矮的树挂到高的下面，树高就不会疯长。两边根相同时直接跳过——这个"跳过"就是判环的依据。',
    view: 'uf',
    facts: [['合并', '近 O(1)'], ['空间', 'O(n)'], ['技巧', '按秩 + 路径压缩'], ['用途', '判环 / 连通分量']],
    counters: '合并成功',
    legend: ufLegend,
    inputs: [
      { label: '五组合并', make: () => [['0', '1'], ['2', '3'], ['1', '3'], ['4', '5'], ['5', '6']] },
      { label: '含重复合并（判环）', make: () => [['0', '1'], ['1', '2'], ['2', '0'], ['3', '4']] },
    ],
    code: unionCode,
    run: unionDemo,
  },
  {
    id: 'uf-find',
    group: '树',
    title: '并查集 · 查找与路径压缩',
    brief: '先一路走到根，回来的时候把路径上每个节点直接挂到根上。这一步让"之后再查"几乎变成一步，是并查集能做到近 O(1) 的关键。',
    view: 'uf',
    facts: [['查找', '摊还近 O(1)'], ['空间', 'O(n)'], ['要点', '两个 while'], ['坑', '只找不压缩就退化']],
    counters: '走了几步',
    legend: ufLegend,
    inputs: [
      { label: '查最深那个', make: () => 6 },
      { label: '查中间那个', make: () => 3 },
    ],
    code: findCode,
    run: findDemo,
  },
];
