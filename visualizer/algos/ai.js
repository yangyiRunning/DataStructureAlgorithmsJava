/**
 * AI / 机器学习算法演示。
 *
 * 和前面的数据结构不一样：这里的"状态"不是容器里装了什么，而是一个模型在迭代中
 * 怎么慢慢收敛。所以视图用散点：样本点固定不动，变的是那条线、那几个质心、那条边界。
 *
 * 数据一律写死，不用随机数——三套实现（JS / Java / Python）要拿同一批输入对拍，
 * 随机种子对不齐就白搭。
 */

const SCATTER_LEGEND = [
  { cls: 'dot', text: '样本点' },
  { cls: 'dot is-hot', text: '本轮选中' },
  { cls: 'line', text: '拟合直线 / 决策边界' },
  { cls: 'square', text: '聚类质心' },
];

const f3 = (v) => (Math.abs(v) < 1e-9 ? 0 : v).toFixed(3);

// ─────────────────────────────────────────────────────────────
// 梯度下降：拟合一条直线
// ─────────────────────────────────────────────────────────────

const GD_POINTS = [
  { x: 1, y: 2.1 }, { x: 2, y: 3.9 }, { x: 3, y: 6.2 }, { x: 4, y: 7.8 },
  { x: 5, y: 10.1 }, { x: 6, y: 12.3 }, { x: 7, y: 13.8 }, { x: 8, y: 16.2 },
];

const gdCode = [
  '// 模型：y = w·x + b，损失用均方误差',
  'for (let step = 0; step < steps; step++) {',
  '  let dw = 0, db = 0;',
  '  for (const p of points) {',
  '    const err = (w * p.x + b) - p.y;   // 预测减真实',
  '    dw += 2 * err * p.x;',
  '    db += 2 * err;',
  '  }',
  '  w -= lr * dw / n;                    // 沿负梯度走一步',
  '  b -= lr * db / n;',
  '}',
];

function gradientDescent(input) {
  const { points, lr, steps } = input;
  const n = points.length;
  let w = 0;
  let b = 0;
  const steps_ = [];

  const loss = () => {
    let s = 0;
    for (const p of points) {
      const e = (w * p.x + b) - p.y;
      s += e * e;
    }
    return s / n;
  };

  const push = (note, line, extra = {}) => steps_.push({
    state: {
      points,
      line: { m: w, b },
      container: {
        label: 'w / b / 损失',
        items: [{ text: `w=${f3(w)}`, hot: true }, { text: `b=${f3(b)}` }, { text: `L=${f3(loss())}` }],
      },
      ...extra,
    },
    note,
    line,
    counters: { 迭代: steps_.length },
  });

  push('先随便放一条水平线（w=0，b=0），然后用均方误差的梯度把它掰到点上去。', 0, { highlight: [] });

  for (let step = 0; step < steps; step++) {
    let dw = 0;
    let db = 0;
    for (const p of points) {
      const err = (w * p.x + b) - p.y;
      dw += 2 * err * p.x;
      db += 2 * err;
    }
    w -= lr * dw / n;
    b -= lr * db / n;
    push(
      `第 ${step + 1} 步：梯度给出方向，w 变 ${f3(w)}、b 变 ${f3(b)}，损失降到 ${f3(loss())}。`,
      5,
    );
  }

  push(`收敛后 w=${f3(w)}、b=${f3(b)}，损失 ${f3(loss())}。学习率再大会震荡，再小要跑很多步。`, 4);
  return { steps: steps_, result: { w, b, loss: loss() } };
}

// ─────────────────────────────────────────────────────────────
// K-means 聚类
// ─────────────────────────────────────────────────────────────

const KM_POINTS = [
  { x: 1, y: 1 }, { x: 1.6, y: 1.8 }, { x: 2.2, y: 1.1 },
  { x: 5.5, y: 5.2 }, { x: 6.1, y: 6.0 }, { x: 5.1, y: 6.2 },
  { x: 9.2, y: 1.5 }, { x: 9.9, y: 2.2 }, { x: 8.6, y: 2.4 },
];

const kmeansCode = [
  '// 1) 先随便挑 k 个点当质心',
  'let centers = points.slice(0, k).map(p => ({ ...p }));',
  'for (let iter = 0; iter < iters; iter++) {',
  '  // 2) 每个点归给最近的质心',
  '  const assign = points.map(p => nearest(centers, p));',
  '  // 3) 质心挪到自己那堆点的平均位置',
  '  centers = centers.map((c, i) => average(points.filter((p, j) => assign[j] === i)));',
  '}',
];

function kmeans(input) {
  const { points, k, iters } = input;
  let centers = points.slice(0, k).map((p) => ({ x: p.x, y: p.y }));
  const steps_ = [];
  let assign = points.map(() => 0);

  const push = (note, line, extra = {}) => steps_.push({
    state: {
      points,
      centroids: centers.map((c) => ({ x: c.x, y: c.y })),
      highlight: assign.map((a, i) => (a === extra.assignTo ? i : -1)).filter((i) => i >= 0),
      container: {
        label: '质心位置',
        items: centers.map((c, i) => ({ text: `C${i + 1}(${f3(c.x)}, ${f3(c.y)})` })),
      },
      ...extra.state,
    },
    note,
    line,
    counters: { 轮次: steps_.length },
  });

  push('先把前 k 个点直接当作初始质心——实际工程里会随机撒或 k-means++，这里固定下来方便对照。', 1);

  for (let iter = 0; iter < iters; iter++) {
    // 2) 分配
    assign = points.map((p) => {
      let best = 0;
      let bestD = Infinity;
      centers.forEach((c, ci) => {
        const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
        if (d < bestD) { bestD = d; best = ci; }
      });
      return best;
    });
    for (let i = 0; i < k; i++) {
      push(`第 ${iter + 1} 轮分配：属于 C${i + 1} 的点有 ${assign.filter((a) => a === i).length} 个。`, 4, { assignTo: i });
    }

    // 3) 更新
    centers = centers.map((c, i) => {
      const own = points.filter((_, j) => assign[j] === i);
      if (!own.length) return c;
      const sx = own.reduce((s, p) => s + p.x, 0) / own.length;
      const sy = own.reduce((s, p) => s + p.y, 0) / own.length;
      return { x: sx, y: sy };
    });
    push(`第 ${iter + 1} 轮更新：每个质心挪到自己那堆点的平均位置。`, 6);
  }

  push(`结束后质心在 ${centers.map((c, i) => `C${i + 1}(${f3(c.x)}, ${f3(c.y)})`).join('、')}。`, 7);
  return { steps: steps_, result: { centers, assign } };
}

