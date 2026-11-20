/**
 * LeetCode 高频题（第六批，扩充到 100 道的第一批）。
 *
 * 这批都是数组 / 字符串的常考基础题，全部复用数组视图（含字符模式）。
 */

const L = [
  { cls: 'bar', text: '元素' },
  { cls: 'bar is-compare', text: '正在看' },
  { cls: 'bar is-pivot', text: '当前处理' },
  { cls: 'bar is-settled', text: '已确定' },
];

// ── 217. 存在重复元素 ────────────────────────────────────
const dupCode = [
  'function containsDuplicate(nums) {',
  '  const seen = new Set();',
  '  for (const x of nums) {',
  '    if (seen.has(x)) return true;',
  '    seen.add(x);',
  '  }',
  '  return false;',
  '}',
];

function containsDuplicate(nums) {
  const seen = new Set();
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { values: nums, container: { label: '已见', items: [...seen].map((v) => ({ text: String(v) })) }, ...state },
    note, line, counters: { 已见: seen.size },
  });

  push({}, '边扫边把见过的数记进集合。一旦撞上，就说明有重复。', 0);
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(nums[i])) {
      push({ compare: [i] }, `${nums[i]} 之前出现过，返回 true。`, 3);
      return { steps, result: { ok: 'true' } };
    }
    seen.add(nums[i]);
    push({ current: i, settled: [i] }, `${nums[i]} 第一次出现，记下来。`, 4);
  }
  push({}, '扫完都没有重复。', 6);
  return { steps, result: { ok: 'false' } };
}

// ── 169. 多数元素 ────────────────────────────────────────
const majorityCode = [
  'function majorityElement(nums) {',
  '  let cand = nums[0], count = 0;',
  '  for (const x of nums) {',
  '    if (count === 0) cand = x;      // 换候选人',
  '    count += x === cand ? 1 : -1;',
  '  }',
  '  return cand;',
  '}',
];

function majorityElement(nums) {
  const steps = [];
  let cand = nums[0];
  let count = 0;
  const push = (state, note, line) => steps.push({
    state: { values: nums, container: { label: '候选 / 计数', items: [{ text: `${cand}`, hot: true }, { text: String(count) }] }, ...state },
    note, line, counters: { 抵消: 0 },
  });

  push({}, '摩尔投票：不同的数两两抵消，剩下的那个一定是多数元素。O(n) 时间 O(1) 空间。', 0);
  for (let i = 0; i < nums.length; i++) {
    if (count === 0) cand = nums[i];
    count += nums[i] === cand ? 1 : -1;
    push({ current: i, pivot: i }, `${nums[i]}：${nums[i] === cand ? `和候选相同，计数 ${count}` : `不同，抵消一次，计数 ${count}`}。`, 3);
  }
  push({}, `多数元素是 ${cand}。`, 6);
  return { steps, result: { num: cand } };
}

// ── 268. 丢失的数字 ──────────────────────────────────────
const missingNumberCode = [
  'function missingNumber(nums) {',
  '  let x = nums.length;              // 0..n 一共 n+1 个数',
  '  for (let i = 0; i < nums.length; i++) x ^= i ^ nums[i];',
  '  return x;',
  '}',
];

function missingNumber(nums) {
  const steps = [];
  let x = nums.length;
  const push = (state, note, line) => steps.push({
    state: { values: nums, container: { label: '异或累计', items: [{ text: String(x), hot: true }] }, ...state },
    note, line, counters: { 步数: 0 },
  });

  push({}, '下标和值全部异或起来：成对的抵消，剩下的就是少掉的那个。', 0);
  for (let i = 0; i < nums.length; i++) {
    x ^= i ^ nums[i];
    push({ current: i }, `异或 i=${i} 和 nums[${i}]=${nums[i]}，累计 ${x}。`, 2);
  }
  push({}, `缺失的数字是 ${x}。`, 3);
  return { steps, result: { num: x } };
}

// ── 27. 移除元素 ────────────────────────────────────────
const removeElementCode = [
  'function removeElement(nums, val) {',
  '  let slow = 0;',
  '  for (let fast = 0; fast < nums.length; fast++) {',
  '    if (nums[fast] !== val) { nums[slow] = nums[fast]; slow++; }',
  '  }',
  '  return slow;',
  '}',
];

