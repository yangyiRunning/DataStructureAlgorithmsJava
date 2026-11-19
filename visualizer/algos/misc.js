/**
 * 三个"换个角度看问题"的专题：位运算、字符串匹配、递归。
 *
 * 放在一个文件里是因为它们各自只有一个演示，单独开文件反而零碎；
 * 分组仍然分开（位运算 / 字符串 / 递归分治），左侧目录看得出归属。
 */

// ─────────────────────────────────────────────────────────────
// 位运算：只出现一次的数字
// ─────────────────────────────────────────────────────────────

const xorCode = [
  'function singleNumber(nums) {',
  '  let ans = 0;',
  '  for (const x of nums) {',
  '    ans ^= x;        // 异或：相同为 0，不同为 1',
  '  }',
  '  return ans;',
  '}',
];

function singleNumber(nums) {
  const steps = [];
  let ans = 0;
  const push = (state, note, line) => steps.push({
    state: {
      values: nums,
      container: { label: '异或累计', items: [{ text: `0b${ans.toString(2)}`, hot: true }] },
      ...state,
    },
    note,
    line,
    counters: { 异或次数: 0 },
  });

  push({}, `每个数都出现两次，只有一个出现一次。把所有数异或起来：相同的成对抵消成 0，剩下的就是答案。`, 0);

  let ops = 0;
  for (let i = 0; i < nums.length; i++) {
    const before = ans;
    ans ^= nums[i];
    ops += 1;
    push(
      {
        current: i,
        settled: Array.from({ length: i + 1 }, (_, k) => k),
        container: { label: '异或累计', items: [{ text: `0b${ans.toString(2)}`, hot: true }] },
      },
      `${before} ^ ${nums[i]} = ${ans}。（二进制 ${before.toString(2)} ^ ${nums[i].toString(2)} = ${ans.toString(2)}）`,
      3,
    );
  }

  push({}, `结果 ${ans}。整个过程 O(n) 时间、O(1) 空间，没用哈希表——异或的"自己异或自己是 0"正好对付成对的数。`, 5);
  return { steps, result: { ans } };
}

function xorInputs() {
  const pair = () => {
    const once = 1 + Math.floor(Math.random() * 30);
    const a = 1 + Math.floor(Math.random() * 30);
    const b = 1 + Math.floor(Math.random() * 30);
    const arr = [a, a, b, b, once];
    // 打乱，避免"单个的正好在最后"
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  return [
    { label: '经典 4,1,2,1,2', make: () => [4, 1, 2, 1, 2] },
    { label: '随机一组', make: pair },
  ];
}

// ─────────────────────────────────────────────────────────────
// 位运算：子集枚举
// ─────────────────────────────────────────────────────────────

const maskCode = [
  'function subsetsByMask(nums) {',
  '  const n = nums.length;',
  '  const res = [];',
  '  for (let mask = 0; mask < (1 << n); mask++) {   // 0 到 2^n - 1',
  '    const pick = [];',
  '    for (let i = 0; i < n; i++) {',
  '      if (mask & (1 << i)) pick.push(nums[i]);     // 第 i 位是 1 就选它',
  '    }',
  '    res.push(pick);',
  '  }',
  '  return res;',
  '}',
];

function subsetsByMask(nums) {
  const n = nums.length;
  const total = 1 << n;
  const steps = [];
  let count = 0;

  const push = (state, note, line) => steps.push({
    state: { values: nums, ...state },
    note,
    line,
    counters: { 子集数: count },
  });

  const bits = (m) => m.toString(2).padStart(n, '0');

  push({ container: { label: '掩码', items: [{ text: bits(0), hot: true }] } },
    `${n} 个元素一共有 2^${n} = ${total} 个子集。用 0 到 ${total - 1} 的每个整数代表一个子集：第 i 位是 1 就表示选第 i 个元素。`, 3);

  for (let mask = 0; mask < total; mask++) {
    const pick = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) pick.push(i);
    }
    count += 1;
    push(
      {
        settled: pick,
        ...(pick.length ? { pivot: pick[pick.length - 1] } : {}),
        container: { label: '掩码', items: [{ text: bits(mask), hot: true }, { text: pick.map((i) => nums[i]).join('') || '∅' }] },
      },
      `掩码 ${bits(mask)}（十进制 ${mask}）对应子集 [${pick.map((i) => nums[i]).join(' ') || '空'}]。`,
      mask === 0 ? 4 : 6,
    );
  }

  push({ settled: nums.map((_, i) => i), container: { label: '掩码', items: [{ text: `${total} 个`, hot: true }] } },
    `枚举完，共 ${count} 个子集。这就是 LeetCode 78 的另一种写法，也是状压 DP 的基础。`, 9);
  return { steps, result: { count } };
}

