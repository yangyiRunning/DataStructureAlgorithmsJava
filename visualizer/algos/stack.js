/**
 * 栈与队列的三个高频用法。
 *
 * 这三个演示都必须在底部把容器画出来——只看指针在数组上动，
 * 根本看不出"栈里存的是下标还是值""队首要弹掉的是谁"，
 * 而那恰恰是这三道题最容易写错的地方。
 */

// ─────────────────────────────────────────────────────────────
// 括号匹配
// ─────────────────────────────────────────────────────────────

const bracketCode = [
  'function isValid(s) {',
  '  const stack = [];',
  '  const pairs = { ")": "(", "]": "[", "}": "{" };',
  '  for (const c of s) {',
  '    if (!(c in pairs)) {',
  '      stack.push(c);            // 左括号入栈',
  '      continue;',
  '    }',
  '    if (stack.pop() !== pairs[c]) return false;',
  '  }',
  '  return stack.length === 0;    // 必须正好清空',
  '}',
];

function brackets(input) {
  const s = [...input];
  const steps = [];
  let cmp = 0;
  const push = (state, note, line) => steps.push({
    state: { chars: s, ...state },
    note,
    line,
    counters: { 比较: cmp },
  });

  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const shown = () => stack.map((c) => ({ text: c }));

  push({ pointers: [{ i: 0, text: 'i' }], container: { label: '栈', items: [] } },
    '左括号入栈，右括号就跟栈顶配对。最后栈必须正好空掉，多了少了都不合法。', 1);

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    push({ compare: [i], pointers: [{ i, text: 'i' }], container: { label: '栈', items: shown() } },
      `读到 ${c}。`, 3);
    cmp += 1;

    if (!(c in pairs)) {
      stack.push(c);
      push({ compare: [i], pointers: [{ i, text: 'i' }], container: { label: '栈', items: shown() } },
        `${c} 是左括号，入栈。`, 5);
      continue;
    }

    const top = stack.pop();
    if (top !== pairs[c]) {
      push(
        { move: [i], pointers: [{ i, text: 'i' }], container: { label: '栈', items: shown() } },
        `${c} 需要 ${pairs[c]}，但栈顶是 ${top === undefined ? '空' : top}，不匹配，返回 false。`,
        8,
      );
      return { steps, result: { ok: 'false' } };
    }
    push({ settled: [i], pointers: [{ i, text: 'i' }], container: { label: '栈', items: shown() } },
      `${c} 和栈顶 ${pairs[c]} 配对，弹掉。`, 7);
  }

  const ok = stack.length === 0;
  push({ container: { label: '栈', items: shown() } },
    ok ? '扫完了，栈正好清空，合法。' : `扫完了但栈里还剩 ${stack.length} 个左括号没配上，不合法。`, 9);
  return { steps, result: { ok: String(ok) } };
}

function bracketInputs() {
  const good = () => {
    const candidates = ['()[]{}', '([{}])', '{[()()]}', '((()))', '(){}[]'];
    return candidates[Math.floor(Math.random() * candidates.length)];
  };
  const bad = () => ['([)]', '(((', ')}', '[]{}}{', '((]]'][Math.floor(Math.random() * 5)];
  return [
    { label: '合法', make: good },
    { label: '不合法', make: bad },
  ];
}

// ─────────────────────────────────────────────────────────────
// 单调栈：每日温度
// ─────────────────────────────────────────────────────────────

const monoCode = [
  'function dailyTemperatures(t) {',
  '  const res = new Array(t.length).fill(0);',
  '  const stack = [];   // 存下标，栈里的温度单调递减',
  '  for (let i = 0; i < t.length; i++) {',
  '    while (stack.length && t[i] > t[stack[stack.length - 1]]) {',
  '      const j = stack.pop();',
  '      res[j] = i - j;   // 等到了更高的温度',
  '    }',
  '    stack.push(i);',
  '  }',
  '  return res;',
  '}',
];

