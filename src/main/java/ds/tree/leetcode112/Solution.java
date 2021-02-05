package ds.tree.leetcode112;


/**
 * 路径总和
 * LeetCode 112 https://leetcode-cn.com/problems/path-sum/
 *
 * @author yangyi 2021年02月04日18:28:38
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

    public boolean hasPathSum(TreeNode root, int targetSum) {
        if (root == null) {
            return false;
        }
        return backtrack(root, targetSum - root.val);
    }

    private boolean backtrack(TreeNode cur, int targetSum) {
        if (cur != null && cur.left == null && cur.right == null && targetSum == 0) {
            return true;
        }
        if (cur != null && cur.left == null && cur.right == null) {
            return false;
        }
        if (cur.left != null) {
            targetSum -= cur.left.val;
            if (backtrack(cur.left, targetSum)) {
                return true;
            }
            targetSum += cur.left.val;
        }
        if (cur.right != null) {
            targetSum -= cur.right.val;
            if (backtrack(cur.right, targetSum)) {
                return true;
            }
            targetSum += cur.right.val;
        }
        return false;
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
        TreeNode node_1 = new TreeNode(1);
        node_5.left = node_4;
        node_5.right = node_8;
        node_4.left = node_11;
        node_11.left = node_7;
        node_11.right = node_2;
        node_8.left = node_13;
        node_8.right = node_4_4;
        node_4_4.right = node_1;
        return node_5;
    }

    private TreeNode createTree2() {
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_3 = new TreeNode(3);
        node_1.left = node_2;
        node_1.right = node_3;
        return node_1;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().hasPathSum(new Solution().createTree(), 22));
        System.out.println(new Solution().hasPathSum(new Solution().createTree2(), 5));
    }
}
