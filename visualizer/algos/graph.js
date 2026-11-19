/**
 * 图的遍历与最短路径：BFS、DFS、Dijkstra、拓扑排序。
 *
 * 共同点：每一步都把"整张图现在的样子"完整吐一遍——哪些边走过了、哪些节点访问了、
 * 容器（队列 / 栈 / 优先队列）里现在是谁。视图不需要记住上一帧，
 * 所以往回拖进度条永远是准确的。
 *
 * 这张无向图的边权是手写的，不随机生成：固定的图才方便对照讲解，
 * 每次刷新换一张图只会让人重新找不到路。
 */

export const GRAPH_FIXTURE = {
  nodes: [
    { id: 'A', label: 'A', x: 110, y: 190 },
    { id: 'B', label: 'B', x: 292, y: 84 },
    { id: 'C', label: 'C', x: 292, y: 296 },
    { id: 'D', label: 'D', x: 486, y: 84 },
    { id: 'E', label: 'E', x: 486, y: 296 },
    { id: 'F', label: 'F', x: 676, y: 190 },
    { id: 'G', label: 'G', x: 822, y: 84 },
  ],

  edges: [
    ['A', 'B', 4], ['A', 'C', 2], ['B', 'C', 1], ['B', 'D', 5],
    ['C', 'D', 8], ['C', 'E', 10], ['D', 'E', 2], ['D', 'F', 6],
    ['E', 'F', 3], ['F', 'G', 1],
  ],
};

export const NODES = GRAPH_FIXTURE.nodes;
export const EDGES = GRAPH_FIXTURE.edges;

/** 无向图的邻接表，按节点 id 字母序排好邻居，保证每次遍历顺序一致 */
function buildAdjacency() {
  const adj = new Map(NODES.map((n) => [n.id, []]));
  for (const [u, v, w] of EDGES) {
    adj.get(u).push({ to: v, w });
    adj.get(v).push({ to: u, w });
  }
  for (const list of adj.values()) list.sort((a, b) => a.to.localeCompare(b.to));
  return adj;
}

const undirectedKey = (u, v) => [u, v].sort().join('|');

// ─────────────────────────────────────────────────────────────
// BFS
// ─────────────────────────────────────────────────────────────

const bfsCode = [
  'function bfs(start) {',
  '  const queue = [start];',
  '  const seen = new Set([start]);',
  '  const order = [];',
  '  while (queue.length > 0) {',
  '    const u = queue.shift();      // 队列：先进先出',
  '    order.push(u);',
  '    for (const { to } of adj[u]) {',
  '      if (seen.has(to)) continue;',
  '      seen.add(to);               // 入队时就标记',
  '      queue.push(to);',
  '    }',
  '  }',
  '  return order;',
  '}',
];

function bfs(start) {
  const adj = buildAdjacency();
  const steps = [];
  let visit = 0;
  let enqueue = 0;

  const queue = [start];
  const seen = new Set([start]);
  const visited = [];
  const edgeState = new Map();

  const push = (state, note, line) => steps.push({
    state: {
      nodes: NODES,
      edges: EDGES.map(([u, v, w]) => ({
        u, v, w, state: edgeState.get(undirectedKey(u, v)) ?? 'idle',
      })),
      visited: [...visited],
      ...state,
    },
    note,
    line,
    counters: { 访问: visit, 入队: enqueue },
  });

  enqueue += 1;
  push(
    { current: start, frontier: [start], container: { label: '队列', items: [start] } },
    `从 ${start} 出发。起点先入队，同时标记"已发现"——标记要在入队时做，不是出队时，否则同一个点会被重复入队。`,
    1,
  );

  while (queue.length) {
    const u = queue.shift();
    visit += 1;
    visited.push(u);
    push(
      {
        current: u,
        frontier: queue.slice(),
        container: { label: '队列', items: queue.slice() },
      },
      `${u} 出队并访问。队列先进先出，所以先发现的先被处理，这就是"按层"遍历的来源。`,
      5,
    );

    for (const { to } of adj.get(u)) {
      if (seen.has(to)) {
        push(
          { current: u, frontier: queue.slice(), container: { label: '队列', items: queue.slice() } },
          `${to} 已经发现过，跳过。`,
          8,
        );
        continue;
      }
      seen.add(to);
      enqueue += 1;
      edgeState.set(undirectedKey(u, to), 'tree');
      queue.push(to);
      push(
        {
          current: u,
          frontier: queue.slice(),
          container: { label: '队列', items: queue.slice() },
        },
        `发现新节点 ${to}，标记并入队。标记和入队在同一时刻完成。`,
        10,
      );
    }
  }

  push({}, `完成。访问顺序：${visited.join(' → ')}。BFS 找到的路径边数一定最少（无权图情况下）。`, 13);
  return { steps, result: { order: visited.join(',') } };
}