function dailyTemperatures(input) {
  const t = input.slice();
  const steps = [];
  let cmp = 0;
  const push = (state, note, line) => steps.push({
    state: { values: t, ...state },
    note,
    line,
    counters: { 比较: cmp },
  });

  const res = new Array(t.length).fill(0);
  const stack = [];
  const shown = () => stack.map((i) => ({ text: `${i}` }));

  push({ pointers: [{ i: 0, text: 'i' }], container: { label: '栈（下标）', items: [] } },
    '栈里存的是下标，对应的温度从栈底到栈顶单调递减。一旦来了更高的温度，就把栈顶那些等到了的一起弹掉。', 2);

  for (let i = 0; i < t.length; i++) {
    push({ compare: [i], pointers: [{ i, text: 'i' }], container: { label: '栈（下标）', items: shown() } },
      `第 ${i} 天温度 ${t[i]}。`, 3);

    while (stack.length && t[i] > t[stack[stack.length - 1]]) {
      cmp += 1;
      const j = stack.pop();
      res[j] = i - j;
      push(
        {
          compare: [i],
          settled: [j],
          pointers: [{ i, text: 'i' }, { i: j, text: '弹出' }],
          container: { label: '栈（下标）', items: shown() },
        },
        `第 ${j} 天（${t[j]}°）等到了第 ${i} 天的 ${t[i]}°，答案填 ${i - j}。`,
        5,
      );
    }
    stack.push(i);
    push({ compare: [i], pointers: [{ i, text: 'i' }], container: { label: '栈（下标）', items: shown() } },
      `第 ${i} 天入栈，等后面有没有更高的。`, 8);
  }

  push({ pointers: [], container: { label: '栈（下标）', items: shown() } },
    `结束。栈里剩下 ${stack.length} 天下标对应的天数，它们后面没有更高的温度，答案保持 0。`, 10);
  return { steps, result: { arr: res.join(',') } };
}

function tempInputs() {
  const make = () => Array.from({ length: 9 }, () => 20 + Math.floor(Math.random() * 16));
  const fixed = () => [73, 74, 75, 71, 69, 72, 76, 73];
  return [
    { label: '经典用例', make: fixed },
    { label: '随机温度', make },
  ];
}

// ─────────────────────────────────────────────────────────────
// 单调队列：滑动窗口最大值
// ─────────────────────────────────────────────────────────────

const dequeCode = [
  'function maxSlidingWindow(nums, k) {',
  '  const dq = [];   // 存下标，对应值单调递减',
  '  const res = [];',
  '  for (let i = 0; i < nums.length; i++) {',
  '    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();',
  '    dq.push(i);',
  '    if (dq[0] <= i - k) dq.shift();   // 队首出窗口就丢掉',
  '    if (i >= k - 1) res.push(nums[dq[0]]);',
  '  }',
  '  return res;',
  '}',
];