function removeElement(input) {
  const { nums, val } = input;
  const a = nums.slice();
  const steps = [];
  let slow = 0;
  const push = (state, note, line) => steps.push({
    state: { values: a.slice(), ...state },
    note, line, counters: { 保留: slow },
  });

  push({ pointers: [{ i: 0, text: 'slow' }] }, `删掉所有等于 ${val} 的元素，剩下的前 slow 个就是答案。快指针扫，慢指针写。`, 0);
  for (let fast = 0; fast < a.length; fast++) {
    push({ compare: [fast], pointers: [{ i: slow, text: 'slow' }, { i: fast, text: 'fast' }] }, `看 ${a[fast]}。`, 3);
    if (a[fast] !== val) {
      a[slow] = a[fast];
      slow += 1;
      push({ move: [slow - 1], pointers: [{ i: slow, text: 'slow' }], settled: Array.from({ length: slow }, (_, k) => k) }, `不等于 ${val}，写回。`, 3);
    }
  }
  push({ settled: Array.from({ length: slow }, (_, k) => k) }, `剩下 ${slow} 个元素。`, 5);
  return { steps, result: { len: slow, arr: a.slice(0, slow).join(',') } };
}

// ── 88. 合并两个有序数组 ────────────────────────────────
const mergeSortedCode = [
  'function merge(nums1, m, nums2, n) {',
  '  let i = m - 1, j = n - 1, k = m + n - 1;',
  '  while (j >= 0) {',
  '    if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];',
  '    else nums1[k--] = nums2[j--];',
  '  }',
  '}',
];

function mergeSorted(input) {
  const { a, m, b, n } = input;
  const nums = a.slice();
  const steps = [];
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;
  const push = (state, note, line) => steps.push({
    state: { values: nums.slice(), ...state },
    note, line, counters: { 写入: 0 },
  });

  push({ pointers: [{ i, text: 'i' }, { i: m, text: 'j' }, { i: k, text: 'k' }] },
    'nums1 后面留了空位，所以从后往前填——这样不用搬动前面的元素。', 0);
  while (j >= 0) {
    if (i >= 0 && nums[i] > b[j]) {
      nums[k] = nums[i];
      i -= 1;
    } else {
      nums[k] = b[j];
      j -= 1;
    }
    push({ move: [k], pointers: [{ i: Math.max(i, 0), text: 'i' }, { i: Math.max(j, 0), text: 'j' }] }, `填好位置 ${k}。`, 3);
    k -= 1;
  }
  push({ settled: nums.map((_, x) => x) }, `合并结果：${nums.join(', ')}。`, 5);
  return { steps, result: { arr: nums.join(',') } };
}

// ── 66. 加一 ────────────────────────────────────────────
const plusOneCode = [
  'function plusOne(digits) {',
  '  for (let i = digits.length - 1; i >= 0; i--) {',
  '    if (digits[i] < 9) { digits[i]++; return digits; }',
  '    digits[i] = 0;                  // 9 + 1 进位',
  '  }',
  '  digits.unshift(1);                // 全是 9，前面补 1',
  '  return digits;',
  '}',
];

function plusOne(digits) {
  const a = digits.slice();
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { values: a.slice(), ...state },
    note, line, counters: { 进位: 0 },
  });

  push({}, '从最后一位往前看：不是 9 就直接加一返回；是 9 就变 0 继续往前进位。', 0);
  for (let i = a.length - 1; i >= 0; i--) {
    if (a[i] < 9) {
      a[i] += 1;
      push({ current: i, pivot: i }, `${a[i] - 1} + 1 = ${a[i]}，没有进位，结束。`, 2);
      return { steps, result: { arr: a.join(',') } };
    }
    a[i] = 0;
    push({ move: [i] }, `9 变 0，向高位进位。`, 3);
  }
  a.unshift(1);
  push({ pivot: 0 }, '全是 9，最前面补一个 1。', 5);
  return { steps, result: { arr: a.join(',') } };
}

// ── 344. 反转字符串 ─────────────────────────────────────
const reverseStringCode = [
  'function reverseString(s) {',
  '  let i = 0, j = s.length - 1;',
  '  while (i < j) { [s[i], s[j]] = [s[j], s[i]]; i++; j--; }',
  '}',
];

function reverseString(input) {
  const chars = [...input];
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { chars, ...state }, note, line, counters: { 交换: 0 },
  });

  push({ pointers: [{ i: 0, text: 'i' }, { i: chars.length - 1, text: 'j' }] }, '两端往中间换，换到相遇为止。原地，O(1) 额外空间。', 0);
  let i = 0;
  let j = chars.length - 1;
  while (i < j) {
    [chars[i], chars[j]] = [chars[j], chars[i]];
    push({ move: [i, j], pointers: [{ i, text: 'i' }, { i: j, text: 'j' }] }, `交换 ${chars[j]} 和 ${chars[i]}。`, 2);
    i += 1;
    j -= 1;
  }
  push({}, `反转结果：${chars.join('')}。`, 2);
  return { steps, result: { out: chars.join('') } };
}