// ─────────────────────────────────────────────────────────────
// KNN 分类
// ─────────────────────────────────────────────────────────────

const KNN_POINTS = [
  { x: 1, y: 1.2, group: 1 }, { x: 2, y: 2.4, group: 1 }, { x: 3, y: 1.8, group: 1 },
  { x: 1.5, y: 3.1, group: 1 }, { x: 2.6, y: 3.6, group: 1 },
  { x: 6, y: 5.2, group: 2 }, { x: 7.2, y: 6.1, group: 2 }, { x: 6.6, y: 4.4, group: 2 },
  { x: 8, y: 5.6, group: 2 }, { x: 7.4, y: 4.2, group: 2 },
];

const knnCode = [
  '// 算查询点到每个样本的距离，取最近的 k 个，投票',
  'const dists = points.map((p, i) => ({ i, d: (p.x-q.x)**2 + (p.y-q.y)**2 }));',
  'dists.sort((a, b) => a.d - b.d || a.i - b.i);   // 同距离按下标稳定排序',
  'const top = dists.slice(0, k);',
  'const votes = {};',
  'for (const t of top) votes[points[t.i].group] = (votes[points[t.i].group] || 0) + 1;',
];

function knn(input) {
  const { points, query, k } = input;
  const steps_ = [];

  const dists = points.map((p, i) => ({ i, d: (p.x - query.x) ** 2 + (p.y - query.y) ** 2 }));
  dists.sort((a, b) => (a.d - b.d) || (a.i - b.i));

  const push = (note, line, extra = {}) => steps_.push({
    state: {
      points: [...points, { ...query, tag: '?' }],
      highlight: extra.hot ?? [],
      container: {
        label: '最近的 k 个',
        items: (extra.top ?? []).map((t) => ({ text: `样本${t.i}距离${f3(Math.sqrt(t.d))}` })),
      },
      ...extra.state,
    },
    note,
    line,
    counters: { 比较: steps_.length },
  });

  push(`查询点是 ?，要按最近的 ${k} 个样本投票决定它属于哪一类。`, 0);

  const top = [];
  for (const d of dists) {
    push(`比较到样本 ${d.i} 的距离：${f3(Math.sqrt(d.d))}。`, 1, { hot: top.map((t) => t.i) });
    if (top.length < k) {
      top.push(d);
      push(`排进前 ${k}，目前有 ${top.length} 个。`, 4, { hot: top.map((t) => t.i), top: [...top] });
    }
  }

  const votes = {};
  for (const t of top) votes[points[t.i].group] = (votes[points[t.i].group] || 0) + 1;
  const label = Number(votes[1] ?? 0) >= Number(votes[2] ?? 0) ? 1 : 2;

  push(`前 ${k} 个里，类 1 有 ${votes[1] ?? 0} 票、类 2 有 ${votes[2] ?? 0} 票，判给类 ${label}。`, 5,
    { hot: top.map((t) => t.i), top: [...top] });
  return { steps: steps_, result: { label, votes, top } };
}

// ─────────────────────────────────────────────────────────────
// 感知机
// ─────────────────────────────────────────────────────────────

const PERCEPTRON_POINTS = [
  { x: 1, y: 1, group: 1 }, { x: 2, y: 1.4, group: 1 }, { x: 1.4, y: 2.2, group: 1 },
  { x: 2.6, y: 2.0, group: 1 },
  { x: 4.2, y: 4.4, group: 2 }, { x: 5, y: 5.2, group: 2 }, { x: 4.6, y: 3.6, group: 2 },
  { x: 5.4, y: 4.0, group: 2 },
];

const perceptronCode = [
  '// 感知机：分错了就把权重往正确方向推一下',
  'for (let epoch = 0; epoch < maxEpoch; epoch++) {',
  '  let errors = 0;',
  '  for (const p of points) {',
  '    const y = p.group === 1 ? 1 : -1;',
  '    const pred = (w[0]*p.x + w[1]*p.y + b) > 0 ? 1 : -1;',
  '    if (pred !== y) { w[0] += lr*y*p.x; w[1] += lr*y*p.y; b += lr*y; errors++; }',
  '  }',
  '  if (errors === 0) break;   // 一轮没错就收敛了',
  '}',
];

function perceptron(input) {
  const { points, lr, maxEpoch } = input;
  const w = [0, 0];
  let b = 0;
  const steps_ = [];
  let totalErrors = 0;
  let converged = false;

  const push = (note, line, extra = {}) => steps_.push({
    state: {
      points,
      boundary: w[1] !== 0 ? { m: -w[0] / w[1], b: -b / w[1] } : null,
      container: {
        label: 'w / b',
        items: [{ text: `w=(${f3(w[0])}, ${f3(w[1])})`, hot: true }, { text: `b=${f3(b)}` }],
      },
      ...extra,
    },
    note,
    line,
    counters: { 错分: totalErrors },
  });

  push('权重全零时边界还没定，模型把所有点都判成负类——所以一开始一定错一片。', 0);

  for (let epoch = 0; epoch < maxEpoch && !converged; epoch++) {
    let errors = 0;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const y = p.group === 1 ? 1 : -1;
      const pred = (w[0] * p.x + w[1] * p.y + b) > 0 ? 1 : -1;
      if (pred !== y) {
        w[0] += lr * y * p.x;
        w[1] += lr * y * p.y;
        b += lr * y;
        errors += 1;
        totalErrors += 1;
        push(`样本 ${i} 分错了（应该在类 ${p.group}），把权重往它那边推：w=(${f3(w[0])}, ${f3(w[1])})、b=${f3(b)}。`, 5, { highlight: [i] });
      }
    }
    if (errors === 0) {
      converged = true;
      push(`第 ${epoch + 1} 轮一个都没分错，收敛。`, 7);
    } else {
      push(`第 ${epoch + 1} 轮结束，错了 ${errors} 个，继续。`, 7);
    }
  }

  const m = w[1] !== 0 ? -w[0] / w[1] : 0;
  const bb = w[1] !== 0 ? -b / w[1] : 0;
  push(`最终边界 y = ${f3(m)}x + ${f3(bb)}，一共错分 ${totalErrors} 次。感知机只要数据线性可分就一定收敛。`, 7);
  return { steps: steps_, result: { w0: w[0], w1: w[1], b, totalErrors } };
}

