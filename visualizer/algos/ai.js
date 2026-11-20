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

export const aiAlgorithms = [
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
