package ds.bst;

/**
 * 二叉搜索树的最近公共祖先
 * <p>
 * <p>
 * 给定一个二叉搜索树, 找到该树中两个指定节点的最近公共祖先。
 * <p>
 * 百度百科中最近公共祖先的定义为：“对于有根树 T 的两个结点 p、q，最近公共祖先表示为一个结点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”
 * <p>
 * 例如，给定如下二叉搜索树:  root = [6,2,8,0,4,7,9,null,null,3,5]
 * <p>
 * <p>
 * <p>
 * <p>
 * <p>
 * 示例 1:
 * <p>
 * 输入: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
 * 输出: 6
 * 解释: 节点 2 和节点 8 的最近公共祖先是 6。
 * 示例 2:
 * <p>
 * 输入: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
 * 输出: 2
 * 解释: 节点 2 和节点 4 的最近公共祖先是 2, 因为根据定义最近公共祖先节点可以为节点本身。
 * <p>
 * <p>
 * 说明:
 * <p>
 * 所有节点的值都是唯一的。
 * p、q 为不同节点且均存在于给定的二叉搜索树中。
 * <p>
 *
 * @author yangyi 2019年01月25日19:15:29
 */
public class BSTreeLowestCommonAncestor {

    public BinarySearchTree.TreeNode lowestCommonAncestor(BinarySearchTree.TreeNode root, BinarySearchTree.TreeNode p, BinarySearchTree.TreeNode q) {
        if (p.value < root.value && q.value < root.value) {
            return lowestCommonAncestor(
                    root.left,
                    new BinarySearchTree.TreeNode(p.value),
                    new BinarySearchTree.TreeNode(q.value));
        } else if (p.value > root.value && q.value > root.value) {
            return lowestCommonAncestor(
                    root.right,
                    new BinarySearchTree.TreeNode(p.value),
                    new BinarySearchTree.TreeNode(q.value));
        } else {
            return root;
        }
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
        BSTreeLowestCommonAncestor bsTreeLowestCommonAncestor = new BSTreeLowestCommonAncestor();
        BinarySearchTree.TreeNode resultNode = bsTreeLowestCommonAncestor.lowestCommonAncestor(
                bsTreeLowestCommonAncestor.createTree(),
                new BinarySearchTree.TreeNode(2),
                new BinarySearchTree.TreeNode(8));
        System.out.println("输出结果为:" + resultNode.value);
    }
}