const aiBatch1 = [
  {
    id: 'ai-gradient-descent',
    group: 'AI 算法',
    title: '梯度下降 · 拟合直线',
    brief: '先随便摆一条线，算出每个点的误差、沿负梯度往下走一步。学习率决定步子多大：太大震荡，太小挪不动。',
    view: 'scatter',
    facts: [['时间', '每轮 O(n)'], ['空间', 'O(1)'], ['超参', '学习率 / 轮数'], ['收敛', '损失单调下降']],
    counters: '迭代', legend: SCATTER_LEGEND,
    inputs: [
      { label: '8 个点，lr=0.01，30 步', make: () => ({ points: GD_POINTS, lr: 0.01, steps: 30 }) },
      { label: '学习率 0.001（步子太小）', make: () => ({ points: GD_POINTS, lr: 0.001, steps: 30 }) },
    ],
    code: gdCode,
    run: gradientDescent,
  },
  {
    id: 'ai-kmeans',
    group: 'AI 算法',
    title: 'K-means 聚类',
    brief: '两步循环：把每个点分给最近的质心，再把质心挪到自己那堆点的平均位置。挪不动了就收敛。',
    view: 'scatter',
    facts: [['时间', '每轮 O(n·k)'], ['空间', 'O(n)'], ['超参', 'k / 轮数'], ['注意', '结果依赖初始质心']],
    counters: '轮次', legend: SCATTER_LEGEND,
    inputs: [
      { label: '3 簇、k=3', make: () => ({ points: KM_POINTS, k: 3, iters: 4 }) },
      { label: '只跑 1 轮', make: () => ({ points: KM_POINTS, k: 3, iters: 1 }) },
    ],
    code: kmeansCode,
    run: kmeans,
  },
  {
    id: 'ai-knn',
    group: 'AI 算法',
    title: 'KNN 最近邻分类',
    brief: '没有训练过程：来一个查询点，算它到所有样本的距离，取最近的 k 个投票。所谓"模型"就是整个训练集。',
    view: 'scatter',
    facts: [['时间', '查询 O(n log n)'], ['空间', 'O(n)'], ['超参', 'k'], ['特点', '惰性学习']],
    counters: '比较', legend: SCATTER_LEGEND,
    inputs: [
      { label: 'k=5，查询点在两类之间', make: () => ({ points: KNN_POINTS, query: { x: 4.4, y: 3.2 }, k: 5 }) },
      { label: 'k=1（只看最近的一个）', make: () => ({ points: KNN_POINTS, query: { x: 4.4, y: 3.2 }, k: 1 }) },
    ],
    code: knnCode,
    run: knn,
  },
  {
    id: 'ai-perceptron',
    group: 'AI 算法',
    title: '感知机',
    brief: '最古老的分类器：分错一个点就把权重往正确方向推一下。数据线性可分时，它一定在有限步内收敛。',
    view: 'scatter',
    facts: [['时间', '每轮 O(n)'], ['空间', 'O(1)'], ['超参', '学习率 / 最大轮数'], ['保证', '线性可分则收敛']],
    counters: '错分', legend: SCATTER_LEGEND,
    inputs: [
      { label: '两组可分、lr=0.1', make: () => ({ points: PERCEPTRON_POINTS, lr: 0.1, maxEpoch: 8 }) },
      { label: 'lr=1（一步到位）', make: () => ({ points: PERCEPTRON_POINTS, lr: 1, maxEpoch: 8 }) },
    ],
    code: perceptronCode,
    run: perceptron,
  },
];

// ─────────────────────────────────────────────────────────────
// Softmax
// ─────────────────────────────────────────────────────────────

const SOFTMAX_LOGITS = [2.0, 1.0, 0.1];

const softmaxCode = [
  '// 先取指数（把负数抬成正数），再归一化成概率',
  'const exps = logits.map((z) => Math.exp(z / T));',
  'const sum = exps.reduce((a, b) => a + b, 0);',
  'const probs = exps.map((e) => e / sum);   // 每项都除以总和',
];

function softmax(input) {
  const { logits, T } = input;
  const exps = logits.map((z) => Math.exp(z / T));
  const sum = exps.reduce((a, b) => a + b, 0);
  const probs = exps.map((e) => e / sum);
  const steps = [];

  const push = (state, note, line) => steps.push({
    state: {
      values: (state?.vals ?? logits.map(() => 0)).map((v) => Number(v.toFixed(3))),
      container: {
        label: `logits（T=${T}）`,
        items: logits.map((z) => ({ text: z.toFixed(2) })),
      },
      ...state,
    },
    note, line, counters: { 类: 0 },
  });

  push({}, `原始打分 logits 是 [${logits.join(', ')}]，直接当概率不行——可能为负、加起来也不等于 1。温度 T=${T}：越小分布越尖。`, 0);

  const shown = logits.map(() => 0);
  for (let i = 0; i < logits.length; i++) {
    shown[i] = exps[i];
    push({ vals: exps.slice(), pivot: i }, `第 ${i + 1} 类取指数：e^(${logits[i].toFixed(2)}/${T}) = ${exps[i].toFixed(3)}。`, 1);
  }

  push({ vals: exps.slice() }, `三个指数加起来是 ${sum.toFixed(3)}，下一步每项都除以它。`, 2);

  for (let i = 0; i < probs.length; i++) {
    push({ vals: probs.slice(), pivot: i, settled: Array.from({ length: i + 1 }, (_, k) => k) },
      `第 ${i + 1} 类概率 = ${exps[i].toFixed(3)} / ${sum.toFixed(3)} = ${probs[i].toFixed(3)}。`, 3);
  }

  push({ vals: probs.slice(), settled: probs.map((_, i) => i) },
    `结果 [${probs.map((p) => p.toFixed(3)).join(', ')}]，加起来正好 1。`, 3);
  return { steps, result: { probs, sum } };
}

