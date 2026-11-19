/**
 * 生成 README 用的配图：GIF 动图 + 静态截图。
 *
 * 为什么不用录屏工具：
 *   这个页面的状态完全由 ?a=&i=&s= 三个参数决定，第 N 步就是一张确定的图。
 *   所以根本不需要"录"，按步号逐张截图、再按顺序拼成 GIF 就行——
 *   帧和算法步骤一一对应，不会录到中间态，也不会因为掉帧让节奏飘掉。
 *
 * 前提：先把页面服务起起来（python3 -m http.server 8788），脚本只负责截图和拼图。
 *
 * 用法：node tools/make-media.mjs
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { linkedListAlgorithms } from '../algos/linkedlist.js';
import { treeAlgorithms } from '../algos/tree.js';
import { sortingAlgorithms } from '../algos/sorting.js';
import { binarySearchAlgorithms } from '../algos/binarysearch.js';
import { twoPointerAlgorithms } from '../algos/twopointers.js';
import { stackAlgorithms } from '../algos/stack.js';
import { trieAlgorithms } from '../algos/trie.js';
import { unionFindAlgorithms } from '../algos/unionfind.js';
import { dpAlgorithms } from '../algos/dp.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const FRAMES = join(ROOT, 'build/frames');
const MEDIA = join(ROOT, 'media');
const HOST = 'http://127.0.0.1:8788';

const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
].find((p) => existsSync(p));

if (!CHROME) {
  console.error('找不到 Chrome，无法截图。');
  process.exit(2);
}

/**
 * 要生成哪几段动图。
 * 选这三段是因为它们最能说明"为什么必须是动画"：
 * 链表反转的箭头掉头、AVL 的双旋、快排的分区扫描。
 */
const CLIPS = [
  {
    name: 'list-reverse',
    algo: 'list-reverse',
    inputIndex: 0,
    fps: 7,
    maxFrames: 22,
  },
  {
    name: 'avl-rotate',
    algo: 'tree-avl-insert',
    inputIndex: 2,      // LR（双旋）那一组
    fps: 6,
    maxFrames: 18,
  },
  {
    name: 'dp-edit',
    algo: 'dp-edit-distance',
    inputIndex: 0,
    fps: 6,
    maxFrames: 18,
  },
  {
    name: 'window-var',
    algo: 'tp-window-var',
    inputIndex: 0,
    fps: 6,
    maxFrames: 20,
  },
  {
    name: 'quick-sort',
    algo: 'sort-quick',
    inputIndex: 0,
    fps: 9,
    maxFrames: 18,
  },
];

const ALL = [
  ...sortingAlgorithms,
  ...binarySearchAlgorithms,
  ...linkedListAlgorithms,
  ...twoPointerAlgorithms,
  ...stackAlgorithms,
  ...treeAlgorithms,
  ...trieAlgorithms,
  ...unionFindAlgorithms,
  ...dpAlgorithms,
];

function stepsOf(algoId, inputIndex) {
  const algo = ALL.find((a) => a.id === algoId);
  if (!algo) throw new Error(`没有这个算法：${algoId}`);
  const spec = algo.inputs[inputIndex];
  const built = algo.run(spec.make());
  return built.steps.length;
}

/** 长轨迹均匀抽帧，头和尾一定取到 */
function sampleIndices(total, maxFrames) {
  if (total <= maxFrames) return Array.from({ length: total }, (_, i) => i);
  const out = new Set();
  for (let k = 0; k < maxFrames; k++) {
    out.add(Math.round((k * (total - 1)) / (maxFrames - 1)));
  }
  return [...out].sort((a, b) => a - b);
}

