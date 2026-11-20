/**
 * 从 python/dsalab.py 里抽出每个算法函数的源码，生成 python/snippets.json。
 *
 * 这样一来：
 *   - 代码栏切到 Python 时显示的就是真正在跑的源码，不存在"文档版本"和"运行版本"两套；
 *   - 对拍用的也是同一份文件，改了源码两边一起变，不会漏。
 *
 * 函数名约定：演示 id 把短横线换成下划线（sort-bubble -> sort_bubble）。
 *
 * 用法：node tools/gen-py-snippets.mjs
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

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

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const PY = join(ROOT, 'python/dsalab.py');
const OUT = join(ROOT, 'python/snippets.json');

const ALL = [
  ...sortingAlgorithms, ...binarySearchAlgorithms, ...linkedListAlgorithms,
  ...twoPointerAlgorithms, ...stackAlgorithms, ...treeAlgorithms,
  ...trieAlgorithms, ...unionFindAlgorithms, ...dpAlgorithms, ...dpOneDAlgorithms,
  ...backtrackingAlgorithms, ...heapAlgorithms, ...graphAlgorithms,
  ...arrayTechAlgorithms, ...miscAlgorithms, ...hashAlgorithms, ...advancedTreeAlgorithms,
  ...leetcodeAlgorithms,
];

const wanted = ALL.map((a) => ({ id: a.id, fn: a.id.replace(/-/g, '_') }));

const py = `
import inspect, json, sys
sys.path.insert(0, r"""${dirname(PY)}""")
import dsalab

names = json.loads(sys.argv[1])
out = {}
missing = []
for algo_id, fn in names:
    f = getattr(dsalab, fn, None)
    if f is None:
        missing.append(fn)
        continue
    out[algo_id] = inspect.getsource(f).rstrip()
print(json.dumps({"snippets": out, "missing": missing}, ensure_ascii=False))
`;

const r = spawnSync('python3', ['-c', py, JSON.stringify(wanted.map((w) => [w.id, w.fn]))], {
  encoding: 'utf8',
});
if (r.status !== 0) {
  console.error(r.stderr);
  process.exit(1);
}

const data = JSON.parse(r.stdout);
writeFileSync(OUT, JSON.stringify(data.snippets, null, 2) + '\n', 'utf8');

const total = wanted.length;
const have = Object.keys(data.snippets).length;
console.log(`已生成 python/snippets.json：${have}/${total} 个演示有 Python 版`);
if (data.missing.length) {
  console.log(`还没写的（${data.missing.length} 个）：${data.missing.slice(0, 12).join(', ')}${data.missing.length > 12 ? ' …' : ''}`);
}
if (!existsSync(OUT)) process.exit(1);
