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
// 快慢指针：找中点
// ─────────────────────────────────────────────────────────────

const middleCode = [
  'function middleNode(head) {',
  '  let slow = head, fast = head;',
  '  while (fast !== null && fast.next !== null) {',
  '    slow = slow.next;        // 一步',
  '    fast = fast.next.next;   // 两步',
  '  }',
  '  return slow;              // 偶数个节点时返回后中点',
  '}',
];

function listMiddle(values) {
  const head = buildList(values);
  const pool = walk(head);
  const order = pool.map((n) => n.id);
  const steps = [];
  let hops = 0;

  const push = (state, note, line) => steps.push({
    state: { nodes: snapshot(pool), order, ...state },
    note,
    line,
    counters: { 移动: hops },
  });

  let slow = head;
  let fast = head;
  const ptrs = (a, b) => [
    ...(a ? [{ on: a.id, text: 'slow' }] : []),
    ...(b ? [{ on: b.id, text: 'fast' }] : []),
  ];

  push({ pointers: ptrs(slow, fast) },
    '快指针一次走两步、慢指针一次走一步。快指针走到头时，慢指针正好在中间。', 1);

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    hops += 1;
    push({ pointers: ptrs(slow, fast), highlight: [slow.id] }, `慢指针走到 ${slow.val}。`, 3);
    fast = fast.next.next;
    hops += 1;
    push({ pointers: ptrs(slow, fast) }, `快指针走到 ${fast ? fast.val : '∅'}。`, 4);
  }

  push({ pointers: [{ on: slow.id, text: 'middle' }], highlight: [slow.id] },
    `快指针到头，中点是 ${slow.val}。注意循环条件里 fast.next 也要判空，少了它会空指针。`, 6);
  return { steps, result: { val: slow.val } };
}

// ─────────────────────────────────────────────────────────────
// Floyd 判圈：入环点
// ─────────────────────────────────────────────────────────────

const cycleCode = [
  'function detectCycle(head) {',
  '  let slow = head, fast = head;',
  '  while (fast !== null && fast.next !== null) {',
  '    slow = slow.next;',
  '    fast = fast.next.next;',
  '    if (slow === fast) {       // 相遇说明有环',
  '      let p = head;',
  '      while (p !== slow) { p = p.next; slow = slow.next; }',
  '      return p;                // p 就是入环点',
  '    }',
  '  }',
  '  return null;',
  '}',
];

function detectCycle(input) {
  const { values, cycleAt } = input;
  const head = buildList(values);
  const pool = walk(head);
  const order = pool.map((n) => n.id);

  // 造环：把尾巴接到第 cycleAt 个节点上
  if (cycleAt != null && cycleAt >= 0 && cycleAt < pool.length) {
    pool[pool.length - 1].next = pool[cycleAt];
  }

  const steps = [];
  let hops = 0;
  const push = (state, note, line) => steps.push({
    state: { nodes: snapshot(pool), order, ...state },
    note,
    line,
    counters: { 移动: hops },
  });

  let slow = head;
  let fast = head;
  const ptrs = (a, b, extra) => [
    ...(a ? [{ on: a.id, text: 'slow' }] : []),
    ...(b ? [{ on: b.id, text: 'fast' }] : []),
    ...(extra ?? []),
  ];

  push({ pointers: ptrs(slow, fast) },
    cycleAt == null ? '这条链表没有环。快慢指针追不上就是没环。' : `这条链表在第 ${cycleAt} 个节点处成环。快慢指针一定会在环里相遇。`, 1);

  let met = null;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    hops += 1;
    push({ pointers: ptrs(slow, fast), highlight: [slow.id] }, `慢指针走到 ${slow.val}。`, 3);
    fast = fast.next.next;
    hops += 1;
    push({ pointers: ptrs(slow, fast), highlight: fast && fast === slow ? [fast.id] : [] },
      `快指针走到 ${fast ? fast.val : '∅'}。${fast && fast === slow ? '两个指针重合了！' : ''}`, 4);

    if (slow === fast) {
      met = slow;
      push({ pointers: ptrs(slow, fast), moved: [slow.id] },
        `相遇在 ${slow.val}。相遇不代表这里就是入环点，还要走第二步。`, 5);
      break;
    }
  }

  if (met === null) {
    push({ pointers: [] }, '快指针到头了也没相遇，确认无环，返回 null。', 11);
    return { steps, result: { entry: -1 } };
  }

  let p = head;
  push({ pointers: [{ on: p.id, text: 'p' }, { on: met.id, text: 'meet' }] },
    '关键结论：从 head 走和从相遇点走，同样速度，一定在入环点相遇。所以现在让 p 从 head 出发。', 6);

  let guard = 0;
  while (p !== met && guard < 100) {
    p = p.next;
    met = met.next;
    hops += 1;
    guard += 1;
    push({ pointers: [{ on: p.id, text: 'p' }, { on: met.id, text: 'meet' }], highlight: [p.id] },
      `p 走到 ${p.val}，相遇点指针也往前一步到 ${met.val}。`, 7);
  }

  const entryIdx = order.indexOf(p.id);
  push({ pointers: [{ on: p.id, text: '入环点' }], settled: [p.id] },
    `两者在 ${p.val} 相遇，这就是入环点，下标 ${entryIdx}。`, 8);
  return { steps, result: { entry: entryIdx } };
}

