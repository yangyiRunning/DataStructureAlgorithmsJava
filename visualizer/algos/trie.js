/**
 * Trie（字典树）：插入与查询。
 *
 * 两道演示共用一棵树：
 *   - 插入：把词逐字往下走，缺节点就建，最后标"词尾"
 *   - 查询：同样逐字往下走，但"走得到"不等于"有这个词"——
 *     必须落在词尾才算，只走完前缀只能说明 startsWith 成立。
 * 这个区别是 Trie 最容易写错的地方，所以查询演示里两个操作并排给出。
 */

let uid = 0;
const nextId = () => `t${++uid}`;

function makeNode(ch) {
  return { id: nextId(), ch, terminal: false, children: [] };
}

function snap(pool, root) {
  return [...pool.values()].map((n) => ({
    id: n.id,
    ch: n.ch,
    terminal: n.terminal,
    children: n.children.map((c) => c.id),
  }));
}

// ─────────────────────────────────────────────────────────────
// 插入
// ─────────────────────────────────────────────────────────────

const insertCode = [
  'function insert(word) {',
  '  let node = root;',
  '  for (const ch of word) {',
  '    let next = node.children.find((c) => c.ch === ch);',
  '    if (!next) {',
  '      next = newNode(ch);',
  '      node.children.push(next);',
  '    }',
  '    node = next;',
  '  }',
  '  node.terminal = true;   // 标记单词结束',
  '}',
];

function trieInsert(words) {
  const root = makeNode('');
  const pool = new Map([[root.id, root]]);

  const steps = [];
  let created = 0;
  const push = (state, note, line) => steps.push({
    state: { nodes: snap(pool, root), root: root.id, ...state },
    note,
    line,
    counters: { 新建节点: created, 节点总数: pool.size },
  });

  push({ container: { label: '待插入', items: words.map((w) => ({ text: w })) } },
    `空 Trie 只有一个根。依次插入 ${words.map((w) => `"${w}"`).join('、')}。公共前缀会共用节点，这就是 Trie 省空间的原因。`, 0);

  let done = 0;
  for (const word of words) {
    let node = root;
    push({ highlight: [root.id], container: { label: '正在插入', items: [{ text: word.slice(0, 0), hot: true }] } },
      `插入 "${word}"：从根开始。`, 1);

    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      let next = node.children.find((c) => c.ch === ch);
      const existed = Boolean(next);
      if (!next) {
        next = makeNode(ch);
        pool.set(next.id, next);
        node.children.push(next);
        created += 1;
      }
      push(
        {
          highlight: [next.id],
          done: [...pool.values()].filter((n) => n.terminal).map((n) => n.id),
          container: { label: '正在插入', items: [{ text: word.slice(0, i + 1), hot: true }] },
        },
        existed
          ? `"${word.slice(0, i + 1)}" 这条路径已存在（和前面的词共用），直接往下走。`
          : `没有 ${ch} 这个孩子，新建一个节点。`,
        existed ? 4 : 6,
      );
      node = next;
    }

    node.terminal = true;
    done += 1;
    push(
      {
        highlight: [node.id],
        done: [...pool.values()].filter((n) => n.terminal).map((n) => n.id),
        container: { label: '已插入', items: words.slice(0, done).map((w) => ({ text: w })) },
      },
      `"${word}" 走完了，把最后一个节点标成词尾——这一步不能省，否则它只是个前缀。`,
      9,
    );
  }

  push({ container: { label: '已插入', items: words.map((w) => ({ text: w })) } },
    `插入完成。共 ${pool.size} 个节点存下 ${words.length} 个词，公共前缀只存了一份。`, 10);
  return { steps, result: { nodes: pool.size, terminals: words.length } };
}

// ─────────────────────────────────────────────────────────────
// 查询：search 与 startsWith
// ─────────────────────────────────────────────────────────────

const searchCode = [
  'function search(word) {',
  '  let node = root;',
  '  for (const ch of word) {',
  '    const next = node.children.find((c) => c.ch === ch);',
  '    if (!next) return false;',
  '    node = next;',
  '  }',
  '  return node.terminal;   // 只走到前缀不算找到',
  '}',
];

const prefixCode = [
  'function startsWith(prefix) {',
  '  let node = root;',
  '  for (const ch of prefix) {',
  '    const next = node.children.find((c) => c.ch === ch);',
  '    if (!next) return false;',
  '    node = next;',
  '  }',
  '  return true;    // 走到就行，不要求是词尾',
  '}',
];