function shoot(outFile, query, width, height) {
  return new Promise((resolve, reject) => {
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${width},${height}`,
      '--virtual-time-budget=4000',
      `--screenshot=${outFile}`,
      `${HOST}/index.html?${query}`,
    ];
    const child = spawn(CHROME, args, { stdio: 'ignore' });
    child.on('error', reject);
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`Chrome 退出码 ${code}`))));
  });
}

// 只重出某一段：node tools/make-media.mjs window-var
const only = process.argv[2];

async function main() {
  rmSync(FRAMES, { recursive: true, force: true });
  mkdirSync(FRAMES, { recursive: true });
  mkdirSync(MEDIA, { recursive: true });

  for (const clip of CLIPS) {
    if (only && clip.name !== only) continue;
    const total = stepsOf(clip.algo, clip.inputIndex);
    const idx = sampleIndices(total, clip.maxFrames);
    const dir = join(FRAMES, clip.name);
    mkdirSync(dir, { recursive: true });

    process.stdout.write(`${clip.name}：共 ${total} 步，抽 ${idx.length} 帧 `);
    for (let n = 0; n < idx.length; n++) {
      const q = `a=${clip.algo}&i=${clip.inputIndex}&s=${idx[n] + 1}&clean=1`;
      // 窗口给高一点：换版后字号和内边距变大，640 会把下方说明条挤出可视区
      await shoot(join(dir, `f${String(n).padStart(3, '0')}.png`), q, 1000, 840);
      process.stdout.write('.');
    }
    console.log(' 截图完成');

    // 拼 GIF 交给 Python（Pillow 有现成的调色板和帧时长控制，自己写太费劲）
    const py = `
from PIL import Image, ImageChops
import glob, os
import numpy as np

src = sorted(glob.glob(os.path.join(r"""${dir}""", "f*.png")))
WIDTH = 820

def trim(im, pad=12, tol=12):
    """按内容裁边。

    背景不能再用"取左上角一个像素"那种做法：这一版的页面顶部有一层很淡的纵向光晕，
    整张图从左到右同色、从上到下在变，拿单点颜色当基准会把边缘裁进正文里去。
    改成逐行右取底色——页面底色只沿纵向变化，横向是均匀的，
    所以第 y 行的背景就是它最左边那个像素。"""
    a = np.asarray(im.convert("RGB")).astype(int)
    h, w, _ = a.shape
    rowbg = a[:, 0:1, :]                       # 每行最左像素 = 该行底色
    mask = np.abs(a - rowbg).max(axis=2) > tol
    if not mask.any():
        return im
    cols = np.where(mask.any(axis=0))[0]
    rows = np.where(mask.any(axis=1))[0]
    x0 = max(0, cols.min() - pad); x1 = min(w, cols.max() + 1 + pad)
    y0 = max(0, rows.min() - pad); y1 = min(h, rows.max() + 1 + pad)
    return im.crop((x0, y0, x1, y1))

raw = [Image.open(p).convert("RGB") for p in src]

# 每帧各自裁，然后统一裁到"所有帧里最大的那个框"，多出来的补底色。
# 直接按第一帧的尺寸对齐的话，某一帧文字多折一行就会被切掉（前一版就这么切的）。
trimmed = [trim(im) for im in raw]
tw = max(t.size[0] for t in trimmed)
th = max(t.size[1] for t in trimmed)
bg = raw[0].getpixel((4, 4))
frames = []
for t in trimmed:
    canvas = Image.new("RGB", (tw, th), bg)
    canvas.paste(t, ((tw - t.size[0]) // 2, (th - t.size[1]) // 2))
    frames.append(canvas)

# 暖色页面上有很淡的渐变，颜色数给多了全是噪点、GIF 越大越糊；64 色对这种界面够用
frames = [f.resize((WIDTH, max(140, round(th * WIDTH / tw))), Image.LANCZOS) for f in frames]
out = [f.quantize(colors=64, method=Image.MEDIANCUT, dither=Image.NONE) for f in frames]
dur = int(1000 / ${clip.fps})
durations = [dur] * len(out)
durations[-1] = 1400          # 最后一帧多停一会儿，看完能记住结论
out[0].save(r"""${join(MEDIA, clip.name + '.gif')}""",
            save_all=True, append_images=out[1:], duration=durations,
            loop=0, optimize=True, disposal=2)
print("  ", os.path.getsize(r"""${join(MEDIA, clip.name + '.gif')}""") // 1024, "KB")
`;
    const r = spawnSync('python3', ['-c', py], { encoding: 'utf8' });
    if (r.status !== 0) {
      console.error(r.stderr);
      process.exit(1);
    }
    process.stdout.write(r.stdout);
  }

  // 静态图：整页界面（含代码栏），用来告诉读者"它不只是个动画"
  if (!only) {
    await shoot(join(MEDIA, 'ui-full.png'), 'a=tree-avl-insert&i=2&s=14', 1500, 900);
    console.log('ui-full.png 完成');
  }

  console.log('\n产物：');
  for (const f of readdirSync(MEDIA).sort()) {
    const s = spawnSync('stat', ['-f%z', join(MEDIA, f)], { encoding: 'utf8' }).stdout.trim();
    console.log(`  media/${f}  ${(Number(s) / 1024).toFixed(0)} KB`);
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
