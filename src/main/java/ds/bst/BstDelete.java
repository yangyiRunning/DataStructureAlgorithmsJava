package ds.bst;

/**
 * 删除二叉搜索树中的节点
 * LeetCode 450 https://leetcode-cn.com/problems/delete-node-in-a-bst/
 *
 * @author yangyi 2020年12月05日16:11:25
 */
public class BstDelete {

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
     * 5
     * / \
     * 3   6
     * / \   \
     * 2   4   7
     */
    private TreeNode createTree() {
        TreeNode node_5 = new TreeNode(5);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_6 = new TreeNode(6);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_7 = new TreeNode(7);
        node_5.left = node_3;
        node_5.right = node_6;
        node_3.left = node_2;
        node_3.right = node_4;
        node_6.right = node_7;
        return node_5;
    }

    private void inOrder(TreeNode root) {
        if (root == null) {
            return;
        }
        inOrder(root.left);
        System.out.print(root.val + " ");
        inOrder(root.right);
    }

    public TreeNode deleteNode(TreeNode root, int key) {
        if (root == null) {
            return null;
        }
        if (root.val == key) {
            if (root.left == null) {
                return root.right;
            }
            if (root.right == null) {
                return root.left;
            }
            //右子树中找到最小值并上来
            TreeNode min = getMin(root.right);
            root.val = min.val;
            //删除右子树中找出来的最小值
            root.right = deleteNode(root.right, min.val);
        } else if (key < root.val) {
            root.left = deleteNode(root.left, key);
        } else {
            root.right = deleteNode(root.right, key);
        }
        return root;
    }

    private TreeNode getMin(TreeNode root) {
        if (root == null) {
            return null;
        }
        while (root.left != null) {
            root = root.left;
        }
        return root;
    }

    public static void main(String[] args) {
        BstDelete bstDelete = new BstDelete();
        System.out.println("构建一棵树");
        TreeNode root = bstDelete.createTree();
        System.out.println("中序遍历构建好的树: ");
        bstDelete.inOrder(root);
        System.out.println();
        System.out.println("删除树中值为3的节点: ");
        TreeNode result = bstDelete.deleteNode(root, 3);
        System.out.println("中序遍历删除对应的3节点之后剩余的树: ");
        bstDelete.inOrder(result);
    }
}
