# 数据结构与算法 · 动画演示

把仓库里那些刷题代码讲义化：每个算法跑一遍，把执行过程逐帧录下来，页面再回放。

在线目录见 `index.html`，75 个演示分成十三组：排序、查找、链表、双指针与滑窗、栈与队列、树、堆、图、数组技巧、动态规划、回溯、字符串、位运算、递归分治、哈希表。

完整知识点清单在 [TOPICS.md](TOPICS.md)：**73 项已全部完成**，每项都标了对应演示和 LeetCode 代表题。

## 怎么跑

**必须起一个 HTTP 服务，直接双击 `index.html` 会白屏。**

原因是页面用的是原生 ES Module（`<script type="module">`），浏览器对 `file://` 协议下的模块加载一律按跨域处理并拦掉，控制台会报 CORS 错误。这不是配置问题，改不了，只能起服务。

```bash
cd visualizer
python3 -m http.server 8788
# 打开 http://127.0.0.1:8788/
```

`npm run serve` 等价于上面那条命令。整个项目零依赖，不需要 `npm install`。

想直接定位到某个演示，地址栏加参数：

- `?a=graph-dijkstra` 打开指定算法
- `?s=12` 直接停在第 12 步（写截图脚本时用得上）

## 风格：和个人主站同一套令牌

这一页将来要作为作品放进主站，所以视觉语言直接对齐
`personal-site/web/src/styles/base.css`：暖奶油纸底、琥珀渐变、胶囊按钮、
大圆角卡片、柔光阴影、大字号粗标题。令牌是同一套值（`--brand-*` / `--ink` / `--sub` /
`--cream` / `--line` / `--card` / `--shadow` / `--radius` / `--font` / `--mono` / `--ease`），
改主站那套以后这边跟着对一遍就行。

主站的三条硬约束在这里同样成立，改样式前先看一眼：

- **不用 blur 光斑、玻璃拟态、渐变文字、紫青配色** —— 主站栽过三次，别往回退
- **`--mono` 只给数字和下标**，正文用系统字体栈；满屏等宽就是"技术风"的来源
- **动效克制**，且 `prefers-reduced-motion: reduce` 下全部关掉（已实现）

演示语义色单独一组，用主站体系里已有的暖琥珀 + 高考产品页那个蓝，
没引入第三种陌生色：未处理 `#F1E9DC` / 已就位 `#C9B79B` / 比较中 `#3E7FD9` 描边 /
移动 `#C96A10` 描边 / 基准 `#B45309` 实心。

### 挂到主站时

全部资源都是相对路径，直接拷到 `personal-site/web/public/dsa/` 即可从 `/dsa/` 访问，
不需要改任何路径（已实测子目录下 index / app.js / views 全部 200）。
它是纯静态零依赖，和 `web/public/gaokao/`、`web/public/kaleme/` 同一个形态，
不进 Vue 构建。

**注意**：子目录能跑是我实测过的（`/dsa/` 下 index、app.js、views 全 200）；
至于"Vite 会把 `web/public/` 下的文件复制进 `web/dist`、再由 `deploy.sh` 同步上线"这一步，
是照主站现有两个产品页的形态推断的，我没有实际部署验证。真要上线时先在本地
`npm --prefix web run build` 看一眼 `web/dist/dsa/` 在不在，别直接信这句话。

## 配图怎么来的

`media/` 下的三张 GIF 和一张界面图不是录屏，是 `tools/make-media.mjs` 按步号逐帧截的：

```bash
python3 -m http.server 8788   # 先起服务
node tools/make-media.mjs      # 截帧 → 拼 GIF → 写进 media/
```

页面的状态完全由 `?a=&i=&s=` 决定，第 N 步就是一张确定的图，所以不需要"录"——
按步号截图再按顺序拼起来，帧和算法步骤严格一一对应，不会录到中间态，也不会掉帧。
截图会先裁边再缩放，各视图画布高低不同也不用改裁剪坐标。

页面带 `?clean=1` 时只留演示区（去掉目录、代码栏、输入按钮），配图和嵌到别处都用这个模式。

## 代码栏：JS / Python

代码栏右上角可以切语言，Python 版来自 `python/dsalab.py`，**和演示、对拍用的是同一份代码**——
不存在"文档里那份"和"真正跑的那份"两套。

生成方式：

```bash
node tools/gen-py-snippets.mjs   # 从 dsalab.py 抽函数源码 → python/snippets.json
```

页面按 `python/snippets.json` 显示；改了 `dsalab.py` 要重新生成，否则代码栏会落后一版。
地址栏 `?lang=py` 可以直接以 Python 版打开。

> Python 的行号和 JS 对不上，所以切到 Python 时不显示"第 N 行"，也不做行高亮——
> 强行标会指到错的代码行上。

## 三个检查

除了下面两个验证脚本，还有两道"画得对不对"的检查——它们拦的是另一类问题：
算法算对了、自检也过了，但**画面上什么都没有**（只往 state 里塞了说明、没给视图主内容）。
这类问题自检永远查不出来，只能靠渲染。

```bash
node tools/audit-canvas.mjs                 # 静态：每帧的 state 里有没有主内容
open tools/render-check.html                # 动态：把每帧真渲染一遍，数画出了几个元素
```

`render-check.html` 需要用 HTTP 打开（跟主页面一样，ES module 不能走 file://）。

## 两个验证脚本

这两个不是摆设，它们各自负责一类"看着没问题但实际有错"的情况。

```bash
node tools/selftest.mjs      # 轨迹自检：不变量
node tools/crosscheck.mjs 20 # 跨语言对拍：结果正确性（20 = 每种输入跑 20 轮）
```

