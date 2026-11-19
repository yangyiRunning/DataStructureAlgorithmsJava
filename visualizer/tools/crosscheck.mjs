/**
 * 跨语言对拍：同一批输入，前端用的 JS 实现和 Java 实现分别算一遍，结果必须一致。
 *
 * 为什么要做这件事：
 *   动画是 JS 算法真跑出来的轨迹，所以"动画好看"不等于"算法算对"。
 *   一个写歪的算法照样能生成一段完全自洽的动画，只有拿独立实现交叉验证才抓得住。
 *   Java 版不是照抄 JS 的翻译——排序、树、堆、图都是按各自语言的习惯重新写的，
 *   两边都错成同一个样子的概率很低。
 *
 * 比的是最终结果，不是每一帧。逐帧对齐会把两边的实现细节绑死，
 * 为了让帧数一致去改算法，是本末倒置。中间状态由 selftest.mjs 验。
 *
 * 用法：node tools/crosscheck.mjs [每种输入的轮数]
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { sortingAlgorithms } from '../algos/sorting.js';
import { binarySearchAlgorithms } from '../algos/binarysearch.js';
import { twoPointerAlgorithms } from '../algos/twopointers.js';
import { stackAlgorithms } from '../algos/stack.js';
import { trieAlgorithms } from '../algos/trie.js';
import { unionFindAlgorithms } from '../algos/unionfind.js';
import { dpAlgorithms } from '../algos/dp.js';
import { backtrackingAlgorithms } from '../algos/backtracking.js';
import { linkedListAlgorithms } from '../algos/linkedlist.js';
import { treeAlgorithms } from '../algos/tree.js';
import { heapAlgorithms } from '../algos/heap.js';
import { graphAlgorithms } from '../algos/graph.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const JAVA_SRC = join(ROOT, 'java/dsalab/Oracle.java');
const BUILD = join(ROOT, 'build/oracle');

const ALGOS = [
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
  ...backtrackingAlgorithms,
];

const ROUNDS = Number(process.argv[2] ?? 5);

/** 找一台机器上能用的 javac / java：优先 JAVA_HOME，其次常见安装位置 */
function findJdk() {
  const candidates = [];
  if (process.env.JAVA_HOME) candidates.push(join(process.env.JAVA_HOME, 'bin'));
  candidates.push(
    '/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin',
    '/Applications/IntelliJ IDEA.app/Contents/jbr/Contents/Home/bin',
    '/Library/Java/JavaVirtualMachines',
    '/opt/homebrew/opt/openjdk/bin',
    '/usr/local/opt/openjdk/bin',
  );
  for (const dir of candidates) {
    const javac = join(dir, 'javac');
    const java = join(dir, 'java');
    if (existsSync(javac) && existsSync(java)) return { javac, java };
  }
  return null;
}

/** 把 JS 的结果拼成一行字符串，格式必须和 Oracle.java 里每个分支的输出逐字一致 */
function canonical(algoId, result) {
  const arr = (v) => v.join(',');
  switch (algoId) {
    case 'bs-standard':
    case 'bs-left':
    case 'bs-right':
    case 'bs-lower':
    case 'bs-upper':
    case 'bs-rotated':
      return `idx:${result.idx}`;
    case 'tp-two-sum':
      return `pair:${result.pair}`;
    case 'tp-dedupe':
      return `arr:${result.arr}|len:${result.len}`;
    case 'tp-window-fixed':
      return `sum:${result.sum}`;
    case 'tp-window-var':
      return `len:${result.len}`;
    case 'st-brackets':
      return `ok:${result.ok}`;
    case 'st-monotonic':
    case 'st-deque':
      return `arr:${result.arr}`;
    case 'list-middle':
      return `val:${result.val}`;
    case 'list-cycle':
      return `entry:${result.entry}`;
    case 'list-remove-nth':
      return `arr:${result.arr}`;
    case 'tree-traverse':
      return `order:${result.order}`;
    case 'tree-bst-delete':
      return `inorder:${result.inorder}|size:${result.size}`;
    case 'sort-quickselect':
      return `val:${result.val}`;
    case 'bt-permute':
    case 'bt-subsets':
    case 'bt-nqueens':
      return `count:${result.count}`;
    case 'dp-knapsack':
      return `ans:${result.ans}`;
    case 'dp-edit-distance':
      return `dist:${result.dist}`;
    case 'trie-insert':
      return `nodes:${result.nodes}|terminals:${result.terminals}`;
    case 'trie-query':
      return `ok:${result.ok}`;
    case 'uf-union':
      return `unions:${result.unions}`;
    case 'uf-find':
      return `root:${result.root}`;
    case 'tree-bst-insert':
      return `inorder:${result.inorder}|height:${result.height}|size:${result.size}`;
    case 'tree-avl-insert':
      return `inorder:${result.inorder}|height:${result.height}|rotations:${result.rotations}|size:${result.size}`;
    case 'heap-pop':
      return `arr:${arr(result.values)}|popped:${result.popped}`;
    case 'graph-bfs':
    case 'graph-dfs':
    case 'graph-topo':
      return `order:${result.order}`;
    case 'graph-dijkstra':
      return `dist:${result.dist}`;
    case 'graph-bellman-ford':
      return `dist:${result.dist}`;
    case 'graph-kruskal':
      return `total:${result.total}|edges:${result.edges}`;
    default:
      return arr(result.values);
  }
}

