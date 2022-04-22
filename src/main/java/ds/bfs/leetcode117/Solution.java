package ds.bfs.leetcode117;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
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

    private Node createTree() {
        Node node_1 = new Node(1);
        Node node_2 = new Node(2);
        Node node_3 = new Node(3);
        Node node_4 = new Node(4);
        Node node_5 = new Node(5);
        Node node_7 = new Node(7);
        node_1.left = node_2;
        node_1.right = node_3;
        node_2.left = node_4;
        node_2.right = node_5;
        node_3.right = node_7;
        return node_1;
    }

    private List<Integer> levelOrder(Node root) {
        if (root == null) {
            return new LinkedList<>();
        }
        List<Integer> result = new LinkedList<>();
        Queue<Node> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                Node cur = queue.poll();
                if (cur != null) {
                    result.add(cur.val);
                }
                if (cur.left != null) {
                    queue.offer(cur.left);
                }
                if (cur.right != null) {
                    queue.offer(cur.right);
                }
            }
        }
        return result;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        Node root = solution.createTree();
        Node result = solution.connect(root);
        System.out.println(Arrays.toString(solution.levelOrder(result).stream().mapToInt(value -> value).toArray()));
    }
}