// ─────────────────────────────────────────────────────────────
// 删除倒数第 N 个
// ─────────────────────────────────────────────────────────────

const nthCode = [
  'function removeNthFromEnd(head, n) {',
  '  const dummy = { next: head };   // 哑节点，省掉删头的单独判断',
  '  let fast = dummy, slow = dummy;',
  '  for (let i = 0; i <= n; i++) fast = fast.next;',
  '  while (fast !== null) { fast = fast.next; slow = slow.next; }',
  '  slow.next = slow.next.next;',
  '  return dummy.next;',
  '}',
];

function removeNth(input) {
  const { values, n } = input;
  let head = buildList(values);
  const pool = new Set(walk(head));
  const dummy = { id: 'dummy', val: 'dummy', next: head };
  pool.add(dummy);

  const steps = [];
  let hops = 0;
  const orderNow = () => [dummy.id, ...walk(head).map((x) => x.id)];
  const push = (state, note, line) => steps.push({
    state: { nodes: snapshot([...pool]), order: orderNow(), ...state },
    note,
    line,
    counters: { 移动: hops },
  });

  push({ head, pointers: [{ on: dummy.id, text: 'dummy' }, { on: head.id, text: 'head' }] },
    `删掉倒数第 ${n} 个。哑节点是为了让"删头"和"删中间"变成同一种操作。`, 1);

  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
    hops += 1;
  }
  push({ head, pointers: [{ on: fast ? fast.id : null, text: 'fast' }, { on: slow.id, text: 'slow' }] },
    `fast 先走 ${n + 1} 步，走到 ${fast ? fast.val : '∅'}。这样它和 slow 之间正好隔着 ${n} 个节点。`, 3);

  while (fast !== null) {
    fast = fast.next;
    slow = slow.next;
    hops += 1;
    push({ head, pointers: [
      ...(fast ? [{ on: fast.id, text: 'fast' }] : []),
      { on: slow.id, text: 'slow' },
    ] },
      `两个指针一起走：fast 到 ${fast ? fast.val : '∅'}，slow 到 ${slow.val}。`, 4);
  }

  const doomed = slow.next;
  slow.next = doomed.next;
  pool.delete(doomed.id);
  push({ head: dummy.next, pointers: [{ on: slow.id, text: 'slow' }], removed: [doomed.id] },
    `fast 到头了，slow 正好停在被删节点的前一个（${slow.val}）。让它跨过 ${doomed.val}。`, 5);

  return { steps, result: { arr: walk(dummy.next).map((x) => x.val).join(',') } };
}


// ─────────────────────────────────────────────────────────────
// 合并两个有序链表
// ─────────────────────────────────────────────────────────────

const mergeCode = [
  'function mergeTwoLists(a, b) {',
  '  const dummy = { next: null };      // 结果链表的哑头',
  '  let tail = dummy;',
  '  while (a && b) {',
  '    if (a.val <= b.val) { tail.next = a; a = a.next; }',
  '    else { tail.next = b; b = b.next; }',
  '    tail = tail.next;                // 尾指针跟着走',
  '  }',
  '  tail.next = a || b;                // 剩下的整段直接挂上',
  '  return dummy.next;',
  '}',
];

