package ds.tree.leetcode236;

/**
 * 二叉树的最近公共祖先
 * LeetCode 236 https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree/
 * 剑指 Offer 68 - II https://leetcode-cn.com/problems/er-cha-shu-de-zui-jin-gong-gong-zu-xian-lcof/
 *
 * @author yangyi 2021年02月17日23:43:14
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

    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) {
            return root;
        }
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) {
            return root;
        } else if (left == null && right != null) {
            return right;
        } else if (left != null && right == null) {
            return left;
        } else if (left == null && right == null) {
            return null;
        }
        return null;
    }

    private TreeNode createTree() {
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_5 = new TreeNode(5);
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_6 = new TreeNode(6);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_0 = new TreeNode(0);
        TreeNode node_8 = new TreeNode(8);
        TreeNode node_7 = new TreeNode(7);
        TreeNode node_4 = new TreeNode(4);
        node_3.left = node_5;
        node_3.right = node_1;
        node_5.left = node_6;
        node_5.right = node_2;
        node_2.left = node_7;
        node_2.right = node_4;
        node_1.left = node_0;
        node_1.right = node_8;
        return node_3;
    }

    private TreeNode p() {
        return new TreeNode(5);
    }

    private TreeNode q() {
        return new TreeNode(1);
    }

    public static void main(String[] args) {
        System.out.println(new Solution().lowestCommonAncestor(new Solution().createTree(), new Solution().p(), new Solution().q()).val);
    }

}
