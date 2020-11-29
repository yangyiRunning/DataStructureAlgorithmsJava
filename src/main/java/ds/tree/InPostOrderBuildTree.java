package ds.tree;

/**
 * 从中序与后序遍历序列构造二叉树
 * LeetCode 106 https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/
 *
 * @author yangyi 2020年11月29日15:19:51
 */
public class InPostOrderBuildTree {

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode(int x) {
            val = x;
        }
    }

    /**
     * 中序遍历 inorder = [9,3,15,20,7]
     * 后序遍历 postorder = [9,15,7,20,3]
     */
    public TreeNode buildTree(int[] inorder, int[] postorder) {
        return build(inorder, 0, inorder.length - 1,
                postorder, 0, postorder.length - 1);
    }

    private TreeNode build(int[] inorder, int instart, int inEnd,
                           int[] postorder, int postStart, int postEnd) {
        if (instart > inEnd) {
            return null;
        }
        int rootVal = postorder[postEnd];
        int index =-1;
        for (int i = instart; i <= inEnd; i++) {
            if (inorder[i] == rootVal) {
                index = i;
                break;
            }
        }
        int left = index - instart;
        TreeNode root = new TreeNode(rootVal);
        root.left = build(inorder, instart, index - 1,
                postorder, postStart, postStart + left - 1);
        root.right = build(inorder, index + 1, inEnd,
                postorder, postStart + left, postEnd - 1);
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

    private void postOrder(TreeNode root) {
        if (root == null) {
            return;
        }
        postOrder(root.left);
        postOrder(root.right);
        System.out.print(root.val + " ");
    }

    public static void main(String[] args) {
        InPostOrderBuildTree inPostOrderBuildTree = new InPostOrderBuildTree();
        int[] inOrderNums = {9, 3, 15, 20, 7};
        int[] postOrderNums = {9, 15, 7, 20, 3};
        System.out.println("从中序与后序遍历序列构造二叉树");
        TreeNode root = inPostOrderBuildTree.buildTree(inOrderNums, postOrderNums);
        System.out.println("中序遍历验证构建的二叉树: ");
        inPostOrderBuildTree.inOrder(root);
        System.out.println();
        System.out.println("后序遍历验证构建的二叉树: ");
        inPostOrderBuildTree.postOrder(root);
    }



}