// ─────────────────────────────────────────────────────────────
// DFS（显式栈的迭代版）
// ─────────────────────────────────────────────────────────────

const dfsCode = [
  'function dfs(start) {',
  '  const stack = [start];',
  '  const seen = new Set();',
  '  const order = [];',
  '  while (stack.length > 0) {',
  '    const u = stack.pop();     // 栈：后进先出',
  '    if (seen.has(u)) continue;',
  '    seen.add(u);               // 出栈时才标记',
  '    order.push(u);',
  '    for (let i = adj[u].length - 1; i >= 0; i--) {',
  '      stack.push(adj[u][i].to);',
  '    }',
  '  }',
  '  return order;',
  '}',
];

function dfs(start) {
  const adj = buildAdjacency();
  const steps = [];
  let visit = 0;
  let pushCount = 0;

  const stack = [start];
  const seen = new Set();
  const visited = [];
  const edgeState = new Map();

  const push = (state, note, line) => steps.push({
    state: {
      nodes: NODES,
      edges: EDGES.map(([u, v, w]) => ({
        u, v, w, state: edgeState.get(undirectedKey(u, v)) ?? 'idle',
      })),
      visited: [...visited],
      ...state,
    },
    note,
    line,
    counters: { 访问: visit, 入栈: pushCount },
  });

  pushCount += 1;
  push(
    { current: start, frontier: [start], container: { label: '栈', items: [start] } },
    `从 ${start} 出发。DFS 用栈：后进先出，所以它一头往深处扎。`,
    1,
  );

  while (stack.length) {
    const u = stack.pop();
    if (seen.has(u)) {
      push(
        { frontier: stack.slice(), container: { label: '栈', items: stack.slice() } },
        `${u} 在栈里重复出现且已访问过，丢掉。这是迭代版 DFS 必须写的判断——同一节点可能被压多次。`,
        6,
      );
      continue;
    }
    seen.add(u);
    visit += 1;
    visited.push(u);
    push(
      { current: u, frontier: stack.slice(), container: { label: '栈', items: stack.slice() } },
      `${u} 出栈并标记访问。`,
      7,
    );

    const neighbors = adj.get(u);
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const { to } = neighbors[i];
      pushCount += 1;
      stack.push(to);
      if (!seen.has(to)) edgeState.set(undirectedKey(u, to), 'tree');
    }
    if (neighbors.length) {
      push(
        { current: u, frontier: stack.slice(), container: { label: '栈', items: stack.slice() } },
        `${u} 的邻居按逆序压栈，这样出栈时正好是字母序。`,
        10,
      );
    }
  }

  push({}, `完成。访问顺序：${visited.join(' → ')}。注意这是显式栈的迭代写法，和递归 DFS 的顺序会不一样。`, 13);
  return { steps, result: { order: visited.join(',') } };
}

// ─────────────────────────────────────────────────────────────
// Dijkstra
// ─────────────────────────────────────────────────────────────

const dijkstraCode = [
  'function dijkstra(start) {',
  '  const dist = {};  // 未到达记 Infinity',
  '  const done = new Set();',
  '  dist[start] = 0;',
  '  while (done.size < n) {',
  '    let u = null;',
  '    for (const v of nodes) {          // 线性找最小',
  '      if (done.has(v)) continue;',
  '      if (u === null || dist[v] < dist[u]) u = v;',
  '    }',
  '    if (dist[u] === Infinity) break;',
  '    done.add(u);',
  '    for (const { to, w } of adj[u]) {',
  '      if (dist[u] + w < dist[to]) {',
  '        dist[to] = dist[u] + w;       // 松弛',
  '      }',
  '    }',
  '  }',
  '  return dist;',
  '}',
];

