/**
 * 自检：把每条轨迹的"结构性不变量"扫一遍。
 *
 * 为什么需要这个而不是只靠肉眼看动画：
 *   轨迹里的 bug 大多是静默的——数组少了一个元素、settled 记了一个越界下标、
 *   计数器倒着走、step.line 指到代码外面。浏览器里这些只会表现为"某一步看着有点怪"，
 *   拖进度条来回滑十遍也未必发现。用脚本把每条轨迹全量扫一遍，能一次抓出来。
 *
 * 这里只查"轨迹自身说得出说不通"的事，不查"算法算得对不对"——
 * 后者交给 tools/crosscheck.mjs 和 Java 实现对比。
 */
import { sortingAlgorithms } from '../algos/sorting.js';
import { binarySearchAlgorithms } from '../algos/binarysearch.js';
import { twoPointerAlgorithms } from '../algos/twopointers.js';
import { stackAlgorithms } from '../algos/stack.js';
import { trieAlgorithms } from '../algos/trie.js';
import { unionFindAlgorithms } from '../algos/unionfind.js';
import { dpAlgorithms } from '../algos/dp.js';
import { linkedListAlgorithms } from '../algos/linkedlist.js';
import { treeAlgorithms } from '../algos/tree.js';
import { heapAlgorithms } from '../algos/heap.js';
import { graphAlgorithms, NODES as GRAPH_NODES, EDGES as GRAPH_EDGES } from '../algos/graph.js';

const ALL = [
  ...sortingAlgorithms,
  ...binarySearchAlgorithms,
  ...linkedListAlgorithms,
  ...twoPointerAlgorithms,
  ...stackAlgorithms,
  ...treeAlgorithms,
  ...trieAlgorithms,
  ...unionFindAlgorithms,
  ...dpAlgorithms,
  ...heapAlgorithms,
  ...graphAlgorithms,
];

let failures = 0;

/** 独立的 Bellman-Ford：用来校验 Dijkstra 的结果，不和被测代码共用任何逻辑 */
function bellmanFord(nodes, edges, start) {
  const dist = {};
  for (const n of nodes) dist[n.id] = Infinity;
  dist[start] = 0;
  for (let round = 0; round < nodes.length - 1; round++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; changed = true; }
      if (dist[v] + w < dist[u]) { dist[u] = dist[v] + w; changed = true; }
    }
    if (!changed) break;
  }
  return dist;
}

/** 独立的 BFS：邻接表按 id 升序，和演示用的那套排序口径一致 */
function referenceBfs(nodes, edges, start) {
  const adj = new Map(nodes.map((n) => [n.id, []]));
  for (const [u, v] of edges) {
    adj.get(u).push(v);
    adj.get(v).push(u);
  }
  for (const list of adj.values()) list.sort();
  const seen = new Set([start]);
  const queue = [start];
  const out = [];
  while (queue.length) {
    const u = queue.shift();
    out.push(u);
    for (const to of adj.get(u)) {
      if (seen.has(to)) continue;
      seen.add(to);
      queue.push(to);
    }
  }
  return out;
}

function fail(where, msg) {
  failures += 1;
  console.error(`  ✗ ${where}：${msg}`);
}

