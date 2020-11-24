package ds.bst;

/**
 * 二叉树的最近公共祖先
 * <p>
 * 此方法通用于 {@link BSTreeLowestCommonAncestor} 因为{@link BSTreeLowestCommonAncestor}类中的二叉搜索树也是普通二叉树的一种
 *
 * @author yangyi 2019年01月25日18:29:39
 */
public class TreeLowestCommonAncestor {

    /**
     * 非平衡二叉查找树的寻找
     */
    public BinarySearchTree.TreeNode lowestCommonAncestor(
            BinarySearchTree.TreeNode root,
            BinarySearchTree.TreeNode p,
            BinarySearchTree.TreeNode q) {
        if (root == null) {
            return null;
        }
        if (root.value == p.value) {
            return p;
        }
        if (root.value == q.value) {
            return q;
        }
        BinarySearchTree.TreeNode left = lowestCommonAncestor(root.left, p, q);
        BinarySearchTree.TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left == null) {
            return right;
        } else if (right == null) {
            return left;
        }
        return root;
    }

    private BinarySearchTree.TreeNode createTree() {
        BinarySearchTree binarySearchTree = new BinarySearchTree();
        BinarySearchTree.TreeNode node = null;
        int[] array = {6, 2, 8, 0, 4, 7, 9, 0, 0, 3, 5};
        for (int i : array) {
            node = binarySearchTree.insert(i);
        }
        return node;
    }

    public static void main(String[] args) {
        TreeLowestCommonAncestor treeLowestCommonAncestor = new TreeLowestCommonAncestor();
        BinarySearchTree.TreeNode resultNode = treeLowestCommonAncestor.lowestCommonAncestor(
                treeLowestCommonAncestor.createTree(),
                new BinarySearchTree.TreeNode(2),
                new BinarySearchTree.TreeNode(8));
        System.out.println("输出结果为:" + resultNode.value);
    }

}
