/**
 * 链表：反转、按位置插入、按值删除。
 *
 * 这里刻意让"节点池"和"节点的 next 指针"分开表达：
 *   反转的过程中链表是断的——头节点一度指向 null，从 head 走不到任何别的节点。
 *   如果视图只画"从 head 能走到的节点"，第二步就只剩一个框，学生看到的是"节点消失了"，
 *   而不是"指针掉头了"。所以轨迹里始终吐出整池节点，各自带自己当前的 next，
 *   视图按 next 画箭头——箭头会往回指、会画到框下面去，这才是反转该有的样子。
 */
import { el, empty, label } from '../core/svg.js';

let uid = 0;
const nextId = () => `n${++uid}`;

function makeNode(val, next = null) {
  return { id: nextId(), val, next };
}

/** 按给定顺序建一条链，返回头节点 */
function buildList(values) {
  let head = null;
  for (let i = values.length - 1; i >= 0; i--) {
    head = makeNode(values[i], head);
  }
  return head;
}

/** 从 head 顺着 next 走一遍，拿到逻辑顺序（用于新建时的布局顺序） */
function walk(head) {
  const out = [];
  const seen = new Set();
  let p = head;
  while (p && !seen.has(p.id)) {
    seen.add(p.id);
    out.push(p);
    p = p.next;
  }
  return out;
}

/** 整池节点的快照：每帧都是独立副本，回退时不会被后面的修改污染 */
function snapshot(pool) {
  // next 只导出 id，不导出节点对象：视图要按 id 去查"它指向第几个框"，
  // 直接扔对象过去查不到，箭头就会被静默跳过（第一版就是这么一条箭头都画不出来的）
  return pool.map((n) => ({ id: n.id, val: n.val, next: n.next ? n.next.id : null }));
}

function randomList(n = 6) {
  // 值互不相同：删除用例靠"第几个元素的值"来构造，重复值会让"删中间"实际变成"删头"
  const picked = new Set();
  while (picked.size < n) picked.add(10 + Math.floor(Math.random() * 89));
  return [...picked];
}

// ─────────────────────────────────────────────────────────────
// 反转
// ─────────────────────────────────────────────────────────────

const reverseCode = [
  'function reverse(head) {',
  '  let prev = null;',
  '  let cur = head;',
  '  while (cur !== null) {',
  '    const next = cur.next;   // 先存住',
  '    cur.next = prev;         // 掉头',
  '    prev = cur;',
  '    cur = next;',
  '  }',
  '  return prev;               // prev 才是新头',
  '}',
];

function reverseList(values) {
  const head = buildList(values);
  const pool = walk(head);
  const steps = [];
  let ops = 0;
  let relink = 0;

  const push = (state, note, line) => steps.push({
    state: { nodes: snapshot(pool), order: pool.map((n) => n.id), ...state },
    note,
    line,
    counters: { 访问: ops, 改指针: relink },
  });

  push(
    {
      head,
      pointers: [{ on: head.id, text: 'head' }, { on: head.id, text: 'cur' }],
    },
    '开始。反转要三个指针：prev 记已反转部分的新头，cur 是当前处理的，next 先存住后面。',
    1,
  );

  let prev = null;
  let cur = head;
  while (cur !== null) {
    const next = cur.next;
    ops += 1;
    push(
      {
        head,
        pointers: [
          { on: cur.id, text: 'cur' },
          ...(next ? [{ on: next.id, text: 'next' }] : []),
          ...(prev ? [{ on: prev.id, text: 'prev' }] : []),
        ],
        highlight: [cur.id],
      },
      `存下 next = ${next ? next.val : '∅'}。不先存住的话，下面一改 cur.next，后面这段就断了。`,
      4,
    );

    cur.next = prev;
    relink += 1;
    push(
      {
        head,
        pointers: [
          { on: cur.id, text: 'cur' },
          ...(prev ? [{ on: prev.id, text: 'prev' }] : []),
        ],
        moved: [cur.id],
      },
      `${cur.val} 的 next 掉头指向 ${prev ? prev.val : '∅'}。注意箭头方向反了。`,
      5,
    );

    prev = cur;
    cur = next;
    push(
      {
        head,
        pointers: [
          ...(prev ? [{ on: prev.id, text: 'prev' }] : []),
          ...(cur ? [{ on: cur.id, text: 'cur' }] : []),
        ],
      },
      `prev 前移成 ${prev.val}，cur 前移成 ${cur ? cur.val : '∅'}。`,
      7,
    );
  }

  push(
    {
      head: prev,
      pointers: prev ? [{ on: prev.id, text: 'head' }] : [],
    },
    `循环结束。prev 停在 ${prev.val}，它就是新头——所以函数返回 prev 而不是 head。`,
    9,
  );

  return {
    steps,
    result: { values: walk(prev).map((n) => n.val) },
  };
}

// ─────────────────────────────────────────────────────────────
// 按位置插入
// ─────────────────────────────────────────────────────────────

