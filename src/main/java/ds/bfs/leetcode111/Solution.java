package ds.bfs.leetcode111;

import java.util.LinkedList;
import java.util.Queue;

/**
 * 二叉树的最小深度
 * LeetCode 111 https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/
 *
 * @author yangyi 2021年01月26日16:18:38
 */
public class Solution {

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

    private TreeNode createTree() {
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_9 = new TreeNode(9);
        TreeNode node_20 = new TreeNode(20);
        TreeNode node_15 = new TreeNode(15);
        TreeNode node_7 = new TreeNode(7);
        node_3.left = node_9;
        node_3.right = node_20;
        node_20.left = node_15;
        node_20.right = node_7;
        return node_3;
    }

    public int minDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        Queue<TreeNode> treeNodeQueue = new LinkedList<>();
        treeNodeQueue.add(root);
        int minDepth = 1;
        while (!treeNodeQueue.isEmpty()) {
            int size = treeNodeQueue.size();
            for (int i = 0; i < size; i++) {
                TreeNode cur = treeNodeQueue.poll();
                if (cur.left == null && cur.right == null) {
                    return minDepth;
                }
                if (cur.left != null) {
                    treeNodeQueue.add(cur.left);
                }
                if (cur.right != null) {
                    treeNodeQueue.add(cur.right);
                }
            }
            minDepth++;
        }
        return minDepth;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        System.out.println(solution.minDepth(solution.createTree()));
    }
}
