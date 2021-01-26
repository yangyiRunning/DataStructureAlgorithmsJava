package ds.bfs.leetcode429;

import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

/**
 * N叉树的层序遍历
 * LeetCode 429 https://leetcode-cn.com/problems/n-ary-tree-level-order-traversal/
 *
 * @author yangyi 2021年01月27日00:34:06
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

    public List<List<Integer>> levelOrder(Node root) {
        if (root == null) {
            return new LinkedList<>();
        }
        List<List<Integer>> result = new LinkedList<>();
        Queue<Node> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new LinkedList<>();
            for (int i = 0; i < size; i++) {
                Node node = queue.poll();
                level.add(node.val);
                for (Node child : node.children) {
                    if (child.children != null) {
                        queue.offer(child);
                    }
                }
            }
            result.add(level);
        }
        return result;
    }

}