const insertCode = [
  'function insertAt(head, k, val) {',
  '  const node = { val, next: null };',
  '  if (k === 0) {',
  '    node.next = head;',
  '    return node;',
  '  }',
  '  let prev = head;',
  '  for (let i = 0; i < k - 1 && prev; i++) {',
  '    prev = prev.next;',
  '  }',
  '  node.next = prev.next;',
  '  prev.next = node;',
  '  return head;',
  '}',
];

function insertList(input) {
  const { values, at, val } = input;
  let head = buildList(values);
  const pool = new Set(walk(head));

  const steps = [];
  let walkCount = 0;
  let relink = 0;

  const orderNow = () => walk(head).map((n) => n.id);
  const push = (state, note, line) => steps.push({
    state: {
      nodes: snapshot([...pool]),
      order: state.order ?? orderNow(),
      ...state,
    },
    note,
    line,
    counters: { 走位: walkCount, 改指针: relink },
  });

  const node = makeNode(val);
  pool.add(node);

  push(
    {
      head,
      pointers: [{ on: head.id, text: 'head' }],
      highlight: [node.id],
      order: [...orderNow(), node.id], // 新节点先摆在队尾，还没接进去
    },
    `要建个新节点 ${val}，插到位置 ${at}（0 表示头插）。现在它还没接进链里。`,
    1,
  );

  if (at === 0) {
    node.next = head;
    relink += 1;
    push(
      {
        head: node,
        pointers: [{ on: node.id, text: 'head' }],
        moved: [node.id],
        order: [node.id, ...orderNow().filter((id) => id !== node.id)],
      },
      `头插：新节点的 next 指向原来的头 ${head.val}，head 改指向新节点。不用遍历，O(1)。`,
      4,
    );
    head = node;   // 少了这一行，链表没真的换头，后面 walk(head) 拿到的还是旧链
  } else {
    let prev = head;
    push(
      {
        head,
        pointers: [{ on: prev.id, text: 'prev' }, { on: head.id, text: 'head' }],
        highlight: [node.id],
        order: [...orderNow(), node.id],
      },
      `要插到位置 ${at}，得先走到第 ${at - 1} 个节点。从 head 开始走。`,
      7,
    );

    for (let i = 0; i < at - 1 && prev; i++) {
      walkCount += 1;
      prev = prev.next;
      push(
        {
          head,
          pointers: [
            ...(prev ? [{ on: prev.id, text: 'prev' }] : []),
            { on: head.id, text: 'head' },
          ],
          highlight: [node.id],
          order: [...orderNow(), node.id],
        },
        `走了第 ${i + 1} 步，prev 现在指向 ${prev ? prev.val : '∅'}。`,
        8,
      );
    }

    if (prev === null) {
      push({ head, order: [...orderNow(), node.id] },
        '走过头了：位置超出链表长度，这次插入什么都不做。', 9);
    } else {
      node.next = prev.next;
      relink += 1;
      push(
        {
          head,
          pointers: [{ on: prev.id, text: 'prev' }],
          highlight: [node.id],
          order: [...orderNow(), node.id],
          moved: [node.id],
        },
        `先把新节点的 next 接到 prev 后面那个节点（${prev.next ? prev.next.val : '∅'}）。顺序不能反。`,
        10,
      );

      prev.next = node;
      relink += 1;
      const after = walk(head).map((n) => n.id);
      push(
        {
          head,
          pointers: [{ on: prev.id, text: 'prev' }],
          moved: [node.id],
          order: after,
        },
        `再让 prev 的 next 指向新节点。两步的顺序反过来，就会把后面的整段链表弄丢。`,
        11,
      );
    }
  }

  return { steps, result: { values: walk(head).map((n) => n.val) } };
}

// ─────────────────────────────────────────────────────────────
// 按值删除
// ─────────────────────────────────────────────────────────────

const deleteCode = [
  'function remove(head, val) {',
  '  if (head === null) return null;',
  '  if (head.val === val) return head.next;  // 删头',
  '  let prev = head;',
  '  while (prev.next !== null) {',
  '    if (prev.next.val === val) {',
  '      prev.next = prev.next.next;      // 跨过它',
  '      return head;',
  '    }',
  '    prev = prev.next;',
  '  }',
  '  return head;',
  '}',
];