function dijkstra(start) {
  const adj = buildAdjacency();
  const steps = [];
  let relax = 0;
  let cmp = 0;

  const dist = {};
  for (const n of NODES) dist[n.id] = Infinity;
  dist[start] = 0;

  const done = new Set();
  const edgeState = new Map();

  const push = (state, note, line) => steps.push({
    state: {
      nodes: NODES,
      edges: EDGES.map(([u, v, w]) => ({
        u, v, w, state: edgeState.get(undirectedKey(u, v)) ?? 'idle',
      })),
      visited: [...done],
      dist: { ...dist },
      distLabel: 'd=',
      ...state,
    },
    note,
    line,
    counters: { 比较: cmp, 松弛: relax },
  });

  const pending = () => NODES.filter((n) => !done.has(n.id))
    .sort((a, b) => dist[a.id] - dist[b.id])
    .map((n) => ({ text: `${n.id}:${dist[n.id] === Infinity ? '∞' : dist[n.id]}`, hot: false }));

  push(
    { current: start, container: { label: '待定', items: pending() } },
    `${start} 距离为 0，其余都是无穷大。每轮从未确定的点里挑距离最小的，确定它，再拿它去松弛邻居。`,
    4,
  );

  while (done.size < NODES.length) {
    let u = null;
    for (const n of NODES) {
      if (done.has(n.id)) continue;
      cmp += 1;
      if (u === null || dist[n.id] < dist[u]) u = n.id;
    }
    if (u === null || dist[u] === Infinity) {
      push({}, '剩下的点都不可达，结束。', 10);
      break;
    }

    push(
      {
        current: u,
        container: { label: '待定', items: pending().map((x) => (x.text.startsWith(u) ? { ...x, hot: true } : x)) },
      },
      `挑出距离最小的 ${u}（d=${dist[u]}）。贪心就贪在这里：一旦被挑出来，它的最短距离就再也不会变小了。`,
      6,
    );

    done.add(u);

    for (const { to, w } of adj.get(u)) {
      if (done.has(to)) continue;
      const cand = dist[u] + w;
      if (cand < dist[to]) {
        relax += 1;
        const before = dist[to];
        dist[to] = cand;
        edgeState.set(undirectedKey(u, to), 'tree');
        push(
          {
            current: u,
            container: { label: '待定', items: pending() },
          },
          `松弛 ${u}→${to}：${dist[u]} + ${w} = ${cand} < ${before === Infinity ? '∞' : before}，更新。`,
          14,
        );
      } else {
        push(
          {
            current: u,
            container: { label: '待定', items: pending() },
          },
          `试 ${u}→${to}：${dist[u]} + ${w} = ${cand}，不比现在的 ${dist[to] === Infinity ? '∞' : dist[to]} 更小，不动。`,
          13,
        );
      }
    }
  }

  const answer = NODES.map((n) => `${n.id}:${dist[n.id] === Infinity ? '∞' : dist[n.id]}`).join('  ');
  push({}, `完成。${answer}`, 18);
  return {
    steps,
    result: { dist: NODES.map((n) => `${n.id}=${dist[n.id]}`).join(',') },
  };
}

// ─────────────────────────────────────────────────────────────
// 拓扑排序（Kahn，入度法）
// ─────────────────────────────────────────────────────────────

const TOPO_NODES = [
  { id: 'X1', label: 'X1', x: 110, y: 190 },
  { id: 'X2', label: 'X2', x: 306, y: 96 },
  { id: 'X3', label: 'X3', x: 306, y: 286 },
  { id: 'X4', label: 'X4', x: 506, y: 96 },
  { id: 'X5', label: 'X5', x: 506, y: 286 },
  { id: 'X6', label: 'X6', x: 720, y: 190 },
];

const TOPO_EDGES = [
  ['X1', 'X2', null], ['X1', 'X3', null], ['X2', 'X4', null],
  ['X3', 'X4', null], ['X3', 'X5', null], ['X4', 'X6', null], ['X5', 'X6', null],
];