**selftest** 扫的是轨迹自身的结构：每步下标不越界、计数器不倒着走、代码行号指在范围内、排序结果真的有序、BST 中序真的升序、AVL 每个节点真的平衡、大顶堆的堆序没破。这类 bug 在浏览器里只表现为"某一步看着有点怪"，拖动进度条来回滑十遍也未必发现。

**crosscheck** 扫的是算法算得对不对：`java/dsalab/Oracle.java` 和 `python/dsalab.py` 是同一批算法的**另外两套独立实现**（Java + Python），三边拿同一批输入各算一遍，结果必须逐字一致。

对拍抓到过真问题：`list-insert` 的头插分支曾经忘了把 `head` 指向新节点，动画一路演得自洽，返回的却是原链表。这种错只有交叉验证能发现。

对拍比的是**最终结果**，不是每一帧。逐帧对齐会把两边的实现细节绑死（JS 把"取 key"单独算一步，Java 里根本没这一步），为了对齐帧数去改算法是本末倒置。中间状态交给 selftest。

跑 crosscheck 需要 JDK（要 `javac`）和 python3。脚本按这个顺序找：`JAVA_HOME` → Android Studio 自带 JBR → IntelliJ 自带 JBR → `/Library/Java/JavaVirtualMachines` → Homebrew 的 openjdk。找不到会直接告诉你，不会装作跑过。

## 目录结构

```
index.html            页面骨架
app.js                外壳：建目录、接控件、按 step.view 分派视图
assets/app.css        全部样式（含 SVG 元素的配色规则）
core/player.js        回放器：只管第几步，不认识任何算法
core/svg.js           极小的 SVG 构造工具
views/                视图：array / list / tree / heap / graph / trie / uf / table / board / pegs / hash
algos/sorting.js      排序四件套
algos/binarysearch.js 二分六个变体
algos/linkedlist.js   链表三个操作
algos/twopointers.js  双指针与滑动窗口
algos/stack.js        括号匹配、单调栈、单调队列
algos/tree.js         BST 与 AVL
algos/heap.js         堆的三个演示
algos/graph.js        BFS / DFS / Dijkstra / 拓扑 / Floyd / Prim / Kruskal / 网格 DFS
algos/dp.js, dp2.js   背包、编辑距离、爬楼梯、打家劫舍、LIS
algos/backtracking.js 全排列、子集、N 皇后
algos/misc.js         位运算、KMP、汉诺塔、回文
algos/hash.js         链地址法、LRU
algos/advancedtree.js 线段树、树状数组
TOPICS.md             知识点清单（施工图，标已有/待做）
tools/selftest.mjs    轨迹不变量自检
tools/crosscheck.mjs  JS ↔ Java 对拍
java/dsalab/Oracle.java  对拍用的 Java 实现
```

## 想加一个算法

1. 在 `algos/` 里加一个对象，导出到某组的数组里
2. 写 `run(input)`，返回 `{ steps, result }`
3. 每一步 `{ state, note, line, counters }`：
   - `state` 是**完整快照**，不是补丁——数组直接 `slice()` 一份，树/图导出一份新结构
   - `note` 是一句话说明，显示在页面下方
   - `line` 是 `code` 数组里的行号，页面据此高亮当前行
   - `counters` 是 `{ 名字: 数值 }`，只许单调不减

`code` 数组里显示的代码必须和 `run()` 里真正执行的逻辑逐行对应。改逻辑不改 `code`，高亮就会指错行，比不做高亮更误导人。

视图不用写新的：数组、链表、树、堆、图这五种形状覆盖了绝大多数算法。真要加，参考 `views/arrayView.js`，导出 `render(svg, state)` 和 `geometry` 就行，`app.js` 里注册一个名字即可。

## 设计上的几个决定

**为什么用快照而不是增量补丁。** 每一步存完整状态，内存多花点（数组最长十几项），换来"回退到任意一步永远正确"。补丁一旦漏记一个字段，往回拖就会看到上一个算法的残留状态。

**为什么快照里的根节点是现算的。** AVL 的旋转发生在递归回溯路上，一个全局 `root` 变量在那一刻可能还没更新完，读它会读到已经被转下去的旧根，画面上就是两个根或者树断成两半。所以从"没有父节点的那个节点"现推。

**为什么视图不做自动布局。** 教学图上"谁在谁上面"是有讲究的：拓扑排序必须画成从左到右的层，Dijkstra 要让近的先出来。力导向布局每次跑都换个形状，讲解的人自己都得先找一遍节点在哪。坐标手写死在数据里，稳定优先。

**为什么颜色只写在 CSS 里。** SVG 的 `fill` 属性写 `var(--x)` 在部分浏览器不生效，所以所有配色都在 `assets/app.css` 里按 class 定义。图例取色也是造一个真的 `<rect>` 去问浏览器，不在 JS 里再抄一份色值。

## 键盘操作

| 键 | 作用 |
|---|---|
| `空格` | 播放 / 暂停 |
| `←` `→` | 上一步 / 下一步 |
| `Home` `End` | 回到开头 / 跳到最后 |

## 与仓库其余部分的关系

这个目录自成一体，不依赖 `src/main/java` 下的刷题代码，也不参与 Maven 构建。`java/dsalab/` 只是为了让对拍有个独立实现，不是生产代码。

`algos/` 里的算法是按演示需要重写的，不是拿刷题文件改的——刷题代码大多是 LeetCode 的 `Solution` 类，没有插桩的位置，也没有"每一步长什么样"的概念。
