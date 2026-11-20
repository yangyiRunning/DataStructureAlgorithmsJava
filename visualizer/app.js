/**
 * 页面外壳：目录、控件、代码栏、计数器。
 *
 * 这一层不认识任何算法细节，只做三件事：
 *   1. 从 algos/ 里拿算法清单，建左侧目录；
 *   2. 用户点了某条，就调 algo.run(input) 拿到轨迹，交给 Player 播；
 *   3. Player 每报一步，就按 step.view 挑一个视图渲染器画出来。
 *
 * 加一个新算法 = 在 algos/ 里加一个对象，这里一行都不用改。
 */
import { Player } from './core/player.js';
import { empty, h } from './core/svg.js';
import * as arrayView from './views/arrayView.js';
import * as listView from './views/listView.js';
import * as treeView from './views/treeView.js';
import * as heapView from './views/heapView.js';
import * as graphView from './views/graphView.js';
import * as trieView from './views/trieView.js';
import * as ufView from './views/ufView.js';
import * as tableView from './views/tableView.js';
import * as boardView from './views/boardView.js';
import * as pegsView from './views/pegsView.js';
import * as hashView from './views/hashView.js';
import * as scatterView from './views/scatterView.js';
import * as networkView from './views/networkView.js';
import { sortingAlgorithms } from './algos/sorting.js';
import { binarySearchAlgorithms } from './algos/binarysearch.js';
import { twoPointerAlgorithms } from './algos/twopointers.js';
import { stackAlgorithms } from './algos/stack.js';
import { trieAlgorithms } from './algos/trie.js';
import { unionFindAlgorithms } from './algos/unionfind.js';
import { dpAlgorithms } from './algos/dp.js';
import { backtrackingAlgorithms } from './algos/backtracking.js';
import { dpOneDAlgorithms } from './algos/dp2.js';
import { arrayTechAlgorithms } from './algos/arraytech.js';
import { miscAlgorithms } from './algos/misc.js';
import { hashAlgorithms } from './algos/hash.js';
import { advancedTreeAlgorithms } from './algos/advancedtree.js';
import { leetcodeAlgorithms } from './algos/leetcode.js';
import { leetcode2Algorithms } from './algos/leetcode2.js';
import { leetcode3Algorithms } from './algos/leetcode3.js';
import { leetcode4Algorithms } from './algos/leetcode4.js';
import { leetcode5Algorithms } from './algos/leetcode5.js';
import { leetcode6Algorithms } from './algos/leetcode6.js';
import { leetcode7Algorithms } from './algos/leetcode7.js';
import { leetcode8Algorithms } from './algos/leetcode8.js';
import { leetcode9Algorithms } from './algos/leetcode9.js';
import { leetcode10Algorithms } from './algos/leetcode10.js';
import { leetcode11Algorithms } from './algos/leetcode11.js';
import { aiAlgorithms } from './algos/ai.js';
import { linkedListAlgorithms } from './algos/linkedlist.js';
import { treeAlgorithms } from './algos/tree.js';
import { heapAlgorithms } from './algos/heap.js';
import { graphAlgorithms } from './algos/graph.js';

const VIEWS = {
  array: arrayView,
  list: listView,
  tree: treeView,
  heap: heapView,
  graph: graphView,
  trie: trieView,
  uf: ufView,
  table: tableView,
  board: boardView,
  pegs: pegsView,
  hash: hashView,
  scatter: scatterView,
  network: networkView,
};

// 只在这里列一次。原来 import 和 ALGOS 是两张表，
// 加新模块时容易只加 import 忘了展开 —— 回溯那 3 个演示就这样从页面上
// 消失了整整几轮，而自检、对拍都读模块、不走这条路，全绿。
const MODULES = [
  sortingAlgorithms,
  binarySearchAlgorithms,
  linkedListAlgorithms,
  twoPointerAlgorithms,
  stackAlgorithms,
  treeAlgorithms,
  trieAlgorithms,
  unionFindAlgorithms,
  heapAlgorithms,
  graphAlgorithms,
  dpAlgorithms,
  dpOneDAlgorithms,
  arrayTechAlgorithms,
  miscAlgorithms,
  hashAlgorithms,
  advancedTreeAlgorithms,
  backtrackingAlgorithms,
  leetcodeAlgorithms,
  leetcode2Algorithms,
  leetcode3Algorithms,
  leetcode4Algorithms,
  leetcode5Algorithms,
  leetcode6Algorithms,
  leetcode7Algorithms,
  leetcode8Algorithms,
  leetcode9Algorithms,
  leetcode10Algorithms,
  leetcode11Algorithms,
  aiAlgorithms,
];