function mergeTwoLists(input) {
  const { left, right } = input;
  const aNodes = left.map((v) => makeNode(v));
  const bNodes = right.map((v) => makeNode(v));
  aNodes.forEach((n, i) => { n.next = aNodes[i + 1] ?? null; });
  bNodes.forEach((n, i) => { n.next = bNodes[i + 1] ?? null; });

  const pool = [...aNodes, ...bNodes];
  // 结果链用「新节点」接：直接复用原节点的话，改写 next 会把 A / B 两行也一起改掉，
  // 画面上就变成「A 行显示的是合并后的结果」，读者会以为 A 被吃掉了。
  const outNodes = [];
  const outPool = [];
  const steps = [];
  let cmp = 0;

  const rowsNow = () => [
    walk(aNodes[0] ?? null).map((n) => n.id),
    walk(bNodes[0] ?? null).map((n) => n.id),
    outNodes.map((n) => n.id),
  ];

  const push = (state, note, line) => steps.push({
    state: {
      nodes: [...pool, ...outPool].map((n) => ({ id: n.id, val: n.val, next: n.next ? n.next.id : null })),
      rows: state.rows ?? rowsNow(),
      rowLabels: ['A', 'B', '结果'],
      ...state,
    },
    note,
    line,
    counters: { 比较: cmp, 已合并: outNodes.length },
  });

  let a = aNodes[0] ?? null;
  let b = bNodes[0] ?? null;

  push({}, '两条有序链表合成一条。每次取两边头部较小的那个接到结果尾部，某条走完就把另一条剩下的整段挂上。', 1);

  let tail = null;
  while (a && b) {
    cmp += 1;
    const takeA = a.val <= b.val;
    push({ highlight: [a.id, b.id] },
      `比较 A 的头 ${a.val} 和 B 的头 ${b.val}，取较小的 ${takeA ? a.val : b.val}。`, 4);
    const pick = takeA ? a : b;
    const copy = makeNode(pick.val);
    outPool.push(copy);
    if (tail) tail.next = copy;
    tail = copy;
    outNodes.push(copy);
    if (takeA) a = a.next; else b = b.next;
    push({ moved: [copy.id] }, `取 ${pick.val} 接到结果尾部。结果现在有 ${outNodes.length} 个。`, 6);
  }

  // 剩下的整段逐个复制（真实实现里是直接挂上，这里为了画面可读改成复制）
  let rest = a ?? b;
  while (rest) {
    const copy = makeNode(rest.val);
    outPool.push(copy);
    if (tail) tail.next = copy;
    tail = copy;
    outNodes.push(copy);
    rest = rest.next;
  }
  push({}, a || b ? '一边走完了，另一边的剩余部分整段接上去，不用再逐个比较。' : '两边都走完了。', 9);

  return { steps, result: { arr: outNodes.map((n) => n.val).join(',') } };
}

// ─────────────────────────────────────────────────────────────
// K 个一组翻转
// ─────────────────────────────────────────────────────────────

const kGroupCode = [
  'function reverseKGroup(head, k) {',
  '  const dummy = { next: head };',
  '  let groupPrev = dummy;',
  '  while (true) {',
  '    let kth = groupPrev;',
  '    for (let i = 0; i < k && kth; i++) kth = kth.next;',
  '    if (!kth) break;                 // 不足 k 个，保持原样',
  '    let prev = kth.next, cur = groupPrev.next;',
  '    while (cur !== kth.next) {',
  '      const next = cur.next;',
  '      cur.next = prev; prev = cur; cur = next;',
  '    }',
  '    const newTail = groupPrev.next;',
  '    groupPrev.next = kth;',
  '    groupPrev = newTail;',
  '  }',
  '  return dummy.next;',
  '}',
];