// ─────────────────────────────────────────────────────────────
// 卷积
// ─────────────────────────────────────────────────────────────

const CONV_INPUT = [
  [1, 2, 0, 1, 0],
  [0, 1, 2, 1, 1],
  [1, 0, 1, 2, 0],
  [2, 1, 0, 1, 2],
  [0, 1, 2, 0, 1],
];

const CONV_KERNEL = [
  [1, 0, -1],
  [1, 0, -1],
  [1, 0, -1],
];

const convCode = [
  '// 卷积核在输入上滑动，每次做逐元素相乘再求和',
  'for (let r = 0; r + 3 <= H; r++) {',
  '  for (let c = 0; c + 3 <= W; c++) {',
  '    let sum = 0;',
  '    for (let i = 0; i < 3; i++)',
  '      for (let j = 0; j < 3; j++) sum += input[r + i][c + j] * kernel[i][j];',
  '    out[r][c] = sum;',
  '  }',
  '}',
];

function convolution() {
  const H = CONV_INPUT.length;
  const W = CONV_INPUT[0].length;
  const out = [];
  const steps = [];

  const push = (state, note, line) => steps.push({
    state: {
      cells: CONV_INPUT.map((r) => r.slice()),
      rowHead: CONV_INPUT.map((_, i) => `行${i}`),
      colHead: CONV_INPUT[0].map((_, i) => `列${i}`),
      filled: CONV_INPUT.flatMap((row, r) => row.map((_, c) => [r, c])),
      container: {
        label: '输出特征图',
        items: out.flat().length
          ? out.flat().map((v) => ({ text: String(v) }))
          : [{ text: '还没开始' }],
      },
      ...state,
    },
    note, line, counters: { 窗口: 0 },
  });

  push({}, `输入是 ${H}×${W}，卷积核 3×3（垂直边缘检测器：左列 +1、右列 -1）。核在输入上逐格滑动，每次九个数相乘再求和。`, 0);

  for (let r = 0; r + 3 <= H; r++) {
    out.push([]);
    for (let c = 0; c + 3 <= W; c++) {
      let sum = 0;
      const win = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          sum += CONV_INPUT[r + i][c + j] * CONV_KERNEL[i][j];
          win.push([r + i, c + j]);
        }
      }
      out[r].push(sum);
      push({ current: [r, c], deps: win },
        `窗口左上角在 (${r},${c})：九个乘积加起来 = ${sum}。`, 5);
    }
  }

  push({}, `输出 ${H - 2}×${W - 2} 的特征图：${out.map((row) => `[${row.join(', ')}]`).join(' ')}。`, 8);
  return { steps, result: { out: out.flat() } };
}

// ─────────────────────────────────────────────────────────────
// 最大池化
// ─────────────────────────────────────────────────────────────

const POOL_INPUT = [
  [1, 3, 2, 4],
  [5, 6, 1, 2],
  [0, 4, 8, 3],
  [2, 1, 7, 5],
];

const poolCode = [
  '// 2×2 的窗口在输入上不重叠地滑，每格取最大值',
  'for (let r = 0; r < H; r += 2)',
  '  for (let c = 0; c < W; c += 2) {',
  '    out[r/2][c/2] = Math.max(in[r][c], in[r][c+1], in[r+1][c], in[r+1][c+1]);',
  '  }',
];

function maxPooling() {
  const H = POOL_INPUT.length;
  const W = POOL_INPUT[0].length;
  const out = [];
  const steps = [];

  const push = (state, note, line) => steps.push({
    state: {
      cells: POOL_INPUT.map((r) => r.slice()),
      rowHead: POOL_INPUT.map((_, i) => `行${i}`),
      colHead: POOL_INPUT[0].map((_, i) => `列${i}`),
      filled: POOL_INPUT.flatMap((row, r) => row.map((_, c) => [r, c])),
      container: {
        label: '池化输出',
        items: out.flat().length ? out.flat().map((v) => ({ text: String(v) })) : [{ text: '还没开始' }],
      },
      ...state,
    },
    note, line, counters: { 窗口: 0 },
  });

  push({}, `${H}×${W} 的输入，用 2×2 窗口、步长 2 做最大池化——每个窗口只留最大的那个，尺寸直接减半。`, 0);

  for (let r = 0; r < H; r += 2) {
    out.push([]);
    for (let c = 0; c < W; c += 2) {
      const vals = [POOL_INPUT[r][c], POOL_INPUT[r][c + 1], POOL_INPUT[r + 1][c], POOL_INPUT[r + 1][c + 1]];
      const m = Math.max(...vals);
      out[r / 2].push(m);
      push({ current: [r, c], deps: [[r, c], [r, c + 1], [r + 1, c], [r + 1, c + 1]] },
        `窗口 (${r},${c})：四个数是 ${vals.join('、')}，最大 ${m}。`, 3);
    }
  }

  push({}, `输出 ${H / 2}×${W / 2}：${out.map((row) => `[${row.join(', ')}]`).join(' ')}。特征变少，最显眼的响应留下了。`, 3);
  return { steps, result: { out: out.flat() } };
}

// ─────────────────────────────────────────────────────────────
// 逻辑回归
// ─────────────────────────────────────────────────────────────

const LOGISTIC_POINTS = [
  { x: 1, y: 1, group: 1 }, { x: 2, y: 2, group: 1 }, { x: 1.5, y: 3, group: 1 },
  { x: 3, y: 1, group: 1 }, { x: 2.5, y: 2.5, group: 1 },
  { x: 4.5, y: 4, group: 2 }, { x: 5.5, y: 5, group: 2 }, { x: 6, y: 4.5, group: 2 },
  { x: 5, y: 6, group: 2 }, { x: 6.5, y: 5.5, group: 2 },
];

const logisticCode = [
  '// 用 sigmoid 把线性打分压到 0..1，再用交叉熵求梯度',
  'for (let step = 0; step < steps; step++) {',
  '  let dw0 = 0, dw1 = 0, db = 0;',
  '  for (const p of points) {',
  '    const yhat = 1 / (1 + Math.exp(-(w0*p.x + w1*p.y + b)));',
  '    const err = yhat - (p.group === 1 ? 1 : 0);',
  '    dw0 += err * p.x; dw1 += err * p.y; db += err;',
  '  }',
  '  w0 -= lr * dw0 / n; w1 -= lr * dw1 / n; b -= lr * db / n;',
  '}',
];