const topoCode = [
  'function topoSort(nodes, edges) {',
  '  const indeg = {};                       // 入度',
  '  for (const [u, v] of edges) indeg[v]++;',
  '  const queue = nodes.filter((n) => indeg[n] === 0);',
  '  const order = [];',
  '  while (queue.length > 0) {',
  '    const u = queue.shift();',
  '    order.push(u);',
  '    for (const [a, v] of edges) {         // 找 u 的出边',
  '      if (a !== u) continue;',
  '      indeg[v]--;',
  '      if (indeg[v] === 0) queue.push(v);',
  '    }',
  '  }',
  '  if (order.length !== nodes.length) return null;  // 有环',
  '  return order;',
  '}',
];

function topoSort() {
  const steps = [];
  let visit = 0;
  let enqueue = 0;

  const indeg = {};
  for (const n of TOPO_NODES) indeg[n.id] = 0;
  for (const [, v] of TOPO_EDGES) indeg[v] += 1;

  const removed = new Set();
  const edgeState = new Map();
  const queue = TOPO_NODES.filter((n) => indeg[n.id] === 0).map((n) => n.id);
  const order = [];

  const indegItems = () => TOPO_NODES.map((n) => ({
    text: `${n.id}:${indeg[n.id]}`,
    hot: !removed.has(n.id) && indeg[n.id] === 0,
  }));

  const push = (state, note, line) => steps.push({
    state: {
      nodes: TOPO_NODES,
      edges: TOPO_EDGES.map(([u, v]) => ({ u, v, w: null, state: edgeState.get(`${u}|${v}`) ?? 'idle' })),
      directed: true,
      visited: [...order],
      ...state,
    },
    note,
    line,
    counters: { 出队: visit, 入队: enqueue },
  });

  enqueue += queue.length;
  push(
    {
      current: null,
      frontier: [...queue],
      container: { label: '入度表', items: indegItems() },
    },
    `统计入度：只有 ${queue.join('、')} 的入度是 0，它们没有前置任务，可以先做。`,
    2,
  );

  while (queue.length) {
    const u = queue.shift();
    visit += 1;
    order.push(u);
    removed.add(u);

    push(
      {
        current: u,
        frontier: queue.slice(),
        container: { label: '入度表', items: indegItems() },
      },
      `${u} 出队，放进结果序列的第一位。`,
      7,
    );

    for (const [a, v] of TOPO_EDGES) {
      if (a !== u) continue;
      indeg[v] -= 1;
      edgeState.set(`${u}|${v}`, 'tree');
      if (indeg[v] === 0) {
        enqueue += 1;
        queue.push(v);
        push(
          {
            current: u,
            frontier: queue.slice(),
            container: { label: '入度表', items: indegItems() },
          },
          `删掉 ${u}→${v} 这条边后，${v} 的入度变成 0，可以排队了。`,
          11,
        );
      } else {
        push(
          {
            current: u,
            frontier: queue.slice(),
            container: { label: '入度表', items: indegItems() },
          },
          `${v} 的入度减 1，还剩 ${indeg[v]}，继续等。`,
          10,
        );
      }
    }
  }

  const ok = order.length === TOPO_NODES.length;
  push(
    {},
    ok
      ? `完成。一个合法拓扑序：${order.join(' → ')}。注意拓扑序通常不唯一。`
      : `序列只有 ${order.length} 个，而节点有 ${TOPO_NODES.length} 个 —— 图里有环，不存在拓扑序。`,
    14,
  );

  return {
    steps,
    result: { order: order.join(',') },
  };
}


// ─────────────────────────────────────────────────────────────
// Bellman-Ford
// ─────────────────────────────────────────────────────────────

const bfCode = [
  'function bellmanFord(start) {',
  '  const dist = {};  // 未到达记 Infinity',
  '  dist[start] = 0;',
  '  for (let round = 0; round < n - 1; round++) {',
  '    let changed = false;',
  '    for (const [u, v, w] of edges) {   // 每条边两个方向都试',
  '      if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; changed = true; }',
  '      if (dist[v] + w < dist[u]) { dist[u] = dist[v] + w; changed = true; }',
  '    }',
  '    if (!changed) break;               // 这一轮没变化，提前结束',
  '  }',
  '  return dist;',
  '}',
];

