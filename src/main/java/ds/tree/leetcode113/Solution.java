package ds.tree.leetcode113;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 * 路径总和II
 * LeetCode 113 https://leetcode-cn.com/problems/path-sum-ii/
 *
 * @author yangyi 2021年02月05日16:39:12
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

    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        if (root == null) {
            return new LinkedList<>();
        }
        List<List<Integer>> result = new LinkedList<>();
        LinkedList<Integer> path = new LinkedList<>();
        path.add(root.val);
        backtrack(root, targetSum - root.val, result, path);
        return result;
    }

    private void backtrack(
            TreeNode cur,
            int targetSum,
            List<List<Integer>> result,
            LinkedList<Integer> path) {
        if (cur != null && cur.left == null && cur.right == null && targetSum == 0) {
            result.add(new LinkedList<>(path));
            return;
        }
        if (cur != null && cur.left == null && cur.right == null) {
            return;
        }
        if (cur.left != null) {
            path.add(cur.left.val);
            targetSum -= cur.left.val;
            backtrack(cur.left, targetSum, result, path);
            targetSum += cur.left.val;
            path.removeLast();
        }
        if (cur.right != null) {
            path.add(cur.right.val);
            targetSum -= cur.right.val;
            backtrack(cur.right, targetSum, result, path);
            targetSum += cur.right.val;
            path.removeLast();
        }
    }

    private TreeNode createTree() {
        TreeNode node_5 = new TreeNode(5);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_8 = new TreeNode(8);
        TreeNode node_11 = new TreeNode(11);
        TreeNode node_13 = new TreeNode(13);
        TreeNode node_4_4 = new TreeNode(4);
        TreeNode node_7 = new TreeNode(7);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_5_5 = new TreeNode(5);
        TreeNode node_1 = new TreeNode(1);
        node_5.left = node_4;
        node_5.right = node_8;
        node_4.left = node_11;
        node_8.left = node_13;
        node_8.right = node_4_4;
        node_11.left = node_7;
        node_11.right = node_2;
        node_4_4.left = node_5_5;
        node_4_4.right = node_1;
        return node_5;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new Solution().pathSum(new Solution().createTree(), 22).toArray()));
    }
}