function maskInputs() {
  return [
    { label: '3 个元素', make: () => [1, 2, 3] },
    { label: '4 个元素', make: () => [1, 2, 3, 4] },
  ];
}

// ─────────────────────────────────────────────────────────────
// KMP
// ─────────────────────────────────────────────────────────────

const kmpCode = [
  'function buildNext(p) {',
  '  const next = new Array(p.length).fill(0);',
  '  let k = 0;                       // 当前最长相等前后缀长度',
  '  for (let i = 1; i < p.length; i++) {',
  '    while (k > 0 && p[i] !== p[k]) k = next[k - 1];   // 失配就回退',
  '    if (p[i] === p[k]) k++;',
  '    next[i] = k;',
  '  }',
  '  return next;',
  '}',
  'function kmp(s, p) {',
  '  const next = buildNext(p);',
  '  let j = 0;',
  '  for (let i = 0; i < s.length; i++) {',
  '    while (j > 0 && s[i] !== p[j]) j = next[j - 1];',
  '    if (s[i] === p[j]) j++;',
  '    if (j === p.length) return i - j + 1;   // 匹配完成',
  '  }',
  '  return -1;',
  '}',
];

function kmp(input) {
  const { s, p } = input;
  const steps = [];
  let cmp = 0;

  const push = (state, note, line) => steps.push({
    state,
    note,
    line,
    counters: { 比较: cmp },
  });

  const next = new Array(p.length).fill(0);

  push(
    { chars: [...p], compare: [], container: { label: 'next', items: p.split('').map((_, i) => ({ text: `${i}:${next[i]}` })) } },
    `先给模式串 "${p}" 建 next 数组：next[i] 是"前 i+1 个字符里，最长相等前后缀的长度"。它的作用是指出失配时该退到哪。`,
    1,
  );

  let k = 0;
  for (let i = 1; i < p.length; i++) {
    while (k > 0 && p[i] !== p[k]) {
      cmp += 1;
      push(
        {
          chars: [...p], current: i, compare: [i, k],
          container: { label: 'next', items: p.split('').map((_, x) => ({ text: `${x}:${next[x]}`, hot: x === i })) },
        },
        `p[${i}]="${p[i]}" 和 p[${k}]="${p[k]}" 不等，回退 k = next[${k - 1}] = ${next[k - 1]}。`,
        5,
      );
      k = next[k - 1];
    }
    if (p[i] === p[k]) k += 1;
    next[i] = k;
    push(
      {
        chars: [...p], current: i, settled: [i],
        container: { label: 'next', items: p.split('').map((_, x) => ({ text: `${x}:${next[x]}`, hot: x === i })) },
      },
      `next[${i}] = ${k}。前后缀能对上 ${k} 个字符。`,
      7,
    );
  }

  // 匹配阶段
  const text = [...s];
  let j = 0;
  for (let i = 0; i < text.length; i++) {
    while (j > 0 && text[i] !== p[j]) {
      cmp += 1;
      push(
        {
          chars: text, current: i, compare: [i],
          container: { label: 'next', items: p.split('').map((_, x) => ({ text: `${x}:${next[x]}`, hot: x === j }) ) },
        },
        `主串 ${i} 处失配，模式串指针从 ${j} 退到 next[${j - 1}] = ${next[j - 1]}，主串指针不动——这就是 KMP 比暴力快的根本原因。`,
        16,
      );
      j = next[j - 1];
    }
    if (text[i] === p[j]) j += 1;
    push(
      {
        chars: text, current: i, compare: j > 0 ? [i] : [],
        container: { label: '已匹配', items: p.split('').slice(0, j).map((c) => ({ text: c })) },
      },
      `主串第 ${i} 个字符 "${text[i]}"，模式串已匹配 ${j} 个。`,
      17,
    );
    if (j === p.length) {
      push({ chars: text, settled: Array.from({ length: p.length }, (_, x) => i - j + 1 + x), container: { label: '已匹配', items: p.split('').map((c) => ({ text: c })) } },
        `模式串走完，在位置 ${i - j + 1} 匹配上了。`, 18);
      return { steps, result: { idx: i - j + 1 } };
    }
  }

  push({ chars: text }, '主串扫完了也没匹配上，返回 -1。', 18);
  return { steps, result: { idx: -1 } };
}

