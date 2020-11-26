package ds.tree;

/**
 * 将二叉树展开为链表
 * LeetCode 114 https://leetcode-cn.com/problems/flatten-binary-tree-to-linked-list/
 *
 * @author yangyi 2020年11月25日16:22:39
 */
public class FlattenLink {

    public static class TreeNode {
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

    /**
     * 1
     * / \
     * 2   5
     * / \   \
     * 3   4   6
     */
    public TreeNode createTree() {
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_5 = new TreeNode(5);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_6 = new TreeNode(6);
        node_1.left = node_2;
        node_1.right = node_5;
        node_2.left = node_3;
        node_2.right = node_4;
        node_5.right = node_6;
        return node_1;
    }

    public void flatten(TreeNode root) {
        if (root == null) {
            return;
        }
        flatten(root.left);
        flatten(root.right);

        //分别记录左右子树
        TreeNode left = root.left;
        TreeNode right = root.right;

        //左子树消除
        root.left = null;
        //左子树拼到右子树后
        root.right = left;

        //找到拼接后的新的右子树的末梢
        TreeNode p = root;
        while (p.right != null) {
            p = p.right;
        }

        //将记录的右子树拼到新生成的右子树的后面
        p.right = right;
    }

    private void inOrder(TreeNode root) {
        if (root == null) {
            return;
        }
        inOrder(root.left);
        System.out.print(root.val + " ");
        inOrder(root.right);
    }

    private void preOrder(TreeNode root) {
        if (root == null) {
            return;
        }
        System.out.print(root.val + " ");
        preOrder(root.right);
    }

    public static void main(String[] args) {
        FlattenLink flattenLink = new FlattenLink();
        TreeNode root = flattenLink.createTree();
        System.out.println("中序遍历创建完成的二叉树: ");
        flattenLink.inOrder(root);
        System.out.println();
        System.out.println("将此二叉树拉平成为一个链表: ");
        flattenLink.flatten(root);
        System.out.println("打印这条二叉树被拉平后生成的链表: ");
        flattenLink.preOrder(root);
    }
}
