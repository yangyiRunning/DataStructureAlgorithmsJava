package ds.bst;

/**
 * 二叉搜索树中的搜索
 * LeetCode 700 https://leetcode-cn.com/problems/search-in-a-binary-search-tree/
 *
 * @author yangyi 2020年12月03日00:50:09
 */
public class BstSearch {

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode(int x) {
            val = x;
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

    public TreeNode searchBST(TreeNode root, int val) {
        if (root == null) {
            return null;
        }
        if (val > root.val) {
            return searchBST(root.right, val);
        } else if (val < root.val) {
            return searchBST(root.left, val);
        } else {
            return root;
        }
    }

    public static void main(String[] args) {
        BstSearch bstSearch = new BstSearch();
        System.out.println("创建一颗BST: ");
        TreeNode root = bstSearch.createTree();
        System.out.println("中序遍历构建好的BST: ");
        bstSearch.inOrder(root);
        System.out.println();
        System.out.println("查找对应以2为根的子树---");
        TreeNode result = bstSearch.searchBST(root, 2);
        System.out.println("中序遍历查找返回的结果: ");
        bstSearch.inOrder(result);
    }
}
