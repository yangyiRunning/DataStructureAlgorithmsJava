package ds.tree.leetcode654;

/**
 * 最大二叉树
 * LeetCode 654 https://leetcode-cn.com/problems/maximum-binary-tree/
 *
 * @author yangyi 2020年11月25日22:39:39
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

    private TreeNode constructMaximumBinaryTree(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }

    private TreeNode build(int[] nums, int start, int end) {
        if (start > end) {
            return null;
        }
        int index = -1;
        int maxValue = Integer.MIN_VALUE;
        for (int i = start; i <= end; i++) {
            if (nums[i] > maxValue) {
                maxValue = nums[i];
                index = i;
            }
        }
        TreeNode root = new TreeNode(maxValue);
        root.left = build(nums, start, index - 1);
        root.right = build(nums, index + 1, end);
        return root;
    }

    private void inOrder(TreeNode root) {
        if (root == null) {
            return;
        }
        inOrder(root.left);
        System.out.print(root.val + " ");
        inOrder(root.right);
    }

    public static void main(String[] args) {
        //[3,2,1,6,0,5]
        int[] nums = {3, 2, 1, 6, 0, 5};
        //        6
        //      /   \
        //      3     5
        //      \    /
        //      2  0
        //      \
        //      1
        Solution maxTree = new Solution();
        TreeNode root = maxTree.constructMaximumBinaryTree(nums);
        System.out.println("中序遍历构造完的二叉树: ");
        maxTree.inOrder(root);
    }
}
