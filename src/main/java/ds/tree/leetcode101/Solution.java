package ds.tree.leetcode101;

/**
 * 对称二叉树
 * LeetCode 101 https://leetcode-cn.com/problems/symmetric-tree/
 *
 * @author yangyi 2021年01月27日18:44:17
 */
public class Solution {

    public static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode(int x) {
            val = x;
        }
    }

    public boolean isSymmetric(TreeNode root) {
        return compare(root, root);
    }

    private boolean compare(TreeNode left, TreeNode right) {
        if (left == null && right == null) {
            return true;
        } else if (left != null && right == null) {
            return false;
        } else if (left == null && right != null) {
            return false;
        } else if (left.val != right.val) {
            return false;
        }
        boolean compareLeft = compare(left.left, right.right);
        boolean compareRight = compare(left.right, right.left);
        return compareLeft && compareRight;
    }

    public static void main(String[] args) {
        TreeNode val_1 = new TreeNode(1);
        TreeNode val_2 = new TreeNode(2);
        TreeNode val_3 = new TreeNode(3);
        val_1.left = val_2;
        val_1.right = val_3;

        TreeNode val__1 = new TreeNode(1);
        TreeNode val__2 = new TreeNode(2);
        val__1.left = val__2;
        val__1.right = val__2;

        Solution symmetricTree = new Solution();
        System.out.println(symmetricTree.isSymmetric(val_1));
        System.out.println(symmetricTree.isSymmetric(val__1));
    }
}
