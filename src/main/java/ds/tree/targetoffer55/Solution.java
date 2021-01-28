package ds.tree.targetoffer55;

/**
 * 二叉树的深度
 * LeetCode 剑指 offer 55 https://leetcode-cn.com/problems/er-cha-shu-de-shen-du-lcof/
 *
 * @author yangyi 2020年12月07日18:42:35
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

    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
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

    public static void main(String[] args) {
        Solution depthTree = new Solution();
        TreeNode root = depthTree.create();
        int maxDepth = depthTree.maxDepth(root);
        System.out.println("构建出的这颗二叉树的深度为: " + maxDepth);
    }
}
