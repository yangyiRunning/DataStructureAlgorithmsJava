package ds.bst;

/**
 * 把二叉搜索树转换为累加树
 * LeetCode 1038 https://leetcode-cn.com/problems/binary-search-tree-to-greater-sum-tree/
 * LeetCode 538 https://leetcode-cn.com/problems/convert-bst-to-greater-tree/
 *
 * @author yangyi 2020年12月02日09:08:55
 */
public class BstToGst {

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

    private TreeNode createTree() {
        TreeNode node_0 = new TreeNode(0);
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_5 = new TreeNode(5);
        TreeNode node_6 = new TreeNode(6);
        TreeNode node_7 = new TreeNode(7);
        TreeNode node_8 = new TreeNode(8);
        node_4.left = node_1;
        node_4.right = node_6;
        node_1.left = node_0;
        node_1.right = node_2;
        node_2.right = node_3;
        node_6.left = node_5;
        node_6.right = node_7;
        node_7.right = node_8;
        return node_4;
    }

    public TreeNode bstToGst(TreeNode root) {
        bstToGstHelper(root);
        return root;
    }

    private int sums;

    private void bstToGstHelper(TreeNode root) {
        if (root == null) {
            return;
        }
        bstToGstHelper(root.right);
        sums += root.val;
        root.val = sums;
        bstToGstHelper(root.left);
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
        BstToGst bstToGst = new BstToGst();
        TreeNode root = bstToGst.createTree();
        System.out.println("中序遍历构造出来的二叉树: ");
        bstToGst.inOrder(root);
        System.out.println();
        System.out.println("生成累加树---");
        bstToGst.bstToGst(root);
        System.out.println("中序遍历生成的累加树: ");
        bstToGst.inOrder(root);
    }

}