const FIXED_WORDS = ['cat', 'car', 'dog'];

function buildFixedTrie() {
  const root = makeNode('');
  const pool = new Map([[root.id, root]]);
  for (const word of FIXED_WORDS) {
    let node = root;
    for (const ch of word) {
      let next = node.children.find((c) => c.ch === ch);
      if (!next) {
        next = makeNode(ch);
        pool.set(next.id, next);
        node.children.push(next);
      }
      node = next;
    }
    node.terminal = true;
  }
  return { root, pool };
}

function trieQuery(input) {
  const { word, mode } = input;
  const { root, pool } = buildFixedTrie();

  const steps = [];
  let depth = 0;
  const push = (state, note, line) => steps.push({
    state: {
      nodes: snap(pool, root),
      root: root.id,
      done: [...pool.values()].filter((n) => n.terminal).map((n) => n.id),
      ...state,
    },
    note,
    line,
    counters: { 走了几步: depth },
  });

  push({ container: { label: '已建好', items: FIXED_WORDS.map((w) => ({ text: w })) } },
    `树里已有 ${FIXED_WORDS.join('、')}。现在 ${mode === 'search' ? '查有没有这个词' : '查有没有这个前缀'}："${word}"。`, 0);

  let node = root;
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    const next = node.children.find((c) => c.ch === ch);
    depth += 1;
    if (!next) {
      push({ highlight: [node.id] },
        `${ch} 这个分支不存在，直接返回 false。`, 4);
      return { steps, code: mode === 'search' ? searchCode : prefixCode, result: { ok: 'false' } };
    }
    push({ highlight: [next.id] }, `沿着 ${ch} 往下走，到节点 ${next.ch}。`, 5);
    node = next;
  }

  if (mode === 'search') {
    const found = node.terminal;
    push(
      { highlight: [node.id], done: [...pool.values()].filter((n) => n.terminal).map((n) => n.id) },
      found
        ? `走完了整个词，这个节点标着词尾，所以 "${word}" 存在。`
        : `走得到这个节点，但它没有词尾标记——"${word}" 只是个前缀，不算一个词。`,
      7,
    );
    return { steps, code: searchCode, result: { ok: String(found) } };
  }

  push({ highlight: [node.id] }, `前缀 "${word}" 存在（不要求它是完整单词）。`, 7);
  return { steps, code: prefixCode, result: { ok: 'true' } };
}

// ─────────────────────────────────────────────────────────────

const trieLegend = [
  { cls: 'tnode', text: '普通节点' },
  { cls: 'tnode is-active', text: '当前节点' },
  { cls: 'tnode is-visited', text: '词尾节点' },
];

export const trieAlgorithms = [
  {
    id: 'trie-insert',
    group: '树',
    title: 'Trie 插入',
    brief: '每个节点是一个字符，从根往下拼。公共前缀共用节点，所以 cat / car 只多出最后那个 r。最后一步必须打词尾标记，否则它只是个前缀。',
    view: 'trie',
    facts: [['时间', '插入 / 查找都 O(词长)'], ['空间', 'O(总字符数)'], ['优势', '前缀共用']],
    counters: '新建节点、节点总数',
    legend: trieLegend,
    inputs: [
      { label: 'cat / car / dog', make: () => ['cat', 'car', 'dog'] },
      { label: '带更短前缀的', make: () => ['do', 'dog', 'dot'] },
    ],
    code: insertCode,
    run: trieInsert,
  },
  {
    id: 'trie-query',
    group: '树',
    title: 'Trie 查询：search 与 startsWith',
    brief: '两个操作走法完全一样，只差最后一步：search 要求落在词尾，startsWith 走到就行。写错这一处，前缀就会被当成完整的词返回。',
    view: 'trie',
    facts: [['时间', 'O(词长)'], ['空间', 'O(1) 额外'], ['易错', '词尾判断']],
    counters: '走了几步',
    legend: trieLegend,
    inputs: [
      { label: 'search("car")', make: () => ({ word: 'car', mode: 'search' }) },
      { label: 'search("ca") —— 只是前缀', make: () => ({ word: 'ca', mode: 'search' }) },
      { label: 'startsWith("ca")', make: () => ({ word: 'ca', mode: 'prefix' }) },
      { label: 'search("cow") —— 不存在', make: () => ({ word: 'cow', mode: 'search' }) },
    ],
    code: searchCode,
    run: trieQuery,
  },
];
