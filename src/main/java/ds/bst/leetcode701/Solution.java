package ds.bst.leetcode701;

/**
 * 二叉搜索树中的插入操作
 * LeetCode 701 https://leetcode-cn.com/problems/insert-into-a-binary-search-tree/
 *
 * @author yangyi 2020年12月03日10:47:33
 */
public class Solution {

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
     * 4
     * / \
     * 2   7
     * / \
     * 1   3
     */
    private TreeNode createTree() {
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_7 = new TreeNode(7);
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_3 = new TreeNode(3);
        node_4.left = node_2;
        node_4.right = node_7;
        node_2.left = node_1;
        node_2.right = node_3;
        return node_4;
    }

    private void inOrder(TreeNode root) {
        if (root == null) {
            return;
        }
        inOrder(root.left);
        System.out.print(root.val + " ");
        inOrder(root.right);
    }

    public TreeNode insertIntoBST(TreeNode root, int val) {
        if (root == null) {
            return new TreeNode(val);
        }
        if (val < root.val) {
            root.left = insertIntoBST(root.left, val);
        } else if (val > root.val) {
            root.right = insertIntoBST(root.right, val);
        }
        return root;
    }

    public static void main(String[] args) {
        Solution bstInsert = new Solution();
        System.out.println("创建一颗BST---");
        TreeNode root = bstInsert.createTree();
        System.out.println("中序遍历创建好的BST");
        bstInsert.inOrder(root);
        System.out.println();
        System.out.println("往BST插入一颗节点---");
        TreeNode result = bstInsert.insertIntoBST(root, 5);
        System.out.println("中序遍历插入后的树: ");
        bstInsert.inOrder(result);
    }
}