function bellmanFord(start) {
  const steps = [];
  let relax = 0;

  const dist = {};
  for (const n of NODES) dist[n.id] = Infinity;
  dist[start] = 0;

  const edgeState = new Map();

  const push = (state, note, line) => steps.push({
    state: {
      nodes: NODES,
      edges: EDGES.map(([u, v, w]) => ({ u, v, w, state: edgeState.get(undirectedKey(u, v)) ?? 'idle' })),
      dist: { ...dist },
      distLabel: 'd=',
      ...state,
    },
    note,
    line,
    counters: { 松弛: relax },
  });

  const show = () => NODES
    .slice()
    .sort((a, b) => dist[a.id] - dist[b.id])
    .map((n) => ({ text: `${n.id}:${dist[n.id] === Infinity ? '∞' : dist[n.id]}` }));

  push({ current: start, container: { label: '距离', items: show() } },
    `${start} 距离 0。Bellman-Ford 不管图长什么样，把所有边扫 V-1 轮，每轮都尝试松弛。`, 0);

  for (let round = 0; round < NODES.length - 1; round++) {
    let changed = false;
    push({ container: { label: '距离', items: show() } }, `第 ${round + 1} 轮开始。`, 3);

    for (const [u, v, w] of EDGES) {
      for (const [a, b] of [[u, v], [v, u]]) {
        if (dist[a] + w < dist[b]) {
          dist[b] = dist[a] + w;
          relax += 1;
          changed = true;
          edgeState.set(undirectedKey(a, b), 'tree');
          push({ current: b, container: { label: '距离', items: show() } },
            `松弛 ${a}→${b}：${dist[a] === Infinity ? '∞' : dist[a]} + ${w} = ${dist[b]}，更小，更新。`, 5);
        }
      }
    }

    if (!changed) {
      push({ container: { label: '距离', items: show() } },
        `第 ${round + 1} 轮一条边都没更新，说明已经收敛，提前结束（这就是能跑不满 V-1 轮的情况）。`, 8);
      break;
    }
  }

  const answer = NODES.map((n) => `${n.id}:${dist[n.id] === Infinity ? '∞' : dist[n.id]}`).join('  ');
  push({}, `完成。${answer}`, 10);
  return { steps, result: { dist: NODES.map((n) => `${n.id}=${dist[n.id]}`).join(',') } };
}

// ─────────────────────────────────────────────────────────────
// Kruskal 最小生成树
// ─────────────────────────────────────────────────────────────

const kruskalCode = [
  'function kruskal() {',
  '  const parent = {};               // 并查集',
  '  for (const n of nodes) parent[n] = n;',
  '  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));',
  '  const sorted = [...edges].sort((a, b) => a[2] - b[2]);',
  '  const picked = [];',
  '  for (const [u, v, w] of sorted) {',
  '    const ru = find(u), rv = find(v);',
  '    if (ru === rv) continue;        // 同一个集合，连上去就成环',
  '    parent[ru] = rv;',
  '    picked.push([u, v, w]);',
  '    if (picked.length === nodes.length - 1) break;',
  '  }',
  '  return picked;',
  '}',
];

function kruskal() {
  const steps = [];
  let picked = 0;

  const parent = {};
  for (const n of NODES) parent[n.id] = n.id;
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));

  const sorted = [...EDGES].sort((a, b) => a[2] - b[2]);
  const treeEdges = new Set();
  const edgeState = new Map();

  const push = (state, note, line) => steps.push({
    state: {
      nodes: NODES,
      edges: EDGES.map(([u, v, w]) => ({ u, v, w, state: edgeState.get(undirectedKey(u, v)) ?? 'idle' })),
      ...state,
    },
    note,
    line,
    counters: { 考察: cmp, 选中: picked },
  });

  const shown = () => sorted.map(([u, v, w]) => ({ text: `${u}${v}:${w}` }));
  let cmp = 0;

  push({ container: { label: '按权排序', items: shown() } },
    'Kruskal：把所有边按权重从小到大排，依次尝试加进生成树；会成环的就跳过。判环用并查集。', 4);

  for (const [u, v, w] of sorted) {
    cmp += 1;
    const ru = find(u);
    const rv = find(v);
    const same = ru === rv;
    push(
      {
        current: same ? null : v,
        container: { label: '按权排序', items: shown().map((it, i) => (i === cmp - 1 ? { ...it, hot: true } : it)) },
      },
      `看边 ${u}-${v}（权 ${w}）：两端${same ? '已经连通，加进去会成环，跳过' : '还没连通，可以选'}。`,
      6,
    );

    if (same) continue;

    parent[ru] = rv;
    picked += 1;
    treeEdges.add(undirectedKey(u, v));
    edgeState.set(undirectedKey(u, v), 'tree');
    push(
      {
        current: v,
        container: { label: '按权排序', items: shown() },
      },
      `选中 ${u}-${v}（权 ${w}），合并两个集合。目前选了 ${picked} 条边。`,
      9,
    );

    if (picked === NODES.length - 1) break;
  }

  const total = sorted
    .filter(([u, v]) => treeEdges.has(undirectedKey(u, v)))
    .reduce((a, [, , w]) => a + w, 0);
  push({}, `完成。选出的边：${[...treeEdges].map((k) => k.replace('|', '-')).join('、')}，总权重 ${total}。`, 10);
  return { steps, result: { total, edges: [...treeEdges].sort().join(',') } };
}


