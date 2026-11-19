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
    name: 'quick-sort',
    algo: 'sort-quick',
    inputIndex: 0,
    fps: 9,
    maxFrames: 26,
  },
];

const ALL = [...sortingAlgorithms, ...linkedListAlgorithms, ...treeAlgorithms];

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

async function main() {
  rmSync(FRAMES, { recursive: true, force: true });
  mkdirSync(FRAMES, { recursive: true });
  mkdirSync(MEDIA, { recursive: true });

  for (const clip of CLIPS) {
    const total = stepsOf(clip.algo, clip.inputIndex);
    const idx = sampleIndices(total, clip.maxFrames);
    const dir = join(FRAMES, clip.name);
    mkdirSync(dir, { recursive: true });

    process.stdout.write(`${clip.name}：共 ${total} 步，抽 ${idx.length} 帧 `);
    for (let n = 0; n < idx.length; n++) {
      const q = `a=${clip.algo}&i=${clip.inputIndex}&s=${idx[n] + 1}&clean=1`;
      await shoot(join(dir, `f${String(n).padStart(3, '0')}.png`), q, 1000, 640);
      process.stdout.write('.');
    }
    console.log(' 截图完成');

    // 拼 GIF 交给 Python（Pillow 有现成的调色板和帧时长控制，自己写太费劲）
    const py = `
from PIL import Image, ImageChops
import glob, os, sys

src = sorted(glob.glob(os.path.join(r"""${dir}""", "f*.png")))

def trim(im, pad=10):
    """按内容自动裁边：拿左上角当作页面底色，和底色差得多的像素才算内容。
    这样各视图画布高低不同也不用改裁剪坐标（早先写死坐标，链表视图换了高度就裁歪）。"""
    bg = Image.new("RGB", im.size, im.getpixel((4, 4)))
    diff = ImageChops.difference(im, bg).convert("L").point(lambda v: 255 if v > 10 else 0)
    box = diff.getbbox() or (0, 0, im.size[0], im.size[1])
    x0, y0, x1, y1 = box
    return im.crop((max(0, x0 - pad), max(0, y0 - pad),
                    min(im.size[0], x1 + pad), min(im.size[1], y1 + pad)))

# 第一帧先裁一次，后面的帧用同一个尺寸，否则 GIF 各帧大小不一致
raw = [Image.open(p).convert("RGB") for p in src]
first = trim(raw[0])
w, h = first.size
frames = []
for i, im in enumerate(raw):
    t = trim(im)
    canvas = Image.new("RGB", (w, h), (250, 249, 247))
    canvas.paste(t, ((w - t.size[0]) // 2, (h - t.size[1]) // 2))
    frames.append(canvas)
scale = 880 / w
frames = [f.resize((880, max(120, int(h * scale))), Image.LANCZOS) for f in frames]

pal = frames[0].quantize(colors=128, method=Image.MEDIANCUT, dither=Image.NONE)
out = [f.quantize(colors=128, method=Image.MEDIANCUT, dither=Image.NONE) for f in frames]
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
  await shoot(join(MEDIA, 'ui-full.png'), 'a=tree-avl-insert&i=2&s=14', 1500, 900);
  console.log('ui-full.png 完成');

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