// ── 242. 有效的字母异位词 ───────────────────────────────
const anagramCode = [
  'function isAnagram(s, t) {',
  '  if (s.length !== t.length) return false;',
  '  const cnt = new Array(26).fill(0);',
  '  for (let i = 0; i < s.length; i++) { cnt[s.charCodeAt(i) - 97]++; cnt[t.charCodeAt(i) - 97]--; }',
  '  return cnt.every((v) => v === 0);',
  '}',
];

function isAnagram(input) {
  const { s, t } = input;
  const cnt = new Array(26).fill(0);
  const steps = [];
  const push = (state, note, line) => steps.push({
    state: { values: cnt.slice(0, 10), container: { label: '计数（前 10 个字母）', items: cnt.slice(0, 10).map((v, i) => ({ text: `${String.fromCharCode(97 + i)}:${v}` })) }, ...state },
    note, line, counters: { 已处理: 0 },
  });

  push({}, `长度不同直接 false。否则一边加一边减，最后全零才是异位词。`, 0);
  if (s.length !== t.length) {
    push({}, `"${s}" 和 "${t}" 长度不同，不是异位词。`, 1);
    return { steps, result: { ok: 'false' } };
  }
  for (let i = 0; i < s.length; i++) {
    cnt[s.charCodeAt(i) - 97] += 1;
    cnt[t.charCodeAt(i) - 97] -= 1;
    push({ current: i, counters: { 已处理: i + 1 } }, `第 ${i} 位：${s[i]} 加一，${t[i]} 减一。`, 3);
  }
  const ok = cnt.every((v) => v === 0);
  push({}, ok ? '计数全为零，是异位词。' : '有计数不为零，不是异位词。', 4);
  return { steps, result: { ok: String(ok) } };
}

// ── 392. 判断子序列 ─────────────────────────────────────
const subsequenceCode = [
  'function isSubsequence(s, t) {',
  '  let i = 0;',
  '  for (const ch of t) { if (ch === s[i]) i++; }',
  '  return i === s.length;',
  '}',
];

function isSubsequence(input) {
  const { s, t } = input;
  const chars = [...t];
  const steps = [];
  let i = 0;
  const push = (state, note, line) => steps.push({
    state: { chars, container: { label: 's 已匹配', items: [...s].slice(0, i).map((c) => ({ text: c })) }, ...state },
    note, line, counters: { 匹配: i },
  });

  push({}, `在 t 里按顺序找 s 的每个字符。找到就前进一格，找不到就跳过 t 的当前字符。`, 0);
  for (let k = 0; k < chars.length; k++) {
    if (chars[k] === s[i]) {
      i += 1;
      push({ current: k, settled: [k] }, `t[${k}] = "${chars[k]}" 匹配 s 的第 ${i} 个字符。`, 2);
      if (i === s.length) break;
    }
  }
  const ok = i === s.length;
  push({}, ok ? `"${s}" 是 "${t}" 的子序列。` : `"${s}" 不是 "${t}" 的子序列。`, 3);
  return { steps, result: { ok: String(ok) } };
}

// ── 191. 位 1 的个数 ────────────────────────────────────
const onesCode = [
  'function hammingWeight(n) {',
  '  let count = 0;',
  '  while (n) { n &= n - 1; count++; }   // 每次抹掉最低位的 1',
  '  return count;',
  '}',
];

function hammingWeight(n) {
  const steps = [];
  let x = n;
  let count = 0;
  const push = (state, note, line) => steps.push({
    state: { chars: [...x.toString(2).padStart(8, '0')], container: { label: 'n / 计数', items: [{ text: x.toString(2), hot: true }, { text: String(count) }] }, ...state },
    note, line, counters: { 消位: 0 },
  });

  push({}, `${n} 的二进制是 ${n.toString(2)}。n & (n-1) 每次抹掉最低位的 1，循环几次就有几个 1。`, 0);
  while (x) {
    const before = x;
    x &= x - 1;
    count += 1;
    push({}, `${before.toString(2)} → ${x.toString(2)}，计数 ${count}。`, 2);
  }
  push({}, `一共 ${count} 个 1。`, 3);
  return { steps, result: { count } };
}

