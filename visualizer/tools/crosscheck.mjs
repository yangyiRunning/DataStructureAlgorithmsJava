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
import { dpOneDAlgorithms } from '../algos/dp2.js';
import { arrayTechAlgorithms } from '../algos/arraytech.js';
import { miscAlgorithms } from '../algos/misc.js';
import { hashAlgorithms } from '../algos/hash.js';
import { advancedTreeAlgorithms } from '../algos/advancedtree.js';
import { leetcodeAlgorithms } from '../algos/leetcode.js';
import { leetcode2Algorithms } from '../algos/leetcode2.js';
import { leetcode3Algorithms } from '../algos/leetcode3.js';
import { leetcode4Algorithms } from '../algos/leetcode4.js';
import { leetcode5Algorithms } from '../algos/leetcode5.js';
import { leetcode6Algorithms } from '../algos/leetcode6.js';
import { leetcode7Algorithms } from '../algos/leetcode7.js';
import { leetcode8Algorithms } from '../algos/leetcode8.js';
import { leetcode9Algorithms } from '../algos/leetcode9.js';
import { leetcode10Algorithms } from '../algos/leetcode10.js';
import { leetcode11Algorithms } from '../algos/leetcode11.js';
import { aiAlgorithms } from '../algos/ai.js';
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
  ...dpOneDAlgorithms,
  ...arrayTechAlgorithms,
  ...miscAlgorithms,
  ...hashAlgorithms,
  ...advancedTreeAlgorithms,
  ...leetcodeAlgorithms,
  ...leetcode2Algorithms,
  ...leetcode3Algorithms,
  ...leetcode4Algorithms,
  ...leetcode5Algorithms,
  ...leetcode6Algorithms,
  ...leetcode7Algorithms,
  ...leetcode8Algorithms,
  ...leetcode9Algorithms,
  ...leetcode10Algorithms,
  ...leetcode11Algorithms,
  ...aiAlgorithms,
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
    case 'ai-forward':
      return `h:${f3(result.h[0])},${f3(result.h[1])}|o:${f3(result.o)}|loss:${f3(result.loss)}`;
    case 'ai-backward': {
      const r = result;
      return `gw2:${f3(r.gradW2[0])},${f3(r.gradW2[1])}|gz1:${f3(r.gradZ1[0])},${f3(r.gradZ1[1])}`
        + `|o:${f3(r.o)},${f3(r.o2)}|loss:${f3(r.loss0)},${f3(r.loss1)}`;
    }
    case 'ai-softmax':
      return `p:${result.probs.map((v) => f3(v)).join(',')}|sum:${f3(result.sum)}`;
    case 'ai-conv':
    case 'ai-pooling':
      return `out:${result.out.join(',')}`;
    case 'ai-logistic': {
      const r = result;
      return `w0:${f3(r.w0)},w1:${f3(r.w1)},b:${f3(r.b)},loss:${f3(r.loss)}`;
    }
    case 'ai-gradient-descent': {
      const r = result;
      return `w:${f3(r.w)},b:${f3(r.b)},loss:${f3(r.loss)}`;
    }
    case 'ai-kmeans': {
      const cs = result.centers.map((c) => `${f3(c.x)},${f3(c.y)}`).join('|');
      return `centers:${cs}|assign:${result.assign.join(',')}`;
    }
    case 'ai-knn':
      return `label:${result.label}|votes:1=${result.votes[1] ?? 0},2=${result.votes[2] ?? 0}`;
    case 'ai-perceptron': {
      const r = result;
      return `w0:${f3(r.w0)},w1:${f3(r.w1)},b:${f3(r.b)},errors:${r.totalErrors}`;
    }
    case 'lc-ransom':
    case 'lc-power-of-two':
    case 'lc-palindrome-number':
      return `ok:${result.ok}`;
    case 'lc-rob-2':
      return `ans:${result.ans}`;
    case 'lc-unique-paths-2':
      return `paths:${result.paths}`;
    case 'lc-min-path-sum':
      return `sum:${result.sum}`;
    case 'lc-lcs':
      return `len:${result.len}`;
    case 'lc-stock-2':
      return `profit:${result.profit}`;
    case 'lc-roman':
    case 'lc-reverse-int':
      return `num:${result.num}`;
    case 'lc-excel-title':
    case 'lc-fizz-buzz':
      return `out:${result.out}`;
    case 'lc-search-bst':
    case 'lc-balanced':
      return `ok:${result.ok}`;
    case 'lc-bst-lca':
      return `lca:${result.lca}`;
    case 'lc-sorted-to-bst':
    case 'lc-merge-trees':
      return `order:${result.order}`;
    case 'lc-min-depth':
      return `depth:${result.depth}`;
    case 'lc-tree-paths':
      return `count:${result.count}`;
    case 'lc-right-view':
      return `arr:${result.arr}`;
    case 'lc-kth-smallest':
      return `num:${result.num}`;
    case 'lc-remove-dup-2':
      return `len:${result.len}|arr:${result.arr}`;
    case 'lc-reorder-list':
    case 'lc-sort-list':
    case 'lc-odd-even-list':
    case 'lc-partition-list':
    case 'lc-reverse-between':
      return `arr:${result.arr}`;
    case 'lc-stack-by-queue':
      return `out:${result.out}`;
    case 'lc-eval-rpn':
      return `num:${result.num}`;
    case 'lc-simplify-path':
      return `out:${result.out}`;
    case 'lc-word-pattern':
    case 'lc-contains-nearby':
      return `ok:${result.ok}`;
    case 'lc-disappeared':
    case 'lc-pascal':
    case 'lc-set-zeroes':
      return `arr:${result.arr}`;
    case 'lc-subarray-sum':
      return `count:${result.count}`;
    case 'lc-min-subarray':
      return `len:${result.len}`;
    case 'lc-max-consecutive':
      return `max:${result.max}`;
    case 'lc-pivot-index':
      return `idx:${result.idx}`;
    case 'lc-last-word':
      return `len:${result.len}`;
    case 'lc-strstr':
      return `idx:${result.idx}`;
    case 'lc-isomorphic':
      return `ok:${result.ok}`;
    case 'lc-dup-exists':
    case 'lc-anagram':
    case 'lc-subsequence':
      return `ok:${result.ok}`;
    case 'lc-majority':
    case 'lc-missing-number':
      return `num:${result.num}`;
    case 'lc-remove-element':
      return `len:${result.len}|arr:${result.arr}`;
    case 'lc-merge-sorted-arr':
    case 'lc-plus-one':
      return `arr:${result.arr}`;
    case 'lc-reverse-string':
      return `out:${result.out}`;
    case 'lc-count-ones':
      return `count:${result.count}`;
    case 'lc-invert-tree':
      return `order:${result.order}`;
    case 'lc-path-sum':
      return `ok:${result.ok}`;
    case 'lc-first-missing':
      return `ans:${result.ans}`;
    case 'lc-longest-palindrome':
      return `len:${result.len}`;
    case 'lc-common-prefix':
      return `prefix:${result.prefix}`;
    case 'lc-reverse-words':
      return `out:${result.out}`;
    case 'lc-hamming':
      return `dist:${result.dist}`;
    case 'lc-count-bits':
      return `arr:${result.arr}`;
    case 'lc-spiral':
      return `out:${result.out}`;
    case 'lc-rotate-image':
      return `arr:${result.arr}`;
    case 'lc-search-matrix':
      return `ok:${result.ok}`;
    case 'lc-merge-k':
      return `arr:${result.arr}`;
    case 'lc-add-two':
      return `arr:${result.arr}`;
    case 'lc-intersection':
      return `val:${result.val}`;
    case 'lc-palindrome-list':
    case 'lc-word-search':
    case 'lc-word-break':
      return `ok:${result.ok}`;
    case 'lc-largest-rect':
      return `area:${result.area}`;
    case 'lc-group-anagrams':
    case 'lc-generate-parens':
      return `count:${result.count}`;
    case 'lc-longest-consecutive':
      return `len:${result.len}`;
    case 'lc-min-stack':
    case 'lc-decode-string':
      return `out:${result.out}`;
    case 'lc-lca':
      return `lca:${result.lca}`;
    case 'lc-validate-bst':
      return `ok:${result.ok}`;
    case 'lc-oranges':
      return `minutes:${result.minutes}`;
    case 'lc-top-k-frequent':
      return `top:${result.top}`;
    case 'lc-stock':
      return `profit:${result.profit}`;
    case 'lc-max-product':
      return `product:${result.product}`;
    case 'lc-move-zero':
    case 'lc-product-except-self':
    case 'lc-rotate':
      return `arr:${result.arr}`;
    case 'lc-max-depth':
      return `depth:${result.depth}`;
    case 'lc-symmetric':
      return `ok:${result.ok}`;
    case 'lc-diameter':
      return `diameter:${result.diameter}`;
    case 'lc-coin-change':
      return `coins:${result.coins}`;
    case 'lc-three-sum':
      return `count:${result.count}`;
    case 'lc-container':
      return `max:${result.max}`;
    case 'lc-max-subarray':
      return `sum:${result.sum}`;
    case 'lc-unique-paths':
      return `paths:${result.paths}`;
    case 'list-merge':
    case 'list-reverse-k':
      return `arr:${result.arr}`;
    case 'st-two-stacks':
      return `transfers:${result.transfers}`;
    case 'st-circle-queue':
      return `leftover:${result.leftover}`;
    case 'hash-chaining':
      return `collisions:${result.collisions}|maxChain:${result.maxChain}|total:${result.total}`;
    case 'hash-lru':
      return `order:${result.order}`;
    case 'str-palindrome':
      return `ok:${result.ok}`;
    case 'adv-segment-tree':
    case 'adv-fenwick':
      return `sum:${result.sum}`;
    case 'graph-islands':
      return `count:${result.count}`;
    case 'heap-topk':
      return `top:${result.top}`;
    case 'at-intervals':
      return `removed:${result.removed}|kept:${result.kept}`;
    case 'bit-single-number':
      return `ans:${result.ans}`;
    case 'bit-subset-mask':
      return `count:${result.count}`;
    case 'str-kmp':
      return `idx:${result.idx}`;
    case 'rec-hanoi':
      return `moves:${result.moves}`;
    case 'graph-floyd':
      return result.dist;
    case 'graph-prim':
      return `total:${result.total}|edges:${result.edges}`;
    case 'dp-climb':
    case 'dp-rob':
    case 'dp-lis':
    case 'dp-unbounded':
      return `ans:${result.ans}`;
    case 'at-prefix-sum':
      return `pre:${result.pre}|total:${result.total}`;
    case 'at-diff-array':
      return `arr:${result.arr}`;
    case 'at-jump-game':
      return `ok:${result.ok}`;
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
const f3 = (v) => (Math.abs(v) < 1e-9 ? 0 : v).toFixed(3);
const lv = (arr) => arr.map((v) => (v == null ? 'null' : v)).join(',');

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
    case 'ai-forward':
    case 'ai-backward':
      return algoId;
    case 'ai-softmax':
      return `${algoId};${input.T}`;
    case 'ai-conv':
    case 'ai-pooling':
      return algoId;
    case 'ai-logistic':
      return `${algoId};${input.lr};${input.steps}`;
    case 'ai-gradient-descent':
      return `${algoId};${input.lr};${input.steps}`;
    case 'ai-kmeans':
      return `${algoId};${input.k};${input.iters}`;
    case 'ai-knn':
      return `${algoId};${input.query.x};${input.query.y};${input.k}`;
    case 'ai-perceptron':
      return `${algoId};${input.lr};${input.maxEpoch}`;
    case 'lc-ransom':
      return `${algoId};${input.ransom};${input.mag}`;
    case 'lc-rob-2':
    case 'lc-stock-2':
      return `${algoId};${nums(input)}`;
    case 'lc-unique-paths-2':
    case 'lc-min-path-sum':
      return algoId;
    case 'lc-lcs':
      return `${algoId};${input.a};${input.b}`;
    case 'lc-power-of-two':
    case 'lc-palindrome-number':
    case 'lc-reverse-int':
    case 'lc-excel-title':
    case 'lc-fizz-buzz':
      return `${algoId};${input}`;
    case 'lc-roman':
      return `${algoId};${input}`;
    case 'lc-search-bst':
      return `${algoId};${lv(input.levels)};${input.val}`;
    case 'lc-bst-lca':
    case 'lc-kth-smallest':
      return `${algoId};${lv(input.levels)};${algoId === 'lc-bst-lca' ? input.p : input.k}${algoId === 'lc-bst-lca' ? `;${input.q}` : ''}`;
    case 'lc-sorted-to-bst':
    case 'lc-remove-dup-2':
      return `${algoId};${nums(input)}`;
    case 'lc-balanced':
    case 'lc-min-depth':
    case 'lc-tree-paths':
    case 'lc-right-view':
      return `${algoId};${lv(input)}`;
    case 'lc-merge-trees':
      return `${algoId};${lv(input.a)};${lv(input.b)}`;
    case 'lc-reorder-list':
    case 'lc-sort-list':
    case 'lc-odd-even-list':
      return `${algoId};${nums(input)}`;
    case 'lc-partition-list':
      return `${algoId};${nums(input.vals)};${input.x}`;
    case 'lc-reverse-between':
      return `${algoId};${nums(input.vals)};${input.left};${input.right}`;
    case 'lc-stack-by-queue':
      return `${algoId};${input.map(([o, v]) => (o === 'push' ? `push${v}` : o)).join(',')}`;
    case 'lc-eval-rpn':
      return `${algoId};${input.join('|')}`;
    case 'lc-simplify-path':
      return `${algoId};${input}`;
    case 'lc-word-pattern':
      return `${algoId};${input.pattern};${input.s}`;
    case 'lc-contains-nearby':
      return `${algoId};${nums(input.nums)};${input.k}`;
    case 'lc-disappeared':
    case 'lc-max-consecutive':
    case 'lc-pivot-index':
      return `${algoId};${nums(input)}`;
    case 'lc-subarray-sum':
      return `${algoId};${nums(input.nums)};${input.k}`;
    case 'lc-min-subarray':
      return `${algoId};${input.target};${nums(input.nums)}`;
    case 'lc-pascal':
      return `${algoId};${input}`;
    case 'lc-set-zeroes':
      return algoId;
    case 'lc-last-word':
      return `${algoId};${input}`;
    case 'lc-strstr':
      return `${algoId};${input.haystack};${input.needle}`;
    case 'lc-isomorphic':
      return `${algoId};${input.s};${input.t}`;
    case 'lc-dup-exists':
    case 'lc-majority':
    case 'lc-missing-number':
    case 'lc-plus-one':
      return `${algoId};${nums(input)}`;
    case 'lc-remove-element':
      return `${algoId};${nums(input.nums)};${input.val}`;
    case 'lc-merge-sorted-arr':
      return `${algoId};${nums(input.a)};${input.m};${nums(input.b)};${input.n}`;
    case 'lc-reverse-string':
      return `${algoId};${input}`;
    case 'lc-anagram':
    case 'lc-subsequence':
      return `${algoId};${input.s};${input.t}`;
    case 'lc-count-ones':
      return `${algoId};${input}`;
    case 'lc-invert-tree':
      return `${algoId};${input.map((v) => (v == null ? 'null' : v)).join(',')}`;
    case 'lc-path-sum':
      return `${algoId};${input.levels.map((v) => (v == null ? 'null' : v)).join(',')};${input.target}`;
    case 'lc-first-missing':
      return `${algoId};${nums(input)}`;
    case 'lc-longest-palindrome':
    case 'lc-reverse-words':
      return `${algoId};${input}`;
    case 'lc-common-prefix':
      return `${algoId};${input.join(',')}`;
    case 'lc-hamming':
      return `${algoId};${input.x};${input.y}`;
    case 'lc-count-bits':
    case 'lc-search-matrix':
      return `${algoId};${input}`;
    case 'lc-spiral':
    case 'lc-rotate-image':
      return algoId;
    case 'lc-merge-k':
      return `${algoId};${input.map((l) => l.join(',')).join('|')}`;
    case 'lc-add-two':
      return `${algoId};${nums(input.a)};${nums(input.b)}`;
    case 'lc-intersection':
      return `${algoId};${nums(input.preA)};${nums(input.preB)};${nums(input.shared)}`;
    case 'lc-palindrome-list':
    case 'lc-largest-rect':
      return `${algoId};${nums(input)}`;
    case 'lc-group-anagrams':
      return `${algoId};${input.join(',')}`;
    case 'lc-generate-parens':
      return `${algoId};${input}`;
    case 'lc-word-search':
      return `${algoId};${input}`;
    case 'lc-word-break':
      return `${algoId};${input.s};${input.words.join(',')}`;
    case 'lc-longest-consecutive':
      return `${algoId};${nums(input)}`;
    case 'lc-min-stack':
      return `${algoId};${input.map(([o, v]) => (o === 'push' ? `push${v}` : o)).join(',')}`;
    case 'lc-decode-string':
      return `${algoId};${input}`;
    case 'lc-lca':
      return `${algoId};${input.levels.map((v) => (v == null ? 'null' : v)).join(',')};${input.p};${input.q}`;
    case 'lc-validate-bst':
      return `${algoId};${input.map((v) => (v == null ? 'null' : v)).join(',')}`;
    case 'lc-oranges':
      return algoId;
    case 'lc-top-k-frequent':
      return `${algoId};${nums(input.nums)};${input.k}`;
    case 'lc-stock':
    case 'lc-max-product':
    case 'lc-move-zero':
    case 'lc-product-except-self':
      return `${algoId};${nums(input)}`;
    case 'lc-rotate':
      return `${algoId};${nums(input.nums)};${input.k}`;
    case 'lc-max-depth':
    case 'lc-symmetric':
    case 'lc-diameter':
      return `${algoId};${input.map((v) => (v == null ? 'null' : v)).join(',')}`;
    case 'lc-coin-change':
      return `${algoId};${nums(input.coins)};${input.amount}`;
    case 'lc-three-sum':
    case 'lc-container':
    case 'lc-max-subarray':
      return `${algoId};${nums(input)}`;
    case 'lc-unique-paths':
      return `${algoId};${input.m};${input.n}`;
    case 'list-merge':
      return `${algoId};${nums(input.left)};${nums(input.right)}`;
    case 'list-reverse-k':
      return `${algoId};${nums(input.values)};${input.k}`;
    case 'st-two-stacks':
      return `${algoId};${input.map(([o, v]) => (o === 'push' ? `push${v}` : 'pop')).join(',')}`;
    case 'st-circle-queue':
      return `${algoId};${input.map(([o, v]) => (o === 'enqueue' ? `enqueue${v}` : 'dequeue')).join(',')}`;
    case 'hash-chaining':
      return `${algoId};${nums(input)}`;
    case 'hash-lru':
      return `${algoId};${input.map(([o, k]) => `${o}${k}`).join(',')}`;
    case 'str-palindrome':
      return `${algoId};${input}`;
    case 'adv-segment-tree':
      return `${algoId};${nums(input.arr)};${input.ql};${input.qr}`;
    case 'adv-fenwick':
      return `${algoId};${nums(input.arr)};${input.q}`;
    case 'graph-islands':
      return algoId;
    case 'heap-topk':
      return `${algoId};${nums(input.nums)};${input.k}`;
    case 'at-intervals':
      return `${algoId};${input.map(([s, e]) => `${s}-${e}`).join(',')}`;
    case 'bit-single-number':
    case 'bit-subset-mask':
      return `${algoId};${nums(input)}`;
    case 'str-kmp':
      return `${algoId};${input.s};${input.p}`;
    case 'rec-hanoi':
      return `${algoId};${input}`;
    case 'graph-floyd':
      return algoId;
    case 'graph-prim':
      return `${algoId};${input}`;
    case 'dp-climb':
      return `${algoId};${input}`;
    case 'dp-rob':
    case 'dp-lis':
    case 'at-prefix-sum':
    case 'at-jump-game':
      return `${algoId};${nums(input)}`;
    case 'dp-unbounded':
      return `${algoId};${nums(input.w)};${nums(input.v)};${input.C}`;
    case 'at-diff-array':
      return `${algoId};${input.n};${input.ops.map(([l, r, v]) => `${l}:${r}:${v}`).join(',')}`;
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