const ALGOS = MODULES.flatMap((m) => m ?? []);

const $ = (id) => document.getElementById(id);

const dom = {
  nav: $('nav'),
  title: $('title'),
  brief: $('brief'),
  facts: $('facts'),
  view: $('view'),
  note: $('note'),
  code: $('code'),
  lineNo: $('line-no'),
  counters: $('counters'),
  legend: $('legend'),
  scrub: $('scrub'),
  progress: $('progress'),
  speed: $('speed'),
  speedOut: $('speed-out'),
  btnPlay: $('btn-play'),
  btnPrev: $('btn-prev'),
  btnNext: $('btn-next'),
  btnFirst: $('btn-first'),
  btnLast: $('btn-last'),
  inputButtons: $('input-buttons'),
  langSwitch: $('lang-switch'),
  navFilter: $('nav-filter'),
};

let current = null;      // 当前算法对象
let codeLines = [];      // 代码栏的 <span> 节点，按行
let lang = 'js';         // 代码栏语言：js / py
let pySnippets = {};     // algoId -> Python 源码（由 tools/gen-py-snippets.mjs 生成）
let currentCode = [];    // 当前算法在 JS 下要显示的行（可能被 run() 的 code 覆盖）
let counterNodes = {};   // 计数器节点，避免每步重建
let inputSpecs = [];     // 当前算法的输入用例，供 ?i= 和按钮共用

const player = new Player({ onChange: paint });

// ── 目录 ──────────────────────────────────────────────────────

function buildNav() {
  empty(dom.nav);
  const groups = new Map();
  for (const algo of ALGOS) {
    if (!groups.has(algo.group)) groups.set(algo.group, []);
    groups.get(algo.group).push(algo);
  }
  for (const [group, items] of groups) {
    const wrap = h('div', { class: 'nav-group' });
    wrap.appendChild(h('h3', { text: group }));
    for (const algo of items) {
      const btn = h('button', {
        type: 'button',
        class: 'nav-item',
        text: algo.title,
        'aria-current': 'false',
      });
      btn.addEventListener('click', () => select(algo.id));
      btn.dataset.id = algo.id;
      // 关键词里带上分组名和 brief：搜 "注意力" 能命中，"attention" 也能
      const raw = `${algo.group} ${algo.title} ${algo.brief ?? ''}`.toLowerCase();
      btn.dataset.key = raw;
      btn.dataset.compact = raw.replace(/[\s\-_·、，。（）()]/g, '');
      wrap.appendChild(btn);
    }
    wrap.dataset.group = group;
    dom.nav.appendChild(wrap);
  }
}

/**
 * 侧边栏筛选。
 * 179 个演示排在一条竖列里，"AI 算法"在最后，光靠滚很难找到——
 * 输入框比目录树更直接。
 */
function filterNav() {
  const q = ($('nav-filter')?.value ?? '').trim().toLowerCase();
  let shown = 0;
  let total = 0;
  for (const wrap of dom.nav.querySelectorAll('.nav-group')) {
    let groupHit = 0;
    for (const btn of wrap.querySelectorAll('.nav-item')) {
      total += 1;
      const qc = q.replace(/[\s\-_·、，。（）()]/g, '');
      const hit = !q || btn.dataset.key.includes(q) || (qc && btn.dataset.compact.includes(qc));
      btn.hidden = !hit;
      if (hit) { groupHit += 1; shown += 1; }
    }
    wrap.hidden = groupHit === 0;
  }
  const count = $('nav-count');
  if (count) {
    count.textContent = q ? `筛出 ${shown} / ${total} 个演示` : '';
  }
}

// ── 切换算法 ──────────────────────────────────────────────────