// ─────────────────────────────────────────────────────────────
// Floyd 多源最短路
// ─────────────────────────────────────────────────────────────

const floydCode = [
  'function floyd(d) {',
  '  // d[i][j] 初始化为直接相连的边权，不直接相连记 Infinity',
  '  for (let k = 0; k < n; k++) {          // 中转点放最外层',
  '    for (let i = 0; i < n; i++) {',
  '      for (let j = 0; j < n; j++) {',
  '        if (d[i][k] + d[k][j] < d[i][j]) {',
  '          d[i][j] = d[i][k] + d[k][j];   // 借 k 中转更短',
  '        }',
  '      }',
  '    }',
  '  }',
  '  return d;',
  '}',
];

function floyd() {
  const ids = NODES.map((n) => n.id);
  const n = ids.length;
  const INF = Infinity;

  const d = Array.from({ length: n }, () => new Array(n).fill(INF));
  for (let i = 0; i < n; i++) d[i][i] = 0;
  for (const [u, v, w] of EDGES) {
    const i = ids.indexOf(u);
    const j = ids.indexOf(v);
    d[i][j] = Math.min(d[i][j], w);
    d[j][i] = Math.min(d[j][i], w);
  }

  const steps = [];
  let updates = 0;

  const render = () => d.map((row) => row.map((v) => (v === INF ? '∞' : v)));

  const push = (state, note, line) => steps.push({
    state: {
      cells: render(),
      rowHead: ids,
      colHead: ids,
      filled: Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => [r, c])).flat(),
      ...state,
    },
    note,
    line,
    counters: { 更新: updates },
  });

  push({}, `先填初始矩阵：直接相连的边填权重，自己到自己 0，其余无穷大。行是起点、列是终点。`, 0);

  for (let k = 0; k < n; k++) {
    push({}, `现在允许借 ${ids[k]} 当中转点，检查所有 i→j 能不能更短。注意 k 必须在最外层——放里层就错了。`, 3);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (d[i][k] === INF || d[k][j] === INF) continue;
        if (d[i][k] + d[k][j] < d[i][j]) {
          d[i][j] = d[i][k] + d[k][j];
          updates += 1;
          push(
            { current: [i, j], deps: [[i, k], [k, j]] },
            `${ids[i]}→${ids[j]} 借 ${ids[k]} 中转：${d[i][k]} + ${d[k][j]} = ${d[i][j]}，比原来的更短，更新。`,
            6,
          );
        }
      }
    }
  }

  push({}, `完成。共更新 ${updates} 次。Floyd 一次算出所有点对的最短距离，代价是 O(n³)；能处理负权边（但不能有负环）。`, 10);
  return {
    steps,
    result: { dist: ids.map((id, i) => `${id}:${ids.map((_, j) => (d[i][j] === INF ? '∞' : d[i][j])).join('/')}`).join(';') },
  };
}

// ─────────────────────────────────────────────────────────────
// Prim 最小生成树
// ─────────────────────────────────────────────────────────────

const primCode = [
  'function prim(start) {',
  '  const inTree = new Set([start]);',
  '  const picked = [];',
  '  while (inTree.size < n) {',
  '    let best = null;   // 连接"树内"和"树外"的最短边',
  '    for (const [u, v, w] of edges) {',
  '      if (inTree.has(u) === inTree.has(v)) continue;   // 两端同侧，不跨切分',
  '      if (!best || w < best[2]) best = [u, v, w];',
  '    }',
  '    if (!best) break;',
  '    inTree.add(inTree.has(best[0]) ? best[1] : best[0]);',
  '    picked.push(best);',
  '  }',
  '  return picked;',
  '}',
];