function deleteList(input) {
  const { values, val } = input;
  let head = buildList(values);
  const pool = new Set(walk(head));

  const steps = [];
  let walkCount = 0;
  let relink = 0;

  const orderNow = () => walk(head).map((n) => n.id);
  const push = (state, note, line) => steps.push({
    state: { nodes: snapshot([...pool]), order: orderNow(), ...state },
    note,
    line,
    counters: { 走位: walkCount, 改指针: relink },
  });

  push(
    { head, pointers: [{ on: head.id, text: 'head' }] },
    `要找值为 ${val} 的节点删掉。删除的难点是"找到后要能改上一个节点的 next"，所以得同时握住前后两个。`,
    1,
  );

  if (head.val === val) {
    relink += 1;
    const doomed = head;
    const newHead = head.next;
    // 这一帧要先把被删的节点画成"待摘除"的灰块，所以 pool 里还不能删；
    // orderNow() 从当前 head 走，仍然会把它算进顺序里
    push(
      {
        head: newHead,
        pointers: newHead ? [{ on: newHead.id, text: 'head' }] : [],
        removed: [doomed.id],
        highlight: [doomed.id],
      },
      `头节点就是要删的。直接让 head 往后挪一格——这是头删必须单独处理的原因：没有"上一个节点"可以改。`,
      2,
    );
    head = newHead;
    pool.delete(doomed); // 下一帧起它就不该再出现在画面里
  } else {
    let prev = head;
    push(
      {
        head,
        pointers: [{ on: prev.id, text: 'prev' }, ...(prev.next ? [{ on: prev.next.id, text: 'prev.next' }] : [])],
      },
      `从头开始，每次比较 prev.next 的值。prev 是"可能要被改 next 的那个节点"。`,
      4,
    );

    while (prev.next !== null) {
      walkCount += 1;
      push(
        {
          head,
          pointers: [
            { on: prev.id, text: 'prev' },
            { on: prev.next.id, text: 'prev.next' },
          ],
          highlight: [prev.next.id],
        },
        `比较 prev.next 的值 ${prev.next.val} 与目标 ${val}。`,
        5,
      );

      if (prev.next.val === val) {
        const doomed = prev.next;
        prev.next = doomed.next;
        relink += 1;
        push(
          {
            head,
            pointers: [{ on: prev.id, text: 'prev' }],
            removed: [doomed.id],
            moved: [prev.id],
          },
          `找到了。让 prev 的 next 跨过 ${doomed.val} 直接指向后面那个——被跨过的节点就没人引用了。`,
          6,
        );
        pool.delete(doomed);
        return { steps, result: { values: walk(head).map((n) => n.val) } };
      }

      prev = prev.next;
      push(
        {
          head,
          pointers: [{ on: prev.id, text: 'prev' }],
        },
        `不是，prev 往后挪一格到 ${prev.val}。`,
        9,
      );
    }

    push({ head }, `走到尾了还没找到 ${val}，链表原样返回。`, 10);
  }

  return { steps, result: { values: walk(head).map((n) => n.val) } };
}

// ─────────────────────────────────────────────────────────────

const listLegend = [
  { cls: 'node', text: '节点' },
  { cls: 'node is-active', text: '正在处理' },
  { cls: 'node is-moved', text: '指针有改动' },
  { cls: 'node is-removed', text: '已摘除 / 待摘除' },
];

export const linkedListAlgorithms = [
  {
    id: 'list-reverse',
    group: '链表',
    title: '反转链表',
    brief: '三个指针 prev / cur / next 一路往右挪，每挪一步把 cur 的 next 掉头。看着复杂，其实就是"存下后面、掉头、集体前移"。',
    view: 'list',
    facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['要点', '先存 next 再改 next']],
    counters: '访问、改指针',
    legend: listLegend,
    inputs: [{ label: '随机 6 个', make: () => randomList(6) }],
    code: reverseCode,
    run: reverseList,
  },
  {
    id: 'list-insert',
    group: '链表',
    title: '按位置插入',
    brief: '头插要改 head 本身；中间插要先走到前一个节点，再分两步接上新节点。两步顺序反了就把后半段弄丢。',
    view: 'list',
    facts: [['头插', 'O(1)'], ['中间插', 'O(k)'], ['空间', 'O(1)']],
    counters: '走位、改指针',
    legend: listLegend,
    inputs: [
      { label: '头插', make: () => ({ values: randomList(5), at: 0, val: 42 }) },
      { label: '插到中间', make: () => ({ values: randomList(5), at: 3, val: 42 }) },
      { label: '插到末尾', make: () => ({ values: randomList(4), at: 4, val: 42 }) },
      { label: '位置越界', make: () => ({ values: randomList(3), at: 9, val: 42 }) },
    ],
    code: insertCode,
    run: insertList,
  },
  {
    id: 'list-delete',
    group: '链表',
    title: '按值删除',
    brief: '删除的关键是找到目标后还能改它前一个节点的 next，所以永远握着 prev。头删没有 prev，必须单独处理。',
    view: 'list',
    facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['易错', '头删 / 删不存在的值']],
    counters: '走位、改指针',
    legend: listLegend,
    inputs: [
      { label: '删中间', make: () => { const v = randomList(5); return { values: v, val: v[2] }; } },
      { label: '删头', make: () => { const v = randomList(5); return { values: v, val: v[0] }; } },
      { label: '删不存在的值', make: () => ({ values: randomList(4), val: 999 }) },
    ],
    code: deleteCode,
    run: deleteList,
  },
];