function logistic(input) {
  const { points, lr, steps: total } = input;
  const n = points.length;
  let w0 = 0;
  let w1 = 0;
  let b = 0;
  const steps_ = [];

  const sigmoid = (z) => 1 / (1 + Math.exp(-z));

  const loss = () => {
    let s = 0;
    for (const p of points) {
      const y = p.group === 1 ? 1 : 0;
      const yh = sigmoid(w0 * p.x + w1 * p.y + b);
      s += -(y * Math.log(yh) + (1 - y) * Math.log(1 - yh));
    }
    return s / n;
  };

  const push = (note, line) => steps_.push({
    state: {
      points,
      boundary: w1 !== 0 ? { m: -w0 / w1, b: -b / w1 } : null,
      container: {
        label: 'w / b / 交叉熵',
        items: [
          { text: `w=(${f3(w0)}, ${f3(w1)})`, hot: true },
          { text: `b=${f3(b)}` },
          { text: `L=${f3(loss())}` },
        ],
      },
    },
    note, line, counters: { 迭代: steps_.length },
  });

  push('线性打分过一遍 sigmoid 就变成概率，再用交叉熵算误差、沿负梯度走。', 0);

  for (let s = 0; s < total; s++) {
    let dw0 = 0;
    let dw1 = 0;
    let db = 0;
    for (const p of points) {
      const y = p.group === 1 ? 1 : 0;
      const yh = sigmoid(w0 * p.x + w1 * p.y + b);
      const err = yh - y;
      dw0 += err * p.x;
      dw1 += err * p.y;
      db += err;
    }
    w0 -= lr * dw0 / n;
    w1 -= lr * dw1 / n;
    b -= lr * db / n;
    push(`第 ${s + 1} 步：权重更新到 w=(${f3(w0)}, ${f3(w1)})，交叉熵 ${f3(loss())}。`, 8);
  }

  push(`收敛后边界 y = ${w1 !== 0 ? f3(-w0 / w1) : '—'}x + ${w1 !== 0 ? f3(-b / w1) : '—'}，交叉熵 ${f3(loss())}。`, 8);
  return { steps: steps_, result: { w0, w1, b, loss: loss() } };
}


// ─────────────────────────────────────────────────────────────
// 神经网络：前向传播 / 反向传播（同一个 2-2-1 网络）
// ─────────────────────────────────────────────────────────────

const NN_X = [1.0, 0.5];
const NN_W1 = [[0.6, -0.4], [0.3, 0.8]];   // W1[i][j]：输入 j → 隐藏 i
const NN_B1 = [0.1, -0.2];
const NN_W2 = [0.7, -0.5];                 // 隐藏 → 输出
const NN_B2 = 0.05;
const NN_Y = 1.0;                          // 目标值

const sigmoid = (z) => 1 / (1 + Math.exp(-z));

function nnLayers(acts, grads) {
  return [
    {
      name: '输入层',
      nodes: [
        { id: 'x0', label: 'x₁', value: acts.x[0] },
        { id: 'x1', label: 'x₂', value: acts.x[1] },
      ],
    },
    {
      name: '隐藏层',
      nodes: [
        { id: 'h0', label: 'h₁', value: acts.h[0] },
        { id: 'h1', label: 'h₂', value: acts.h[1] },
      ],
    },
    { name: '输出层', nodes: [{ id: 'o0', label: 'o', value: acts.o }] },
  ];
}

const nnEdges = (w1, w2) => [
  { from: 'x0', to: 'h0', w: w1[0][0] },
  { from: 'x0', to: 'h1', w: w1[1][0] },
  { from: 'x1', to: 'h0', w: w1[0][1] },
  { from: 'x1', to: 'h1', w: w1[1][1] },
  { from: 'h0', to: 'o0', w: w2[0] },
  { from: 'h1', to: 'o0', w: w2[1] },
];

const nnForwardCode = [
  '// 逐层：先算加权和 z，再过一个 sigmoid',
  'for (const layer of [hidden, output]) {',
  '  for (const node of layer) {',
  '    const z = bias[node] + sum(w[i] * input[i]);',
  '    out[node] = 1 / (1 + Math.exp(-z));   // sigmoid 把 z 压进 (0,1)',
  '  }',
  '  input = out;   // 这层的输出就是下一层的输入',
  '}',
];

function nnForward() {
  const steps = [];
  const x = NN_X;
  const h = [0, 0];
  const z1 = [0, 0];

  const push = (state, note, line) => steps.push({
    state: {
      layers: nnLayers({ x, h: state?.h ?? h.map(() => null), o: state?.o ?? null }),
      edges: nnEdges(NN_W1, NN_W2),
      phase: 'forward',
      ...state,
    },
    note, line, counters: { 层: 0 },
  });

  push({}, `网络是 2-2-1：两个输入、两个隐藏节点、一个输出。输入 x=(${x[0]}, ${x[1]})，权重如图。`, 0);

  for (let i = 0; i < 2; i++) {
    const z = NN_B1[i] + NN_W1[i][0] * x[0] + NN_W1[i][1] * x[1];
    z1[i] = z;
    h[i] = sigmoid(z);
    push(
      { h: h.slice(), activeNodes: ['x0', 'x1', `h${i}`], activeEdges: [`x0->h${i}`, `x1->h${i}`] },
      `隐藏节点 h${i + 1}：加权和 z = ${z.toFixed(3)}，过 sigmoid 得 ${h[i].toFixed(3)}。`,
      3,
    );
  }

  const z2 = NN_B2 + NN_W2[0] * h[0] + NN_W2[1] * h[1];
  const o = sigmoid(z2);
  push(
    { o, activeNodes: ['h0', 'h1', 'o0'], activeEdges: ['h0->o0', 'h1->o0'] },
    `输出层：z = ${z2.toFixed(3)}，sigmoid 后得 ${o.toFixed(3)}。这就是预测值。`,
    5,
  );

  const loss = 0.5 * (o - NN_Y) ** 2;
  push({ o }, `预测 ${o.toFixed(3)}、目标 ${NN_Y}，损失 0.5·(o−y)² = ${loss.toFixed(3)}。前向到此结束。`, 6);
  return { steps, result: { h, o, loss } };
}

