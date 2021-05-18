package ds.bfs.leetcode117;

import java.util.LinkedList;
import java.util.Queue;

/**
 * 填充每个节点的下一个右侧节点指针II
 * LeetCode 117 https://leetcode-cn.com/problems/populating-next-right-pointers-in-each-node-ii/
 *
 * @author yangyi 2021年05月03日11:41:19
 */
public class Solution {

    class Node {
        public int val;
        public Node left;
        public Node right;
        public Node next;

        public Node() {
        }

        public Node(int _val) {
            val = _val;
        }

        public Node(int _val, Node _left, Node _right, Node _next) {
            val = _val;
            left = _left;
            right = _right;
            next = _next;
        }
    }

    public Node connect(Node root) {
        if (root == null) {
            return null;
        }
        Queue<Node> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            Node last = null;
            for (int i = 0; i < size; i++) {
                Node cur = queue.poll();
                if (cur.left != null) {
                    queue.offer(cur.left);
                }
                if (cur.right != null) {
                    queue.offer(cur.right);
                }
                if (i != 0) {
                    last.next = cur;
                }
                last = cur;
            }
        }
        return root;
    }
}
