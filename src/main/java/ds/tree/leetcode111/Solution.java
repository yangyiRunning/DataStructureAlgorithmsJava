package ds.tree.leetcode111;

import java.util.LinkedList;
import java.util.Queue;

/**
 * 二叉树的最小深度
 * LeetCode 111 https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/
 *
 * @author yangyi 2021年01月28日16:53:38
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
    public int minDepthRecursive(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int leftDepth = minDepth(root.left);
        int rightDepth = minDepth(root.right);
        if (root.left == null && root.right != null) {
            return rightDepth + 1;
        }
        if (root.left != null && root.right == null) {
            return leftDepth + 1;
        }
        return Math.min(leftDepth, rightDepth) + 1;
    }

    /**
     * 层序遍历方式解决
     */
    public int minDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int level = 0;
        while (!queue.isEmpty()) {
            int size = queue.size();
            level++;
            boolean finished = false;
            for (int i = 0; i < size; i++) {
                TreeNode cur = queue.poll();
                if (cur.left != null) {
                    queue.offer(cur.left);
                }
                if (cur.right != null) {
                    queue.offer(cur.right);
                }
                if (cur.left == null && cur.right == null) {
                    finished = true;
                    break;
                }
            }
            if(finished){
                break;
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
        node_20.left = node_15;
        node_20.right = node_7;
        return node_3;
    }

    public static void main(String[] args) {
        Solution minDepth = new Solution();
        TreeNode node = minDepth.createTree();
        int min = minDepth.minDepthRecursive(node);
        System.out.println("最小深度为:" + min);
        int min2 = minDepth.minDepth(node);
        System.out.println("最小深度为:" + min2);
    }
}
