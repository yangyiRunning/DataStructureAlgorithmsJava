package ds;

import java.util.ArrayDeque;
import java.util.Queue;

/**
 * 给定一个二叉树，找出其最大深度。
 * <p>
 * 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。
 * <p>
 * 说明: 叶子节点是指没有子节点的节点。
 * <p>
 * 示例：
 * 给定二叉树 [3,9,20,null,null,15,7]，
 * <p>
 * 3
 * / \
 * 9  20
 * /  \
 * 15   7
 * 返回它的最大深度 3 。
 *
 * @author yangyi 2019年01月28日21:12:36
 */
public class MaxDepth {

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
    }

    /**
     * 关键奥义为记录两层的节点个数
     */
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);

        //当前层的节点个数
        int currentLevelCount = 1;
        //下一层的节点个数
        int nextCurrentLevelCount = 0;
        //广度优先遍历到哪一层了
        int level = 0;

        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            currentLevelCount--;
            if (node.left != null) {
                queue.offer(node.left);
                nextCurrentLevelCount++;
            }
            if (node.right != null) {
                queue.offer(node.right);
                nextCurrentLevelCount++;
            }
            if (currentLevelCount == 0) {
                currentLevelCount = nextCurrentLevelCount;
                nextCurrentLevelCount = 0;
                level++;
            }
        }
        return level;
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
        node_9.left = node_15;
        node_20.right = node_7;
        return node_3;
    }

    public static void main(String[] args) {
        MaxDepth maxDepth = new MaxDepth();
        int level = maxDepth.maxDepth(maxDepth.createTree());
        System.out.println("最大层级数为:" + level);
    }
}
