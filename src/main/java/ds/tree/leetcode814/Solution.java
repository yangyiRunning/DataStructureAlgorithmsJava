package ds.tree.leetcode814;

import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

/**
 * 二叉树剪枝
 * LeetCode 814 https://leetcode-cn.com/problems/binary-tree-pruning/
 *
 * @author yangyi 2021年05月03日12:01:15
 */
public class Solution {

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode() {
        }

        TreeNode(int val) {
            this.val = val;
        }

        TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val;
            this.left = left;
            this.right = right;
        }
    }

    public TreeNode pruneTree(TreeNode root) {
        return containsOne(root) ? root : null;
    }

    private boolean containsOne(TreeNode node) {
        if (node == null) {
            return false;
        }
        boolean hasOneLeft = containsOne(node.left);
        boolean hasOneRight = containsOne(node.right);
        if (!hasOneLeft) {
            node.left = null;
        }
        if (!hasOneRight) {
            node.right = null;
        }
        return hasOneLeft || hasOneRight || node.val == 1;
    }

    private TreeNode createTree() {
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_11 = new TreeNode(1);
        TreeNode node_0 = new TreeNode(0);
        TreeNode node_00 = new TreeNode(0);
        node_1.right = node_0;
        node_0.right = node_11;
        node_0.left = node_00;
        return node_1;
    }

    private List<List<Integer>> levelPrintTree(TreeNode root) {
        if (root == null) {
            return new LinkedList<>();
        }
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        List<List<Integer>> result = new LinkedList<>();
        while (!queue.isEmpty()) {
            List<Integer> level = new LinkedList<>();
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode cur = queue.poll();
                if (cur != null) {
                    level.add(cur.val);
                }
                if (cur.left != null) {
                    queue.offer(cur.left);
                }
                if (cur.right != null) {
                    queue.offer(cur.right);
                }
            }
            result.add(level);
        }
        return result;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        TreeNode root = solution.pruneTree(solution.createTree());
        List<List<Integer>> result = solution.levelPrintTree(root);
        for (List<Integer> integers : result) {
            for (Integer integer : integers) {
                System.out.println(integer);
            }
        }
    }
}
