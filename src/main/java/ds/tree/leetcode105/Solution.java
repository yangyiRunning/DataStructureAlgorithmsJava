package ds.tree.leetcode105;

/**
 * 从前序与中序遍历序列构造二叉树
 * Leetcode 105 https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
 *
 * @author yangyi 2020年11月29日14:41:50
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

    /**
     * 前序遍历 preorder = [3,9,20,15,7]
     * 中序遍历 inorder = [9,3,15,20,7]
     */
    private TreeNode buildTree(int[] preorder, int[] inorder) {
        return build(preorder, 0, preorder.length - 1, inorder, 0, inorder.length - 1);
    }

    private TreeNode build(int[] preorder, int preStart, int preEnd,
                           int[] inorder, int inStart, int inEnd) {
        if (preStart > preEnd) {
            return null;
        }
        int rootVal = preorder[preStart];
        int index = -1;
        for (int i = inStart; i <= inEnd; i++) {
            if (inorder[i] == rootVal) {
                index = i;
                break;
            }
        }
        int left = index - inStart;
        TreeNode root = new TreeNode(rootVal);
        root.left = build(preorder, preStart + 1, preStart + left,
                inorder, inStart, index - 1);
        root.right = build(preorder, preStart + left + 1, preEnd,
                inorder, index + 1, inEnd);
        return root;
    }

    private void preOrder(TreeNode root) {
        if (root == null) {
            return;
        }
        System.out.print(root.val + " ");
        preOrder(root.left);
        preOrder(root.right);
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
        int[] preOrderNums = {3, 9, 20, 15, 7};
        int[] inOrderNums = {9, 3, 15, 20, 7};
        System.out.println("通过前序遍历结果和中序遍历结果构造二叉树: ");
        Solution preInOrderBuildTree = new Solution();
        TreeNode root = preInOrderBuildTree.buildTree(preOrderNums, inOrderNums);
        System.out.println("构建完成之后验证结果: ");
        System.out.println("输出前序遍历的结果: ");
        preInOrderBuildTree.preOrder(root);
        System.out.println();
        System.out.println("输出中序遍历的结果: ");
        preInOrderBuildTree.inOrder(root);
    }

}
