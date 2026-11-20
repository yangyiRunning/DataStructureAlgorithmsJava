package dsalab;

import java.util.*;

/**
 * 与前端演示同源同算法的 Java 实现，只用来做结果比对（对拍）。
 *
 * 存在意义：前端的动画是 JS 实现的算法跑出来的。如果只靠"看着像"，没法发现
 * 某个算法在 JS 里被写歪了——它照样能画出一段自洽的动画，只是算错了。
 * 这里用 Java 独立再写一遍，两边拿同一批输入算结果，结果必须逐字节一致。
 *
 * 注意这里比对的是"最终答案"，不是"每一帧"。
 * 两者步的分法本来就允许不同（比如 JS 把"取 key"单独算一步，Java 里没有这一步），
 * 强求逐帧对齐等于把两边的实现细节绑死，反而会为了对齐而改算法。
 * 中间状态由 tools/selftest.mjs 验（BST 中序有序、AVL 平衡、堆序、每一步下标不越界）。
 *
 * 输入协议（一行一个用例，便于一次 JVM 启动跑完全部用例）：
 *   <命令>;<参数组用分号分隔>;<参数组...>
 * 输出：每个用例一行结果，格式与 crosscheck.mjs 里的 canonical() 一一对应。
 */
public final class Oracle {

  public static void main(String[] args) throws Exception {
    Scanner sc = new Scanner(System.in);
    if (!sc.hasNextLine()) return;
    int n = Integer.parseInt(sc.nextLine().trim());
    StringBuilder out = new StringBuilder();
    for (int i = 0; i < n; i++) {
      String line = sc.nextLine().trim();
      out.append(run(line)).append('\n');
    }
    System.out.print(out);
  }

  private static String run(String spec) {
    String[] parts = spec.split(";");
    String cmd = parts[0];
    switch (cmd) {
      case "sort-bubble": return arr(bubble(ints(parts[1])));
      case "sort-insertion": return arr(insertion(ints(parts[1])));
      case "sort-selection": return arr(selection(ints(parts[1])));
      case "sort-quick": return arr(quick(ints(parts[1])));
      case "sort-merge": return arr(mergeSort(ints(parts[1])));
      case "sort-counting": return arr(countingSort(ints(parts[1])));
      case "sort-shell": return arr(shellSort(ints(parts[1])));
      case "sort-radix": return arr(radixSort(ints(parts[1])));
      case "list-reverse": return arr(reverse(ints(parts[1])));
      case "list-insert": return arr(insertAt(ints(parts[1]), Integer.parseInt(parts[2]), Integer.parseInt(parts[3])));
      case "list-delete": return arr(remove(ints(parts[1]), Integer.parseInt(parts[2])));
      case "list-merge": return "arr:" + mergeLists(parts[1], parts[2]);
      case "list-reverse-k": return "arr:" + reverseK(ints(parts[1]), Integer.parseInt(parts[2]));
      case "st-two-stacks": return "transfers:" + twoStacks(parts[1]);
      case "st-circle-queue": return "leftover:" + circleQueue(parts[1]);
      case "hash-chaining": return chaining(parts[1]);
      case "hash-lru": return "order:" + lru(parts[1]);
      case "str-palindrome": return "ok:" + isPalindrome(parts[1]);
      case "lc-dup-exists": return "ok:" + dupExists(arr0(parts[1]));
      case "lc-majority": return "num:" + majority(arr0(parts[1]));
      case "lc-missing-number": return "num:" + missingNum(arr0(parts[1]));
      case "lc-remove-element": {
        List<Integer> out = removeElem(arr0(parts[1]), Integer.parseInt(parts[2]));
        return "len:" + out.size() + "|arr:" + arr(out);
      }
      case "lc-merge-sorted-arr": return "arr:" + arr(mergeSorted(arr0(parts[1]), Integer.parseInt(parts[2]), arr0(parts[3]), Integer.parseInt(parts[4])));
      case "lc-plus-one": return "arr:" + arr(plusOne(arr0(parts[1])));
      case "lc-reverse-string": return "out:" + new StringBuilder(parts[1]).reverse();
      case "lc-anagram": return "ok:" + isAnagram(parts[1], parts[2]);
      case "lc-subsequence": return "ok:" + isSubseq(parts[1], parts[2]);
      case "lc-count-ones": return "count:" + Integer.bitCount(Integer.parseInt(parts[1]));
      case "lc-invert-tree": return "order:" + invertTree(parts[1]);
      case "lc-path-sum": return "ok:" + pathSum(parts[1], Integer.parseInt(parts[2]));
      case "lc-first-missing": return "ans:" + firstMissing(arr0(parts[1]));
      case "lc-longest-palindrome": return "len:" + longestPalin(parts[1]).length();
      case "lc-common-prefix": return "prefix:" + commonPrefix(parts[1]);
      case "lc-reverse-words": return "out:" + reverseWords(parts[1]);
      case "lc-hamming": return "dist:" + hamming(Integer.parseInt(parts[1]), Integer.parseInt(parts[2]));
      case "lc-count-bits": return "arr:" + arr(countBits(Integer.parseInt(parts[1])));
      case "lc-spiral": return "out:" + arr(spiral());
      case "lc-rotate-image": return "arr:" + arr(rotateImage());
      case "lc-search-matrix": return "ok:" + searchMatrix240(Integer.parseInt(parts[1]));
      case "lc-merge-k": return "arr:" + arr(mergeK(parts[1]));
      case "lc-add-two": return "arr:" + arr(addTwo(arr0(parts[1]), arr0(parts[2])));
      case "lc-intersection": {
        List<Integer> shared = parts.length > 3 && !parts[3].isEmpty() ? ints(parts[3]) : new ArrayList<>();
        return "val:" + intersect(arr0(parts[1]), arr0(parts[2]), shared);
      }
      case "lc-palindrome-list": return "ok:" + isPalinList(arr0(parts[1]));
      case "lc-largest-rect": return "area:" + largestRect(arr0(parts[1]));
      case "lc-group-anagrams": return "count:" + groupAnagrams(parts[1]);
      case "lc-generate-parens": return "count:" + genParens(Integer.parseInt(parts[1]));
      case "lc-word-search": return "ok:" + wordSearch(parts[1]);
      case "lc-word-break": return "ok:" + wordBreak(parts[1], parts[2].split(","));
      case "lc-longest-consecutive": return "len:" + longestConsecutive(arr0(parts[1]));
      case "lc-min-stack": return "out:" + minStack(parts[1]);
      case "lc-decode-string": return "out:" + decodeString(parts[1]);
      case "lc-lca": return "lca:" + lcaValue(parts[1], Integer.parseInt(parts[2]), Integer.parseInt(parts[3]));
      case "lc-validate-bst": return "ok:" + validateBst(parts[1]);
      case "lc-oranges": return "minutes:" + oranges();
      case "lc-top-k-frequent": return "top:" + topKFrequent(arr0(parts[1]), Integer.parseInt(parts[2]));
      case "lc-stock": return "profit:" + stock(arr0(parts[1]));
      case "lc-max-product": return "product:" + maxProduct(arr0(parts[1]));
      case "lc-move-zero": return "arr:" + arr(moveZero(arr0(parts[1])));
      case "lc-product-except-self": return "arr:" + arr(productExcept(arr0(parts[1])));
      case "lc-rotate": return "arr:" + arr(rotateArr(arr0(parts[1]), Integer.parseInt(parts[2])));
      case "lc-max-depth": return "depth:" + maxDepthTree(parts[1]);
      case "lc-symmetric": return "ok:" + isSym(parts[1]);
      case "lc-diameter": return "diameter:" + diameter(parts[1]);
      case "lc-coin-change": return "coins:" + coinChange(arr0(parts[1]), Integer.parseInt(parts[2]));
      case "lc-three-sum": return "count:" + threeSum(arr0(parts[1]));
      case "lc-container": return "max:" + maxArea(arr0(parts[1]));
      case "lc-max-subarray": return "sum:" + maxSub(arr0(parts[1]));
      case "lc-unique-paths": return "paths:" + uniquePaths(Integer.parseInt(parts[1]), Integer.parseInt(parts[2]));
      case "adv-segment-tree": return "sum:" + segQuery(parts[1], Integer.parseInt(parts[2]), Integer.parseInt(parts[3]));
      case "adv-fenwick": return "sum:" + fenwick(parts[1], Integer.parseInt(parts[2]));
      case "list-middle": return "val:" + middleVal(ints(parts[1]));
      case "list-cycle": return "entry:" + cycleEntry(ints(parts[1]), parts[2].equals("null") ? -1 : Integer.parseInt(parts[2]));
      case "list-remove-nth": return "arr:" + arr(removeNth(ints(parts[1]), Integer.parseInt(parts[2])));
      case "tree-traverse": return "order:" + String.join(",", traverse(parts[1]));
      case "tree-bst-delete": {
        Node r = null;
        for (int v : ints(parts[1])) r = bstPut(r, v);
        r = bstRemove(r, Integer.parseInt(parts[2]));
        List<Integer> in2 = new ArrayList<>();
        inorder(r, in2);
        return "inorder:" + arr(in2) + "|size:" + size(r);
      }
      case "tree-bst-insert": {
        List<Integer> seq = ints(parts[1]);
        Node r = null;
        for (int v : seq) r = bstPut(r, v);
        List<Integer> in = new ArrayList<>();
        inorder(r, in);
        return "inorder:" + arr(in) + "|height:" + height(r) + "|size:" + size(r);
      }
      case "tree-avl-insert": {
        List<Integer> seq = ints(parts[1]);
        Avl a = new Avl();
        for (int v : seq) a.put(v);
        List<Integer> in = new ArrayList<>();
        inorder(a.root, in);
        return "inorder:" + arr(in) + "|height:" + height(a.root) + "|rotations:" + a.rotations
            + "|size:" + size(a.root);
      }
      case "heap-push": {
        List<Integer> h = ints(parts[1]);
        heapPush(h, Integer.parseInt(parts[2]));
        return arr(h);
      }
      case "heap-pop": {
        List<Integer> h = ints(parts[1]);
        int top = heapPop(h);
        return "arr:" + arr(h) + "|popped:" + top;
      }
      case "heap-sort": return arr(heapSort(ints(parts[1])));
      case "bs-standard": return "idx:" + bsStandard(arr0(parts[1]), Integer.parseInt(parts[2]));
      case "bs-left": return "idx:" + bsLeft(arr0(parts[1]), Integer.parseInt(parts[2]));
      case "bs-right": return "idx:" + bsRight(arr0(parts[1]), Integer.parseInt(parts[2]));
      case "bs-lower": return "idx:" + bsLower(arr0(parts[1]), Integer.parseInt(parts[2]));
      case "bs-upper": return "idx:" + bsUpper(arr0(parts[1]), Integer.parseInt(parts[2]));
      case "bs-rotated": return "idx:" + bsRotated(arr0(parts[1]), Integer.parseInt(parts[2]));
      case "tp-two-sum": return "pair:" + twoSum(arr0(parts[1]), Integer.parseInt(parts[2]));
      case "tp-dedupe": {
        List<Integer> d = dedupe(arr0(parts[1]));
        return "arr:" + arr(d) + "|len:" + d.size();
      }
      case "tp-window-fixed": return "sum:" + maxWindowSum(arr0(parts[1]), Integer.parseInt(parts[2]));
      case "tp-window-var": return "len:" + longestUnique(parts[1]);
      case "st-brackets": return "ok:" + brackets(parts[1]);
      case "st-monotonic": return "arr:" + arr(dailyTemps(arr0(parts[1])));
      case "st-deque": return "arr:" + arr(slidingMax(arr0(parts[1]), Integer.parseInt(parts[2])));
      case "graph-bfs": return "order:" + String.join(",", bfs(parts[1]));
      case "graph-dfs": return "order:" + String.join(",", dfs(parts[1]));
      case "graph-dijkstra": return dijkstra(parts[1]);
      case "graph-topo": return "order:" + String.join(",", topo());
      case "trie-insert": {
        String[] words = parts[1].split(",");
        Trie t = new Trie();
        for (String w : words) t.insert(w);
        return "nodes:" + t.count() + "|terminals:" + t.terminals;
      }
      case "trie-query": {
        Trie t = new Trie();
        for (String w : new String[]{"cat", "car", "dog"}) t.insert(w);
        boolean ok = parts[2].equals("prefix") ? t.startsWith(parts[1]) : t.search(parts[1]);
        return "ok:" + ok;
      }
      case "uf-union": {
        Uf uf = new Uf(7);
        if (!parts[1].isEmpty()) {
          for (String pair : parts[1].split(",")) {
            String[] ab = pair.split("-");
            uf.union(Integer.parseInt(ab[0]), Integer.parseInt(ab[1]));
          }
        }
        return "unions:" + uf.unions;
      }
      case "uf-find": {
        Uf uf = new Uf(7);
        for (int i = 1; i < 7; i++) uf.parent[i] = i - 1;   // 先造一条链
        int r = uf.find(Integer.parseInt(parts[1]));
        return "root:" + r;
      }
      case "sort-quickselect": {
        int[] a = arr0(parts[1]);
        return "val:" + quickSelect(a, Integer.parseInt(parts[2]));
      }
      case "bt-permute": return "count:" + permuteCount(arr0(parts[1]));
      case "bt-subsets": return "count:" + (1 << arr0(parts[1]).length);
      case "bt-nqueens": return "count:" + nQueens(Integer.parseInt(parts[1]));
      case "dp-knapsack": {
        int[] w = arr0(parts[1]);
        int[] v = arr0(parts[2]);
        int C = Integer.parseInt(parts[3]);
        int[] dp = new int[C + 1];
        for (int i = 0; i < w.length; i++) {
          for (int c = C; c >= w[i]; c--) {          // 01 背包一维写法必须倒着走
            dp[c] = Math.max(dp[c], dp[c - w[i]] + v[i]);
          }
        }
        return "ans:" + dp[C];
      }
      case "dp-edit-distance": return "dist:" + editDistance(parts[1], parts[2]);
      case "graph-islands": return "count:" + islands();
      case "heap-topk": return "top:" + topK(arr0(parts[1]), Integer.parseInt(parts[2]));
      case "at-intervals": return intervals(parts[1]);
      case "bit-single-number": return "ans:" + single(arr0(parts[1]));
      case "bit-subset-mask": return "count:" + (1 << arr0(parts[1]).length);
      case "str-kmp": return "idx:" + kmp(parts[1], parts[2]);
      case "rec-hanoi": return "moves:" + ((1 << Integer.parseInt(parts[1])) - 1);
      case "graph-floyd": return floydAll();
      case "graph-prim": return primMst(parts[1]);
      case "dp-climb": return "ans:" + climb(Integer.parseInt(parts[1]));
      case "dp-rob": return "ans:" + rob(arr0(parts[1]));
      case "dp-lis": return "ans:" + lis(arr0(parts[1]));
      case "dp-unbounded": return "ans:" + unbounded(arr0(parts[1]), arr0(parts[2]), Integer.parseInt(parts[3]));
      case "at-prefix-sum": {
        int[] a = arr0(parts[1]);
        int[] pre = new int[a.length + 1];
        for (int i = 0; i < a.length; i++) pre[i + 1] = pre[i] + a[i];
        StringBuilder sb = new StringBuilder("pre:");
        for (int i = 0; i < pre.length; i++) { if (i > 0) sb.append(','); sb.append(pre[i]); }
        sb.append("|total:").append(pre[pre.length - 1]);
        return sb.toString();
      }
      case "at-diff-array": {
        int n = Integer.parseInt(parts[1]);
        int[] d = new int[n + 1];
        if (!parts[2].isEmpty()) {
          for (String op : parts[2].split(",")) {
            String[] lrv = op.split(":");
            int l = Integer.parseInt(lrv[0]), r = Integer.parseInt(lrv[1]), v = Integer.parseInt(lrv[2]);
            d[l] += v;
            d[r + 1] -= v;
          }
        }
        int cur = 0;
        List<Integer> res = new ArrayList<>();
        for (int i = 0; i < n; i++) { cur += d[i]; res.add(cur); }
        return "arr:" + arr(res);
      }
      case "at-jump-game": return "ok:" + canJump(arr0(parts[1]));
      case "graph-bellman-ford": return bellman(parts[1]);
      case "graph-kruskal": return kruskalMst();
      default: throw new IllegalArgumentException("未知命令：" + cmd);
    }
  }

