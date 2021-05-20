package ds.tree.leetcode965;

import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

/**
 * 单值二叉树
 * LeetCode 965 https://leetcode-cn.com/problems/univalued-binary-tree/
 *
 * @author yangyi 2021年05月03日16:34:44
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

    public boolean isUnivalTree(TreeNode root) {
        List<Integer> result = level(root);
        for (int i = 0; i < result.size(); i++) {
            if (result.get(0).intValue() != result.get(i).intValue()) {
                return false;
            }
        }
        return true;
    }

    private List<Integer> level(TreeNode root) {
        if (root == null) {
            return new LinkedList<>();
        }
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        List<Integer> result = new LinkedList<>();
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode cur = queue.poll();
                if (cur != null) {
                    result.add(cur.val);
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

    private TreeNode createTree(){
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(1);
        TreeNode node_3 = new TreeNode(1);
        TreeNode node_4 = new TreeNode(1);
        TreeNode node_5 = new TreeNode(1);
        TreeNode node_6 = new TreeNode(1);
        node_1.left = node_2;
        node_1.right = node_3;
        node_2.left = node_4;
        node_2.right = node_5;
        node_3.right = node_6;
        return node_1;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        System.out.println(solution.isUnivalTree(solution.createTree()));
    }

}