export const leetcode7Algorithms = [
  { id: 'lc-dup-exists', group: '热门题', title: '217. 存在重复元素', brief: '边扫边把见过的数记进集合，撞上就返回。时间 O(n)，空间 O(n)；排序做法是 O(n log n) 时间 O(1) 空间。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(n)'], ['另一解', '排序后相邻比较']], counters: '已见', legend: L,
    inputs: [{ label: '有重复', make: () => [1, 2, 3, 1] }, { label: '无重复', make: () => [1, 2, 3, 4] }], code: dupCode, run: containsDuplicate },
  { id: 'lc-majority', group: '热门题', title: '169. 多数元素', brief: '摩尔投票：不同的数两两抵消，剩下的就是多数元素。O(n) 时间 O(1) 空间。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['方法', '摩尔投票']], counters: '抵消', legend: L,
    inputs: [{ label: '3 2 3', make: () => [3, 2, 3] }, { label: '2 2 1 1 1 2 2', make: () => [2, 2, 1, 1, 1, 2, 2] }], code: majorityCode, run: majorityElement },
  { id: 'lc-missing-number', group: '热门题', title: '268. 丢失的数字', brief: '下标和值一起异或：成对的抵消，剩下的就是缺的那个。也可以用求和公式，但有溢出风险。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['另一解', '求和相减']], counters: '步数', legend: L,
    inputs: [{ label: '3 0 1', make: () => [3, 0, 1] }, { label: '0 1', make: () => [0, 1] }], code: missingNumberCode, run: missingNumber },
  { id: 'lc-remove-element', group: '热门题', title: '27. 移除元素', brief: '快指针扫、慢指针写。等于目标值就跳过，不等就写到慢指针位置。O(n) 时间 O(1) 空间。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['技巧', '快慢指针']], counters: '保留', legend: L,
    inputs: [{ label: '删 3', make: () => ({ nums: [3, 2, 2, 3], val: 3 }) }, { label: '删 2', make: () => ({ nums: [0, 1, 2, 2, 3, 0, 4, 2], val: 2 }) }], code: removeElementCode, run: removeElement },
  { id: 'lc-merge-sorted-arr', group: '热门题', title: '88. 合并两个有序数组', brief: 'nums1 后面留了空位，所以从后往前填，不用搬动前面的元素。', view: 'array', facts: [['时间', 'O(m+n)'], ['空间', 'O(1)'], ['技巧', '从后往前']], counters: '写入', legend: L,
    inputs: [{ label: '1 2 3 + 2 5 6', make: () => ({ a: [1, 2, 3, 0, 0, 0], m: 3, b: [2, 5, 6], n: 3 }) }], code: mergeSortedCode, run: mergeSorted },
  { id: 'lc-plus-one', group: '热门题', title: '66. 加一', growable: true, brief: '从最后一位往前：不是 9 就加一返回；是 9 就变 0 继续进位。全是 9 时最前面补 1。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['坑', '全是 9']], counters: '进位', legend: L,
    inputs: [{ label: '1 2 3', make: () => [1, 2, 3] }, { label: '9 9 9', make: () => [9, 9, 9] }], code: plusOneCode, run: plusOne },
  { id: 'lc-reverse-string', group: '热门题', title: '344. 反转字符串', brief: '两端往中间换，换到相遇为止。原地，O(1) 额外空间。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['技巧', '双指针']], counters: '交换', legend: [{ cls: 'cell', text: '字符' }, { cls: 'cell is-move', text: '刚交换' }],
    inputs: [{ label: 'hello', make: () => 'hello' }, { label: 'Hannah', make: () => 'Hannah' }], code: reverseStringCode, run: reverseString },
  { id: 'lc-anagram', group: '热门题', title: '242. 有效的字母异位词', brief: '长度不同直接否。否则一边加一边减，26 个计数全为零才是异位词。', view: 'array', facts: [['时间', 'O(n)'], ['空间', 'O(1) 26 个桶'], ['技巧', '计数抵消']], counters: '已处理', legend: L,
    inputs: [{ label: 'anagram / nagaram', make: () => ({ s: 'anagram', t: 'nagaram' }) }, { label: 'rat / car', make: () => ({ s: 'rat', t: 'car' }) }], code: anagramCode, run: isAnagram },
  { id: 'lc-subsequence', group: '热门题', title: '392. 判断子序列', brief: '在 t 里按顺序找 s 的每个字符。找到就前进，找不到就跳过 t 的当前字符。', view: 'array', facts: [['时间', 'O(m+n)'], ['空间', 'O(1)'], ['技巧', '双指针']], counters: '匹配', legend: [{ cls: 'cell', text: 't 的字符' }, { cls: 'cell is-settled', text: '匹配上了' }],
    inputs: [{ label: 'abc / ahbgdc', make: () => ({ s: 'abc', t: 'ahbgdc' }) }, { label: 'axc / ahbgdc', make: () => ({ s: 'axc', t: 'ahbgdc' }) }], code: subsequenceCode, run: isSubsequence },
  { id: 'lc-count-ones', group: '热门题', title: '191. 位 1 的个数', brief: 'n & (n-1) 每次抹掉最低位的 1，循环几次就有几个 1。比逐位判断少一半迭代。', view: 'array', facts: [['时间', 'O(1) 最多 32 次'], ['空间', 'O(1)'], ['技巧', 'n & (n-1)']], counters: '消位', legend: [{ cls: 'cell', text: '二进制位' }],
    inputs: [{ label: '11（1011）', make: () => 11 }, { label: '128（10000000）', make: () => 128 }], code: onesCode, run: hammingWeight },
];
