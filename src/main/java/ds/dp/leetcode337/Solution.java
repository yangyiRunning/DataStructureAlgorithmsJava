package ds.dp.leetcode337;

/**
 * 打家劫舍 III
 * LeetCode 337 https://leetcode-cn.com/problems/house-robber-iii/
 *
 * @author yangyi 2021年03月10日15:48:45
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

    public int rob(TreeNode root) {
        int[] dp = robTree(root);
        return Math.max(dp[0], dp[1]);
    }

    /**
     * dp数组中
     * 0表示不打算偷的当前节点，dp[0]代表不打算偷当前节点时的最大值
     * 1表示打算偷的当前按节点，dp[1]代表打算偷当前节点时的最大值
     */
    private int[] robTree(TreeNode root) {
        if (root == null) {
            return new int[]{0, 0};
        }
        int[] left = robTree(root.left);
        int[] right = robTree(root.right);
        //准备偷当前的节点，
        int take = root.val + left[0] + right[0];
        //不准备偷当前的节点
        int noTake = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
        return new int[]{noTake, take};
    }

    private TreeNode createTree() {
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_33 = new TreeNode(3);
        TreeNode node_333 = new TreeNode(3);
        TreeNode node_1 = new TreeNode(1);
        node_3.left = node_2;
        node_3.right = node_33;
        node_2.right = node_333;
        node_33.right = node_1;
        return node_3;
    }

    private TreeNode createTree2() {
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_5 = new TreeNode(5);
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_33 = new TreeNode(3);
        TreeNode node_11 = new TreeNode(1);
        node_3.left = node_4;
        node_3.right = node_5;
        node_4.left = node_1;
        node_4.right = node_33;
        node_5.right = node_11;
        return node_3;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().rob(new Solution().createTree()));
        System.out.println(new Solution().rob(new Solution().createTree2()));
    }
}
