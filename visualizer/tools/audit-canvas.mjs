/**
 * 体检：每个演示的每一帧，视图到底有没有东西可画。
 *
 * 之前出过"画面全空"的事故——演示只往 state 里塞了 container / note，
 * 没给 values / chars / cells，视图拿不到主内容就画了个空白画布。
 * 自检查的是轨迹的不变量，查不出"画出来是空的"这种问题。
 */
import { sortingAlgorithms } from '../algos/sorting.js';
import { binarySearchAlgorithms } from '../algos/binarysearch.js';
import { linkedListAlgorithms } from '../algos/linkedlist.js';
import { twoPointerAlgorithms } from '../algos/twopointers.js';
import { stackAlgorithms } from '../algos/stack.js';
import { treeAlgorithms } from '../algos/tree.js';
import { trieAlgorithms } from '../algos/trie.js';
import { unionFindAlgorithms } from '../algos/unionfind.js';
import { dpAlgorithms } from '../algos/dp.js';
import { dpOneDAlgorithms } from '../algos/dp2.js';
import { backtrackingAlgorithms } from '../algos/backtracking.js';
import { heapAlgorithms } from '../algos/heap.js';
import { graphAlgorithms } from '../algos/graph.js';
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

const ALL = [
  ...sortingAlgorithms, ...binarySearchAlgorithms, ...linkedListAlgorithms,
  ...twoPointerAlgorithms, ...stackAlgorithms, ...treeAlgorithms, ...trieAlgorithms,
  ...unionFindAlgorithms, ...dpAlgorithms, ...dpOneDAlgorithms, ...backtrackingAlgorithms,
  ...heapAlgorithms, ...graphAlgorithms, ...arrayTechAlgorithms, ...miscAlgorithms,
  ...hashAlgorithms, ...advancedTreeAlgorithms, ...leetcodeAlgorithms, ...leetcode2Algorithms,
  ...leetcode3Algorithms, ...leetcode4Algorithms, ...leetcode5Algorithms, ...leetcode6Algorithms,
  ...leetcode7Algorithms, ...leetcode8Algorithms, ...leetcode9Algorithms, ...leetcode10Algorithms,
  ...leetcode11Algorithms,
];

/** 每种视图靠什么才算"有主内容" */
const NEED = {
  array: (s) => (s.values?.length ?? 0) > 0 || (s.chars?.length ?? 0) > 0,
  table: (s) => (s.cells?.length ?? 0) > 0,
  tree: (s) => (s.nodes?.length ?? 0) > 0,
  list: (s) => (s.nodes?.length ?? 0) > 0 || (s.rows?.length ?? 0) > 0,
  graph: (s) => (s.nodes?.length ?? 0) > 0,
  board: (s) => (s.grid?.length ?? 0) > 0 || (s.queens?.length ?? 0) > 0 || (s.n ?? 0) > 0,
  heap: (s) => (s.values?.length ?? 0) > 0,
  trie: (s) => (s.nodes?.length ?? 0) > 0 || (s.words?.length ?? 0) > 0,
  uf: (s) => (s.elements?.length ?? 0) > 0,
  hash: (s) => (s.buckets?.length ?? 0) > 0,
  pegs: (s) => (s.pegs?.length ?? 0) > 0,
};

let bad = 0;
for (const algo of ALL) {
  const check = NEED[algo.view];
  if (!check) { console.log(`? 未知视图 ${algo.view}：${algo.id}`); bad++; continue; }
  for (const input of algo.inputs) {
    const { steps } = algo.run(input.make());
    const empty = steps.filter((st) => !check(st.state ?? {}));
    // 起始帧结构本来就是空的（空栈、空树），页面上会画"当前状态为空"，
    // 不算错；真正要拦的是"整段都没内容"。
    if (empty.length === steps.length && steps.length > 0) {
      console.log(`✗ ${algo.id.padEnd(26)} ${empty.length}/${steps.length} 帧没有主内容（全空）`);
      bad++;
      break;
    }
  }
}

console.log(bad === 0 ? `\n全部 ${ALL.length} 个演示都有可画的内容` : `\n共 ${bad} 个演示整段没有内容`);
process.exit(bad === 0 ? 0 : 1);