// 第三路：Python。python/dsalab.py 读同一套 spec、输出同一套格式。
// 它还没实现的命令会让整批失败，所以先探一次覆盖率，只把 Python 有实现的用例交给它。
const PY = join(ROOT, 'python/dsalab.py');
const probeSrc = [
  'import json, sys',
  'sys.path.insert(0, ' + JSON.stringify(join(ROOT, 'python')) + ')',
  'import dsalab',
  'ids = json.loads(sys.argv[1])',
  'print(json.dumps([i for i in ids if hasattr(dsalab, i.replace("-", "_"))]))',
].join('\n');
const pyHave = spawnSync('python3', ['-c', probeSrc, JSON.stringify([...new Set(ALGOS.map((a) => a.id))])], { encoding: 'utf8' });
if (pyHave.status !== 0) {
  console.error('Python 探测失败：');
  console.error(pyHave.stderr);
  process.exit(2);
}
const pyIds = new Set(JSON.parse(pyHave.stdout));
const pyCases = cases.filter((c) => pyIds.has(c.algo.id));
const pyPayload = pyCases.map((c) => serialize(c.algo.id, c.input));
const pyExec = spawnSync('python3', [PY], {
  input: `${pyPayload.length}\n${pyPayload.join('\n')}\n`,
  encoding: 'utf8',
  maxBuffer: 32 * 1024 * 1024,
});
if (pyExec.status !== 0) {
  console.error('Python 运行失败：');
  console.error(pyExec.stderr || pyExec.stdout);
  process.exit(2);
}
const pyLines = pyExec.stdout.trimEnd().split('\n');
if (pyLines.length !== pyCases.length) {
  console.error(`Python 输出行数 ${pyLines.length} 和用例数 ${pyCases.length} 对不上`);
  process.exit(2);
}
const pyOf = new Map();
pyCases.forEach((c, i) => pyOf.set(c, pyLines[i]));


