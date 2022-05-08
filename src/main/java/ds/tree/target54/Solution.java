package ds.tree.target54;

/**
 * 二叉搜索树的第k大节点
 * 剑指 Offer 54 https://leetcode-cn.com/problems/er-cha-sou-suo-shu-de-di-kda-jie-dian-lcof/
 *
 * @author yangyi 2022年04月22日17:44:46
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

    private int k, result;

    public int kthLargest(TreeNode root, int k) {
        this.k = k;
        kthLargestHelper(root);
        return result;
    }

    public void kthLargestHelper(TreeNode root) {
        if (root == null) {
            return;
        }
        kthLargestHelper(root.right);
        k--;
        if (k == 0) {
            result = root.val;
            return;
        }
        kthLargestHelper(root.left);
    }

    private TreeNode createTree() {
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_2 = new TreeNode(2);
        node_3.left = node_1;
        node_3.right = node_4;
        node_1.right = node_2;
        return node_3;
    }

    private TreeNode createTree2() {
        TreeNode node_5 = new TreeNode(5);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_6 = new TreeNode(6);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_1 = new TreeNode(1);
        node_5.left = node_3;
        node_5.right = node_6;
        node_3.left = node_2;
        node_3.right = node_4;
        node_2.left = node_1;
        return node_5;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().kthLargest(new Solution().createTree(), 1));
        System.out.println(new Solution().kthLargest(new Solution().createTree2(), 3));
    }
}
