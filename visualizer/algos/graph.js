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
];