// ── 逐条比对 ──────────────────────────────────────────────

let bad = 0;
const perAlgo = new Map();

cases.forEach((c, i) => {
  const jsResult = c.algo.run(c.input).result;
  const js = canonical(c.algo.id, jsResult);
  const java = javaLines[i];
  const py = pyOf.get(c);
  const stat = perAlgo.get(c.algo.id) ?? { ok: 0, fail: 0, py: py !== undefined };
  if (js === java && (py === undefined || py === js)) {
    stat.ok += 1;
  } else {
    stat.fail += 1;
    if (stat.fail <= 2) {
      bad += 1;
      console.error(`✗ ${c.algo.id}［${c.label}］`);
      console.error(`  输入：${serialize(c.algo.id, c.input)}`);
      console.error(`  JS    ：${js}`);
      console.error(`  Java  ：${java}`);
      if (py !== undefined) console.error(`  Python：${py}`);
    }
  }
  perAlgo.set(c.algo.id, stat);
});

console.log(`\n对拍 ${cases.length} 个用例（每个算法每种输入 ${ROUNDS} 轮）\n`);
let pyCount = 0;
for (const [id, s] of perAlgo) {
  const mark = s.fail === 0 ? '✓' : '✗';
  if (s.py) pyCount += 1;
  console.log(`  ${mark} ${id.padEnd(22)} 一致 ${String(s.ok).padStart(4)}   不一致 ${s.fail}   ${s.py ? 'JS/Java/Python' : 'JS/Java'}`);
}
console.log(`\n有 Python 实现的算法：${pyCount}/${perAlgo.size}`);
if (pyCount < perAlgo.size) {
  const missing = [...perAlgo].filter(([, v]) => !v.py).map(([id]) => id);
  console.log(`还没有 Python 版（${missing.length} 个）：${missing.slice(0, 10).join(', ')}${missing.length > 10 ? ' …' : ''}`);
}

if (bad > 0) {
  console.error(`\n对拍失败：${[...perAlgo.values()].reduce((a, b) => a + b.fail, 0)} 个用例结果不一致`);
  process.exit(1);
}
console.log('\n对拍通过：JS / Java / Python 三路在所有用例上结果完全一致');