const nnBackwardCode = [
  '// 误差先从输出往回走，再按链式法则摊到每条边上',
  'const dL_do = o - y;',
  'const dL_dz2 = dL_do * o * (1 - o);        // sigmoid 的导数',
  'for (each hidden node) {',
  '  const dL_dh = dL_dz2 * W2[i];',
  '  const dL_dz1 = dL_dh * h * (1 - h);',
  '  W2[i] -= lr * dL_dz2 * h;                // 更新这一层的权重',
  '}',
];

function nnBackward() {
  const steps = [];
  const x = NN_X;
  // 先做一遍前向，拿到各层激活
  const h = [sigmoid(NN_B1[0] + NN_W1[0][0] * x[0] + NN_W1[0][1] * x[1]),
             sigmoid(NN_B1[1] + NN_W1[1][0] * x[0] + NN_W1[1][1] * x[1])];
  const z2 = NN_B2 + NN_W2[0] * h[0] + NN_W2[1] * h[1];
  const o = sigmoid(z2);
  const loss0 = 0.5 * (o - NN_Y) ** 2;

  const w1 = NN_W1.map((r) => r.slice());
  const w2 = NN_W2.slice();

  const push = (state, note, line) => steps.push({
    state: {
      layers: nnLayers({ x, h, o: state?.o ?? o }),
      edges: nnEdges(state?.w1 ?? w1, state?.w2 ?? w2),
      phase: 'backward',
      ...state,
    },
    note, line, counters: { 层: 0 },
  });

  push({ w1, w2 }, `前向算完：o = ${o.toFixed(3)}，损失 ${loss0.toFixed(3)}。现在要从输出往回推梯度。`, 0);

  const dL_do = o - NN_Y;
  const dL_dz2 = dL_do * o * (1 - o);
  push({ w1, w2, activeNodes: ['o0'], activeEdges: ['h0->o0', 'h1->o0'] },
    `输出层梯度：dL/do = ${dL_do.toFixed(3)}，再乘 sigmoid 导数得 dL/dz₂ = ${dL_dz2.toFixed(3)}。`, 2);

  const gradW2 = [dL_dz2 * h[0], dL_dz2 * h[1]];
  push({ w1, w2, activeNodes: ['h0', 'h1'], activeEdges: ['h0->o0', 'h1->o0'] },
    `两条输出边的梯度 = dL/dz₂ × 上游激活：${gradW2.map((g) => g.toFixed(3)).join('、')}。`, 4);

  const dL_dh = [dL_dz2 * w2[0], dL_dz2 * w2[1]];
  const dL_dz1 = [dL_dh[0] * h[0] * (1 - h[0]), dL_dh[1] * h[1] * (1 - h[1])];
  push({ w1, w2, activeNodes: ['h0', 'h1'], activeEdges: ['x0->h0', 'x1->h0', 'x0->h1', 'x1->h1'] },
    `继续往回：dL/dz₁ = ${dL_dz1.map((g) => g.toFixed(3)).join('、')}（同样乘 sigmoid 导数）。`, 5);

  // 更新权重（一步梯度下降）
  const lr = 0.5;
  const newW2 = w2.map((w, i) => w - lr * gradW2[i]);
  const newW1 = w1.map((row, i) => row.map((w, j) => w - lr * dL_dz1[i] * x[j]));
  push({ w1: newW1, w2: newW2, activeEdges: ['h0->o0', 'h1->o0'] },
    `按梯度下降更新：输出层权重变成 ${newW2.map((w) => w.toFixed(3)).join('、')}。`, 7);

  const h2 = [sigmoid(NN_B1[0] + newW1[0][0] * x[0] + newW1[0][1] * x[1]),
              sigmoid(NN_B1[1] + newW1[1][0] * x[0] + newW1[1][1] * x[1])];
  const o2 = sigmoid(NN_B2 + newW2[0] * h2[0] + newW2[1] * h2[1]);
  const loss1 = 0.5 * (o2 - NN_Y) ** 2;
  push({ w1: newW1, w2: newW2, o: o2 },
    `再前向一次：o 从 ${o.toFixed(3)} 变成 ${o2.toFixed(3)}，损失从 ${loss0.toFixed(3)} 降到 ${loss1.toFixed(3)}。一步就有效。`, 7);

  return { steps, result: { gradW2, gradZ1: dL_dz1, newW2, newW1, o, o2, loss0, loss1 } };
}


// ─────────────────────────────────────────────────────────────
// 注意力机制（单头 self-attention）
// ─────────────────────────────────────────────────────────────

const ATTN_X = [[1, 0], [0, 1], [1, 1]];
const ATTN_WQ = [[1, 0], [0, 1]];
const ATTN_WK = [[1, 0], [0, 1]];
const ATTN_WV = [[0.5, 0.5], [0.5, 0.5]];

const matVec = (M, v) => M.map((row) => row[0] * v[0] + row[1] * v[1]);

const attnCode = [
  '// 每个 token 各自算出 Q / K / V，然后两两点积打分',
  'const Q = X.map((x) => mul(x, Wq));',
  'const K = X.map((x) => mul(x, Wk));',
  'const V = X.map((x) => mul(x, Wv));',
  'const scores = Q.map((q) => K.map((k) => dot(q, k) / Math.sqrt(d)));',
  'const weights = scores.map(row => softmax(row));   // 每一行各自归一化',
  'const out = weights.map((w, i) => sum(w[j] * V[j]));',
];

