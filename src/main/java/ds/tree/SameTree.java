package ds.tree;

/**
 * 相同的树
 * <p>
 * 给定两个二叉树，编写一个函数来检验它们是否相同。
 * <p>
 * 如果两个树在结构上相同，并且节点具有相同的值，则认为它们是相同的。
 * <p>
 * 示例 1:
 * <p>
 * 输入:       1         1
 * / \       / \
 * 2   3     2   3
 * <p>
 * [1,2,3],   [1,2,3]
 * <p>
 * 输出: true
 * 示例 2:
 * <p>
 * 输入:      1          1
 * /           \
 * 2             2
 * <p>
 * [1,2],     [1,null,2]
 * <p>
 * 输出: false
 * 示例 3:
 * <p>
 * 输入:       1         1
 * / \       / \
 * 2   1     1   2
 * <p>
 * [1,2,1],   [1,1,2]
 * <p>
 * 输出: false
 * <p>
 *
 * @author yangyi 2019年02月10日21:26:34
 */
public class SameTree {

    public static class TreeNode {
        public int val;
        public TreeNode left;
        public TreeNode right;

        public TreeNode(int x) {
            val = x;
        }
    }

    public boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) {
            return true;
        }
        if (p != null && q != null && p.val == q.val) {
            return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
        }
        return false;
    }

    public TreeNode[] createTreeNode() {
        TreeNode[] treeNodes = new TreeNode[3];

        TreeNode val_1 = new TreeNode(1);
        TreeNode val_2 = new TreeNode(2);
        TreeNode val_3 = new TreeNode(3);
        val_1.left = val_2;
        val_1.right = val_3;
        treeNodes[0] = val_1;

        TreeNode val_4 = new TreeNode(4);
        TreeNode val_5 = new TreeNode(5);
        TreeNode val_6 = new TreeNode(6);
        val_4.left = val_5;
        val_4.right = val_6;
        treeNodes[1] = val_4;

        TreeNode val_1_1 = new TreeNode(1);
        TreeNode val_2_2 = new TreeNode(2);
        TreeNode val_3_3 = new TreeNode(3);
        val_1_1.left = val_2_2;
        val_1_1.right = val_3_3;
        treeNodes[2] = val_1_1;

        return treeNodes;
    }

    public static void main(String[] args) {
        SameTree sameTree = new SameTree();
        TreeNode[] treeNodes = sameTree.createTreeNode();
        System.out.println("两个树是否相同:" + sameTree.isSameTree(treeNodes[0], treeNodes[1]));
        System.out.println("两个树是否相同:" + sameTree.isSameTree(treeNodes[0], treeNodes[2]));
    }
}