function select(id) {
  const algo = ALGOS.find((a) => a.id === id);
  if (!algo) return;
  current = algo;

  for (const btn of dom.nav.querySelectorAll('.nav-item')) {
    btn.setAttribute('aria-current', String(btn.dataset.id === id));
  }

  document.title = `${algo.title} · 数据结构与算法动画演示`;
  dom.title.textContent = `${algo.group} · ${algo.title}`;
  dom.brief.textContent = algo.brief;

  empty(dom.facts);
  for (const [k, v] of algo.facts ?? []) {
    dom.facts.appendChild(h('div', {}, [h('dt', { text: k }), h('dd', { text: v })]));
  }

  renderCode(algo.code);

  // 图例
  empty(dom.legend);
  for (const item of algo.legend ?? []) {
    const sw = h('span', { class: 'sw' });
    sw.style.background = legendColor(item.cls);
    dom.legend.appendChild(h('li', {}, [sw, h('span', { text: item.text })]));
  }

  // 输入按钮
  empty(dom.inputButtons);
  inputSpecs = algo.inputs ?? [];
  (algo.inputs ?? []).forEach((spec, idx) => {
    const btn = h('button', { type: 'button', text: spec.label, 'aria-pressed': 'false' });
    btn.addEventListener('click', () => chooseInput(idx));
    dom.inputButtons.appendChild(btn);
    if (idx === 0) btn.setAttribute('aria-pressed', 'true');
  });

  const first = (algo.inputs ?? [])[0];
  if (first) load(algo, first.make());
  else player.load([]);
}

/**
 * 图例小色块：真去问浏览器"这个 class 画出来是什么颜色"，而不是在 JS 里再抄一份色值。
 *
 * 坑：视图里的元素是 SVG <rect>，上色用的是 fill 不是 background-color，
 * 拿一个 <div> 去取 backgroundColor 会永远是 transparent（第一版就是这么错的，
 * 图例全是白块）。所以这里造一个真的 <rect> 来取 fill。
 */
const COLOR_CACHE = new Map();
function legendColor(cls) {
  if (COLOR_CACHE.has(cls)) return COLOR_CACHE.get(cls);
  const probe = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  probe.setAttribute('width', '0');
  probe.setAttribute('height', '0');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('class', cls);
  probe.appendChild(rect);
  document.body.appendChild(probe);
  const color = getComputedStyle(rect).fill;
  probe.remove();
  COLOR_CACHE.set(cls, color);
  return color;
}

/**
 * 画代码栏。
 *
 * 支持"同一道题的不同写法共用一条目录"：run() 可以在结果里带上 code，
 * 用哪组输入就换成哪一套代码（四种二叉树遍历就是这么做的）。
 * 不带 code 就用算法本身的。
 */
function renderCode(lines) {
  currentCode = lines ?? [];
  paintCode();
}

/**
 * 真正画代码：JS 用算法自带的行（或 run() 覆盖的那套），Python 用 snippets.json 里的源码。
 * 两边行号不对应，所以切换语言时高亮会重置——这不是 bug，是两套代码本来就没法逐行对齐。
 */
function paintCode() {
  empty(dom.code);
  let lines;
  if (lang === 'py') {
    const src = pySnippets[current?.id];
    lines = src ? src.split('\n') : ['# 这个演示还没写 Python 版', '# 见 python/dsalab.py'];
  } else {
    lines = currentCode;
  }
  codeLines = lines.map((line) => {
    const span = h('span', { class: 'ln', text: line === '' ? ' ' : line });
    dom.code.appendChild(span);
    return span;
  });
}

/** 切到第 idx 组输入用例。地址栏的 ?i= 也走这里，保证两条路径行为完全一致 */
function chooseInput(idx) {
  const spec = inputSpecs[idx];
  if (!current || !spec) return;
  const buttons = dom.inputButtons.querySelectorAll('button');
  buttons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === idx)));
  load(current, spec.make());
}

function load(algo, input) {
  let built;
  try {
    built = algo.run(input);
  } catch (err) {
    dom.note.textContent = `这组输入跑失败了：${err.message}`;
    player.load([]);
    return;
  }
  renderCode(built.code ?? algo.code);
  const steps = built.steps.map((s) => ({ view: algo.view, ...s }));
  dom.scrub.max = String(Math.max(0, steps.length - 1));
  respaceCounters(steps[0]?.counters ?? {});
  player.load(steps);
}

// ── 渲染 ──────────────────────────────────────────────────────

let lastPaint = { step: null, index: 0, total: 0, playing: false };

