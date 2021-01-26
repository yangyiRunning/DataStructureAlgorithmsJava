package ds.bfs.leetcode107;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

/**
 * 二叉树的层序遍历 II
 * LeetCode 107 https://leetcode-cn.com/problems/binary-tree-level-order-traversal-ii/
 *
 * @author yangyi 2021年01月26日20:25:22
 */
public class Solution {

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode(int x) {
            val = x;
        }
    }

    public List<List<Integer>> levelOrderBottom(TreeNode root) {
        if (root == null) {
            return new LinkedList<>();
        }
        List<List<Integer>> result = new LinkedList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new LinkedList<>();
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
        return reserveArray(0, result.size() - 1, result);
    }

    private List<List<Integer>> reserveArray(int start, int end, List<List<Integer>> target) {
        while (start < end) {
            List<Integer> temp = target.get(start);
            target.set(start, target.get(end));
            target.set(end, temp);
            start++;
            end--;
        }
        return target;
    }

    private TreeNode createTree() {
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_9 = new TreeNode(9);
        TreeNode node_20 = new TreeNode(20);
        TreeNode node_15 = new TreeNode(15);
        TreeNode node_7 = new TreeNode(7);
        node_3.left = node_9;
        node_3.right = node_20;
        node_20.left = node_15;
        node_20.right = node_7;
        return node_3;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        System.out.println(Arrays.toString(solution.levelOrderBottom(solution.createTree()).toArray()));
    }
}