/** 把输入序列化成 Oracle 认的一行，分号分组、逗号分项 */
function serialize(algoId, input) {
  const nums = (v) => v.join(',');
  switch (algoId) {
    case 'bs-standard':
    case 'bs-left':
    case 'bs-right':
    case 'bs-lower':
    case 'bs-upper':
    case 'bs-rotated':
    case 'tp-two-sum':
      return `${algoId};${nums(input.nums)};${input.target}`;
    case 'tp-dedupe':
    case 'st-monotonic':
      return `${algoId};${nums(input)}`;
    case 'tp-window-fixed':
    case 'st-deque':
      return `${algoId};${nums(input.nums)};${input.k}`;
    case 'tp-window-var':
    case 'st-brackets':
      return `${algoId};${input}`;
    case 'list-middle':
      return `${algoId};${nums(input)}`;
    case 'list-cycle':
      return `${algoId};${nums(input.values)};${input.cycleAt == null ? 'null' : input.cycleAt}`;
    case 'list-remove-nth':
      return `${algoId};${nums(input.values)};${input.n}`;
    case 'tree-traverse':
      return `${algoId};${input.mode}`;
    case 'sort-quickselect':
      return `${algoId};${nums(input.values)};${input.k}`;
    case 'bt-nqueens':
      return `${algoId};${input}`;
    case 'dp-knapsack':
      return `${algoId};${nums(input.w)};${nums(input.v)};${input.C}`;
    case 'dp-edit-distance':
      return `${algoId};${input.a};${input.b}`;
    case 'trie-insert':
      return `${algoId};${input.join(',')}`;
    case 'trie-query':
      return `${algoId};${input.word};${input.mode}`;
    case 'uf-union':
      return `${algoId};${input.map(([a, b]) => `${a}-${b}`).join(',')}`;
    case 'uf-find':
      return `${algoId};${input}`;
    case 'tree-bst-delete':
      return `${algoId};${nums(input.values)};${input.del}`;
    case 'list-insert':
      return `${algoId};${nums(input.values)};${input.at};${input.val}`;
    case 'list-delete':
      return `${algoId};${nums(input.values)};${input.val}`;
    case 'heap-push':
      return `${algoId};${nums(input.base)};${input.val}`;
    case 'heap-pop':
      return `${algoId};${nums(input.base)}`;
    case 'graph-bfs':
    case 'graph-dfs':
    case 'graph-dijkstra':
    case 'graph-bellman-ford':
      return `${algoId};${input}`;
    case 'graph-topo':
    case 'graph-kruskal':
      return algoId;
    default:
      // 排序、链表反转、BST、AVL、堆排序：输入就是一个数组
      return `${algoId};${nums(input)}`;
  }
}

const jdk = findJdk();
if (!jdk) {
  console.error('找不到 JDK。装一个，或者设 JAVA_HOME 指向带 javac 的 JDK。');
  process.exit(2);
}

mkdirSync(BUILD, { recursive: true });
const compile = spawnSync(jdk.javac, ['-encoding', 'UTF-8', '-d', BUILD, JAVA_SRC], { encoding: 'utf8' });
if (compile.status !== 0) {
  console.error('Java 编译失败：');
  console.error(compile.stderr || compile.stdout);
  process.exit(2);
}

// ── 生成全部用例 ──────────────────────────────────────────

const cases = [];
for (const algo of ALGOS) {
  for (const spec of algo.inputs ?? []) {
    for (let round = 0; round < ROUNDS; round++) {
      const input = spec.make();
      cases.push({ algo, label: spec.label, input });
    }
  }
}

const payload = cases.map((c) => serialize(c.algo.id, c.input));
const stdin = `${payload.length}\n${payload.join('\n')}\n`;

const exec = spawnSync(jdk.java, ['-cp', BUILD, 'dsalab.Oracle'], {
  input: stdin,
  encoding: 'utf8',
  maxBuffer: 32 * 1024 * 1024,
});
if (exec.status !== 0) {
  console.error('Java 运行失败：');
  console.error(exec.stderr || exec.stdout);
  process.exit(2);
}

const javaLines = exec.stdout.trimEnd().split('\n');
if (javaLines.length !== cases.length) {
  console.error(`Java 输出行数 ${javaLines.length} 和用例数 ${cases.length} 对不上`);
  process.exit(2);
}

// ── 逐条比对 ──────────────────────────────────────────────

let bad = 0;
const perAlgo = new Map();

cases.forEach((c, i) => {
  const jsResult = c.algo.run(c.input).result;
  const js = canonical(c.algo.id, jsResult);
  const java = javaLines[i];
  const stat = perAlgo.get(c.algo.id) ?? { ok: 0, fail: 0 };
  if (js === java) {
    stat.ok += 1;
  } else {
    stat.fail += 1;
    if (stat.fail <= 2) {
      bad += 1;
      console.error(`✗ ${c.algo.id}［${c.label}］`);
      console.error(`  输入：${serialize(c.algo.id, c.input)}`);
      console.error(`  JS  ：${js}`);
      console.error(`  Java：${java}`);
    }
  }
  perAlgo.set(c.algo.id, stat);
});

console.log(`\n对拍 ${cases.length} 个用例（每个算法每种输入 ${ROUNDS} 轮）\n`);
for (const [id, s] of perAlgo) {
  const mark = s.fail === 0 ? '✓' : '✗';
  console.log(`  ${mark} ${id.padEnd(22)} 一致 ${String(s.ok).padStart(4)}   不一致 ${s.fail}`);
}

if (bad > 0) {
  console.error(`\n对拍失败：${[...perAlgo.values()].reduce((a, b) => a + b.fail, 0)} 个用例结果不一致`);
  process.exit(1);
}
console.log('\n对拍通过：JS 与 Java 在所有用例上结果完全一致');