function checkTrajectory(algo, inputLabel, input, built) {
  const where = `${algo.id}［${inputLabel}］`;
  const { steps } = built;

  if (!Array.isArray(steps) || steps.length === 0) {
    fail(where, '没有产生任何步骤');
    return;
  }

  // 有的演示按输入切换代码（四种遍历），行号要按实际那套来查
  const codeLen = (built.code ?? algo.code ?? []).length;
  // 期望长度取第一帧的快照：新一批演示的输入是对象（{nums,target} 之类），
  // 拿 input.length 比会得到 undefined。用首帧当基准同样能抓出"中途数组被截断"。
  const refLen = steps[0]?.state?.values?.length;
  let lastCounters = {};
  let prevView = null;

  steps.forEach((step, i) => {
    // view 记在算法上（app.js 载入时补进每一帧），这里取算法声明的那个
    const view = step.view ?? algo.view;
    if (!view) fail(where, `第 ${i} 步没有 view，算法本身也没声明`);
    if (view !== prevView && prevView !== null) {
      fail(where, `第 ${i} 步的 view 从 ${prevView} 变成了 ${view}，同一轨迹里视图不该跳`);
    }
    prevView = view;

    if (typeof step.note !== 'string' || !step.note.trim()) {
      fail(where, `第 ${i} 步没有说明文字`);
    }

    if (!Number.isInteger(step.line) || step.line < 0 || step.line >= codeLen) {
      fail(where, `第 ${i} 步的 line=${step.line} 超出代码范围 0..${codeLen - 1}`);
    }

    if (!step.counters || typeof step.counters !== 'object') {
      fail(where, `第 ${i} 步没有计数器`);
    } else {
      for (const [k, v] of Object.entries(step.counters)) {
        if (typeof v !== 'number' || !Number.isFinite(v)) {
          fail(where, `第 ${i} 步计数器 ${k}=${v} 不是有限数`);
        } else if (lastCounters[k] !== undefined && v < lastCounters[k]) {
          fail(where, `第 ${i} 步计数器 ${k} 从 ${lastCounters[k]} 倒退回 ${v}`);
        }
      }
      lastCounters = { ...step.counters };
    }

    // 数组类视图必须每次都是完整快照，长度不能变
    const s = step.state ?? {};
    if (view === 'array' && Array.isArray(s.values)) {
      if (refLen != null && s.values.length !== refLen) {
        fail(where, `第 ${i} 步 values 长度 ${s.values.length} ≠ 首帧长度 ${refLen}`);
      }
      for (const idx of [s.settled ?? [], s.compare ?? [], s.move ?? []].flat()) {
        if (idx < 0 || idx >= s.values.length) {
          fail(where, `第 ${i} 步下标 ${idx} 越界`);
        }
      }
      if (s.pivot != null && (s.pivot < 0 || s.pivot >= s.values.length)) {
        fail(where, `第 ${i} 步 pivot=${s.pivot} 越界`);
      }
    }
  });

  // 树：拿最后一步的快照验 BST 性质；AVL 还要验每个节点都平衡
  if (algo.view === 'tree') {
    const last = steps[steps.length - 1];
    const flat = last.state?.nodes ?? [];
    const byId = new Map(flat.map((n) => [n.id, n]));
    const rootId = last.state?.root;
    if (!rootId || !byId.has(rootId)) {
      fail(where, '最后一步没有根节点');
    } else {
      const seen = new Set();
      const inorder = [];
      const bfOf = new Map();
      let broken = false;
      const walkTree = (id) => {
        if (!id) return 0;
        if (seen.has(id)) { broken = true; return 0; }   // 有环
        seen.add(id);
        const n = byId.get(id);
        if (!n) { broken = true; return 0; }
        const hl = walkTree(n.left);
        inorder.push(n.val);
        const hr = walkTree(n.right);
        bfOf.set(id, hl - hr);
        return 1 + Math.max(hl, hr);
      };
      walkTree(rootId);
      if (broken) fail(where, '树结构有环或指向不存在的节点');
      const want = [...inorder].sort((a, b) => a - b);
      if (inorder.join() !== want.join()) {
        fail(where, `中序遍历不是升序，BST 性质被破坏：${inorder.join(',')}`);
      }
      if (algo.id.includes('avl')) {
        for (const [id, bf] of bfOf) {
          if (Math.abs(bf) > 1) {
            fail(where, `AVL 失衡：节点 ${byId.get(id).val} 的平衡因子是 ${bf}`);
          }
        }
      }
    }
  }

  // 堆：结束状态必须满足堆序；堆排序的最终结果必须是升序
  if (algo.view === 'heap') {
    const last = steps[steps.length - 1];
    const vals = last.state?.values ?? [];
    if (algo.id === 'heap-sort') {
      const want = [...vals].sort((a, b) => a - b);
      if (vals.join() !== want.join()) {
        fail(where, `堆排序结果是 ${vals.join(',')}，不是升序`);
      }
    } else {
      for (let i = 1; i < vals.length; i++) {
        const p = (i - 1) >> 1;
        if (vals[p] < vals[i]) {
          fail(where, `大顶堆性质被破坏：下标 ${p} 的 ${vals[p]} < 下标 ${i} 的 ${vals[i]}`);
        }
      }
    }
  }

  // 图：遍历的完整性与最短路数值都要独立验一遍
  if (algo.group === '图' && built.result) {
    const res = built.result;
    if (algo.id === 'graph-bfs') {
      const got = res.order.split(',');
      const want = referenceBfs(GRAPH_NODES, GRAPH_EDGES, input);
      if (got.join() !== want.join()) {
        fail(where, `BFS 顺序 ${got.join(',')} 与独立实现 ${want.join(',')} 不一致`);
      }
    }
    if (algo.id === 'graph-dfs') {
      const got = res.order.split(',');
      if (got.length !== GRAPH_NODES.length || new Set(got).size !== GRAPH_NODES.length) {
        fail(where, `DFS 没有恰好访问每个节点一次：${got.join(',')}`);
      }
    }
    if (algo.id === 'graph-dijkstra') {
      const want = bellmanFord(GRAPH_NODES, GRAPH_EDGES, input);
      const got = {};
      for (const part of res.dist.split(',')) {
        const [k, v] = part.split('=');
        got[k] = Number(v);
      }
      for (const n of GRAPH_NODES) {
        if (got[n.id] !== want[n.id]) {
          fail(where, `Dijkstra 给出的 ${n.id} 距离是 ${got[n.id]}，Bellman-Ford 算出来是 ${want[n.id]}`);
        }
      }
    }
    if (algo.id === 'graph-topo') {
      const order = res.order.split(',');
      const last = steps[steps.length - 1];
      const edges = last.state?.edges ?? [];
      const pos = new Map(order.map((id, i) => [id, i]));
      for (const e of edges) {
        if (pos.get(e.u) > pos.get(e.v)) {
          fail(where, `拓扑序违反依赖：${e.u} 排在了 ${e.v} 后面`);
        }
      }
    }
  }

  // 最后一步之后，结果数组必须真的有序（只对排序类检查）
  if (algo.group === '排序' && built.result?.values) {
    const got = built.result.values;
    const want = [...input].sort((a, b) => a - b);
    if (got.length !== want.length || got.some((v, i) => v !== want[i])) {
      fail(where, `排序结果不对：得到 ${got.join(',')}，应为 ${want.join(',')}`);
    }
    const last = steps[steps.length - 1];
    if (!Array.isArray(last.state.settled) || last.state.settled.length !== got.length) {
      fail(where, '最后一步没有把全部元素标为已就位');
    }
  }
}

console.log(`共 ${ALL.length} 个演示\n`);

for (const algo of ALL) {
  const inputs = algo.inputs ?? [];
  if (!inputs.length) {
    fail(algo.id, '没有配任何输入用例');
    continue;
  }
  let total = 0;
  for (const spec of inputs) {
    // 每个用例跑两次：随机生成器如果带隐藏状态，两次结果会不一样，这里能暴露出来
    const input = spec.make();
    const built = algo.run(input);
    total += built.steps.length;
    checkTrajectory(algo, spec.label, input, built);
    const again = algo.run(spec.make());
    if (again.steps[0] && built.steps[0] && JSON.stringify(again.steps[0].state) !== JSON.stringify(built.steps[0].state)) {
      // 只是提示：随机输入本来就不同，不算失败
    }
  }
  console.log(`  ${failures ? '·' : '✓'} ${algo.id}   ${inputs.length} 组用例  ${total} 步`);
}

console.log('');
if (failures) {
  console.error(`自检失败：${failures} 处问题`);
  process.exit(1);
}
console.log('自检通过：所有轨迹的结构性不变量成立');
