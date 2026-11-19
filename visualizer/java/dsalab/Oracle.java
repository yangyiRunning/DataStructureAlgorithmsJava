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
      case "list-reverse": return arr(reverse(ints(parts[1])));
      case "list-insert": return arr(insertAt(ints(parts[1]), Integer.parseInt(parts[2]), Integer.parseInt(parts[3])));
      case "list-delete": return arr(remove(ints(parts[1]), Integer.parseInt(parts[2])));
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
