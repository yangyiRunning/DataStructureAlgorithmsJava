package ds.tree;

/**
 * 完全二叉树的节点个数
 * LeetCode 222 https://leetcode-cn.com/problems/count-complete-tree-nodes/
 *
 * @author yangyi 2020年12月08日14:08:31
 */
public class CompleteBinaryTreeNodeCount {

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode(int x) {
            val = x;
        }
    }

    public int countNodes(TreeNode root) {
        int hl = 0, hr = 0;
        if (root == null) {
            return 0;
        }
        TreeNode left = root;
        TreeNode right = root;
        while (left != null) {
            left = left.left;
            hl++;
        }
        while (right != null) {
            right = right.right;
            hr++;
        }
        if (hl == hr) {
            return (int) (Math.pow(2, hl) - 1);
        }
        return 1 + countNodes(root.left) + countNodes(root.right);
    }

    /**
     * 1
     * / \
     * 2   3
     * / \  /
     * 4  5 6
     */
    private TreeNode createTree() {
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_5 = new TreeNode(5);
        TreeNode node_6 = new TreeNode(6);
        node_1.left = node_2;
        node_1.right = node_3;
        node_2.left = node_4;
        node_2.right = node_5;
        node_3.left = node_6;
        return node_1;
    }

    public static void main(String[] args) {
        System.out.println("创建一棵树");
        CompleteBinaryTreeNodeCount completeBinaryTreeNodeCount = new CompleteBinaryTreeNodeCount();
        TreeNode root = completeBinaryTreeNodeCount.createTree();
        int count = completeBinaryTreeNodeCount.countNodes(root);
        System.out.println("这棵树的总结点个数为: " + count);
    }
}