function maxSlidingWindow(input) {
  const { nums, k } = input;
  const steps = [];
  let cmp = 0;
  const push = (state, note, line) => steps.push({
    state: { values: nums, ...state },
    note,
    line,
    counters: { 比较: cmp },
  });

  const dq = [];
  const res = [];
  const shown = () => dq.map((i) => ({ text: `${i}:${nums[i]}` }));

  push({ pointers: [], container: { label: '队列（下标:值）', items: [] } },
    `窗口宽 ${k}。队列里存下标，对应的值从队首到队尾单调递减——所以队首永远是这个窗口的最大值。`, 1);

  for (let i = 0; i < nums.length; i++) {
    push({ window: { lo: Math.max(0, i - k + 1), hi: i }, compare: [i], pointers: [{ i, text: 'i' }], container: { label: '队列（下标:值）', items: shown() } },
      `右边界到 ${i}（值 ${nums[i]}）。`, 3);

    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) {
      cmp += 1;
      const gone = dq.pop();
      push({ window: { lo: Math.max(0, i - k + 1), hi: i }, compare: [i], pointers: [{ i, text: 'i' }, { i: gone, text: '弹出' }], container: { label: '队列（下标:值）', items: shown() } },
        `队尾 ${nums[gone]} 不比新来的 ${nums[i]} 大，它永远不可能再当最大值了，弹掉。`, 4);
    }
    dq.push(i);

    if (dq[0] <= i - k) {
      const out = dq.shift();
      push({ window: { lo: Math.max(0, i - k + 1), hi: i }, pointers: [{ i, text: 'i' }, { i: out, text: '出窗' }], container: { label: '队列（下标:值）', items: shown() } },
        `队首下标 ${out} 已经滑出窗口，丢掉。`, 6);
    } else {
      push({ window: { lo: Math.max(0, i - k + 1), hi: i }, pointers: [{ i, text: 'i' }], container: { label: '队列（下标:值）', items: shown() } },
        `入队。`, 5);
    }

    if (i >= k - 1) {
      res.push(nums[dq[0]]);
      push(
        {
          window: { lo: i - k + 1, hi: i },
          settled: [dq[0]],
          container: { label: '队列（下标:值）', items: shown() },
        },
        `窗口 [${i - k + 1}, ${i}] 已满，最大值是队首的 ${nums[dq[0]]}。`,
        7,
      );
    }
  }

  push({ pointers: [] }, `每个窗口的最大值依次是 ${res.join('，')}。`, 10);
  return { steps, result: { arr: res.join(',') } };
}

function dequeInputs() {
  const make = (k) => () => ({
    nums: Array.from({ length: 8 }, () => 1 + Math.floor(Math.random() * 30)),
    k,
  });
  return [
    { label: 'k = 3', make: make(3) },
    { label: 'k = 4', make: make(4) },
  ];
}

// ─────────────────────────────────────────────────────────────

const charStackLegend = [
  { cls: 'cell', text: '字符' },
  { cls: 'cell is-compare', text: '正在读' },
  { cls: 'cell is-settled', text: '已配对' },
  { cls: 'cell is-move', text: '不匹配' },
];

const numStripLegend = [
  { cls: 'bar', text: '未处理' },
  { cls: 'bar is-compare', text: '当前元素' },
  { cls: 'bar is-settled', text: '已确定答案' },
];

export const stackAlgorithms = [
  {
    id: 'st-brackets',
    group: '栈与队列',
    title: '括号匹配',
    brief: '左括号入栈，右括号跟栈顶配对。两个易错点：栈空时弹栈，以及最后忘了检查栈是不是正好空掉。',
    view: 'array',
    facts: [['时间', 'O(n)'], ['空间', 'O(n)'], ['要点', '最后必须清空']],
    counters: '比较',
    legend: charStackLegend,
    inputs: bracketInputs(),
    code: bracketCode,
    run: brackets,
  },
  {
    id: 'st-monotonic',
    group: '栈与队列',
    title: '单调栈 · 每日温度',
    brief: '栈里存下标，温度从栈底到栈顶单调递减。来了更高的温度就把栈顶那些"等到了的"一次弹完，每个元素只进栈出栈一次。',
    view: 'array',
    facts: [['时间', 'O(n)'], ['空间', 'O(n)'], ['每个元素', '进出栈各一次']],
    counters: '比较',
    legend: numStripLegend,
    inputs: tempInputs(),
    code: monoCode,
    run: dailyTemperatures,
  },
  {
    id: 'st-deque',
    group: '栈与队列',
    title: '单调队列 · 滑动窗口最大值',
    brief: '队列存下标，对应值单调递减，队首就是当前窗口最大值。队尾小的直接弹掉，队首滑出窗口就丢掉，整体 O(n)。',
    view: 'array',
    facts: [['时间', 'O(n)'], ['空间', 'O(k)'], ['对比', '暴力是 O(nk)']],
    counters: '比较',
    legend: numStripLegend,
    inputs: dequeInputs(),
    code: dequeCode,
    run: maxSlidingWindow,
  },
];