function kmpInputs() {
  return [
    { label: 'abababc 找 ababc', make: () => ({ s: 'abababc', p: 'ababc' }) },
    { label: 'aabaabaaa 找 aabaa', make: () => ({ s: 'aabaabaaa', p: 'aabaa' }) },
    { label: '找不到', make: () => ({ s: 'abcabcabc', p: 'cabx' }) },
  ];
}

// ─────────────────────────────────────────────────────────────
// 汉诺塔
// ─────────────────────────────────────────────────────────────

const hanoiCode = [
  'function hanoi(n, from, to, via) {',
  '  if (n === 0) return;',
  '  hanoi(n - 1, from, via, to);        // 先把上面 n-1 个挪开',
  '  move(n, from, to);                  // 把最大的挪过去',
  '  hanoi(n - 1, via, to, from);        // 再把 n-1 个摞上去',
  '}',
];

function hanoi(n) {
  const pegs = [Array.from({ length: n }, (_, i) => n - i), [], []];
  const steps = [];
  let moves = 0;
  const names = ['A', 'B', 'C'];

  const push = (state, note, line) => steps.push({
    state: { pegs: pegs.map((p) => p.slice()), names, total: n, ...state },
    note,
    line,
    counters: { 移动次数: moves },
  });

  push({ container: { label: '目标', items: [{ text: `把 ${n} 个从 A 移到 C` }] } },
    `${n} 个盘从 A 移到 C，每次只能移一个、大盘不能压小盘。递归思路：先把上面 n-1 个挪到 B，把最大的挪到 C，再把那 n-1 个挪到 C。`, 0);

  const rec = (cnt, from, to, via) => {
    if (cnt === 0) return;
    rec(cnt - 1, from, via, to);
    const disk = pegs[from].pop();
    pegs[to].push(disk);
    moves += 1;
    push({ moving: [disk], container: { label: '第几步', items: [{ text: String(moves) }] } },
      `把 ${disk} 号盘从 ${names[from]} 挪到 ${names[to]}。`, 3);
    rec(cnt - 1, via, to, from);
  };

  rec(n, 0, 2, 1);

  push({ container: { label: '总步数', items: [{ text: String(moves) }] } },
    `完成，共 ${moves} 步（2^${n} - 1 = ${Math.pow(2, n) - 1}）。递归的移动次数是 2^n-1，所以 n 大一点就算不动了。`, 4);
  return { steps, result: { moves } };
}

function hanoiInputs() {
  return [
    { label: '3 个盘', make: () => 3 },
    { label: '4 个盘', make: () => 4 },
  ];
}


// ─────────────────────────────────────────────────────────────
// 验证回文串
// ─────────────────────────────────────────────────────────────

const palinCode = [
  'function isPalindrome(s) {',
  '  let i = 0, j = s.length - 1;',
  '  while (i < j) {',
  '    if (s[i] !== s[j]) return false;',
  '    i++; j--;              // 两端同时往中间收',
  '  }',
  '  return true;',
  '}',
];

function palindrome(input) {
  const chars = [...input];
  const steps = [];
  let cmp = 0;

  const push = (state, note, line) => steps.push({
    state: { chars, ...state },
    note,
    line,
    counters: { 比较: cmp },
  });

  push({ pointers: [{ i: 0, text: 'i' }, { i: chars.length - 1, text: 'j' }] },
    '两边指针往中间收，每次比较一对。只要有一对不相等就不是回文。', 0);

  let i = 0;
  let j = chars.length - 1;
  while (i < j) {
    cmp += 1;
    push({ compare: [i, j], pointers: [{ i, text: 'i' }, { i: j, text: 'j' }] },
      `比较 ${chars[i]} 和 ${chars[j]}。`, 3);
    if (chars[i] !== chars[j]) {
      push({ move: [i, j], pointers: [{ i, text: 'i' }, { i: j, text: 'j' }] },
        `${chars[i]} ≠ ${chars[j]}，不是回文，返回 false。`, 2);
      return { steps, result: { ok: 'false' } };
    }
    i += 1;
    j -= 1;
    push({ settled: Array.from({ length: i }, (_, k) => k).concat(Array.from({ length: chars.length - j - 1 }, (_, k) => j + 1 + k)) },
      '这一对相等，两边各收一格。', 4);
  }

  push({ settled: chars.map((_, k) => k) }, '指针相遇了还没发现不等，是回文。', 6);
  return { steps, result: { ok: 'true' } };
}