function attention() {
  const X = ATTN_X;
  const Q = X.map((x) => matVec(ATTN_WQ, x));
  const K = X.map((x) => matVec(ATTN_WK, x));
  const V = X.map((x) => matVec(ATTN_WV, x));
  const d = 2;
  const scores = Q.map((q) => K.map((k) => (q[0] * k[0] + q[1] * k[1]) / Math.sqrt(d)));
  const weights = scores.map((row) => {
    const exps = row.map((z) => Math.exp(z));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / sum);
  });
  const out = weights.map((w) => {
    const r = [0, 0];
    for (let j = 0; j < 3; j += 1) { r[0] += w[j] * V[j][0]; r[1] += w[j] * V[j][1]; }
    return r;
  });

  const steps = [];
  const shown = [[null, null, null], [null, null, null], [null, null, null]];

  const push = (state, note, line) => steps.push({
    // 注意顺序：先铺 ...state，再写格式化后的 cells，
    // 否则调用方传进来的原始浮点会把格式化结果覆盖掉（踩过一次）
    state: {
      ...state,
      cells: (state?.cells ?? shown).map((r) => r.map((v) => (v == null ? '' : Number(v.toFixed(3))))),
      rowHead: ['T₁', 'T₂', 'T₃'],
      colHead: ['T₁', 'T₂', 'T₃'],
      filled: (state?.cells ?? shown)
        .flatMap((row, r) => row.map((v, c) => (v == null ? null : [r, c])))
        .filter(Boolean),
      container: {
        label: 'Q / K / V',
        items: [
          { text: `Q₁(${Q[0].map((v) => v.toFixed(1)).join(',')})`, hot: true },
          { text: `K₁(${K[0].map((v) => v.toFixed(1)).join(',')})` },
          { text: `V₁(${V[0].map((v) => v.toFixed(1)).join(',')})` },
        ],
      },
    },
    note, line, counters: { 行: 0 },
  });

  push({}, `三个 token，每个先各自算 Q、K、V。打分 = Q·K / √d，d 是维度（这里是 2）。`, 0);

  for (let i = 0; i < 3; i += 1) {
    for (let j = 0; j < 3; j += 1) {
      shown[i][j] = scores[i][j];
      push({ cells: shown.map((r) => r.slice()), current: [i, j] },
        `第 ${i + 1} 行第 ${j + 1} 列：T${i + 1} 的 Q 点乘 T${j + 1} 的 K，除以 √2 得 ${scores[i][j].toFixed(3)}。`, 4);
    }
    // 这一行做完 softmax
    for (let j = 0; j < 3; j += 1) shown[i][j] = weights[i][j];
    push({ cells: shown.map((r) => r.slice()), current: [i, 0] },
      `第 ${i + 1} 行做 softmax：三个分数变成加起来为 1 的权重 [${weights[i].map((v) => v.toFixed(3)).join(', ')}]。`, 5);
  }

  push({ cells: weights.map((r) => r.slice()) },
    `权重矩阵每行和都是 1。最后拿它去加权求和各 token 的 V：输出 ${out.map((v) => `(${v.map((x) => x.toFixed(3)).join(',')})`).join(' ')}。`, 6);

  return { steps, result: { scores, weights, out } };
}

// ─────────────────────────────────────────────────────────────
// 决策树划分（按 Gini 挑阈值）
// ─────────────────────────────────────────────────────────────

const SPLIT_POINTS = [
  { x: 1, y: 1, group: 1 }, { x: 2, y: 1, group: 1 },
  { x: 3, y: 1, group: 2 }, { x: 4, y: 1, group: 2 },
  { x: 5, y: 1, group: 1 },
  { x: 6, y: 1, group: 2 }, { x: 7, y: 1, group: 2 }, { x: 8, y: 1, group: 2 },
];

const gini = (labels) => {
  if (!labels.length) return 0;
  const c1 = labels.filter((l) => l === 1).length;
  const p1 = c1 / labels.length;
  const p2 = 1 - p1;
  return 1 - p1 * p1 - p2 * p2;
};

const splitCode = [
  '// 把候选阈值一个个试过去，谁的加权 Gini 最低就选谁',
  'for (const thr of candidates) {',
  '  const left = points.filter(p => p.x <= thr);',
  '  const right = points.filter(p => p.x > thr);',
  '  const g = (left.length * gini(left) + right.length * gini(right)) / n;',
  '  if (g < best) { best = g; bestThr = thr; }',
  '}',
];

function treeSplit() {
  const pts = SPLIT_POINTS;
  const steps = [];
  const candidates = [];
  for (let i = 0; i < pts.length - 1; i += 1) {
    if (pts[i].group !== pts[i + 1].group) candidates.push((pts[i].x + pts[i + 1].x) / 2);
  }

  let best = Infinity;
  let bestThr = candidates[0] ?? 0;

  const push = (state, note, line) => steps.push({
    state: { points: pts, splitX: state?.splitX ?? null, yMin: 0, yMax: 2, ...state },
    note, line, counters: { 候选: 0 },
  });

  push({}, `8 个样本、一个特征 x（纵轴只是把点摆开，没有含义）。决策树要找个阈值切开，让两边尽量"纯"。候选阈值取在两类交界处：${candidates.map((c) => c.toFixed(2)).join('、')}。`, 0);

  for (const thr of candidates) {
    const left = pts.filter((p) => p.x <= thr);
    const right = pts.filter((p) => p.x > thr);
    const g = (left.length * gini(left.map((p) => p.group))
      + right.length * gini(right.map((p) => p.group))) / pts.length;
    const better = g < best;
    if (better) { best = g; bestThr = thr; }
    push({ splitX: thr, highlight: pts.map((p, i) => (p.x <= thr ? i : -1)).filter((i) => i >= 0) },
      `切在 ${thr.toFixed(2)}：左 ${left.length} 个、右 ${right.length} 个，加权 Gini = ${g.toFixed(3)}${better ? '，比之前都好，记下' : '，不如之前的' }。`, 5);
  }

  push({ splitX: bestThr },
    `最好的阈值是 ${bestThr.toFixed(2)}，加权 Gini 降到 ${best.toFixed(3)}（0 表示切完两边都纯）。`, 5);
  return { steps, result: { threshold: bestThr, gini: best, candidates } };
}

