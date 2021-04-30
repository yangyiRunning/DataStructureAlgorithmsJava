package ds.bfs.targetoffer321;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

/**
 * 从上到下打印二叉树
 * 剑指 Offer 32 - I. https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-lcof/
 *
 * @author yangyi 2021年04月30日17:43:21
 */
public class Solution {

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode(int x) {
            val = x;
        }
    }

    public int[] levelOrder(TreeNode root) {
        if (root == null) {
            return new int[]{};
        }
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        List<TreeNode> levelList = new LinkedList<>();
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode cur = queue.poll();
                if (cur != null) {
                    levelList.add(cur);
                }
                if (cur.left != null) {
                    queue.add(cur.left);
                }
                if (cur.right != null) {
                    queue.add(cur.right);
                }
            }
        }
        return levelList.stream().mapToInt(value -> value.val).toArray();
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

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new Solution().levelOrder(new Solution().createTree())));
    }
}
