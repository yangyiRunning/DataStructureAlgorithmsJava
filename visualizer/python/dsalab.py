"""算法实现的 Python 版。

这份文件有两个用途，而且是同一份代码：
  1. 演示页的代码栏切到 Python 时，显示的就是这里的函数源码；
  2. tools/crosscheck.mjs 把它当成第三路独立实现，和 JS / Java 三方比对结果。

所以注释里讲的是"为什么这么写"，和演示里的说明对得上——不要为了好看改逻辑，
改了这里，页面上看到的和真正跑过的就不是同一段代码了。

函数名统一由演示 id 把短横线换成下划线得到（sort-bubble -> sort_bubble）。
"""

from collections import deque
import sys


# ── 工具 ──────────────────────────────────────────────────

def _levels(s):
    """层序数组，null 表示空节点"""
    return [None if x == "null" else int(x) for x in s.split(",")] if s else []


def _ints(s):
    return [int(x) for x in s.split(",")] if s else []


def _arr(a):
    return ",".join(str(x) for x in a)


# ── 排序 ──────────────────────────────────────────────────

def sort_bubble(nums):
    a = list(nums)
    for end in range(len(a) - 1, 0, -1):
        swapped = False
        for i in range(end):
            if a[i] > a[i + 1]:
                a[i], a[i + 1] = a[i + 1], a[i]
                swapped = True
        if not swapped:
            break
    return a


def sort_insertion(nums):
    a = list(nums)
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a


def sort_selection(nums):
    a = list(nums)
    for i in range(len(a) - 1):
        m = i
        for j in range(i + 1, len(a)):
            if a[j] < a[m]:
                m = j
        if m != i:
            a[i], a[m] = a[m], a[i]
    return a


def sort_quick(nums):
    a = list(nums)

    def rec(lo, hi):
        if lo >= hi:
            return
        pivot = a[hi]
        i = lo
        for j in range(lo, hi):
            if a[j] < pivot:
                a[i], a[j] = a[j], a[i]
                i += 1
        a[i], a[hi] = a[hi], a[i]
        rec(lo, i - 1)
        rec(i + 1, hi)

    rec(0, len(a) - 1)
    return a


def sort_merge(nums):
    def rec(a):
        if len(a) <= 1:
            return a
        mid = len(a) // 2
        left = rec(a[:mid])
        right = rec(a[mid:])
        out = []
        i = j = 0
        # 取等号时优先取左边，这就是归并稳定的原因
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                out.append(left[i]); i += 1
            else:
                out.append(right[j]); j += 1
        out.extend(left[i:])
        out.extend(right[j:])
        return out

    return rec(list(nums))


def sort_counting(nums):
    if not nums:
        return []
    mx = max(nums)
    cnt = [0] * (mx + 1)
    for v in nums:
        cnt[v] += 1
    out = []
    for v in range(mx + 1):
        out.extend([v] * cnt[v])
    return out


def sort_shell(nums):
    a = list(nums)
    gap = len(a) // 2
    while gap > 0:
        for i in range(gap, len(a)):
            key = a[i]
            j = i - gap
            while j >= 0 and a[j] > key:
                a[j + gap] = a[j]
                j -= gap
            a[j + gap] = key
        gap //= 2
    return a