function prim(start) {
  const steps = [];
  let picked = 0;

  const inTree = new Set([start]);
  const edgeState = new Map();

  const push = (state, note, line) => steps.push({
    state: {
      nodes: NODES,
      edges: EDGES.map(([u, v, w]) => ({ u, v, w, state: edgeState.get(undirectedKey(u, v)) ?? 'idle' })),
      visited: [...inTree],
      ...state,
    },
    note,
    line,
    counters: { 选中: picked },
  });

  push({ current: start, container: { label: '已在树里', items: [...inTree].map((t) => ({ text: t })) } },
    `Prim 从 ${start} 出发，每次挑一条"一端在树里、一端在树外"的最短边，把外面的点拉进来。`, 0);

  while (inTree.size < NODES.length) {
    let best = null;
    for (const [u, v, w] of EDGES) {
      const cu = inTree.has(u);
      const cv = inTree.has(v);
      if (cu === cv) continue;
      if (!best || w < best[2]) best = [u, v, w];
    }
    if (!best) break;

    const [u, v, w] = best;
    const outside = inTree.has(u) ? v : u;
    push(
      { current: outside, container: { label: '已在树里', items: [...inTree].map((t) => ({ text: t })) } },
      `跨切分的边里 ${u}-${v}（权 ${w}）最短，把 ${outside} 拉进树。`,
      5,
    );

    inTree.add(outside);
    edgeState.set(undirectedKey(u, v), 'tree');
    picked += 1;
    push(
      { current: outside, container: { label: '已在树里', items: [...inTree].map((t) => ({ text: t })) } },
      `现在树里有 ${inTree.size} 个点，选了 ${picked} 条边。`,
      11,
    );
  }

  const total = EDGES.filter(([u, v]) => edgeState.has(undirectedKey(u, v))).reduce((a, [, , w]) => a + w, 0);
  push({ container: { label: '已在树里', items: [...inTree].map((t) => ({ text: t })) } },
    `完成。${NODES.length} 个点、${picked} 条边，总权重 ${total}。和 Kruskal 的答案应该一样（最小生成树可能不唯一，但权重相同）。`, 13);
  return { steps, result: { total, edges: [...edgeState.keys()].sort().join(',') } };
}

// ─────────────────────────────────────────────────────────────

const graphLegend = [
  { cls: 'gnode', text: '未访问' },
  { cls: 'gnode is-frontier', text: '已入容器，待处理' },
  { cls: 'gnode is-current', text: '当前处理' },
  { cls: 'gnode is-visited', text: '已完成' },
];