// 两批合并成对外的一个数组
const aiBatch2 = [
  {
    id: 'ai-softmax',
    group: 'AI 算法',
    title: 'Softmax',
    brief: '把一组打分变成概率：先取指数（负数也能抬成正的），再各自除以总和。温度 T 越小分布越尖。',
    view: 'array',
    facts: [['时间', 'O(k)'], ['空间', 'O(k)'], ['性质', '全正且和为 1'], ['超参', '温度 T']],
    counters: '类', legend: [
      { cls: 'bar', text: '当前值' }, { cls: 'bar is-pivot', text: '正在算' }, { cls: 'bar is-settled', text: '已算出' },
    ],
    inputs: [
      { label: 'logits 2, 1, 0.1，T=1', make: () => ({ logits: SOFTMAX_LOGITS, T: 1 }) },
      { label: '同样的 logits，T=0.5（更尖）', make: () => ({ logits: SOFTMAX_LOGITS, T: 0.5 }) },
    ],
    code: softmaxCode,
    run: softmax,
  },
  {
    id: 'ai-conv',
    group: 'AI 算法',
    title: '卷积 · 边缘检测',
    brief: '卷积核在输入上逐格滑动，每次九个位置相乘再求和。这个核左列 +1、右列 -1，抓的是垂直边缘。',
    view: 'table',
    facts: [['时间', 'O(H·W·k²)'], ['空间', 'O(H·W)'], ['超参', '核大小 / 步长'], ['效果', '输出比输入小一圈']],
    counters: '窗口', legend: [
      { cls: 'cell', text: '输入' }, { cls: 'cell is-active', text: '窗口左上' }, { cls: 'cell is-compare', text: '窗口内' },
    ],
    inputs: [{ label: '5×5 输入、3×3 核', make: () => true }],
    code: convCode,
    run: convolution,
  },
  {
    id: 'ai-pooling',
    group: 'AI 算法',
    title: '最大池化',
    brief: '2×2 的窗口不重叠地滑，每格只留最大的那个。尺寸减半，最显眼的响应保留。',
    view: 'table',
    facts: [['时间', 'O(H·W)'], ['空间', 'O(H·W/4)'], ['超参', '窗口 / 步长'], ['作用', '降维、留主特征']],
    counters: '窗口', legend: [
      { cls: 'cell', text: '输入' }, { cls: 'cell is-active', text: '窗口左上' }, { cls: 'cell is-compare', text: '窗口内' },
    ],
    inputs: [{ label: '4×4 → 2×2', make: () => true }],
    code: poolCode,
    run: maxPooling,
  },
  {
    id: 'ai-logistic',
    group: 'AI 算法',
    title: '逻辑回归',
    brief: '线性打分过一遍 sigmoid 变成概率，再用交叉熵算误差。边界从"随便放"慢慢转到把两类分开。',
    view: 'scatter',
    facts: [['时间', '每轮 O(n)'], ['空间', 'O(1)'], ['超参', '学习率 / 轮数'], ['对比', '感知机只关心对错，它关心概率']],
    counters: '迭代', legend: SCATTER_LEGEND,
    inputs: [
      { label: '两类点，lr=0.5，30 步', make: () => ({ points: LOGISTIC_POINTS, lr: 0.5, steps: 30 }) },
      { label: 'lr=0.1（更慢）', make: () => ({ points: LOGISTIC_POINTS, lr: 0.1, steps: 30 }) },
    ],
    code: logisticCode,
    run: logistic,
  },
];

const aiBatch3 = [
  {
    id: 'ai-forward',
    group: 'AI 算法',
    title: '神经网络 · 前向传播',
    brief: '2-2-1 的小网络：每层先算加权和、再过 sigmoid。网络图的边上标着权重，节点下面标激活值。',
    view: 'network',
    facts: [['时间', '每层 O(节点数×输入数)'], ['空间', 'O(参数量)'], ['激活', 'sigmoid'], ['看什么', '数值一层层往后传']],
    counters: '层', legend: [
      { cls: 'circle', text: '神经元' }, { cls: 'circle is-active', text: '正在算' }, { cls: 'line', text: '权重' },
    ],
    inputs: [{ label: '固定权重，x=(1, 0.5)', make: () => true }],
    code: nnForwardCode,
    run: nnForward,
  },
  {
    id: 'ai-backward',
    group: 'AI 算法',
    title: '神经网络 · 反向传播',
    brief: '误差从输出往回走：乘 sigmoid 导数、按权重摊到每条边，再用梯度下降改权重。蓝虚线就是"往回传"的那一层。',
    view: 'network',
    facts: [['时间', 'O(参数量)'], ['空间', 'O(参数量)'], ['关键', '链式法则'], ['对比', '前向算值，反向算梯度']],
    counters: '层', legend: [
      { cls: 'circle', text: '神经元' }, { cls: 'line', text: '前向权重' }, { cls: 'line is-back', text: '梯度回传' },
    ],
    inputs: [{ label: '一步梯度下降，lr=0.5', make: () => true }],
    code: nnBackwardCode,
    run: nnBackward,
  },
];

const aiBatch4 = [
  {
    id: 'ai-attention',
    group: 'AI 算法',
    title: '注意力机制 · 单头 self-attention',
    brief: '每个 token 算出 Q、K、V；Q 和 K 两两点积打分，每行 softmax 成权重，再拿权重去加权求和各家的 V。表格里就是那个权重矩阵。',
    view: 'table',
    facts: [['时间', 'O(n²·d)'], ['空间', 'O(n²)'], ['看什么', '权重矩阵每行和为 1'], ['关键', '除以 √d 防梯度消失']],
    counters: '行', legend: [
      { cls: 'cell', text: '打分 / 权重' }, { cls: 'cell is-active', text: '当前格' },
    ],
    inputs: [{ label: '3 个 token、维度 2', make: () => true }],
    code: attnCode,
    run: attention,
  },
  {
    id: 'ai-tree-split',
    group: 'AI 算法',
    title: '决策树划分 · 按 Gini 挑阈值',
    brief: '把候选阈值一个个试过去，算左右两边的加权 Gini，谁最低就选谁。Gini 为 0 表示切完两边都纯。',
    view: 'scatter',
    facts: [['时间', '候选数 × O(n)'], ['空间', 'O(n)'], ['指标', '加权 Gini'], ['贪心', '每层只挑当前最优']],
    counters: '候选', legend: SCATTER_LEGEND,
    inputs: [{ label: '8 个样本、一个特征', make: () => true }],
    code: splitCode,
    run: treeSplit,
  },
];

export const aiAlgorithms = [...aiBatch1, ...aiBatch2, ...aiBatch3, ...aiBatch4];