def sort_radix(nums):
    a = list(nums)
    if not a:
        return a
    exp = 1
    while max(a) // exp > 0:
        buckets = [[] for _ in range(10)]
        for v in a:
            buckets[(v // exp) % 10].append(v)
        a = [v for b in buckets for v in b]     # 桶内保持原顺序 -> 稳定
        exp *= 10
    return a


def sort_quickselect(nums, k):
    a = list(nums)
    target = len(a) - k          # "第 k 大"是名次，要换成升序下标
    lo, hi = 0, len(a) - 1
    while True:
        pivot = a[hi]
        i = lo
        for j in range(lo, hi):
            if a[j] < pivot:
                a[i], a[j] = a[j], a[i]
                i += 1
        a[i], a[hi] = a[hi], a[i]
        if i == target:
            return a[i]
        if i < target:
            lo = i + 1
        else:
            hi = i - 1


# ── 查找 ──────────────────────────────────────────────────

def bs_standard(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1


def bs_left(nums, target):
    lo, hi, ans = 0, len(nums) - 1, -1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            ans = mid
            hi = mid - 1
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return ans


def bs_right(nums, target):
    lo, hi, ans = 0, len(nums) - 1, -1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            ans = mid
            lo = mid + 1
        elif nums[mid] > target:
            hi = mid - 1
        else:
            lo = mid + 1
    return ans


def bs_lower(nums, target):
    lo, hi = 0, len(nums)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo


def bs_upper(nums, target):
    lo, hi, ans = 0, len(nums) - 1, -1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] <= target:
            ans = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return ans


def bs_rotated(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:            # 左半有序
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                                 # 右半有序
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1



# ── 链表 ──────────────────────────────────────────────────

def list_reverse(nums):
    return list(reversed(nums))


def list_insert(nums, at, val):
    a = list(nums)
    if 0 <= at <= len(a):
        a.insert(at, val)
    return a


def list_delete(nums, val):
    a = list(nums)
    if val in a:
        a.remove(val)
    return a


def list_middle(nums):
    slow = fast = 0
    while fast < len(nums) - 1:
        slow += 1
        fast += 2
    return nums[slow]


def _cycle_next(i, size, cycle_at):
    if i == size - 1:
        return cycle_at
    return i + 1


def list_cycle(nums, cycle_at):
    if cycle_at < 0:
        return -1
    slow = fast = 0
    while True:
        slow = _cycle_next(slow, len(nums), cycle_at)
        fast = _cycle_next(_cycle_next(fast, len(nums), cycle_at), len(nums), cycle_at)
        if slow == -1 or fast == -1:
            return -1
        if slow == fast:
            break
    p = 0
    while p != slow:
        p = _cycle_next(p, len(nums), cycle_at)
        slow = _cycle_next(slow, len(nums), cycle_at)
    return p


def list_remove_nth(nums, n):
    a = list(nums)
    idx = len(a) - n
    if 0 <= idx < len(a):
        a.pop(idx)
    return a


def list_merge(left, right):
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    out.extend(left[i:])
    out.extend(right[j:])
    return out


def list_reverse_k(nums, k):
    a = list(nums)
    for s in range(0, len(a) - k + 1, k):
        a[s:s + k] = a[s:s + k][::-1]
    return a


# ── 双指针与滑窗 ──────────────────────────────────────────

def tp_two_sum(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        s = nums[lo] + nums[hi]
        if s == target:
            return "%d,%d" % (lo, hi)
        if s < target:
            lo += 1
        else:
            hi -= 1
    return "none"


def tp_dedupe(nums):
    if not nums:
        return [], 0
    out = [nums[0]]
    for v in nums[1:]:
        if v != out[-1]:
            out.append(v)
    return out, len(out)


def tp_window_fixed(nums, k):
    best = s = sum(nums[:k])
    for i in range(k, len(nums)):
        s += nums[i] - nums[i - k]
        best = max(best, s)
    return best


def tp_window_var(s):
    last = {}
    left = best = 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)
    return best


# ── 栈与队列 ──────────────────────────────────────────────

def st_brackets(s):
    stack = []
    pairs = {")": "(", "]": "[", "}": "{"}
    for ch in s:
        if ch not in pairs:
            stack.append(ch)
            continue
        if not stack or stack.pop() != pairs[ch]:
            return False
    return not stack


def st_monotonic(temps):
    res = [0] * len(temps)
    stack = []
    for i, t in enumerate(temps):
        while stack and t > temps[stack[-1]]:
            j = stack.pop()
            res[j] = i - j
        stack.append(i)
    return res


def st_deque(nums, k):
    dq = deque()
    out = []
    for i, v in enumerate(nums):
        while dq and nums[dq[-1]] <= v:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            out.append(nums[dq[0]])
    return out


def st_two_stacks(spec):
    in_stack, out_stack, transfers = [], [], 0
    for op in spec.split(","):
        if op.startswith("push"):
            in_stack.append(int(op[4:]))
        else:
            if not out_stack:
                while in_stack:
                    out_stack.append(in_stack.pop()); transfers += 1
            if out_stack:
                out_stack.pop()
    return transfers


def st_circle_queue(spec):
    n = 6
    buf = [None] * n
    head = tail = size = 0
    for op in spec.split(","):
        if op.startswith("enqueue"):
            if size == n:
                continue
            buf[tail] = int(op[7:])
            tail = (tail + 1) % n
            size += 1
        else:
            if size == 0:
                continue
            buf[head] = None
            head = (head + 1) % n
            size -= 1
    return [v for v in buf if v is not None]


# ── 树、堆 ────────────────────────────────────────────────

class _Node:
    __slots__ = ("val", "left", "right")

    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None


def _height(n):
    return 0 if n is None else 1 + max(_height(n.left), _height(n.right))


def _size(n):
    return 0 if n is None else 1 + _size(n.left) + _size(n.right)


def _inorder(n, out):
    if n is None:
        return out
    _inorder(n.left, out)
    out.append(n.val)
    _inorder(n.right, out)
    return out


def _bst_put(root, val):
    if root is None:
        return _Node(val)
    cur = root
    while True:
        if val < cur.val:
            if cur.left is None:
                cur.left = _Node(val); break
            cur = cur.left
        elif val > cur.val:
            if cur.right is None:
                cur.right = _Node(val); break
            cur = cur.right
        else:
            break
    return root


def _bst_remove(node, key):
    if node is None:
        return None
    if key < node.val:
        node.left = _bst_remove(node.left, key)
        return node
    if key > node.val:
        node.right = _bst_remove(node.right, key)
        return node
    if node.left is None:
        return node.right
    if node.right is None:
        return node.left
    succ = node.right
    while succ.left:
        succ = succ.left
    node.val = succ.val
    node.right = _bst_remove(node.right, succ.val)
    return node


def tree_bst_insert(nums):
    root = None
    for v in nums:
        root = _bst_put(root, v)
    return "inorder:%s|height:%d|size:%d" % (_arr(_inorder(root, [])), _height(root), _size(root))


def _rot_right(y):
    x = y.left
    y.left = x.right
    x.right = y
    return x


def _rot_left(x):
    y = x.right
    x.right = y.left
    y.left = x
    return y


def tree_avl_insert(nums):
    rotations = [0]

    def ins(node, val):
        if node is None:
            return _Node(val)
        if val < node.val:
            node.left = ins(node.left, val)
        elif val > node.val:
            node.right = ins(node.right, val)
        else:
            return node
        hl, hr = _height(node.left), _height(node.right)
        bf = hl - hr
        if bf > 1 and val < node.left.val:
            rotations[0] += 1
            return _rot_right(node)
        if bf < -1 and val > node.right.val:
            rotations[0] += 1
            return _rot_left(node)
        if bf > 1 and val > node.left.val:
            node.left = _rot_left(node.left); rotations[0] += 1
            rotations[0] += 1
            return _rot_right(node)
        if bf < -1 and val < node.right.val:
            node.right = _rot_right(node.right); rotations[0] += 1
            rotations[0] += 1
            return _rot_left(node)
        return node

    root = None
    for v in nums:
        root = ins(root, v)
    return "inorder:%s|height:%d|rotations:%d|size:%d" % (
        _arr(_inorder(root, [])), _height(root), rotations[0], _size(root))


_FIXED_TREE = [8, 4, 12, 2, 6, 10, 14]


def tree_traverse(mode):
    out = []

    def dfs(i):
        if i >= len(_FIXED_TREE):
            return
        if mode == "pre":
            out.append(_FIXED_TREE[i])
        dfs(2 * i + 1)
        if mode == "in":
            out.append(_FIXED_TREE[i])
        dfs(2 * i + 2)
        if mode == "post":
            out.append(_FIXED_TREE[i])

    if mode == "level":
        q = deque([0])
        while q:
            i = q.popleft()
            out.append(_FIXED_TREE[i])
            for c in (2 * i + 1, 2 * i + 2):
                if c < len(_FIXED_TREE):
                    q.append(c)
    else:
        dfs(0)
    return out


def tree_bst_delete(nums, key):
    root = None
    for v in nums:
        root = _bst_put(root, v)
    root = _bst_remove(root, key)
    return "inorder:%s|size:%d" % (_arr(_inorder(root, [])), _size(root))


class _TrieNode:
    __slots__ = ("children", "terminal")

    def __init__(self):
        self.children = {}
        self.terminal = False


def _trie_count(node):
    return 1 + sum(_trie_count(c) for c in node.children.values())


def trie_insert(words):
    root = _TrieNode()
    terminals = 0
    for w in words:
        cur = root
        for ch in w:
            cur = cur.children.setdefault(ch, _TrieNode())
        if not cur.terminal:
            cur.terminal = True
            terminals += 1
    return "nodes:%d|terminals:%d" % (_trie_count(root), terminals)


def _trie_build(words):
    root = _TrieNode()
    for w in words:
        cur = root
        for ch in w:
            cur = cur.children.setdefault(ch, _TrieNode())
        cur.terminal = True
    return root


def trie_query(word, mode):
    root = _trie_build(["cat", "car", "dog"])
    cur = root
    for ch in word:
        if ch not in cur.children:
            return False
        cur = cur.children[ch]
    return True if mode == "prefix" else cur.terminal


def uf_union(spec):
    parent = list(range(7))
    rank = [0] * 7
    unions = 0

    def find(x):
        r = x
        while parent[r] != r:
            r = parent[r]
        while parent[x] != r:
            parent[x], x = r, parent[x]
        return r

    for pair in (spec.split(",") if spec else []):
        a, b = (int(x) for x in pair.split("-"))
        ra, rb = find(a), find(b)
        if ra == rb:
            continue
        if rank[ra] < rank[rb]:
            parent[ra] = rb
        elif rank[ra] > rank[rb]:
            parent[rb] = ra
        else:
            parent[rb] = ra
            rank[ra] += 1
        unions += 1
    return unions


def uf_find(x):
    parent = list(range(7))
    for i in range(1, 7):
        parent[i] = i - 1          # 先造一条链
    r = x
    while parent[r] != r:
        r = parent[r]
    while parent[x] != r:
        parent[x], x = r, parent[x]
    return r


def heap_push(base, val):
    h = list(base)
    h.append(val)
    i = len(h) - 1
    while i > 0:
        p = (i - 1) // 2
        if h[p] >= h[i]:
            break
        h[p], h[i] = h[i], h[p]
        i = p
    return h


def _sift_down(h, i, size):
    while True:
        big, l, r = i, 2 * i + 1, 2 * i + 2
        if l < size and h[l] > h[big]:
            big = l
        if r < size and h[r] > h[big]:
            big = r
        if big == i:
            return
        h[i], h[big] = h[big], h[i]
        i = big


def heap_pop(base):
    h = list(base)
    top = h[0]
    h[0] = h[-1]
    h.pop()
    _sift_down(h, 0, len(h))
    return h, top


def heap_sort(nums):
    h = list(nums)
    for i in range(len(h) // 2 - 1, -1, -1):
        _sift_down(h, i, len(h))
    for end in range(len(h) - 1, 0, -1):
        h[0], h[end] = h[end], h[0]
        _sift_down(h, 0, end)
    return h


def heap_topk(nums, k):
    import heapq
    heap = []
    for v in nums:
        heapq.heappush(heap, v)
        if len(heap) > k:
            heapq.heappop(heap)
    return sorted(heap, reverse=True)


# ── 动态规划 ──────────────────────────────────────────────

def dp_climb(n):
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b


def dp_rob(nums):
    prev = cur = 0
    for x in nums:
        prev, cur = cur, max(cur, prev + x)
    return cur


def dp_lis(nums):
    if not nums:
        return 0
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)


def dp_knapsack(w, v, C):
    dp = [[0] * (C + 1) for _ in range(len(w) + 1)]
    for i in range(1, len(w) + 1):
        for c in range(C + 1):
            dp[i][c] = dp[i - 1][c]                      # 不装
            if c >= w[i - 1]:
                dp[i][c] = max(dp[i][c], dp[i - 1][c - w[i - 1]] + v[i - 1])
    return dp[len(w)][C]


def dp_unbounded(w, v, C):
    dp = [[0] * (C + 1) for _ in range(len(w) + 1)]
    for i in range(1, len(w) + 1):
        for c in range(C + 1):
            dp[i][c] = dp[i - 1][c]
            if c >= w[i - 1]:
                # 注意是 dp[i][...]：同一行，表示这件还能再装
                dp[i][c] = max(dp[i][c], dp[i][c - w[i - 1]] + v[i - 1])
    return dp[len(w)][C]


def dp_edit_distance(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]


# ── 回溯 ──────────────────────────────────────────────────

def bt_permute(nums):
    import math
    return math.factorial(len(nums))


def bt_subsets(nums):
    return 1 << len(nums)


def bt_nqueens(n):
    queens = [-1] * n

    def dfs(r):
        if r == n:
            return 1
        total = 0
        for c in range(n):
            if any(queens[rr] == c or abs(queens[rr] - c) == r - rr for rr in range(r)):
                continue                      # 剪枝：这一列放不了
            queens[r] = c
            total += dfs(r + 1)
            queens[r] = -1
        return total

    return dfs(0)


# ── 图 ────────────────────────────────────────────────────

_NODES = ["A", "B", "C", "D", "E", "F", "G"]
_EDGES = [
    ("A", "B", 4), ("A", "C", 2), ("B", "C", 1), ("B", "D", 5),
    ("C", "D", 8), ("C", "E", 10), ("D", "E", 2), ("D", "F", 6),
    ("E", "F", 3), ("F", "G", 1),
]
_TOPO_EDGES = [("X1", "X2"), ("X1", "X3"), ("X2", "X4"), ("X3", "X4"),
               ("X3", "X5"), ("X4", "X6"), ("X5", "X6")]


def _adj():
    adj = {n: [] for n in _NODES}
    for u, v, w in _EDGES:
        adj[u].append((v, w))
        adj[v].append((u, w))
    for k in adj:
        adj[k].sort()
    return adj


def graph_bfs(start):
    adj = _adj()
    seen = {start}
    q = deque([start])
    out = []
    while q:
        u = q.popleft()
        out.append(u)
        for to, _ in adj[u]:
            if to not in seen:
                seen.add(to)
                q.append(to)
    return out


def graph_dfs(start):
    adj = _adj()
    seen = set()
    stack = [start]
    out = []
    while stack:
        u = stack.pop()
        if u in seen:
            continue
        seen.add(u)
        out.append(u)
        for to, _ in reversed(adj[u]):
            stack.append(to)
    return out


def _dijkstra_raw(start):
    adj = _adj()
    dist = {n: float("inf") for n in _NODES}
    dist[start] = 0
    done = set()
    while len(done) < len(_NODES):
        u = None
        for n in _NODES:
            if n in done:
                continue
            if u is None or dist[n] < dist[u]:
                u = n
        if u is None or dist[u] == float("inf"):
            break
        done.add(u)
        for to, w in adj[u]:
            if dist[u] + w < dist[to]:
                dist[to] = dist[u] + w
    return dist


def _dist_str(dist):
    return ",".join("%s=%s" % (n, "Infinity" if dist[n] == float("inf") else int(dist[n])) for n in _NODES)


def graph_dijkstra(start):
    return _dist_str(_dijkstra_raw(start))


def graph_bellman_ford(start):
    dist = {n: float("inf") for n in _NODES}
    dist[start] = 0
    for _ in range(len(_NODES) - 1):
        changed = False
        for u, v, w in _EDGES:
            if dist[u] != float("inf") and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w; changed = True
            if dist[v] != float("inf") and dist[v] + w < dist[u]:
                dist[u] = dist[v] + w; changed = True
        if not changed:
            break
    return _dist_str(dist)


def graph_floyd():
    n = len(_NODES)
    idx = {name: i for i, name in enumerate(_NODES)}
    INF = float("inf")
    d = [[INF] * n for _ in range(n)]
    for i in range(n):
        d[i][i] = 0
    for u, v, w in _EDGES:
        i, j = idx[u], idx[v]
        d[i][j] = min(d[i][j], w)
        d[j][i] = min(d[j][i], w)
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if d[i][k] + d[k][j] < d[i][j]:
                    d[i][j] = d[i][k] + d[k][j]
    return ";".join("%s:%s" % (_NODES[i], "/".join(str(d[i][j]) for j in range(n))) for i in range(n))


def _fmt_int(v):
    return "Infinity" if v == float("inf") else str(v)


def _mst_edges(total, picked):
    return "total:%d|edges:%s" % (total, ",".join(sorted(picked)))


def graph_kruskal():
    parent = {n: n for n in _NODES}

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    total, picked = 0, []
    for u, v, w in sorted(_EDGES, key=lambda e: e[2]):
        ru, rv = find(u), find(v)
        if ru == rv:
            continue
        parent[ru] = rv
        total += w
        picked.append("%s|%s" % (u, v) if u < v else "%s|%s" % (v, u))
        if len(picked) == len(_NODES) - 1:
            break
    return _mst_edges(total, picked)


def graph_prim(start):
    inside = {start}
    total, picked = 0, []
    while len(inside) < len(_NODES):
        best = None
        for e in _EDGES:
            if (e[0] in inside) == (e[1] in inside):
                continue
            if best is None or e[2] < best[2]:
                best = e
        if best is None:
            break
        u, v, w = best
        inside.add(v if u in inside else u)
        total += w
        picked.append("%s|%s" % (u, v) if u < v else "%s|%s" % (v, u))
    return _mst_edges(total, picked)


def graph_topo():
    indeg = {n: 0 for n in ["X1", "X2", "X3", "X4", "X5", "X6"]}
    for _, v in _TOPO_EDGES:
        indeg[v] += 1
    q = deque([n for n in indeg if indeg[n] == 0])
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for a, v in _TOPO_EDGES:
            if a != u:
                continue
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order


_ISLAND_GRID = [
    [1, 1, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [0, 0, 1, 0, 0],
    [1, 0, 1, 1, 0],
]


def graph_islands():
    g = [row[:] for row in _ISLAND_GRID]
    R, C = len(g), len(g[0])
    count = 0

    def flood(r, c):
        if r < 0 or r >= R or c < 0 or c >= C or g[r][c] != 1:
            return
        g[r][c] = 0
        flood(r + 1, c); flood(r - 1, c); flood(r, c + 1); flood(r, c - 1)

    for r in range(R):
        for c in range(C):
            if g[r][c] == 1:
                count += 1
                flood(r, c)
    return count


# ── 数组技巧 / 位运算 / 字符串 / 杂项 ─────────────────────

def at_prefix_sum(nums):
    pre = [0]
    for v in nums:
        pre.append(pre[-1] + v)
    return "pre:%s|total:%d" % (_arr(pre), pre[-1])


def at_diff_array(n, spec):
    d = [0] * (n + 1)
    for op in (spec.split(",") if spec else []):
        l, r, v = (int(x) for x in op.split(":"))
        d[l] += v
        d[r + 1] -= v
    out, cur = [], 0
    for i in range(n):
        cur += d[i]
        out.append(cur)
    return out


def at_jump_game(nums):
    reach = 0
    for i, v in enumerate(nums):
        if i > reach:
            return False
        reach = max(reach, i + v)
    return True


def at_intervals(spec):
    items = []
    for part in (spec.split(",") if spec else []):
        s, e = (int(x) for x in part.split("-"))
        items.append((s, e))
    items.sort(key=lambda x: x[1])
    removed = kept = 0
    last_end = float("-inf")
    for s, e in items:
        if s >= last_end:
            last_end = e
            kept += 1
        else:
            removed += 1
    return removed, kept


def bit_single_number(nums):
    ans = 0
    for v in nums:
        ans ^= v
    return ans


def bit_subset_mask(nums):
    return 1 << len(nums)


def str_kmp(s, p):
    n = len(p)
    nxt = [0] * n
    k = 0
    for i in range(1, n):
        while k > 0 and p[i] != p[k]:
            k = nxt[k - 1]
        if p[i] == p[k]:
            k += 1
        nxt[i] = k
    j = 0
    for i, ch in enumerate(s):
        while j > 0 and ch != p[j]:
            j = nxt[j - 1]
        if ch == p[j]:
            j += 1
        if j == n:
            return i - j + 1
    return -1


def rec_hanoi(n):
    return (1 << n) - 1


def str_palindrome(s):
    i, j = 0, len(s) - 1
    while i < j:
        if s[i] != s[j]:
            return False
        i += 1; j -= 1
    return True


def hash_chaining(nums):
    N = 5
    buckets = [[] for _ in range(N)]
    collisions = 0
    for key in nums:
        i = key % N
        if key in buckets[i]:
            continue
        if buckets[i]:
            collisions += 1
        buckets[i].append(key)
    return collisions, max(len(b) for b in buckets), sum(len(b) for b in buckets)


def hash_lru(spec):
    from collections import OrderedDict
    cap = 3
    od = OrderedDict()
    for op in spec.split(","):
        kind, key = op[:3], int(op[3:])
        if kind == "get":
            if key not in od:
                continue
            od.move_to_end(key)
        else:
            val = key * 10
            if key in od:
                od.pop(key)
            elif len(od) == cap:
                od.popitem(last=False)      # 淘汰最久没用
            od[key] = val
    return list(reversed(list(od.keys())))


def adv_segment_tree(nums, ql, qr):
    n = len(nums)
    tree = [0] * (4 * n)

    def build(node, l, r):
        if l == r:
            tree[node] = nums[l]
            return
        mid = (l + r) // 2
        build(node * 2, l, mid)
        build(node * 2 + 1, mid + 1, r)
        tree[node] = tree[node * 2] + tree[node * 2 + 1]

    def query(node, l, r):
        if qr < l or r < ql:
            return 0
        if ql <= l and r <= qr:
            return tree[node]
        mid = (l + r) // 2
        return query(node * 2, l, mid) + query(node * 2 + 1, mid + 1, r)

    build(1, 0, n - 1)
    return query(1, 0, n - 1)


def adv_fenwick(nums, q):
    n = len(nums)
    tree = [0] * (n + 1)
    for i in range(1, n + 1):
        j = i
        while j <= n:
            tree[j] += nums[i - 1]
            j += j & -j
    total = 0
    i = q
    while i > 0:
        total += tree[i]
        i -= i & -i
    return total


# ── 热门题 ────────────────────────────────────────────────

def lc_three_sum(nums):
    a = sorted(nums)
    res = 0
    for i in range(len(a) - 2):
        if i > 0 and a[i] == a[i - 1]:
            continue                        # 第一个数去重
        lo, hi = i + 1, len(a) - 1
        while lo < hi:
            s = a[i] + a[lo] + a[hi]
            if s == 0:
                res += 1
                while lo < hi and a[lo] == a[lo + 1]:
                    lo += 1
                while lo < hi and a[hi] == a[hi - 1]:
                    hi -= 1
                lo += 1; hi -= 1
            elif s < 0:
                lo += 1
            else:
                hi -= 1
    return res


def lc_container(height):
    lo, hi, best = 0, len(height) - 1, 0
    while lo < hi:
        best = max(best, min(height[lo], height[hi]) * (hi - lo))
        if height[lo] < height[hi]:
            lo += 1
        else:
            hi -= 1
    return best


def lc_max_subarray(nums):
    cur = best = nums[0]
    for v in nums[1:]:
        cur = max(v, cur + v)              # 接着前面，还是从这里重开
        best = max(best, cur)
    return best


def lc_unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]
    for r in range(1, m):
        for c in range(1, n):
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
    return dp[m - 1][n - 1]


# ── 热门题 2 ──────────────────────────────────────────────

def lc_stock(prices):
    min_price = float("inf")
    best = 0
    for p in prices:
        min_price = min(min_price, p)
        best = max(best, p - min_price)
    return best


def lc_max_product(nums):
    cur_max = cur_min = best = nums[0]
    for v in nums[1:]:
        a, b = cur_max * v, cur_min * v
        cur_max = max(v, a, b)          # 负负得正，最小也可能是潜力股
        cur_min = min(v, a, b)
        best = max(best, cur_max)
    return best


def lc_move_zero(nums):
    a = list(nums)
    slow = 0
    for fast in range(len(a)):
        if a[fast] != 0:
            a[slow], a[fast] = a[fast], a[slow]
            slow += 1
    return a


def lc_product_except_self(nums):
    n = len(nums)
    res = [1] * n
    left = 1
    for i in range(n):
        res[i] = left
        left *= nums[i]
    right = 1
    for i in range(n - 1, -1, -1):
        res[i] *= right
        right *= nums[i]
    return res


def lc_rotate(nums, k):
    a = list(nums)
    k %= len(a)
    a.reverse()
    a[:k] = reversed(a[:k])
    a[k:] = reversed(a[k:])
    return a


class _TNode:
    __slots__ = ("val", "left", "right")

    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None


def _build_tree(levels):
    nodes = [_TNode(v) if v is not None else None for v in levels]
    for i, node in enumerate(nodes):
        if node is None:
            continue
        l, r = 2 * i + 1, 2 * i + 2
        if l < len(nodes):
            node.left = nodes[l]
        if r < len(nodes):
            node.right = nodes[r]
    return nodes[0]


def lc_max_depth(levels):
    def dfs(node):
        if node is None:
            return 0
        return 1 + max(dfs(node.left), dfs(node.right))
    return dfs(_build_tree(levels))


def lc_symmetric(levels):
    root = _build_tree(levels)

    def walk(a, b):
        if a is None and b is None:
            return True
        if a is None or b is None:
            return False
        return a.val == b.val and walk(a.left, b.right) and walk(a.right, b.left)

    if root is None:
        return True
    return walk(root.left, root.right)


def lc_diameter(levels):
    best = [0]

    def depth(node):
        if node is None:
            return 0
        l, r = depth(node.left), depth(node.right)
        best[0] = max(best[0], l + r)
        return 1 + max(l, r)

    depth(_build_tree(levels))
    return best[0]


def lc_coin_change(coins, amount):
    INF = float("inf")
    dp = [INF] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if a >= c and dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1
    return -1 if dp[amount] == INF else dp[amount]


# ── 热门题 3 ──────────────────────────────────────────────

def lc_longest_consecutive(nums):
    st = set(nums)
    best = 0
    for x in st:
        if x - 1 in st:
            continue                        # 只从序列起点开始数
        y = x
        while y + 1 in st:
            y += 1
        best = max(best, y - x + 1)
    return best


def lc_min_stack(spec):
    stack, mins, out = [], [], []
    for op in spec.split(","):
        if op.startswith("push"):
            v = int(op[4:])
            stack.append(v)
            mins.append(min(v, mins[-1]) if mins else v)
        elif op == "pop":
            if stack:
                stack.pop(); mins.pop()
        elif op == "top":
            if stack:
                out.append(stack[-1])
        else:
            if mins:
                out.append(mins[-1])
    return out


def lc_decode_string(s):
    stack = []
    cur, num = "", 0
    for ch in s:
        if ch.isdigit():
            num = num * 10 + int(ch)
        elif ch == "[":
            stack.append((cur, num))
            cur, num = "", 0
        elif ch == "]":
            prev, n = stack.pop()
            cur = prev + cur * n
        else:
            cur += ch
    return cur


def _build_tree3(levels):
    nodes = [_TNode(v) if v is not None else None for v in levels]
    for i, node in enumerate(nodes):
        if node is None:
            continue
        l, r = 2 * i + 1, 2 * i + 2
        if l < len(nodes):
            node.left = nodes[l]
        if r < len(nodes):
            node.right = nodes[r]
    return nodes[0]


def lc_lca(levels, p, q):
    root = _build_tree3(levels)

    def dfs(node):
        if node is None or node.val == p or node.val == q:
            return node
        l, r = dfs(node.left), dfs(node.right)
        if l and r:
            return node                     # 两边各找到一个 -> 当前就是分叉点
        return l or r

    ans = dfs(root)
    return ans.val if ans else -1


def lc_validate_bst(levels):
    root = _build_tree3(levels)

    def walk(node, low, high):
        if node is None:
            return True
        if not (low < node.val < high):
            return False
        return walk(node.left, low, node.val) and walk(node.right, node.val, high)

    return walk(root, float("-inf"), float("inf"))


_ORANGE_GRID = [
    [2, 1, 1, 1, 2],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 0, 1],
]


def lc_oranges():
    g = [row[:] for row in _ORANGE_GRID]
    R, C = len(g), len(g[0])
    fresh = sum(row.count(1) for row in g)
    q = deque([(r, c) for r in range(R) for c in range(C) if g[r][c] == 2])
    minutes = 0
    while q and fresh > 0:
        for _ in range(len(q)):
            r, c = q.popleft()
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < R and 0 <= nc < C and g[nr][nc] == 1:
                    g[nr][nc] = 2
                    fresh -= 1
                    q.append((nr, nc))
        minutes += 1
    return minutes if fresh == 0 else -1


def lc_top_k_frequent(nums, k):
    from collections import Counter
    cnt = Counter(nums)          # 插入顺序 = 首次出现顺序，和 JS 的 Map 一致
    heap = []
    for x, c in cnt.items():
        heap.append((x, c))
        heap.sort(key=lambda t: t[1])     # 稳定排序：同频次保持插入顺序
        if len(heap) > k:
            heap.pop(0)                   # 挤掉频次最小的那个
    return sorted(x for x, _ in heap)


# ── 热门题 4 ──────────────────────────────────────────────

def lc_add_two(a, b):
    out, carry, i, j = [], 0, 0, 0
    while i < len(a) or j < len(b) or carry:
        va = a[i] if i < len(a) else 0
        vb = b[j] if j < len(b) else 0
        s = va + vb + carry
        carry = s // 10
        out.append(s % 10)
        i += 1
        j += 1
    return out


class _LNode:
    __slots__ = ("val", "next")

    def __init__(self, val):
        self.val = val
        self.next = None


def _build_lists(pre_a, pre_b, shared):
    """shared 里的节点被两条链共用，这才是"相交"的含义"""
    shared_nodes = [_LNode(v) for v in shared]
    for i, n in enumerate(shared_nodes[:-1]):
        n.next = shared_nodes[i + 1]

    def chain(vals):
        nodes = [_LNode(v) for v in vals]
        for i, n in enumerate(nodes[:-1]):
            n.next = nodes[i + 1]
        if nodes and shared_nodes:
            nodes[-1].next = shared_nodes[0]
        return nodes[0] if nodes else (shared_nodes[0] if shared_nodes else None)

    return chain(pre_a), chain(pre_b)


def lc_intersection(pre_a, pre_b, shared):
    a, b = _build_lists(pre_a, pre_b, shared)
    pa, pb = a, b
    steps = 0
    limit = len(pre_a) + len(pre_b) + 2 * len(shared) + 2
    # 走到 null 就换到另一条链的头：两个指针走的总长相同，必同时抵达交点
    while pa is not pb and steps <= limit:
        pa = b if pa is None else (pa.next if pa is not None else None)
        pb = a if pb is None else (pb.next if pb is not None else None)
        steps += 1
        if pa is None and pb is None:
            break
    return pa.val if pa is not None else -1


def lc_palindrome_list(nums):
    return nums == nums[::-1]


def lc_largest_rect(h):
    stack, best = [], 0
    for i in range(len(h) + 1):
        cur = 0 if i == len(h) else h[i]      # 末尾补 0 把栈清空
        while stack and h[stack[-1]] > cur:
            height = h[stack.pop()]
            left = stack[-1] + 1 if stack else 0
            best = max(best, height * (i - left))
        stack.append(i)
    return best


def lc_group_anagrams(strs):
    groups = {}
    for s in strs:
        key = "".join(sorted(s))              # 排序后的串当键
        groups.setdefault(key, []).append(s)
    return len(groups)


def lc_generate_parens(n):
    res = []

    def dfs(cur, open_cnt, close_cnt):
        if len(cur) == n * 2:
            res.append(cur)
            return
        if open_cnt < n:
            dfs(cur + "(", open_cnt + 1, close_cnt)
        if close_cnt < open_cnt:
            dfs(cur + ")", open_cnt, close_cnt + 1)

    dfs("", 0, 0)
    return len(res)


_WORD_BOARD = [
    ["A", "B", "C", "E"],
    ["S", "F", "C", "S"],
    ["A", "D", "E", "E"],
]


def lc_word_search(word):
    board = [row[:] for row in _WORD_BOARD]
    R, C = len(board), len(board[0])

    def dfs(r, c, i):
        if i == len(word):
            return True
        if r < 0 or r >= R or c < 0 or c >= C or board[r][c] != word[i]:
            return False
        tmp = board[r][c]
        board[r][c] = "#"                     # 占住，防止走回头路
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if dfs(nr, nc, i + 1):
                return True
        board[r][c] = tmp                     # 撤销
        return False

    return any(dfs(r, c, 0) for r in range(R) for c in range(C))


def lc_word_break(s, words):
    word_set = set(words)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    return dp[len(s)]

# ── 命令分发：把 spec 翻译成上面这些函数，输出和 Java 版逐字一致的结果 ──

def _run(spec):
    parts = spec.split(";")
    cmd = parts[0]

    if cmd == "sort-bubble":
        return _arr(sort_bubble(_ints(parts[1])))
    if cmd == "sort-insertion":
        return _arr(sort_insertion(_ints(parts[1])))
    if cmd == "sort-selection":
        return _arr(sort_selection(_ints(parts[1])))
    if cmd == "sort-quick":
        return _arr(sort_quick(_ints(parts[1])))
    if cmd == "sort-merge":
        return _arr(sort_merge(_ints(parts[1])))
    if cmd == "sort-counting":
        return _arr(sort_counting(_ints(parts[1])))
    if cmd == "sort-shell":
        return _arr(sort_shell(_ints(parts[1])))
    if cmd == "sort-radix":
        return _arr(sort_radix(_ints(parts[1])))
    if cmd == "sort-quickselect":
        return "val:%d" % sort_quickselect(_ints(parts[1]), int(parts[2]))

    if cmd == "bs-standard":
        return "idx:%d" % bs_standard(_ints(parts[1]), int(parts[2]))
    if cmd == "bs-left":
        return "idx:%d" % bs_left(_ints(parts[1]), int(parts[2]))
    if cmd == "bs-right":
        return "idx:%d" % bs_right(_ints(parts[1]), int(parts[2]))
    if cmd == "bs-lower":
        return "idx:%d" % bs_lower(_ints(parts[1]), int(parts[2]))
    if cmd == "bs-upper":
        return "idx:%d" % bs_upper(_ints(parts[1]), int(parts[2]))
    if cmd == "bs-rotated":
        return "idx:%d" % bs_rotated(_ints(parts[1]), int(parts[2]))

    if cmd == "list-reverse":
        return _arr(list_reverse(_ints(parts[1])))
    if cmd == "list-insert":
        return _arr(list_insert(_ints(parts[1]), int(parts[2]), int(parts[3])))
    if cmd == "list-delete":
        return _arr(list_delete(_ints(parts[1]), int(parts[2])))
    if cmd == "list-middle":
        return "val:%d" % list_middle(_ints(parts[1]))
    if cmd == "list-cycle":
        return "entry:%d" % list_cycle(_ints(parts[1]), -1 if parts[2] == "null" else int(parts[2]))
    if cmd == "list-remove-nth":
        return "arr:" + _arr(list_remove_nth(_ints(parts[1]), int(parts[2])))
    if cmd == "list-merge":
        return "arr:" + _arr(list_merge(_ints(parts[1]), _ints(parts[2])))
    if cmd == "list-reverse-k":
        return "arr:" + _arr(list_reverse_k(_ints(parts[1]), int(parts[2])))

    if cmd == "tp-two-sum":
        return "pair:" + tp_two_sum(_ints(parts[1]), int(parts[2]))
    if cmd == "tp-dedupe":
        arr, ln = tp_dedupe(_ints(parts[1]))
        return "arr:" + _arr(arr) + "|len:%d" % ln
    if cmd == "tp-window-fixed":
        return "sum:%d" % tp_window_fixed(_ints(parts[1]), int(parts[2]))
    if cmd == "tp-window-var":
        return "len:%d" % tp_window_var(parts[1])

    if cmd == "st-brackets":
        return "ok:%s" % ("true" if st_brackets(parts[1]) else "false")
    if cmd == "st-monotonic":
        return "arr:" + _arr(st_monotonic(_ints(parts[1])))
    if cmd == "st-deque":
        return "arr:" + _arr(st_deque(_ints(parts[1]), int(parts[2])))
    if cmd == "st-two-stacks":
        return "transfers:%d" % st_two_stacks(parts[1])
    if cmd == "st-circle-queue":
        return "leftover:" + _arr(st_circle_queue(parts[1]))

    if cmd == "tree-bst-insert":
        return tree_bst_insert(_ints(parts[1]))
    if cmd == "tree-avl-insert":
        return tree_avl_insert(_ints(parts[1]))
    if cmd == "tree-traverse":
        return "order:" + _arr(tree_traverse(parts[1]))
    if cmd == "tree-bst-delete":
        return tree_bst_delete(_ints(parts[1]), int(parts[2]))
    if cmd == "trie-insert":
        return trie_insert(parts[1].split(","))
    if cmd == "trie-query":
        return "ok:%s" % ("true" if trie_query(parts[1], parts[2]) else "false")
    if cmd == "uf-union":
        return "unions:%d" % uf_union(parts[1])
    if cmd == "uf-find":
        return "root:%d" % uf_find(int(parts[1]))
    if cmd == "heap-push":
        return _arr(heap_push(_ints(parts[1]), int(parts[2])))
    if cmd == "heap-pop":
        h, top = heap_pop(_ints(parts[1]))
        return "arr:" + _arr(h) + "|popped:%d" % top
    if cmd == "heap-sort":
        return _arr(heap_sort(_ints(parts[1])))
    if cmd == "heap-topk":
        return "top:" + _arr(heap_topk(_ints(parts[1]), int(parts[2])))

    if cmd == "dp-climb":
        return "ans:%d" % dp_climb(int(parts[1]))
    if cmd == "dp-rob":
        return "ans:%d" % dp_rob(_ints(parts[1]))
    if cmd == "dp-lis":
        return "ans:%d" % dp_lis(_ints(parts[1]))
    if cmd == "dp-knapsack":
        return "ans:%d" % dp_knapsack(_ints(parts[1]), _ints(parts[2]), int(parts[3]))
    if cmd == "dp-unbounded":
        return "ans:%d" % dp_unbounded(_ints(parts[1]), _ints(parts[2]), int(parts[3]))
    if cmd == "dp-edit-distance":
        return "dist:%d" % dp_edit_distance(parts[1], parts[2])

    if cmd == "bt-permute":
        return "count:%d" % bt_permute(_ints(parts[1]))
    if cmd == "bt-subsets":
        return "count:%d" % bt_subsets(_ints(parts[1]))
    if cmd == "bt-nqueens":
        return "count:%d" % bt_nqueens(int(parts[1]))

    if cmd == "graph-bfs":
        return "order:" + ",".join(graph_bfs(parts[1]))
    if cmd == "graph-dfs":
        return "order:" + ",".join(graph_dfs(parts[1]))
    if cmd == "graph-topo":
        return "order:" + ",".join(graph_topo())
    if cmd == "graph-dijkstra":
        return "dist:" + graph_dijkstra(parts[1])
    if cmd == "graph-bellman-ford":
        return "dist:" + graph_bellman_ford(parts[1])
    if cmd == "graph-floyd":
        return graph_floyd()
    if cmd == "graph-kruskal":
        return graph_kruskal()
    if cmd == "graph-prim":
        return graph_prim(parts[1])
    if cmd == "graph-islands":
        return "count:%d" % graph_islands()

    if cmd == "at-prefix-sum":
        return at_prefix_sum(_ints(parts[1]))
    if cmd == "at-diff-array":
        return "arr:" + _arr(at_diff_array(int(parts[1]), parts[2]))
    if cmd == "at-jump-game":
        return "ok:%s" % ("true" if at_jump_game(_ints(parts[1])) else "false")
    if cmd == "at-intervals":
        removed, kept = at_intervals(parts[1])
        return "removed:%d|kept:%d" % (removed, kept)

    if cmd == "bit-single-number":
        return "ans:%d" % bit_single_number(_ints(parts[1]))
    if cmd == "bit-subset-mask":
        return "count:%d" % bit_subset_mask(_ints(parts[1]))

    if cmd == "str-kmp":
        return "idx:%d" % str_kmp(parts[1], parts[2])
    if cmd == "str-palindrome":
        return "ok:%s" % ("true" if str_palindrome(parts[1]) else "false")
    if cmd == "rec-hanoi":
        return "moves:%d" % rec_hanoi(int(parts[1]))

    if cmd == "hash-chaining":
        c, m, t = hash_chaining(_ints(parts[1]))
        return "collisions:%d|maxChain:%d|total:%d" % (c, m, t)
    if cmd == "hash-lru":
        return "order:" + ",".join(str(k) for k in hash_lru(parts[1]))

    if cmd == "adv-segment-tree":
        return "sum:%d" % adv_segment_tree(_ints(parts[1]), int(parts[2]), int(parts[3]))
    if cmd == "adv-fenwick":
        return "sum:%d" % adv_fenwick(_ints(parts[1]), int(parts[2]))

    if cmd == "lc-three-sum":
        return "count:%d" % lc_three_sum(_ints(parts[1]))
    if cmd == "lc-container":
        return "max:%d" % lc_container(_ints(parts[1]))
    if cmd == "lc-max-subarray":
        return "sum:%d" % lc_max_subarray(_ints(parts[1]))
    if cmd == "lc-unique-paths":
        return "paths:%d" % lc_unique_paths(int(parts[1]), int(parts[2]))

    if cmd == "lc-stock":
        return "profit:%d" % lc_stock(_ints(parts[1]))
    if cmd == "lc-max-product":
        return "product:%d" % lc_max_product(_ints(parts[1]))
    if cmd == "lc-move-zero":
        return "arr:" + _arr(lc_move_zero(_ints(parts[1])))
    if cmd == "lc-product-except-self":
        return "arr:" + _arr(lc_product_except_self(_ints(parts[1])))
    if cmd == "lc-rotate":
        return "arr:" + _arr(lc_rotate(_ints(parts[1]), int(parts[2])))
    if cmd == "lc-max-depth":
        return "depth:%d" % lc_max_depth(_levels(parts[1]))
    if cmd == "lc-symmetric":
        return "ok:%s" % ("true" if lc_symmetric(_levels(parts[1])) else "false")
    if cmd == "lc-diameter":
        return "diameter:%d" % lc_diameter(_levels(parts[1]))
    if cmd == "lc-coin-change":
        return "coins:%d" % lc_coin_change(_ints(parts[1]), int(parts[2]))

    if cmd == "lc-longest-consecutive":
        return "len:%d" % lc_longest_consecutive(_ints(parts[1]))
    if cmd == "lc-min-stack":
        return "out:" + _arr(lc_min_stack(parts[1]))
    if cmd == "lc-decode-string":
        return "out:" + lc_decode_string(parts[1])
    if cmd == "lc-lca":
        return "lca:%d" % lc_lca(_levels(parts[1]), int(parts[2]), int(parts[3]))
    if cmd == "lc-validate-bst":
        return "ok:%s" % ("true" if lc_validate_bst(_levels(parts[1])) else "false")
    if cmd == "lc-oranges":
        return "minutes:%d" % lc_oranges()
    if cmd == "lc-top-k-frequent":
        return "top:" + _arr(lc_top_k_frequent(_ints(parts[1]), int(parts[2])))

    if cmd == "lc-add-two":
        return "arr:" + _arr(lc_add_two(_ints(parts[1]), _ints(parts[2])))
    if cmd == "lc-intersection":
        shared = _ints(parts[3]) if len(parts) > 3 and parts[3] else []
        return "val:%d" % lc_intersection(_ints(parts[1]), _ints(parts[2]), shared)
    if cmd == "lc-palindrome-list":
        return "ok:%s" % ("true" if lc_palindrome_list(_ints(parts[1])) else "false")
    if cmd == "lc-largest-rect":
        return "area:%d" % lc_largest_rect(_ints(parts[1]))
    if cmd == "lc-group-anagrams":
        return "count:%d" % lc_group_anagrams(parts[1].split(","))
    if cmd == "lc-generate-parens":
        return "count:%d" % lc_generate_parens(int(parts[1]))
    if cmd == "lc-word-search":
        return "ok:%s" % ("true" if lc_word_search(parts[1]) else "false")
    if cmd == "lc-word-break":
        return "ok:%s" % ("true" if lc_word_break(parts[1], parts[2].split(",")) else "false")

    raise ValueError("还没实现：" + cmd)


def main():
    first = sys.stdin.readline()
    if not first:
        return
    n = int(first.strip())
    out = []
    for _ in range(n):
        out.append(_run(sys.stdin.readline().strip()))
    sys.stdout.write("\n".join(out) + "\n")


if __name__ == "__main__":
    main()