function paint(state) {
  lastPaint = state;
  const { step, index, total, playing } = state;
  dom.btnPlay.textContent = playing ? '❙❙' : '▶';
  dom.btnPlay.setAttribute('aria-label', playing ? '暂停' : '播放');
  dom.btnPlay.classList.toggle('playing', playing);
  dom.btnPrev.disabled = index <= 0;
  dom.btnNext.disabled = total === 0 || index >= total - 1;
  dom.scrub.value = String(index);
  dom.progress.textContent = total ? `${index + 1} / ${total}` : '0 / 0';

  // 代码高亮：只有 JS 版能对上行号；Python 是另一套代码，强行标会指错
  const line = lang === 'js' ? (step?.line ?? -1) : -1;
  codeLines.forEach((node, i) => node.classList.toggle('on', i === line));
  dom.lineNo.textContent = lang === 'py'
    ? (step ? 'Python 版' : '—')
    : (line >= 0 ? `第 ${line + 1} 行` : '—');

  dom.note.textContent = step?.note ?? '';

  // 计数器
  for (const [k, v] of Object.entries(step?.counters ?? {})) {
    if (!counterNodes[k]) {
      const btn = h('div', { class: 'counter' }, [
        h('span', { class: 'k', text: k }),
        h('span', { class: 'v', text: '0' }),
      ]);
      dom.counters.appendChild(btn);
      counterNodes[k] = btn.querySelector('.v');
    }
    counterNodes[k].textContent = String(v);
  }

  if (!step) {
    empty(dom.view);
    return;
  }

  const view = VIEWS[step.view] ?? VIEWS.array;
  // 有的视图尺寸随内容变（比如数组视图的字符模式用矮画布），允许单独提供
  const g = view.geometryFor?.(step.state) ?? view.geometry;
  if (g) dom.view.setAttribute('viewBox', `0 0 ${g.W} ${g.H}`);
  view.render(dom.view, step.state, step);

  // 空结构（栈刚清空、树还没插入第一个节点）本来就该是空的，
  // 但留一块纯白/纯黑画布看着像坏了，给一句提示。
  // 判断放在这里而不是每个视图里：十一个视图各写一遍，漏一个就又空白了。
  const drawn = [...dom.view.childNodes].filter(
    (n) => n.nodeType === 1 && n.tagName !== 'defs',
  );
  if (drawn.length === 0) {
    const { W, H } = g ?? { W: 900, H: 380 };
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', String(W / 2));
    t.setAttribute('y', String(H / 2));
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('fill', 'var(--mut)');
    t.setAttribute('font-size', '13');
    t.textContent = '当前状态为空';
    dom.view.appendChild(t);
  }
}

/** 计数器键集合可能随算法变化，重建一次，别把上一个算法的计数留着 */
function respaceCounters(sample) {
  const keys = Object.keys(sample ?? {});
  const existing = Object.keys(counterNodes);
  if (keys.length === existing.length && keys.every((k) => counterNodes[k])) return;
  empty(dom.counters);
  counterNodes = {};
}

// ── 控件 ──────────────────────────────────────────────────────

dom.btnPlay.addEventListener('click', () => player.toggle());
dom.btnPrev.addEventListener('click', () => { player.pause(); player.prev(); });
dom.btnNext.addEventListener('click', () => { player.pause(); player.next(); });
dom.btnFirst.addEventListener('click', () => { player.pause(); player.first(); });
dom.btnLast.addEventListener('click', () => { player.pause(); player.last(); });

// 拖动进度条时先暂停：否则拖到一半播放器又往前推，手感是"拽不住"
dom.scrub.addEventListener('pointerdown', () => player.pause());
dom.scrub.addEventListener('input', () => player.goto(Number(dom.scrub.value)));

dom.speed.addEventListener('input', () => {
  const v = Number(dom.speed.value);
  player.setSpeed(v);
  dom.speedOut.textContent = `${v} 步/秒`;
});

document.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLInputElement) return;
  if (e.key === ' ') { e.preventDefault(); player.toggle(); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); player.pause(); player.next(); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); player.pause(); player.prev(); }
  else if (e.key === 'Home') { e.preventDefault(); player.pause(); player.first(); }
  else if (e.key === 'End') { e.preventDefault(); player.pause(); player.last(); }
});

$('nav-filter')?.addEventListener('input', filterNav);
// 按 "/" 直接跳到筛选框，避免每次都去点
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
    e.preventDefault();
    $('nav-filter')?.focus();
  }
});

