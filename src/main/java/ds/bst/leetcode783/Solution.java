package ds.bst.leetcode783;

import java.util.LinkedList;

/**
 * 二叉搜索树节点最小距离
 * LeetCode 783 https://leetcode-cn.com/problems/minimum-distance-between-bst-nodes/
 *
 * @author yangyi 2022年04月19日16:20:47
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

    public LinkedList<Integer> result = new LinkedList<>();

    private void inOrder(TreeNode root) {
        if (root == null) {
            return;
        }
        inOrder(root.left);
        result.add(root.val);
        inOrder(root.right);
    }

    public int minDiffInBST(TreeNode root) {
        inOrder(root);
        if (result.size() <= 1) {
            return 0;
        }
        int min = Integer.MAX_VALUE;
        for (int i = 1; i < result.size(); i++) {
            min = Math.min(min, Math.abs(result.get(i) - result.get(i - 1)));
        }
        return min;
    }

    private TreeNode createTree(){
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_6 = new TreeNode(6);
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_3 = new TreeNode(3);
        node_4.left = node_2;
        node_4.right = node_6;
        node_2.left = node_1;
        node_2.right = node_3;
        return node_4;
    }

    private TreeNode createTree2(){
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_0 = new TreeNode(0);
        TreeNode node_48 = new TreeNode(48);
        TreeNode node_12 = new TreeNode(12);
        TreeNode node_49 = new TreeNode(49);
        node_1.left = node_0;
        node_1.right = node_48;
        node_48.left = node_12;
        node_48.right = node_49;
        return node_1;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        TreeNode tree = solution.createTree();
        TreeNode tree2 = solution.createTree2();
        System.out.println(solution.minDiffInBST(tree));
        System.out.println(solution.minDiffInBST(tree2));
    }

}