function palinInputs() {
  return [
    { label: 'racecar', make: () => 'racecar' },
    { label: 'abccba', make: () => 'abccba' },
    { label: 'abcade', make: () => 'abcade' },
  ];
}

// ─────────────────────────────────────────────────────────────

const bitLegend = [
  { cls: 'bar', text: '原数组' },
  { cls: 'bar is-settled', text: '已参与' },
  { cls: 'bar is-pivot', text: '本次选中' },
];

export const miscAlgorithms = [
  {
    id: 'bit-single-number',
    group: '位运算',
    title: '异或 · 只出现一次的数字',
    brief: '所有数异或一遍：成对的自己抵消成 0，剩下的就是那个单独的。不用哈希表，O(n) 时间 O(1) 空间——靠的是异或的三条性质。',
    view: 'array',
    facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['性质', 'a^a=0, a^0=a'], ['前提', '只有一个数出现奇数次']],
    counters: '异或次数',
    legend: bitLegend,
    inputs: xorInputs(),
    code: xorCode,
    run: singleNumber,
  },
  {
    id: 'bit-subset-mask',
    group: '位运算',
    title: '子集枚举（掩码）',
    brief: '0 到 2^n-1 的每个整数就是一个子集：第 i 位是 1 表示选第 i 个元素。这是状压 DP 的基础写法。',
    view: 'array',
    facts: [['时间', 'O(2^n · n)'], ['空间', 'O(n)'], ['映射', '整数 ↔ 子集'], ['用途', '状压 DP']],
    counters: '子集数',
    legend: bitLegend,
    inputs: maskInputs(),
    code: maskCode,
    run: subsetsByMask,
  },
  {
    id: 'str-kmp',
    group: '字符串',
    title: 'KMP 字符串匹配',
    brief: 'next 数组记下"失配时该退到哪"，让主串指针永不回退。暴力匹配是 O(mn)，KMP 是 O(m+n)，差别全在失配后的那一步。',
    view: 'array',
    facts: [['时间', 'O(m+n)'], ['空间', 'O(n)'], ['核心', 'next 数组'], ['对比', '暴力 O(mn)']],
    counters: '比较',
    legend: [
      { cls: 'cell', text: '字符' },
      { cls: 'cell is-active', text: '当前位置' },
      { cls: 'cell is-settled', text: '已匹配' },
      { cls: 'cell is-compare', text: '失配位置' },
    ],
    inputs: kmpInputs(),
    code: kmpCode,
    run: kmp,
  },
  {
    id: 'rec-hanoi',
    group: '递归分治',
    title: '汉诺塔',
    brief: '三步：把上面 n-1 个挪到中转柱、把最大的挪到目标柱、再把那 n-1 个挪过去。移动次数 2^n-1，递归的经典入门。',
    view: 'pegs',
    facts: [['时间', 'O(2^n)'], ['空间', 'O(n) 递归栈'], ['步数', '2^n - 1'], ['要点', '递归三步走']],
    counters: '移动次数',
    legend: [],
    inputs: hanoiInputs(),
    code: hanoiCode,
    run: hanoi,
  },
  {
    id: 'str-palindrome',
    group: '字符串',
    title: '验证回文串',
    brief: '首尾各一个指针往中间收，逐个比较。一旦有一对不相等就返回 false，全部对上都相等就是回文。O(n) 一趟，不需要额外空间。',
    view: 'array',
    facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['技巧', '双端收缩'], ['变体', '忽略大小写和标点']],
    counters: '比较',
    legend: [
      { cls: 'cell', text: '字符' },
      { cls: 'cell is-compare', text: '正在比较的一对' },
      { cls: 'cell is-settled', text: '已确认相等' },
      { cls: 'cell is-move', text: '不相等' },
    ],
    inputs: palinInputs(),
    code: palinCode,
    run: palindrome,
  },
];
