package ds.tree;

/**
 * 对称二叉树
 *
 * @author yangyi 2019年02月10日23:50:38
 */
public class SymmetricTree {

    public static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode(int x) {
            val = x;
        }
    }

    public boolean isSymmetric(TreeNode root) {
        return isMirror(root, root);
    }

    public boolean isMirror(TreeNode p, TreeNode q) {
        if (p == null && q == null) {
            return true;
        }
        if (p == null || q == null) {
            return false;
        }
        return p.val == q.val && isMirror(p.left, q.right) && isMirror(p.right, q.left);
    }

    public static void main(String[] args) {
        TreeNode val_1 = new TreeNode(1);
        TreeNode val_2 = new TreeNode(2);
        TreeNode val_3 = new TreeNode(3);
        val_1.left = val_2;
        val_1.right = val_3;

        TreeNode val__1 = new TreeNode(1);
        TreeNode val__2 = new TreeNode(2);
        val__1.left = val__2;
        val__1.right = val__2;

        SymmetricTree symmetricTree = new SymmetricTree();
        System.out.println(symmetricTree.isSymmetric(val_1));
        System.out.println(symmetricTree.isSymmetric(val__1));
    }
}