// 语言切换：只影响代码栏，动画和计数不受影响。
// 用文档级委托而不是绑在具体节点上——绑节点时只要那一次 querySelector 拿到 null，
// 按钮就会静默失效（"点了没反应"就是这么来的）。
document.addEventListener('click', (e) => {
  const btn = e.target.closest?.('button[data-lang]');
  if (!btn) return;
  e.preventDefault();
  lang = btn.dataset.lang;
  const box = btn.parentElement;
  if (box) for (const b of box.querySelectorAll('button')) {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  }
  paintCode();
  if (lang === 'js' && lastPaint) paint(lastPaint);   // 切回 JS 时补上行高亮
});


// ── 夜灯模式 ──────────────────────────────────────────────────
// 和主站 personal-site 共用 localStorage 的 'yy-theme' 键：
// 在主站切了夜灯，进到这里也是夜灯，不用再点一次。
const THEME_KEY = 'yy-theme';
const root = document.documentElement;

function applyTheme(dark) {
  if (dark) root.setAttribute('data-theme', 'dark');
  else root.removeAttribute('data-theme');
  document.querySelector('meta[name=theme-color]')
    ?.setAttribute('content', dark ? '#0D1424' : '#FEFDFB');
  const btn = $('theme-toggle');
  if (btn) {
    btn.setAttribute('aria-label', dark ? '切换到日光模式' : '切换到夜灯模式');
    btn.setAttribute('title', dark ? '切换到日光模式' : '切换到夜灯模式');
    btn.setAttribute('aria-pressed', String(dark));
  }
}

(function initTheme() {
  // 地址栏 ?theme=dark / ?theme=light 优先，方便截图和分享指定配色
  const forced = new URLSearchParams(location.search).get('theme');
  if (forced === 'dark' || forced === 'light') {
    applyTheme(forced === 'dark');
    try { localStorage.setItem(THEME_KEY, forced); } catch {}
    return;
  }
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch {}
  // 没存过就跟系统偏好走；存过就听存的那次
  const dark = saved ? saved === 'dark'
    : window.matchMedia?.('(prefers-color-scheme: dark)').matches === true;
  applyTheme(dark);
})();

$('theme-toggle')?.addEventListener('click', () => {
  const dark = root.getAttribute('data-theme') !== 'dark';
  applyTheme(dark);
  try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch {}
});

// 挂在主站 /dsa/ 下时，给一个回主站的入口；单独打开时不显示（根路径没有主站）
if (location.pathname.startsWith('/dsa/')) {
  const back = $('back-home');
  if (back) back.hidden = false;
}

// ── 启动 ──────────────────────────────────────────────────────

buildNav();
player.setSpeed(Number(dom.speed.value));
dom.speedOut.textContent = `${dom.speed.value} 步/秒`;

// Python 源码：加载失败不影响主流程，只是切到 Python 时提示没写
fetch('./python/snippets.json')
  .then((r) => (r.ok ? r.json() : {}))
  .then((data) => {
    pySnippets = data;
    if (lang === 'py') paintCode();
  })
  .catch(() => {});

// 地址栏带 ?a=sort-quick 可以直接定位到某一条，方便截图和分享
const params = new URLSearchParams(location.search);

// ?clean=1 只留演示区：去掉顶栏、目录、代码栏和输入按钮。
// 录 GIF、截 README 配图、把页面嵌到别处都用这个模式，省得每处再写一遍裁剪。
if (params.has('clean')) document.body.classList.add('clean');

// ?lang=py 直接以 Python 版打开代码栏（截图和分享都用得上）
if (params.get('lang') === 'py') lang = 'py';

const wanted = params.get('a');
select(wanted && ALGOS.some((a) => a.id === wanted) ? wanted : ALGOS[0].id);

// ?s=12 直接跳到第 12 步。写截图脚本时要停在特定一帧（比如反转进行到一半），
// 没这个参数就得用无头浏览器去模拟点击，很容易点不稳。
// ?i=3 打开第 4 组输入用例（比如 AVL 的 LR 那一组）
const inputIdx = Number(params.get('i'));
if (Number.isInteger(inputIdx) && inputIdx > 0 && inputIdx < inputSpecs.length) chooseInput(inputIdx);

// URL 指定了 Python 版时，把按钮状态也对齐，别出现"代码是 Python、按钮亮着 JS"
if (lang === 'py') {
  for (const b of document.querySelectorAll('#lang-switch button')) {
    b.setAttribute('aria-pressed', String(b.dataset.lang === 'py'));
  }
}

const at = Number(params.get('s'));
if (Number.isFinite(at) && at > 0) player.goto(at - 1);