  // ── 工具 ──────────────────────────────────────────────

  private static List<Integer> ints(String s) {
    List<Integer> out = new ArrayList<>();
    if (s.isEmpty()) return out;
    for (String t : s.split(",")) out.add(Integer.parseInt(t.trim()));
    return out;
  }

  private static String arr(List<Integer> a) {
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < a.size(); i++) {
      if (i > 0) sb.append(',');
      sb.append(a.get(i));
    }
    return sb.toString();
  }

  private static int[] arr0(String s) {
    List<Integer> l = ints(s);
    int[] a = new int[l.size()];
    for (int i = 0; i < a.length; i++) a[i] = l.get(i);
    return a;
  }

  private static void swap(List<Integer> a, int i, int j) {
    int t = a.get(i);
    a.set(i, a.get(j));
    a.set(j, t);
  }

  // ── 排序 ──────────────────────────────────────────────

  static List<Integer> bubble(List<Integer> in) {
    List<Integer> a = new ArrayList<>(in);
    for (int end = a.size() - 1; end > 0; end--) {
      boolean swapped = false;
      for (int i = 0; i < end; i++) {
        if (a.get(i) > a.get(i + 1)) {
          swap(a, i, i + 1);
          swapped = true;
        }
      }
      if (!swapped) break;
    }
    return a;
  }

  static List<Integer> insertion(List<Integer> in) {
    List<Integer> a = new ArrayList<>(in);
    for (int i = 1; i < a.size(); i++) {
      int key = a.get(i);
      int j = i - 1;
      while (j >= 0 && a.get(j) > key) {
        a.set(j + 1, a.get(j));
        j--;
      }
      a.set(j + 1, key);
    }
    return a;
  }

  static List<Integer> selection(List<Integer> in) {
    List<Integer> a = new ArrayList<>(in);
    for (int i = 0; i < a.size() - 1; i++) {
      int min = i;
      for (int j = i + 1; j < a.size(); j++) if (a.get(j) < a.get(min)) min = j;
      if (min != i) swap(a, i, min);
    }
    return a;
  }

  static List<Integer> quick(List<Integer> in) {
    List<Integer> a = new ArrayList<>(in);
    quickRec(a, 0, a.size() - 1);
    return a;
  }

  private static void quickRec(List<Integer> a, int lo, int hi) {
    if (lo >= hi) return;
    int p = a.get(hi);
    int i = lo;
    for (int j = lo; j < hi; j++) {
      if (a.get(j) < p) {
        swap(a, i, j);
        i++;
      }
    }
    swap(a, i, hi);
    quickRec(a, lo, i - 1);
    quickRec(a, i + 1, hi);
  }

  static List<Integer> mergeSort(List<Integer> in) {
    List<Integer> a = new ArrayList<>(in);
    mergeRec(a, 0, a.size() - 1);
    return a;
  }

  private static void mergeRec(List<Integer> a, int lo, int hi) {
    if (lo >= hi) return;
    int mid = (lo + hi) >> 1;
    mergeRec(a, lo, mid);
    mergeRec(a, mid + 1, hi);
    List<Integer> tmp = new ArrayList<>();
    int i = lo, j = mid + 1;
    while (i <= mid && j <= hi) tmp.add(a.get(i) <= a.get(j) ? a.get(i++) : a.get(j++));
    while (i <= mid) tmp.add(a.get(i++));
    while (j <= hi) tmp.add(a.get(j++));
    for (int k = 0; k < tmp.size(); k++) a.set(lo + k, tmp.get(k));
  }

  static List<Integer> countingSort(List<Integer> in) {
    int max = 0;
    for (int v : in) max = Math.max(max, v);
    int[] cnt = new int[max + 1];
    for (int v : in) cnt[v]++;
    List<Integer> out = new ArrayList<>();
    for (int v = 0; v <= max; v++) for (int k = 0; k < cnt[v]; k++) out.add(v);
    return out;
  }

  static List<Integer> shellSort(List<Integer> in) {
    List<Integer> a = new ArrayList<>(in);
    for (int gap = a.size() >> 1; gap > 0; gap >>= 1) {
      for (int i = gap; i < a.size(); i++) {
        int key = a.get(i);
        int j = i - gap;
        while (j >= 0 && a.get(j) > key) {
          a.set(j + gap, a.get(j));
          j -= gap;
        }
        a.set(j + gap, key);
      }
    }
    return a;
  }

  static List<Integer> radixSort(List<Integer> in) {
    List<Integer> a = new ArrayList<>(in);
    int max = 0;
    for (int v : a) max = Math.max(max, v);
    for (int exp = 1; max / exp > 0; exp *= 10) {
      List<List<Integer>> buckets = new ArrayList<>();
      for (int d = 0; d < 10; d++) buckets.add(new ArrayList<>());
      for (int v : a) buckets.get((v / exp) % 10).add(v);
      a.clear();
      for (List<Integer> b : buckets) a.addAll(b);
    }
    return a;
  }

  static int quickSelect(int[] in, int k) {
    int[] a = in.clone();
    int target = a.length - k;      // 第 k 大 → 升序下标
    int lo = 0, hi = a.length - 1;
    while (true) {
      int p = a[hi], i = lo;
      for (int j = lo; j < hi; j++) {
        if (a[j] < p) { int t = a[i]; a[i] = a[j]; a[j] = t; i++; }
      }
      int t = a[i]; a[i] = a[hi]; a[hi] = t;
      if (i == target) return a[i];
      if (i < target) lo = i + 1; else hi = i - 1;
    }
  }

  // ── 回溯 ──────────────────────────────────────────────

  static int permuteCount(int[] nums) {
    return fact(nums.length);
  }

  private static int fact(int n) {
    int r = 1;
    for (int i = 2; i <= n; i++) r *= i;
    return r;
  }

  static int nQueens(int n) {
    int[] queens = new int[n];
    java.util.Arrays.fill(queens, -1);
    return nqDfs(queens, 0, n);
  }

  private static int nqDfs(int[] queens, int r, int n) {
    if (r == n) return 1;
    int total = 0;
    for (int c = 0; c < n; c++) {
      boolean ok = true;
      for (int rr = 0; rr < r; rr++) {
        int cc = queens[rr];
        if (cc == c || Math.abs(cc - c) == Math.abs(rr - r)) { ok = false; break; }
      }
      if (!ok) continue;
      queens[r] = c;
      total += nqDfs(queens, r + 1, n);
      queens[r] = -1;
    }
    return total;
  }

  // ── 链表（用 ArrayList 模拟值序列，结论等价） ─────────────

  static List<Integer> reverse(List<Integer> in) {
    List<Integer> out = new ArrayList<>(in);
    Collections.reverse(out);
    return out;
  }

  static List<Integer> insertAt(List<Integer> in, int k, int val) {
    List<Integer> a = new ArrayList<>(in);
    if (k >= 0 && k <= a.size()) a.add(k, val);
    return a;
  }

  static List<Integer> remove(List<Integer> in, int val) {
    List<Integer> a = new ArrayList<>(in);
    a.remove(Integer.valueOf(val));
    return a;
  }

  // ── 网格 DFS ──────────────────────────────────────────

  static final int[][] ISLAND_GRID = {
      {1, 1, 0, 0, 1},
      {1, 0, 0, 1, 1},
      {0, 0, 1, 0, 0},
      {1, 0, 1, 1, 0},
  };

  static int islands() {
    int R = ISLAND_GRID.length, C = ISLAND_GRID[0].length;
    int[][] g = new int[R][C];
    for (int i = 0; i < R; i++) g[i] = ISLAND_GRID[i].clone();
    int count = 0;
    for (int r = 0; r < R; r++)
      for (int c = 0; c < C; c++)
        if (g[r][c] == 1) { count++; flood(g, r, c); }
    return count;
  }

  private static void flood(int[][] g, int r, int c) {
    if (r < 0 || r >= g.length || c < 0 || c >= g[0].length) return;
    if (g[r][c] != 1) return;
    g[r][c] = 0;
    flood(g, r + 1, c); flood(g, r - 1, c);
    flood(g, r, c + 1); flood(g, r, c - 1);
  }

  // ── TopK ──────────────────────────────────────────────

  static String topK(int[] nums, int k) {
    java.util.PriorityQueue<Integer> pq = new java.util.PriorityQueue<>();
    for (int x : nums) {
      pq.add(x);
      if (pq.size() > k) pq.poll();
    }
    List<Integer> out = new ArrayList<>(pq);
    out.sort((a, b) -> b - a);
    return arr(out);
  }

  // ── 区间调度 ──────────────────────────────────────────

  static String intervals(String spec) {
    List<int[]> list = new ArrayList<>();
    if (!spec.isEmpty()) {
      for (String part : spec.split(",")) {
        String[] se = part.split("-");
        list.add(new int[]{Integer.parseInt(se[0]), Integer.parseInt(se[1])});
      }
    }
    list.sort((a, b) -> a[1] - b[1]);
    int removed = 0, kept = 0, lastEnd = Integer.MIN_VALUE;
    for (int[] it : list) {
      if (it[0] >= lastEnd) { lastEnd = it[1]; kept++; }
      else removed++;
    }
    return "removed:" + removed + "|kept:" + kept;
  }

  // ── 位运算 / 字符串 / 递归 ────────────────────────────

  static int single(int[] nums) {
    int ans = 0;
    for (int x : nums) ans ^= x;
    return ans;
  }

  static int kmp(String s, String p) {
    int n = p.length();
    int[] next = new int[n];
    int k = 0;
    for (int i = 1; i < n; i++) {
      while (k > 0 && p.charAt(i) != p.charAt(k)) k = next[k - 1];
      if (p.charAt(i) == p.charAt(k)) k++;
      next[i] = k;
    }
    int j = 0;
    for (int i = 0; i < s.length(); i++) {
      while (j > 0 && s.charAt(i) != p.charAt(j)) j = next[j - 1];
      if (s.charAt(i) == p.charAt(j)) j++;
      if (j == n) return i - j + 1;
    }
    return -1;
  }

  // ── 图：Floyd / Prim ──────────────────────────────────

  static String floydAll() {
    int n = NODES.length;
    Map<String, Integer> idx = new LinkedHashMap<>();
    for (int i = 0; i < n; i++) idx.put(NODES[i], i);
    int[][] d = new int[n][n];
    for (int[] row : d) java.util.Arrays.fill(row, Integer.MAX_VALUE / 4);
    for (int i = 0; i < n; i++) d[i][i] = 0;
    for (Object[] e : EDGES) {
      int i = idx.get((String) e[0]), j = idx.get((String) e[1]), w = (Integer) e[2];
      d[i][j] = Math.min(d[i][j], w);
      d[j][i] = Math.min(d[j][i], w);
    }
    for (int k = 0; k < n; k++)
      for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
          if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];

    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < n; i++) {
      if (i > 0) sb.append(';');
      sb.append(NODES[i]).append(':');
      for (int j = 0; j < n; j++) {
        if (j > 0) sb.append('/');
        sb.append(d[i][j]);
      }
    }
    return sb.toString();
  }

  static String primMst(String start) {
    Set<String> inTree = new LinkedHashSet<>();
    inTree.add(start);
    List<String> picked = new ArrayList<>();
    int total = 0;
    while (inTree.size() < NODES.length) {
      Object[] best = null;
      for (Object[] e : EDGES) {
        boolean cu = inTree.contains((String) e[0]);
        boolean cv = inTree.contains((String) e[1]);
        if (cu == cv) continue;
        if (best == null || (Integer) e[2] < (Integer) best[2]) best = e;
      }
      if (best == null) break;
      String u = (String) best[0], v = (String) best[1];
      String outside = inTree.contains(u) ? v : u;
      inTree.add(outside);
      total += (Integer) best[2];
      picked.add(u.compareTo(v) < 0 ? u + "|" + v : v + "|" + u);
    }
    picked.sort(String::compareTo);
    return "total:" + total + "|edges:" + String.join(",", picked);
  }

  // ── 一维 DP ───────────────────────────────────────────

  static int climb(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) { int c = a + b; a = b; b = c; }
    return b;
  }

  static int rob(int[] nums) {
    int prev = 0, cur = 0;
    for (int x : nums) {
      int take = prev + x;
      prev = cur;
      cur = Math.max(cur, take);
    }
    return cur;
  }

  static int lis(int[] nums) {
    if (nums.length == 0) return 0;
    int[] dp = new int[nums.length];
    java.util.Arrays.fill(dp, 1);
    int best = 1;
    for (int i = 1; i < nums.length; i++) {
      for (int j = 0; j < i; j++) {
        if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
      }
      best = Math.max(best, dp[i]);
    }
    return best;
  }

  static int unbounded(int[] w, int[] v, int C) {
    int[] dp = new int[C + 1];
    for (int i = 0; i < w.length; i++)
      for (int c = w[i]; c <= C; c++)          // 完全背包一维写法：正序
        dp[c] = Math.max(dp[c], dp[c - w[i]] + v[i]);
    return dp[C];
  }

  static boolean canJump(int[] nums) {
    int reach = 0;
    for (int i = 0; i < nums.length; i++) {
      if (i > reach) return false;
      reach = Math.max(reach, i + nums[i]);
    }
    return true;
  }

  // ── 动态规划 ──────────────────────────────────────────

  static int editDistance(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
      for (int j = 1; j <= n; j++) {
        if (a.charAt(i - 1) == b.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];
        else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));
      }
    }
    return dp[m][n];
  }

  // ── Trie ──────────────────────────────────────────────

  static final class Trie {
    final Map<Character, Trie> next = new HashMap<>();
    boolean terminal;
    int terminals;

    void insert(String w) {
      Trie node = this;
      for (char c : w.toCharArray()) node = node.next.computeIfAbsent(c, k -> new Trie());
      if (!node.terminal) { node.terminal = true; terminals++; }
    }

    boolean search(String w) {
      Trie node = walk(w);
      return node != null && node.terminal;
    }

    boolean startsWith(String p) {
      return walk(p) != null;
    }

    private Trie walk(String w) {
      Trie node = this;
      for (char c : w.toCharArray()) {
        node = node.next.get(c);
        if (node == null) return null;
      }
      return node;
    }

    int count() {
      int n = 1;
      for (Trie t : next.values()) n += t.count();
      return n;
    }
  }

  // ── 并查集 ────────────────────────────────────────────

  static final class Uf {
    final int[] parent;
    final int[] rank;
    int unions;

    Uf(int n) {
      parent = new int[n];
      rank = new int[n];
      for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
      int r = x;
      while (parent[r] != r) r = parent[r];
      while (parent[x] != r) {
        int nx = parent[x];
        parent[x] = r;
        x = nx;
      }
      return r;
    }

    boolean union(int a, int b) {
      int ra = find(a), rb = find(b);
      if (ra == rb) return false;
      if (rank[ra] < rank[rb]) parent[ra] = rb;
      else if (rank[ra] > rank[rb]) parent[rb] = ra;
      else { parent[rb] = ra; rank[ra]++; }
      unions++;
      return true;
    }
  }

  // ── 链表 2 ────────────────────────────────────────────

  static int middleVal(List<Integer> a) {
    int slow = 0, fast = 0;
    while (fast < a.size() - 1) {
      slow += 1;
      fast += 2;
    }
    return a.get(slow);
  }

  static int cycleEntry(List<Integer> a, int cycleAt) {
    if (cycleAt < 0) return -1;
    int slow = 0, fast = 0;
    do {
      slow = next(slow, a.size(), cycleAt);
      fast = next(next(fast, a.size(), cycleAt), a.size(), cycleAt);
      if (slow == -1 || fast == -1) return -1;
    } while (slow != fast);
    int p = 0;
    while (p != slow) {
      p = next(p, a.size(), cycleAt);
      slow = next(slow, a.size(), cycleAt);
    }
    return p;
  }

  private static int next(int i, int size, int cycleAt) {
    if (i == size - 1) return cycleAt;
    return i + 1;
  }

  static List<Integer> removeNth(List<Integer> a, int n) {
    List<Integer> out = new ArrayList<>(a);
    int idx = out.size() - n;
    if (idx >= 0 && idx < out.size()) out.remove(idx);
    return out;
  }

  // ── 四种遍历 ──────────────────────────────────────────

  static final int[] FIXED_TREE = {8, 4, 12, 2, 6, 10, 14};

  static List<String> traverse(String mode) {
    List<Integer> out = new ArrayList<>();
    if (mode.equals("level")) {
      Deque<Integer> q = new ArrayDeque<>();
      if (FIXED_TREE.length > 0) q.add(0);
      while (!q.isEmpty()) {
        int i = q.poll();
        out.add(FIXED_TREE[i]);
        int l = 2 * i + 1, r = 2 * i + 2;
        if (l < FIXED_TREE.length) q.add(l);
        if (r < FIXED_TREE.length) q.add(r);
      }
    } else {
      dfs(0, mode, out);
    }
    List<String> s = new ArrayList<>();
    for (int v : out) s.add(String.valueOf(v));
    return s;
  }

  private static void dfs(int i, String mode, List<Integer> out) {
    if (i >= FIXED_TREE.length) return;
    if (mode.equals("pre")) out.add(FIXED_TREE[i]);
    dfs(2 * i + 1, mode, out);
    if (mode.equals("in")) out.add(FIXED_TREE[i]);
    dfs(2 * i + 2, mode, out);
    if (mode.equals("post")) out.add(FIXED_TREE[i]);
  }

  // ── 链表 3 / 队列 / 哈希 / 其余 ───────────────────────

  static String mergeLists(String aSpec, String bSpec) {
    List<Integer> a = ints(aSpec), b = ints(bSpec);
    List<Integer> out = new ArrayList<>();
    int i = 0, j = 0;
    while (i < a.size() && j < b.size()) {
      if (a.get(i) <= b.get(j)) out.add(a.get(i++)); else out.add(b.get(j++));
    }
    while (i < a.size()) out.add(a.get(i++));
    while (j < b.size()) out.add(b.get(j++));
    return arr(out);
  }

  static String reverseK(List<Integer> in, int k) {
    List<Integer> a = new ArrayList<>(in);
    for (int s = 0; s + k <= a.size(); s += k) {
      for (int i = s, j = s + k - 1; i < j; i++, j--) {
        Integer t = a.get(i); a.set(i, a.get(j)); a.set(j, t);
      }
    }
    return arr(a);
  }

  static int twoStacks(String spec) {
    Deque<Integer> in = new ArrayDeque<>();
    Deque<Integer> out = new ArrayDeque<>();
    int transfers = 0;
    for (String op : spec.split(",")) {
      if (op.startsWith("push")) {
        in.push(Integer.parseInt(op.substring(4)));
      } else {
        if (out.isEmpty()) {
          while (!in.isEmpty()) { out.push(in.pop()); transfers++; }
        }
        if (!out.isEmpty()) out.pop();
      }
    }
    return transfers;
  }

  static String circleQueue(String spec) {
    int n = 6;
    Integer[] buf = new Integer[n];
    int head = 0, tail = 0, size = 0;
    for (String op : spec.split(",")) {
      if (op.startsWith("enqueue")) {
        if (size == n) continue;
        buf[tail] = Integer.parseInt(op.substring(7));
        tail = (tail + 1) % n;
        size++;
      } else {
        if (size == 0) continue;
        buf[head] = null;
        head = (head + 1) % n;
        size--;
      }
    }
    StringBuilder sb = new StringBuilder();
    for (Integer v : buf) if (v != null) { if (sb.length() > 0) sb.append(','); sb.append(v); }
    return sb.toString();
  }

  static String chaining(String spec) {
    int N = 5;
    List<List<Integer>> buckets = new ArrayList<>();
    for (int i = 0; i < N; i++) buckets.add(new ArrayList<>());
    int collisions = 0;
    for (int key : arr0(spec)) {
      int i = key % N;
      if (buckets.get(i).contains(key)) continue;
      if (!buckets.get(i).isEmpty()) collisions++;
      buckets.get(i).add(key);
    }
    int maxChain = 0, total = 0;
    for (List<Integer> b : buckets) { maxChain = Math.max(maxChain, b.size()); total += b.size(); }
    return "collisions:" + collisions + "|maxChain:" + maxChain + "|total:" + total;
  }

  static String lru(String spec) {
    int capacity = 3;
    LinkedHashMap<Integer, Integer> map = new LinkedHashMap<>();
    for (String op : spec.split(",")) {
      if (op.startsWith("get")) {
        int key = Integer.parseInt(op.substring(3));
        if (!map.containsKey(key)) continue;
        Integer v = map.remove(key);
        map.put(key, v);                       // 重新插入 = 移到最新
      } else {
        int key = Integer.parseInt(op.substring(3));
        int val = key * 10;
        if (map.containsKey(key)) {
          map.remove(key);
          map.put(key, val);
        } else {
          if (map.size() == capacity) {
            Integer eldest = map.keySet().iterator().next();
            map.remove(eldest);
          }
          map.put(key, val);
        }
      }
    }
    List<String> keys = new ArrayList<>();
    for (Integer k : map.keySet()) keys.add(String.valueOf(k));
    java.util.Collections.reverse(keys);        // JS 里最近使用在最前
    return String.join(",", keys);
  }

  static boolean isPalindrome(String s) {
    int i = 0, j = s.length() - 1;
    while (i < j) {
      if (s.charAt(i) != s.charAt(j)) return false;
      i++; j--;
    }
    return true;
  }

  static int segQuery(String spec, int ql, int qr) {
    int[] a = arr0(spec);
    int[] tree = new int[4 * a.length];
    segBuild(a, tree, 1, 0, a.length - 1);
    return segDo(tree, 1, 0, a.length - 1, ql, qr);
  }

  private static void segBuild(int[] a, int[] t, int node, int l, int r) {
    if (l == r) { t[node] = a[l]; return; }
    int mid = (l + r) >> 1;
    segBuild(a, t, node * 2, l, mid);
    segBuild(a, t, node * 2 + 1, mid + 1, r);
    t[node] = t[node * 2] + t[node * 2 + 1];
  }

  private static int segDo(int[] t, int node, int l, int r, int ql, int qr) {
    if (qr < l || r < ql) return 0;
    if (ql <= l && r <= qr) return t[node];
    int mid = (l + r) >> 1;
    return segDo(t, node * 2, l, mid, ql, qr) + segDo(t, node * 2 + 1, mid + 1, r, ql, qr);
  }

  static int fenwick(String spec, int q) {
    int[] a = arr0(spec);
    int n = a.length;
    int[] tree = new int[n + 1];
    for (int i = 1; i <= n; i++) {
      for (int j = i; j <= n; j += j & -j) tree[j] += a[i - 1];
    }
    int sum = 0;
    for (int i = q; i > 0; i -= i & -i) sum += tree[i];
    return sum;
  }

  // ── 热门题 2 ──────────────────────────────────────────

  static boolean dupExists(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int v : nums) if (!seen.add(v)) return true;
    return false;
  }

  static int majority(int[] nums) {
    int cand = nums[0], count = 0;
    for (int x : nums) {
      if (count == 0) cand = x;
      count += x == cand ? 1 : -1;
    }
    return cand;
  }

  static int missingNum(int[] nums) {
    int x = nums.length;
    for (int i = 0; i < nums.length; i++) x ^= i ^ nums[i];
    return x;
  }

  static List<Integer> removeElem(int[] nums, int val) {
    int slow = 0;
    int[] a = nums.clone();
    for (int fast = 0; fast < a.length; fast++) if (a[fast] != val) a[slow++] = a[fast];
    List<Integer> out = new ArrayList<>();
    for (int i = 0; i < slow; i++) out.add(a[i]);
    return out;
  }

  static List<Integer> mergeSorted(int[] a, int m, int[] b, int n) {
    int[] nums = a.clone();
    int i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
      if (i >= 0 && nums[i] > b[j]) nums[k--] = nums[i--];
      else nums[k--] = b[j--];
    }
    List<Integer> out = new ArrayList<>();
    for (int v : nums) out.add(v);
    return out;
  }

  static List<Integer> plusOne(int[] digits) {
    int[] a = digits.clone();
    for (int i = a.length - 1; i >= 0; i--) {
      if (a[i] < 9) { a[i]++; return box(a); }
      a[i] = 0;
    }
    List<Integer> out = new ArrayList<>();
    out.add(1);
    for (int v : a) out.add(v);
    return out;
  }

  private static List<Integer> box(int[] a) {
    List<Integer> out = new ArrayList<>();
    for (int v : a) out.add(v);
    return out;
  }

  static boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] cnt = new int[26];
    for (int i = 0; i < s.length(); i++) { cnt[s.charAt(i) - 97]++; cnt[t.charAt(i) - 97]--; }
    for (int v : cnt) if (v != 0) return false;
    return true;
  }

  static boolean isSubseq(String s, String t) {
    int i = 0;
    for (int k = 0; k < t.length() && i < s.length(); k++) if (t.charAt(k) == s.charAt(i)) i++;
    return i == s.length();
  }

  static String invertTree(String spec) {
    Node root = treeFromLevels(spec);
    invertWalk(root);
    List<String> out = new ArrayList<>();
    java.util.LinkedList<Node> q = new java.util.LinkedList<>();   // 允许 null
    q.add(root);
    while (!q.isEmpty()) {
      Node n = q.poll();
      if (n == null) { out.add("null"); continue; }
      out.add(String.valueOf(n.val));
      q.add(n.left);
      q.add(n.right);
    }
    while (!out.isEmpty() && out.get(out.size() - 1).equals("null")) out.remove(out.size() - 1);
    return String.join(",", out);
  }

  private static void invertWalk(Node n) {
    if (n == null) return;
    Node t = n.left; n.left = n.right; n.right = t;
    invertWalk(n.left);
    invertWalk(n.right);
  }

  static boolean pathSum(String spec, int target) {
    return pathDfs(treeFromLevels(spec), target);
  }

  private static boolean pathDfs(Node n, int rest) {
    if (n == null) return false;
    if (n.left == null && n.right == null) return rest == n.val;   // 必须到叶子
    int left = rest - n.val;
    return pathDfs(n.left, left) || pathDfs(n.right, left);
  }

  static int firstMissing(int[] nums) {
    int[] a = nums.clone();
    int n = a.length;
    for (int i = 0; i < n; i++) {
      while (a[i] > 0 && a[i] <= n && a[a[i] - 1] != a[i]) {
        int x = a[i];
        int t = a[x - 1]; a[x - 1] = a[i]; a[i] = t;
      }
    }
    for (int i = 0; i < n; i++) if (a[i] != i + 1) return i + 1;
    return n + 1;
  }

  static String longestPalin(String s) {
    String best = "";
    for (int c = 0; c < s.length(); c++) {
      for (int half = 0; half <= 1; half++) {
        int l = c, r = c + half;
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
        String cand = s.substring(l + 1, r);
        if (cand.length() > best.length()) best = cand;
      }
    }
    return best;
  }

  static String commonPrefix(String spec) {
    String[] words = spec.split(",", -1);
    if (words.length == 0) return "";
    String base = words[0];
    for (int i = 0; i < base.length(); i++) {
      char ch = base.charAt(i);
      for (String w : words) if (i >= w.length() || w.charAt(i) != ch) return base.substring(0, i);
    }
    return base;
  }

  static String reverseWords(String s) {
    String[] parts = s.trim().split("\\s+");
    List<String> list = new ArrayList<>(java.util.Arrays.asList(parts));
    if (list.size() == 1 && list.get(0).isEmpty()) return "";
    java.util.Collections.reverse(list);
    return String.join(" ", list);
  }

  static int hamming(int x, int y) {
    int z = x ^ y, count = 0;
    while (z != 0) { z &= z - 1; count++; }
    return count;
  }

  static List<Integer> countBits(int n) {
    int[] dp = new int[n + 1];
    for (int i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);
    List<Integer> out = new ArrayList<>();
    for (int v : dp) out.add(v);
    return out;
  }

  static final int[][] SPIRAL_M = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};

  static List<Integer> spiral() {
    List<Integer> out = new ArrayList<>();
    int top = 0, bottom = SPIRAL_M.length - 1, left = 0, right = SPIRAL_M[0].length - 1;
    while (top <= bottom && left <= right) {
      for (int c = left; c <= right; c++) out.add(SPIRAL_M[top][c]);
      top++;
      for (int r = top; r <= bottom; r++) out.add(SPIRAL_M[r][right]);
      right--;
      if (top <= bottom) { for (int c = right; c >= left; c--) out.add(SPIRAL_M[bottom][c]); bottom--; }
      if (left <= right) { for (int r = bottom; r >= top; r--) out.add(SPIRAL_M[r][left]); left++; }
    }
    return out;
  }

  static final int[][] ROTATE_M = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};

  static List<Integer> rotateImage() {
    int n = ROTATE_M.length;
    int[][] m = new int[n][n];
    for (int i = 0; i < n; i++) m[i] = ROTATE_M[i].clone();
    for (int i = 0; i < n; i++)
      for (int j = i + 1; j < n; j++) { int t = m[i][j]; m[i][j] = m[j][i]; m[j][i] = t; }
    List<Integer> out = new ArrayList<>();
    for (int i = 0; i < n; i++)
      for (int j = n - 1; j >= 0; j--) out.add(m[i][j]);
    return out;
  }

  static final int[][] SORTED_M = {
      {1, 4, 7, 11}, {2, 5, 8, 12}, {3, 6, 9, 16}, {10, 13, 14, 17},
  };

  static boolean searchMatrix240(int target) {
    int r = 0, c = SORTED_M[0].length - 1;
    while (r < SORTED_M.length && c >= 0) {
      if (SORTED_M[r][c] == target) return true;
      if (SORTED_M[r][c] > target) c--; else r++;
    }
    return false;
  }

  static List<Integer> mergeK(String spec) {
    String[] segs = spec.split("\\|");
    List<int[]> lists = new ArrayList<>();
    for (String seg : segs) lists.add(seg.isEmpty() ? new int[0] : arr0(seg));
    java.util.PriorityQueue<int[]> pq = new java.util.PriorityQueue<>((a, b) -> a[0] - b[0]);
    for (int i = 0; i < lists.size(); i++)
      if (lists.get(i).length > 0) pq.add(new int[]{lists.get(i)[0], i, 0});
    List<Integer> out = new ArrayList<>();
    while (!pq.isEmpty()) {
      int[] top = pq.poll();
      out.add(top[0]);
      int nxt = top[2] + 1;
      if (nxt < lists.get(top[1]).length) pq.add(new int[]{lists.get(top[1])[nxt], top[1], nxt});
    }
    return out;
  }

  static final class LNode {
    int val;
    LNode next;
    LNode(int v) { val = v; }
  }

  static List<Integer> addTwo(int[] a, int[] b) {
    List<Integer> out = new ArrayList<>();
    int carry = 0, i = 0, j = 0;
    while (i < a.length || j < b.length || carry != 0) {
      int va = i < a.length ? a[i] : 0;
      int vb = j < b.length ? b[j] : 0;
      int sum = va + vb + carry;
      carry = sum / 10;
      out.add(sum % 10);
      i++; j++;
    }
    return out;
  }

  /** shared 里的节点被两条链共用，这才是"相交"的含义 */
  static int intersect(int[] preA, int[] preB, List<Integer> shared) {
    LNode[] sharedNodes = new LNode[shared.size()];
    for (int i = 0; i < shared.size(); i++) sharedNodes[i] = new LNode(shared.get(i));
    for (int i = 0; i + 1 < sharedNodes.length; i++) sharedNodes[i].next = sharedNodes[i + 1];
    LNode sharedHead = sharedNodes.length > 0 ? sharedNodes[0] : null;

    LNode a = buildChain(preA, sharedHead);
    LNode b = buildChain(preB, sharedHead);

    LNode pa = a, pb = b;
    int steps = 0, limit = preA.length + preB.length + 2 * shared.size() + 2;
    while (pa != pb && steps <= limit) {
      pa = pa == null ? b : pa.next;
      pb = pb == null ? a : pb.next;
      steps++;
    }
    return pa == null ? -1 : pa.val;
  }

  private static LNode buildChain(int[] vals, LNode tail) {
    LNode head = null, prev = null;
    for (int v : vals) {
      LNode n = new LNode(v);
      if (prev == null) head = n; else prev.next = n;
      prev = n;
    }
    if (prev != null) prev.next = tail;
    return head != null ? head : tail;
  }

  static boolean isPalinList(int[] nums) {
    for (int i = 0, j = nums.length - 1; i < j; i++, j--) if (nums[i] != nums[j]) return false;
    return true;
  }

  static int largestRect(int[] h) {
    Deque<Integer> stack = new ArrayDeque<>();
    int best = 0;
    for (int i = 0; i <= h.length; i++) {
      int cur = i == h.length ? 0 : h[i];
      while (!stack.isEmpty() && h[stack.peek()] > cur) {
        int height = h[stack.pop()];
        int left = stack.isEmpty() ? 0 : stack.peek() + 1;
        best = Math.max(best, height * (i - left));
      }
      stack.push(i);
    }
    return best;
  }

  static int groupAnagrams(String spec) {
    Map<String, Integer> groups = new HashMap<>();
    for (String w : spec.split(",", -1)) {
      char[] cs = w.toCharArray();
      java.util.Arrays.sort(cs);
      groups.merge(new String(cs), 1, Integer::sum);
    }
    return groups.size();
  }

  static int genParens(int n) {
    int[] count = new int[1];
    genDfs("", 0, 0, n, count);
    return count[0];
  }

  private static void genDfs(String cur, int open, int close, int n, int[] count) {
    if (cur.length() == n * 2) { count[0]++; return; }
    if (open < n) genDfs(cur + "(", open + 1, close, n, count);
    if (close < open) genDfs(cur + ")", open, close + 1, n, count);
  }

  static final char[][] WORD_BOARD = {
      {'A', 'B', 'C', 'E'},
      {'S', 'F', 'C', 'S'},
      {'A', 'D', 'E', 'E'},
  };

  static boolean wordSearch(String word) {
    char[][] board = new char[WORD_BOARD.length][];
    for (int i = 0; i < WORD_BOARD.length; i++) board[i] = WORD_BOARD[i].clone();
    for (int r = 0; r < board.length; r++)
      for (int c = 0; c < board[0].length; c++)
        if (wsDfs(board, r, c, word, 0)) return true;
    return false;
  }

  private static boolean wsDfs(char[][] board, int r, int c, String word, int i) {
    if (i == word.length()) return true;
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return false;
    if (board[r][c] != word.charAt(i)) return false;
    char tmp = board[r][c];
    board[r][c] = '#';
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    for (int[] d : dirs) if (wsDfs(board, r + d[0], c + d[1], word, i + 1)) return true;
    board[r][c] = tmp;
    return false;
  }

  static boolean wordBreak(String s, String[] words) {
    Set<String> set = new HashSet<>(java.util.Arrays.asList(words));
    boolean[] dp = new boolean[s.length() + 1];
    dp[0] = true;
    for (int i = 1; i <= s.length(); i++)
      for (int j = 0; j < i; j++)
        if (dp[j] && set.contains(s.substring(j, i))) { dp[i] = true; break; }
    return dp[s.length()];
  }

  static int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int v : nums) set.add(v);
    int best = 0;
    for (int x : set) {
      if (set.contains(x - 1)) continue;
      int y = x;
      while (set.contains(y + 1)) y++;
      best = Math.max(best, y - x + 1);
    }
    return best;
  }

  static String minStack(String spec) {
    Deque<Integer> stack = new ArrayDeque<>();
    Deque<Integer> mins = new ArrayDeque<>();
    List<Integer> out = new ArrayList<>();
    for (String op : spec.split(",")) {
      if (op.startsWith("push")) {
        int v = Integer.parseInt(op.substring(4));
        stack.push(v);
        mins.push(mins.isEmpty() ? v : Math.min(v, mins.peek()));
      } else if (op.equals("pop")) {
        if (!stack.isEmpty()) { stack.pop(); mins.pop(); }
      } else if (op.equals("top")) {
        if (!stack.isEmpty()) out.add(stack.peek());
      } else {
        if (!mins.isEmpty()) out.add(mins.peek());
      }
    }
    return arr(out);
  }

  static String decodeString(String s) {
    Deque<Object[]> stack = new ArrayDeque<>();
    StringBuilder cur = new StringBuilder();
    int num = 0;
    for (char ch : s.toCharArray()) {
      if (ch >= '0' && ch <= '9') num = num * 10 + (ch - '0');
      else if (ch == '[') { stack.push(new Object[]{cur.toString(), num}); cur.setLength(0); num = 0; }
      else if (ch == ']') {
        Object[] top = stack.pop();
        String prev = (String) top[0];
        int n = (Integer) top[1];
        StringBuilder rep = new StringBuilder(cur);
        cur.setLength(0);
        cur.append(prev);
        for (int i = 0; i < n; i++) cur.append(rep);
      } else cur.append(ch);
    }
    return cur.toString();
  }

  static int lcaValue(String spec, int p, int q) {
    Node root = treeFromLevels(spec);
    Node ans = lcaDfs(root, p, q);
    return ans == null ? -1 : ans.val;
  }

  private static Node lcaDfs(Node node, int p, int q) {
    if (node == null || node.val == p || node.val == q) return node;
    Node l = lcaDfs(node.left, p, q);
    Node r = lcaDfs(node.right, p, q);
    if (l != null && r != null) return node;
    return l != null ? l : r;
  }

  static boolean validateBst(String spec) {
    return validDfs(treeFromLevels(spec), Long.MIN_VALUE, Long.MAX_VALUE);
  }

  private static boolean validDfs(Node node, long low, long high) {
    if (node == null) return true;
    if (node.val <= low || node.val >= high) return false;
    return validDfs(node.left, low, node.val) && validDfs(node.right, node.val, high);
  }

  static final int[][] ORANGE_GRID = {
      {2, 1, 1, 1, 2},
      {1, 1, 0, 1, 1},
      {0, 1, 1, 0, 1},
  };

  static int oranges() {
    int R = ORANGE_GRID.length, C = ORANGE_GRID[0].length;
    int[][] g = new int[R][C];
    int fresh = 0;
    Deque<int[]> q = new ArrayDeque<>();
    for (int r = 0; r < R; r++) {
      g[r] = ORANGE_GRID[r].clone();
      for (int c = 0; c < C; c++) {
        if (g[r][c] == 1) fresh++;
        if (g[r][c] == 2) q.add(new int[]{r, c});
      }
    }
    int minutes = 0;
    while (!q.isEmpty() && fresh > 0) {
      int size = q.size();
      for (int i = 0; i < size; i++) {
        int[] cur = q.poll();
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int[] d : dirs) {
          int nr = cur[0] + d[0], nc = cur[1] + d[1];
          if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
          if (g[nr][nc] != 1) continue;
          g[nr][nc] = 2;
          fresh--;
          q.add(new int[]{nr, nc});
        }
      }
      minutes++;
    }
    return fresh == 0 ? minutes : -1;
  }

  static String topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> cnt = new LinkedHashMap<>();
    for (int v : nums) cnt.merge(v, 1, Integer::sum);
    List<int[]> heap = new ArrayList<>();
    for (Map.Entry<Integer, Integer> e : cnt.entrySet()) {
      heap.add(new int[]{e.getKey(), e.getValue()});
      heap.sort((a, b) -> a[1] - b[1]);          // 稳定排序
      if (heap.size() > k) heap.remove(0);
    }
    List<Integer> out = new ArrayList<>();
    for (int[] e : heap) out.add(e[0]);
    out.sort(Integer::compareTo);
    return arr(out);
  }

  static int stock(int[] p) {
    int min = Integer.MAX_VALUE, best = 0;
    for (int v : p) { min = Math.min(min, v); best = Math.max(best, v - min); }
    return best;
  }

  static int maxProduct(int[] nums) {
    int curMax = nums[0], curMin = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
      int a = curMax * nums[i], b = curMin * nums[i];
      curMax = Math.max(nums[i], Math.max(a, b));
      curMin = Math.min(nums[i], Math.min(a, b));
      best = Math.max(best, curMax);
    }
    return best;
  }

  static List<Integer> moveZero(int[] in) {
    int[] a = in.clone();
    int slow = 0;
    for (int fast = 0; fast < a.length; fast++) {
      if (a[fast] != 0) { int t = a[slow]; a[slow] = a[fast]; a[fast] = t; slow++; }
    }
    List<Integer> out = new ArrayList<>();
    for (int v : a) out.add(v);
    return out;
  }

  static List<Integer> productExcept(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    int left = 1;
    for (int i = 0; i < n; i++) { res[i] = left; left *= nums[i]; }
    int right = 1;
    for (int i = n - 1; i >= 0; i--) { res[i] *= right; right *= nums[i]; }
    List<Integer> out = new ArrayList<>();
    for (int v : res) out.add(v);
    return out;
  }

  static List<Integer> rotateArr(int[] nums, int k) {
    int n = nums.length;
    int[] a = nums.clone();
    int kk = k % n;
    reverse(a, 0, n - 1);
    reverse(a, 0, kk - 1);
    reverse(a, kk, n - 1);
    List<Integer> out = new ArrayList<>();
    for (int v : a) out.add(v);
    return out;
  }

  private static void reverse(int[] a, int i, int j) {
    while (i < j) { int t = a[i]; a[i] = a[j]; a[j] = t; i++; j--; }
  }

  /** 层序数组建树，null 用 "null" 表示 */
  private static Node treeFromLevels(String spec) {
    String[] parts = spec.split(",");
    Node[] nodes = new Node[parts.length];
    for (int i = 0; i < parts.length; i++) {
      if (!parts[i].equals("null")) nodes[i] = new Node(Integer.parseInt(parts[i]));
    }
    for (int i = 0; i < nodes.length; i++) {
      if (nodes[i] == null) continue;
      int l = 2 * i + 1, r = 2 * i + 2;
      if (l < nodes.length) nodes[i].left = nodes[l];
      if (r < nodes.length) nodes[i].right = nodes[r];
    }
    return nodes[0];
  }

  static int maxDepthTree(String spec) { return depth(treeFromLevels(spec)); }

  private static int depth(Node n) { return n == null ? 0 : 1 + Math.max(depth(n.left), depth(n.right)); }

  static boolean isSym(String spec) {
    Node root = treeFromLevels(spec);
    return root == null || mirror(root.left, root.right);
  }

  private static boolean mirror(Node a, Node b) {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    return a.val == b.val && mirror(a.left, b.right) && mirror(a.right, b.left);
  }

  static int diameter(String spec) {
    int[] best = new int[1];
    diaDepth(treeFromLevels(spec), best);
    return best[0];
  }

  private static int diaDepth(Node n, int[] best) {
    if (n == null) return 0;
    int l = diaDepth(n.left, best), r = diaDepth(n.right, best);
    best[0] = Math.max(best[0], l + r);
    return 1 + Math.max(l, r);
  }

  static int coinChange(int[] coins, int amount) {
    int INF = Integer.MAX_VALUE / 2;
    int[] dp = new int[amount + 1];
    java.util.Arrays.fill(dp, INF);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++)
      for (int c : coins)
        if (a >= c && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
    return dp[amount] == INF ? -1 : dp[amount];
  }

  // ── 热门题 ────────────────────────────────────────────

  static int threeSum(int[] in) {
    int[] a = in.clone();
    java.util.Arrays.sort(a);
    int res = 0;
    for (int i = 0; i < a.length - 2; i++) {
      if (i > 0 && a[i] == a[i - 1]) continue;
      int lo = i + 1, hi = a.length - 1;
      while (lo < hi) {
        int s = a[i] + a[lo] + a[hi];
        if (s == 0) {
          res++;
          while (lo < hi && a[lo] == a[lo + 1]) lo++;
          while (lo < hi && a[hi] == a[hi - 1]) hi--;
          lo++; hi--;
        } else if (s < 0) lo++;
        else hi--;
      }
    }
    return res;
  }

  static int maxArea(int[] h) {
    int lo = 0, hi = h.length - 1, best = 0;
    while (lo < hi) {
      best = Math.max(best, Math.min(h[lo], h[hi]) * (hi - lo));
      if (h[lo] < h[hi]) lo++; else hi--;
    }
    return best;
  }

  static int maxSub(int[] nums) {
    int cur = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
      cur = Math.max(nums[i], cur + nums[i]);
      best = Math.max(best, cur);
    }
    return best;
  }

  static int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];
    for (int r = 0; r < m; r++) dp[r][0] = 1;
    for (int c = 0; c < n; c++) dp[0][c] = 1;
    for (int r = 1; r < m; r++)
      for (int c = 1; c < n; c++)
        dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
    return dp[m - 1][n - 1];
  }

  // ── 查找 ──────────────────────────────────────────────

  static int bsStandard(int[] a, int t) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (a[mid] == t) return mid;
      if (a[mid] < t) lo = mid + 1; else hi = mid - 1;
    }
    return -1;
  }

  static int bsLeft(int[] a, int t) {
    int lo = 0, hi = a.length - 1, ans = -1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (a[mid] == t) { ans = mid; hi = mid - 1; }
      else if (a[mid] < t) lo = mid + 1;
      else hi = mid - 1;
    }
    return ans;
  }

  static int bsRight(int[] a, int t) {
    int lo = 0, hi = a.length - 1, ans = -1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (a[mid] == t) { ans = mid; lo = mid + 1; }
      else if (a[mid] > t) hi = mid - 1;
      else lo = mid + 1;
    }
    return ans;
  }

  static int bsLower(int[] a, int t) {
    int lo = 0, hi = a.length;
    while (lo < hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (a[mid] < t) lo = mid + 1; else hi = mid;
    }
    return lo;
  }

  static int bsUpper(int[] a, int t) {
    int lo = 0, hi = a.length - 1, ans = -1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (a[mid] <= t) { ans = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
    return ans;
  }

  static int bsRotated(int[] a, int t) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
      int mid = lo + ((hi - lo) >> 1);
      if (a[mid] == t) return mid;
      if (a[lo] <= a[mid]) {
        if (a[lo] <= t && t < a[mid]) hi = mid - 1; else lo = mid + 1;
      } else {
        if (a[mid] < t && t <= a[hi]) lo = mid + 1; else hi = mid - 1;
      }
    }
    return -1;
  }

  // ── 双指针与滑窗 ──────────────────────────────────────

  static String twoSum(int[] a, int t) {
    int lo = 0, hi = a.length - 1;
    while (lo < hi) {
      int sum = a[lo] + a[hi];
      if (sum == t) return lo + "," + hi;
      if (sum < t) lo++; else hi--;
    }
    return "none";
  }

  static List<Integer> dedupe(int[] in) {
    List<Integer> out = new ArrayList<>();
    if (in.length == 0) return out;
    out.add(in[0]);
    int slow = 0;
    for (int fast = 1; fast < in.length; fast++) {
      if (in[fast] != out.get(slow)) {
        slow++;
        out.add(in[fast]);
      }
    }
    return out;
  }

  static int maxWindowSum(int[] a, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) sum += a[i];
    int best = sum;
    for (int i = k; i < a.length; i++) {
      sum += a[i] - a[i - k];
      if (sum > best) best = sum;
    }
    return best;
  }

  static int longestUnique(String s) {
    Map<Character, Integer> last = new HashMap<>();
    int left = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
      char c = s.charAt(right);
      Integer prev = last.get(c);
      if (prev != null && prev >= left) left = prev + 1;
      last.put(c, right);
      if (right - left + 1 > best) best = right - left + 1;
    }
    return best;
  }

  // ── 栈与队列 ──────────────────────────────────────────

  static boolean brackets(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    Map<Character, Character> pairs = new HashMap<>();
    pairs.put(')', '(');
    pairs.put(']', '[');
    pairs.put('}', '{');
    for (char c : s.toCharArray()) {
      if (!pairs.containsKey(c)) {
        stack.push(c);
        continue;
      }
      Character top = stack.isEmpty() ? null : stack.pop();
      if (top == null || !top.equals(pairs.get(c))) return false;
    }
    return stack.isEmpty();
  }

  static List<Integer> dailyTemps(int[] t) {
    int[] res = new int[t.length];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < t.length; i++) {
      while (!stack.isEmpty() && t[i] > t[stack.peek()]) {
        int j = stack.pop();
        res[j] = i - j;
      }
      stack.push(i);
    }
    List<Integer> out = new ArrayList<>();
    for (int v : res) out.add(v);
    return out;
  }

  static List<Integer> slidingMax(int[] nums, int k) {
    Deque<Integer> dq = new ArrayDeque<>();
    List<Integer> res = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) {
      while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
      dq.addLast(i);
      if (dq.peekFirst() <= i - k) dq.pollFirst();
      if (i >= k - 1) res.add(nums[dq.peekFirst()]);
    }
    return res;
  }

  // ── 树 ────────────────────────────────────────────────

  static final class Node {
    int val;
    Node left, right, parent;

    Node(int v) { val = v; }
  }

  static int height(Node n) { return n == null ? 0 : 1 + Math.max(height(n.left), height(n.right)); }

  static int size(Node n) { return n == null ? 0 : 1 + size(n.left) + size(n.right); }

  static void inorder(Node n, List<Integer> out) {
    if (n == null) return;
    inorder(n.left, out);
    out.add(n.val);
    inorder(n.right, out);
  }

  static Node bstPut(Node root, int val) {
    if (root == null) return new Node(val);
    Node cur = root;
    while (true) {
      if (val < cur.val) {
        if (cur.left == null) { cur.left = new Node(val); cur.left.parent = cur; break; }
        cur = cur.left;
      } else if (val > cur.val) {
        if (cur.right == null) { cur.right = new Node(val); cur.right.parent = cur; break; }
        cur = cur.right;
      } else break;   // 重复值不插
    }
    return root;
  }

  /** BST 删除：三种情况分开处理，两个孩子的用后继顶替 */
  static Node bstRemove(Node node, int key) {
    if (node == null) return null;
    if (key < node.val) {
      node.left = bstRemove(node.left, key);
      if (node.left != null) node.left.parent = node;
      return node;
    }
    if (key > node.val) {
      node.right = bstRemove(node.right, key);
      if (node.right != null) node.right.parent = node;
      return node;
    }
    if (node.left == null) return node.right;
    if (node.right == null) return node.left;
    Node succ = node.right;
    while (succ.left != null) succ = succ.left;
    node.val = succ.val;
    node.right = bstRemove(node.right, succ.val);
    if (node.right != null) node.right.parent = node;
    return node;
  }

  /** AVL：与前端同一套旋转顺序和 parent 维护 */
  static final class Avl {
    Node root;
    int rotations;

    void put(int val) {
      root = insert(root, val);
    }

    private Node insert(Node node, int val) {
      if (node == null) return new Node(val);
      if (val < node.val) {
        node.left = insert(node.left, val);
        if (node.left != null) node.left.parent = node;
      } else if (val > node.val) {
        node.right = insert(node.right, val);
        if (node.right != null) node.right.parent = node;
      } else return node;

      int hl = height(node.left), hr = height(node.right);
      int bf = hl - hr;

      if (bf > 1 && val < node.left.val) { rotations++; return rotateRight(node); }
      if (bf < -1 && val > node.right.val) { rotations++; return rotateLeft(node); }
      if (bf > 1 && val > node.left.val) {
        node.left = rotateLeft(node.left); rotations++;
        rotations++; return rotateRight(node);
      }
      if (bf < -1 && val < node.right.val) {
        node.right = rotateRight(node.right); rotations++;
        rotations++; return rotateLeft(node);
      }
      return node;
    }

    private Node rotateRight(Node y) {
      Node x = y.left;
      y.left = x.right;
      if (x.right != null) x.right.parent = y;
      x.parent = y.parent;
      if (y.parent == null) root = x;
      else if (y.parent.left == y) y.parent.left = x;
      else y.parent.right = x;
      x.right = y;
      y.parent = x;
      return x;
    }

    private Node rotateLeft(Node x) {
      Node y = x.right;
      x.right = y.left;
      if (y.left != null) y.left.parent = x;
      y.parent = x.parent;
      if (x.parent == null) root = y;
      else if (x.parent.left == x) x.parent.left = y;
      else x.parent.right = y;
      y.left = x;
      x.parent = y;
      return y;
    }
  }

  // ── 堆 ────────────────────────────────────────────────

  static void heapPush(List<Integer> h, int val) {
    h.add(val);
    int i = h.size() - 1;
    while (i > 0) {
      int p = (i - 1) >> 1;
      if (h.get(p) >= h.get(i)) break;
      swap(h, p, i);
      i = p;
    }
  }

  static int heapPop(List<Integer> h) {
    int top = h.get(0);
    h.set(0, h.get(h.size() - 1));
    h.remove(h.size() - 1);
    siftDown(h, 0, h.size());
    return top;
  }

  static List<Integer> heapSort(List<Integer> in) {
    List<Integer> h = new ArrayList<>(in);
    for (int i = (h.size() >> 1) - 1; i >= 0; i--) siftDown(h, i, h.size());
    for (int end = h.size() - 1; end > 0; end--) {
      swap(h, 0, end);
      siftDown(h, 0, end);
    }
    return h;
  }

  private static void siftDown(List<Integer> h, int i, int size) {
    while (true) {
      int big = i, l = 2 * i + 1, r = 2 * i + 2;
      if (l < size && h.get(l) > h.get(big)) big = l;
      if (r < size && h.get(r) > h.get(big)) big = r;
      if (big == i) return;
      swap(h, i, big);
      i = big;
    }
  }

  // ── 图（与前端同一张固定图） ────────────────────────────

  static final String[] NODES = {"A", "B", "C", "D", "E", "F", "G"};
  static final Object[][] EDGES = {
      {"A", "B", 4}, {"A", "C", 2}, {"B", "C", 1}, {"B", "D", 5},
      {"C", "D", 8}, {"C", "E", 10}, {"D", "E", 2}, {"D", "F", 6},
      {"E", "F", 3}, {"F", "G", 1},
  };

  private static Map<String, List<Object[]>> adjacency() {
    Map<String, List<Object[]>> adj = new LinkedHashMap<>();
    for (String n : NODES) adj.put(n, new ArrayList<>());
    for (Object[] e : EDGES) {
      adj.get((String) e[0]).add(new Object[]{e[1], e[2]});
      adj.get((String) e[1]).add(new Object[]{e[0], e[2]});
    }
    for (List<Object[]> l : adj.values()) l.sort((a, b) -> ((String) a[0]).compareTo((String) b[0]));
    return adj;
  }

  static List<String> bfs(String start) {
    Map<String, List<Object[]>> adj = adjacency();
    Deque<String> queue = new ArrayDeque<>();
    Set<String> seen = new HashSet<>();
    List<String> order = new ArrayList<>();
    queue.add(start);
    seen.add(start);
    while (!queue.isEmpty()) {
      String u = queue.poll();
      order.add(u);
      for (Object[] e : adj.get(u)) {
        String to = (String) e[0];
        if (seen.contains(to)) continue;
        seen.add(to);
        queue.add(to);
      }
    }
    return order;
  }

  static List<String> dfs(String start) {
    Map<String, List<Object[]>> adj = adjacency();
    Deque<String> stack = new ArrayDeque<>();
    Set<String> seen = new HashSet<>();
    List<String> order = new ArrayList<>();
    stack.push(start);
    while (!stack.isEmpty()) {
      String u = stack.pop();
      if (seen.contains(u)) continue;
      seen.add(u);
      order.add(u);
      List<Object[]> nb = adj.get(u);
      for (int i = nb.size() - 1; i >= 0; i--) stack.push((String) nb.get(i)[0]);
    }
    return order;
  }

  static String dijkstra(String start) {
    Map<String, List<Object[]>> adj = adjacency();
    Map<String, Integer> dist = new LinkedHashMap<>();
    for (String n : NODES) dist.put(n, Integer.MAX_VALUE);
    dist.put(start, 0);
    Set<String> done = new HashSet<>();
    while (done.size() < NODES.length) {
      String u = null;
      for (String n : NODES) {
        if (done.contains(n)) continue;
        if (u == null || dist.get(n) < dist.get(u)) u = n;
      }
      if (u == null || dist.get(u) == Integer.MAX_VALUE) break;
      done.add(u);
      for (Object[] e : adj.get(u)) {
        String to = (String) e[0];
        int w = (Integer) e[1];
        if (dist.get(u) + w < dist.get(to)) dist.put(to, dist.get(u) + w);
      }
    }
    StringBuilder sb = new StringBuilder("dist:");
    for (int i = 0; i < NODES.length; i++) {
      if (i > 0) sb.append(',');
      int d = dist.get(NODES[i]);
      sb.append(NODES[i]).append('=').append(d == Integer.MAX_VALUE ? "Infinity" : d);
    }
    return sb.toString();
  }

  static final String[][] TOPO_EDGES = {
      {"X1", "X2"}, {"X1", "X3"}, {"X2", "X4"}, {"X3", "X4"}, {"X3", "X5"},
      {"X4", "X6"}, {"X5", "X6"},
  };

  static String bellman(String start) {
    Map<String, Integer> dist = new LinkedHashMap<>();
    for (String n : NODES) dist.put(n, Integer.MAX_VALUE);
    dist.put(start, 0);
    for (int round = 0; round < NODES.length - 1; round++) {
      boolean changed = false;
      for (Object[] e : EDGES) {
        String u = (String) e[0], v = (String) e[1];
        int w = (Integer) e[2];
        if (dist.get(u) != Integer.MAX_VALUE && dist.get(u) + w < dist.get(v)) { dist.put(v, dist.get(u) + w); changed = true; }
        if (dist.get(v) != Integer.MAX_VALUE && dist.get(v) + w < dist.get(u)) { dist.put(u, dist.get(v) + w); changed = true; }
      }
      if (!changed) break;
    }
    StringBuilder sb = new StringBuilder("dist:");
    for (int i = 0; i < NODES.length; i++) {
      if (i > 0) sb.append(',');
      int d = dist.get(NODES[i]);
      sb.append(NODES[i]).append('=').append(d == Integer.MAX_VALUE ? "Infinity" : d);
    }
    return sb.toString();
  }

  static String kruskalMst() {
    Map<String, String> parent = new LinkedHashMap<>();
    for (String n : NODES) parent.put(n, n);
    List<Object[]> sorted = new ArrayList<>();
    for (Object[] e : EDGES) sorted.add(e);
    sorted.sort((a, b) -> (Integer) a[2] - (Integer) b[2]);
    List<String> picked = new ArrayList<>();
    int total = 0;
    for (Object[] e : sorted) {
      String u = (String) e[0], v = (String) e[1];
      int w = (Integer) e[2];
      String ru = find(parent, u), rv = find(parent, v);
      if (ru.equals(rv)) continue;
      parent.put(ru, rv);
      total += w;
      picked.add((u.compareTo(v) < 0 ? u + "|" + v : v + "|" + u));
      if (picked.size() == NODES.length - 1) break;
    }
    picked.sort(String::compareTo);
    return "total:" + total + "|edges:" + String.join(",", picked);
  }

  private static String find(Map<String, String> parent, String x) {
    String p = parent.get(x);
    if (p.equals(x)) return x;
    String r = find(parent, p);
    parent.put(x, r);
    return r;
  }

  static List<String> topo() {
    String[] nodes = {"X1", "X2", "X3", "X4", "X5", "X6"};
    Map<String, Integer> indeg = new LinkedHashMap<>();
    for (String n : nodes) indeg.put(n, 0);
    for (String[] e : TOPO_EDGES) indeg.merge(e[1], 1, Integer::sum);
    Deque<String> queue = new ArrayDeque<>();
    for (String n : nodes) if (indeg.get(n) == 0) queue.add(n);
    List<String> order = new ArrayList<>();
    while (!queue.isEmpty()) {
      String u = queue.poll();
      order.add(u);
      for (String[] e : TOPO_EDGES) {
        if (!e[0].equals(u)) continue;
        indeg.merge(e[1], -1, Integer::sum);
        if (indeg.get(e[1]) == 0) queue.add(e[1]);
      }
    }
    return order;
  }
}
