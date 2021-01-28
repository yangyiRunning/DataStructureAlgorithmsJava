package ds.tree.leetcode559;

import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

/**
 * N叉树的最大深度
 * LeetCode 559 https://leetcode-cn.com/problems/maximum-depth-of-n-ary-tree/
 *
 * @author yangyi 2021年01月28日16:34:11
 */
public class Solution {

    class Node {
        public int val;
        public List<Node> children;

        public Node() {
        }

        public Node(int _val) {
            val = _val;
        }

        public Node(int _val, List<Node> _children) {
            val = _val;
            children = _children;
        }
    }

    /**
     * 递归方式解决
     */
    public int maxDepth(Node root) {
        if (root == null) {
            return 0;
        }
        int maxDepth = 0;
        for (Node child : root.children) {
            maxDepth = Math.max(maxDepth, maxDepth(child));
        }
        return maxDepth + 1;
    }

    /**
     * 层序遍历方式解决
     */
    public int maxDepthRecursive(Node root) {
        if (root == null) {
            return 0;
        }
        Queue<Node> queue = new LinkedList<>();
        queue.offer(root);
        int level = 0;
        while (!queue.isEmpty()) {
            int size = queue.size();
            level++;
            for (int i = 0; i < size; i++) {
                Node cur = queue.poll();
                if (cur != null) {
                    for (Node child : cur.children) {
                        if (child != null) {
                            queue.offer(child);
                        }
                    }
                }
            }
        }
        return level;
    }
}
