package ds.tree;

/**
 * 二叉树的节点个数
 *
 * @author yangyi 2020年11月25日10:28:19
 */
public class TreeNodeCount {

    /**
     * 4
     * /   \
     * 2     7
     * / \   / \
     * 1   3 6   9
     */
    private SameTree.TreeNode createTree() {
        SameTree.TreeNode root = new SameTree.TreeNode(4);
        SameTree.TreeNode node_2 = new SameTree.TreeNode(2);
        SameTree.TreeNode node_7 = new SameTree.TreeNode(7);
        SameTree.TreeNode node_1 = new SameTree.TreeNode(1);
        SameTree.TreeNode node_3 = new SameTree.TreeNode(3);
        SameTree.TreeNode node_6 = new SameTree.TreeNode(6);
        SameTree.TreeNode node_9 = new SameTree.TreeNode(9);
        root.left = node_2;
        root.right = node_7;
        node_2.left = node_1;
        node_2.right = node_3;
        node_7.left = node_6;
        node_7.right = node_9;
        return root;
    }

    /**
     * 统计二叉树的节点个数
     */
    private int countTree(SameTree.TreeNode root) {
        if (root == null) {
            return 0;
        }
        return 1 + countTree(root.left) + countTree(root.right);
    }

    public static void main(String[] args) {
        TreeNodeCount treeNodeCount = new TreeNodeCount();
        SameTree.TreeNode root = treeNodeCount.createTree();
        int count = treeNodeCount.countTree(root);
        System.out.println("此二叉树的节点个数为: " + count);
    }

}
