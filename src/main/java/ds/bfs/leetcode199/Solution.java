package ds.bfs.leetcode199;

import java.util.*;

/**
 * 二叉树的右视图
 * LeetCode 199 https://leetcode-cn.com/problems/binary-tree-right-side-view/
 *
 * @author yangyi 2021年01月26日20:33:04
 */
public class Solution {

    public static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode(int x) {
            val = x;
        }
    }

    public List<Integer> rightSideView(TreeNode root) {
        if (root == null) {
            return new LinkedList<>();
        }
        Queue<TreeNode> queue = new LinkedList<>();
        List<Integer> result = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode cur = queue.poll();
                if (cur != null && i == size - 1) {
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

    public static void main(String[] args) {
        TreeNode one = new TreeNode(1);
        TreeNode two = new TreeNode(2);
        TreeNode three = new TreeNode(3);
        TreeNode five = new TreeNode(5);
        TreeNode four = new TreeNode(4);

        one.left = two;
        one.right = three;
        two.right = five;
        three.right = four;

        Solution solution = new Solution();
        System.out.println(Arrays.toString(solution.rightSideView(one).toArray()));
    }
}
