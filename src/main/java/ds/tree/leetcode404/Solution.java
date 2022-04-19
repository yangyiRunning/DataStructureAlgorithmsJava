package ds.tree.leetcode404;

/**
 * 左叶子之和
 * LeetCode 404 https://leetcode-cn.com/problems/sum-of-left-leaves/
 * https://tva1.sinaimg.cn/large/e6c9d24ely1h19ol4nngyj20hy0jbgm5.jpg
 *
 * @author yangyi 2021年02月04日17:33:34
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

    public int sumOfLeftLeaves(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int leftSum = sumOfLeftLeaves(root.left);
        int rightSum = sumOfLeftLeaves(root.right);
        int middleSum = 0;
        if (root.left != null && root.left.left == null && root.left.right == null) {
            middleSum = root.left.val;
        }
        return middleSum + leftSum + rightSum;
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
        System.out.println(new Solution().sumOfLeftLeaves(new Solution().createTree()));
    }
}
