package ds.bst;

/**
 * 二叉搜索树中第K小的元素
 * LeetCode 230 https://leetcode-cn.com/problems/kth-smallest-element-in-a-bst/
 *
 * @author yangyi 2019年02月10日10:34:52
 */
public class KthSmallestInBST {

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

    /**
     * 3
     * / \
     * 1   4
     * \
     * 2
     */
    private TreeNode createTreeNode() {
        TreeNode tree_3 = new TreeNode(3);
        TreeNode tree_1 = new TreeNode(1);
        TreeNode tree_4 = new TreeNode(4);
        TreeNode tree_2 = new TreeNode(2);
        tree_3.left = tree_1;
        tree_3.right = tree_4;
        tree_1.right = tree_2;
        return tree_3;
    }

    private int index;
    private int result;

    public int kthSmallest(TreeNode root, int k) {
        search(root, k);
        return result;
    }

    private void search(TreeNode root, int k) {
        if (root == null) {
            return;
        }
        search(root.left, k);
        index++;
        if (index == k) {
            result = root.val;
            return;
        }
        search(root.right, k);
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
        KthSmallestInBST kthSmallestInBST = new KthSmallestInBST();
        TreeNode root = kthSmallestInBST.createTreeNode();
        System.out.println("中序遍历构造出来的第一棵树: ");
        kthSmallestInBST.inOrder(root);
        System.out.println();
        System.out.println("搜索此树的第1个最小的元素: ");
        System.out.println(kthSmallestInBST.kthSmallest(root, 1));
    }
}
