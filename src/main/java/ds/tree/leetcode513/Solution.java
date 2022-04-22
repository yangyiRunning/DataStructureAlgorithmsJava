package ds.tree.leetcode513;

import java.util.LinkedList;
import java.util.Queue;

/**
 * 找树左下角的值
 * LeetCode 513 https://leetcode-cn.com/problems/find-bottom-left-tree-value/
 *
 * @author yangyi 2022年04月22日16:59:26
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

    public int findBottomLeftValue(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int result = 0;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode cur = queue.poll();
                if (cur != null && i == 0) {
                    result = cur.val;
                }
                if (cur.left != null) {
                    queue.offer(cur.left);
                }
                if (cur.right != null) {
                    queue.offer(cur.right);
                }
            }
        }
        return result;
    }

    private TreeNode createTree() {
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_3 = new TreeNode(3);
        node_2.left = node_1;
        node_2.right = node_3;
        return node_2;
    }

    private TreeNode createTree2() {
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_5 = new TreeNode(5);
        TreeNode node_6 = new TreeNode(6);
        TreeNode node_7 = new TreeNode(7);
        node_1.left = node_2;
        node_1.right = node_3;
        node_2.left = node_4;
        node_3.left = node_5;
        node_3.right = node_6;
        node_5.left = node_7;
        return node_1;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().findBottomLeftValue(new Solution().createTree()));
        System.out.println(new Solution().findBottomLeftValue(new Solution().createTree2()));
    }
}
