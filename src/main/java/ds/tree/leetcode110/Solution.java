package ds.tree.leetcode110;

/**
 * 验证一颗二叉树是否为平衡二叉树
 * 平衡二叉树
 * LeetCode 剑指Offer 55 https://leetcode-cn.com/problems/ping-heng-er-cha-shu-lcof/
 * LeetCode 110 https://leetcode-cn.com/problems/balanced-binary-tree/
 *
 * @author yangyi 2020年12月07日17:18:12
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

    public boolean isBalanced(TreeNode root) {
        if(root == null){
            return true;
        }
        if (root.left == null && root.right == null) {
            return true;
        }
        int leftDepth = depth(root.left);
        int rightDepth = depth(root.right);
        if (Math.abs(leftDepth - rightDepth) <= 1) {
            return isBalanced(root.left) && isBalanced(root.right);
        } else {
            return false;
        }
    }

    private int depth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        return Math.max(depth(root.left), depth(root.right)) + 1;
    }

    /**
     * 3
     * / \
     * 9  20
     * /  \
     * 15   7
     */
    private TreeNode create() {
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

    /**
     * 1
     * / \
     * 2   2
     * / \
     * 3   3
     * / \
     * 4   4
     */
    private TreeNode create2() {
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2l = new TreeNode(2);
        TreeNode node_2r = new TreeNode(2);
        TreeNode node_3l = new TreeNode(3);
        TreeNode node_3r = new TreeNode(3);
        TreeNode node_4l = new TreeNode(4);
        TreeNode node_4r = new TreeNode(4);
        node_1.left = node_2l;
        node_1.right = node_2r;
        node_2l.left = node_3l;
        node_2l.right = node_3r;
        node_3l.left = node_4l;
        node_3l.right = node_4r;
        return node_1;
    }

    public static void main(String[] args) {
        Solution isBalancedTree = new Solution();
        TreeNode root = isBalancedTree.create();
        TreeNode root2 = isBalancedTree.create2();
        System.out.println("第1颗树是否为平衡二叉树: " + isBalancedTree.isBalanced(root));
        System.out.println("第2颗树是否为平衡二叉树: " + isBalancedTree.isBalanced(root2));
    }
}
