package ds.tree.leetcode104;

import java.util.LinkedList;
import java.util.Queue;

/**
 * 二叉树的最大深度
 * LeetCode 104 https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/
 *
 * @author yangyi 2021年01月28日16:10:32
 */
public class Solution {

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
    }

    /**
     * 递归方式解决
     */
    public int maxDepthRecursion(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int leftDepth = maxDepthRecursion(root.left);
        int rightDepth = maxDepthRecursion(root.right);
        return Math.max(leftDepth, rightDepth) + 1;
    }

    /**
     * 层序遍历(广度优先搜索)方式解决
     */
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int level = 0;
        while (!queue.isEmpty()) {
            int size = queue.size();
            level++;
            for (int i = 0; i < size; i++) {
                TreeNode cur = queue.poll();
                if (cur.left != null) {
                    queue.offer(cur.left);
                }
                if (cur.right != null) {
                    queue.offer(cur.right);
                }
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
        Solution maxDepth = new Solution();
        int level = maxDepth.maxDepth(maxDepth.createTree());
        System.out.println("最大层级数为:" + level);
        int level2 = maxDepth.maxDepthRecursion(maxDepth.createTree());
        System.out.println("最大层级数为:" + level2);
    }
}