function reverseKGroup(input) {
  const { values, k } = input;
  const head = buildList(values);
  const pool = walk(head);
  const order = pool.map((n) => n.id);

  const steps = [];
  let relink = 0;
  const push = (state, note, line) => steps.push({
    state: { nodes: snapshot(pool), order, ...state },
    note,
    line,
    counters: { 改指针: relink },
  });

  push({}, `每 ${k} 个一组翻转，不足 ${k} 个的尾巴保持原样。关键是每组翻转前先确认"后面还剩够不够 ${k} 个"。`, 0);

  const dummy = { id: 'dummy', val: 'dummy', next: head };
  let groupPrev = dummy;

  while (true) {
    let kth = groupPrev;
    let count = 0;
    while (count < k && kth && kth.next !== null) {
      kth = kth.next ?? null;
      if (!kth) break;
      count += 1;
    }
    if (!kth || count < k) {
      push({ pointers: groupPrev.id !== 'dummy' ? [{ on: groupPrev.id, text: 'groupPrev' }] : [] },
        `剩下的不够 ${k} 个了，这一段保持原样，结束。`, 7);
      break;
    }

    push({ highlight: [kth.id], pointers: [{ on: groupPrev.id, text: 'groupPrev' }] },
      `从 groupPrev 往后数 ${k} 个，第 ${k} 个是 ${kth.val}，这一段可以翻转。`, 5);

    const stop = kth.next;          // 先存住组后的边界，翻转会改写 kth.next
    let prev = stop;
    let cur = groupPrev.next;
    while (cur !== stop) {
      const next = cur.next;
      cur.next = prev;
      prev = cur;
      cur = next;
      relink += 1;
      push({ highlight: [cur ? cur.id : kth.id], moved: [prev.id] },
        `组内掉头：${prev.val} 的 next 指向 ${prev.next ? prev.next.val : '∅'}。`, 11);
    }

    const newTail = groupPrev.next;
    groupPrev.next = kth;
    relink += 1;
    push({ moved: [kth.id], pointers: [{ on: newTail.id, text: '下一组的 groupPrev' }] },
      `这一组接回去：groupPrev 指向新的组头 ${kth.val}，原来的组头 ${newTail.val} 变成组尾。`, 14);
    groupPrev = newTail;
  }

  const finalHead = dummy.next;
  push({}, `完成。现在链表是 ${walk(finalHead).map((n) => n.val).join('→')}。`, 16);
  return { steps, result: { arr: walk(finalHead).map((n) => n.val).join(',') } };
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
  {
    id: 'list-middle',
    group: '链表',
    title: '快慢指针 · 找中点',
    brief: '快指针一次两步、慢指针一次一步。快指针到头时慢指针正好在中间，一趟就够，不用先求长度。',
    view: 'list',
    facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['细节', '循环要判 fast.next']],
    counters: '移动',
    legend: listLegend,
    inputs: [
      { label: '奇数个', make: () => randomList(5) },
      { label: '偶数个', make: () => randomList(6) },
      { label: '只有 2 个', make: () => randomList(2) },
    ],
    code: middleCode,
    run: listMiddle,
  },
  {
    id: 'list-cycle',
    group: '链表',
    title: 'Floyd 判圈 · 入环点',
    brief: '快慢指针追上了就说明有环。找入环点靠一个反直觉的结论：从 head 和从相遇点同时走，同速，必在入环点相遇。',
    view: 'list',
    facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['结论', '相遇点到环口 = head 到环口']],
    counters: '移动',
    legend: listLegend,
    inputs: [
      { label: '有环', make: () => { const v = randomList(6); return { values: v, cycleAt: 2 }; } },
      { label: '环在头部', make: () => { const v = randomList(5); return { values: v, cycleAt: 0 }; } },
      { label: '无环', make: () => ({ values: randomList(5), cycleAt: null }) },
    ],
    code: cycleCode,
    run: detectCycle,
  },
  {
    id: 'list-remove-nth',
    group: '链表',
    title: '删除倒数第 N 个',
    brief: '哑节点 + 快慢间隔：fast 先走 n+1 步，然后两个一起走到头，slow 正好停在被删节点的前一个。哑节点让删头不用单独写。',
    view: 'list',
    facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['技巧', '哑节点 + 间隔']],
    counters: '移动',
    legend: listLegend,
    inputs: [
      { label: '删倒数第 2 个', make: () => ({ values: randomList(5), n: 2 }) },
      { label: '删倒数第 1 个（尾）', make: () => ({ values: randomList(5), n: 1 }) },
      { label: '删倒数第 5 个（头）', make: () => ({ values: randomList(5), n: 5 }) },
    ],
    code: nthCode,
    run: removeNth,
  },
  {
    id: 'list-merge',
    group: '链表',
    title: '合并两个有序链表',
    brief: '两边头部取小的接到结果尾部。某条走完就把另一条剩下的整段挂上，不用再逐个比。哑头节点省掉了"结果是空"的单独判断。',
    view: 'list',
    facts: [['时间', 'O(m+n)'], ['空间', 'O(1) 复用节点'], ['技巧', '哑头 + 尾指针'], ['坑', '剩下的整段']],
    counters: '比较、已合并',
    legend: listLegend,
    inputs: [
      { label: '交错', make: () => ({ left: [1, 3, 5], right: [2, 4, 6] }) },
      { label: '一边先走完', make: () => ({ left: [1, 2, 3], right: [8, 9] }) },
    ],
    code: mergeCode,
    run: mergeTwoLists,
  },
  {
    id: 'list-reverse-k',
    group: '链表',
    title: 'K 个一组翻转',
    brief: '每 k 个一组翻转，不足 k 个的尾巴不动。难点是两个：翻转前要先数够不够 k 个，翻转后要把这一组接回前后两段。',
    view: 'list',
    facts: [['时间', 'O(n)'], ['空间', 'O(1)'], ['细节', '先数够再翻'], ['坑', '尾巴不足 k 个']],
    counters: '改指针',
    legend: listLegend,
    inputs: [
      { label: 'k = 2', make: () => ({ values: randomList(6), k: 2 }) },
      { label: 'k = 3', make: () => ({ values: randomList(7), k: 3 }) },
      { label: 'k 比长度大', make: () => ({ values: randomList(4), k: 6 }) },
    ],
    code: kGroupCode,
    run: reverseKGroup,
  },
];