export const graphAlgorithms = [
  {
    id: 'graph-bfs',
    group: '图',
    title: '广度优先搜索 BFS',
    brief: '用队列：先发现的先处理，所以是一圈一圈往外扩。无权图上它找到的路径边数最少。关键细节是"入队就标记"，不是出队才标记。',
    view: 'graph',
    facts: [['时间', 'O(V + E)'], ['空间', 'O(V) 队列'], ['容器', '队列 FIFO'], ['用途', '无权最短路']],
    counters: '访问、入队',
    legend: graphLegend,
    inputs: [{ label: '从 A 出发', make: () => 'A' }, { label: '从 D 出发', make: () => 'D' }],
    code: bfsCode,
    run: bfs,
  },
  {
    id: 'graph-dfs',
    group: '图',
    title: '深度优先搜索 DFS',
    brief: '用栈：后进先出，一头往深处扎到底再回头。这里给的是显式栈的迭代写法，它和递归版的访问顺序不同，也很容易漏掉"出栈时判重"。',
    view: 'graph',
    facts: [['时间', 'O(V + E)'], ['空间', 'O(V) 栈'], ['容器', '栈 LIFO'], ['用途', '连通性 / 环检测']],
    counters: '访问、入栈',
    legend: graphLegend,
    inputs: [{ label: '从 A 出发', make: () => 'A' }, { label: '从 C 出发', make: () => 'C' }],
    code: dfsCode,
    run: dfs,
  },
  {
    id: 'graph-dijkstra',
    group: '图',
    title: '最短路径 Dijkstra',
    brief: '每轮从未确定的点里挑距离最小的那个，确定它，再用它去松弛邻居。这里用线性查最小，O(V²)；换成二叉堆是 O((V+E)log V)，但演示里线性的更容易看清每一步在选谁。',
    view: 'graph',
    facts: [['时间', 'O(V²) 线性版'], ['空间', 'O(V)'], ['前提', '边权非负'], ['贪心', '挑出的点不再改']],
    counters: '比较、松弛',
    legend: graphLegend,
    inputs: [{ label: '从 A 出发', make: () => 'A' }, { label: '从 C 出发', make: () => 'C' }],
    code: dijkstraCode,
    run: dijkstra,
  },
  {
    id: 'graph-topo',
    group: '图',
    title: '拓扑排序（Kahn 入度法）',
    brief: '反复找入度为 0 的点出队，删掉它的出边，被删到入度为 0 的就进队。跑完发现出队数少于节点数，就说明图里有环、不存在拓扑序。',
    view: 'graph',
    facts: [['时间', 'O(V + E)'], ['空间', 'O(V)'], ['前提', '有向无环图'], ['结果', '通常不唯一']],
    counters: '出队、入队',
    legend: graphLegend,
    inputs: [{ label: '从头播放', make: () => true }],
    code: topoCode,
    run: topoSort,
  },
  {
    id: 'graph-bellman-ford',
    group: '图',
    title: 'Bellman-Ford',
    brief: '不管图什么样，把每条边扫 V-1 轮，每轮都尝试松弛。能处理负权边，也正因为这个特性可以拿来判负环。某一轮没有任何更新就提前结束。',
    view: 'graph',
    facts: [['时间', 'O(V·E)'], ['空间', 'O(V)'], ['优势', '支持负权'], ['对比', 'Dijkstra 更快但怕负权']],
    counters: '松弛',
    legend: graphLegend,
    inputs: [{ label: '从 A 出发', make: () => 'A' }, { label: '从 D 出发', make: () => 'D' }],
    code: bfCode,
    run: bellmanFord,
  },
  {
    id: 'graph-kruskal',
    group: '图',
    title: '最小生成树 Kruskal',
    brief: '把所有边按权重排序，依次尝试加入；两端已经连通（加进去会成环）就跳过。判环用并查集，选够 V-1 条边就停。',
    view: 'graph',
    facts: [['时间', 'O(E log E)'], ['空间', 'O(V)'], ['判环', '并查集'], ['前提', '无向连通图']],
    counters: '考察、选中',
    legend: graphLegend,
    inputs: [{ label: '这张图', make: () => true }],
    code: kruskalCode,
    run: kruskal,
  },
  {
    id: 'graph-floyd',
    group: '图',
    title: 'Floyd 多源最短路',
    brief: '一次算出所有点对的最短距离。三重循环里中转点 k 必须在最外层，写成里层就是错的——这是 Floyd 唯一的坑，也是最常考的点。',
    view: 'table',
    facts: [['时间', 'O(n³)'], ['空间', 'O(n²)'], ['优势', '一次算全部点对'], ['负权', '支持，不能有负环']],
    counters: '更新',
    legend: [{ cls: 'cell', text: '距离' }, { cls: 'cell is-active', text: '正在更新' }, { cls: 'cell is-compare', text: '中转依赖的两格' }],
    inputs: [{ label: '这张图', make: () => true }],
    code: floydCode,
    run: floyd,
  },
  {
    id: 'graph-prim',
    group: '图',
    title: '最小生成树 Prim',
    brief: '从一个点出发，每次挑"一端在树里、一端在树外"的最短边，把外面的点拉进来。和 Kruskal 的差别：Prim 长点，Kruskal 长边。',
    view: 'graph',
    facts: [['时间', 'O(V²) 或 O(E log V)'], ['空间', 'O(V)'], ['思路', '点扩张'], ['对比', 'Kruskal 是边排序']],
    counters: '选中',
    legend: graphLegend,
    inputs: [{ label: '从 A 出发', make: () => 'A' }, { label: '从 D 出发', make: () => 'D' }],
    code: primCode,
    run: prim,
  },
];
