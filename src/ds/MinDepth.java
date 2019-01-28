package ds;

/**
 * 给定一个二叉树，找出其最小深度。
 * <p>
 * 最小深度是从根节点到最近叶子节点的最短路径上的节点数量。
 * <p>
 * 说明: 叶子节点是指没有子节点的节点。
 * <p>
 * 示例:
 * <p>
 * 给定二叉树 [3,9,20,null,null,15,7],
 * <p>
 * 3
 * / \
 * 9  20
 * /  \
 * 15   7
 * 返回它的最小深度  2.
 *
 * @author yangyi 2019年01月28日23:24:57
 */
public class MinDepth {

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
    }

    public int minDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        if (root.left == null) {
            return minDepth(root.right) + 1;
        }
        if (root.right == null) {
            return minDepth(root.left) + 1;
        }
        return Math.min(minDepth(root.left), minDepth(root.right)) + 1;
    }


    public TreeNode createTree() {
        TreeNode node_3 = new TreeNode();
        node_3.val = 3;
        TreeNode node_9 = new TreeNode();
        node_9.val = 9;
        TreeNode node_20 = new TreeNode();
        node_20.val = 20;
        TreeNode node_15 = new TreeNode();
        node_15.val = 15;
        TreeNode node_7 = new TreeNode();
        node_7.val = 7;
        node_3.left = node_9;
        node_3.right = node_20;
        node_20.left = node_15;
        node_20.right = node_7;
        return node_3;
    }

    public static void main(String[] args) {
        MinDepth minDepth = new MinDepth();
        TreeNode node = minDepth.createTree();
        int min = minDepth.minDepth(node);
        System.out.println("最小深度为:" + min);
    }
}
