package ds.tree.leetcode257;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 * 二叉树的所有路径
 * LeetCode 257 https://leetcode-cn.com/problems/binary-tree-paths/
 *
 * @author yangyi 2021年01月31日21:30:02
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

    public List<String> binaryTreePaths(TreeNode root) {
        if (root == null) {
            return new LinkedList<>();
        }
        LinkedList<Integer> path = new LinkedList<>();
        LinkedList<String> result = new LinkedList<>();
        backtrack(root, path, result);
        return result;
    }

    private void backtrack(TreeNode cur, LinkedList<Integer> path, List<String> result) {
        path.add(cur.val);
        if (cur.left == null && cur.right == null) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < path.size(); i++) {
                sb.append(path.get(i)).append("->");
            }
            result.add(sb.substring(0, sb.length() - 2));
            return;
        }
        if (cur.left != null) {
            backtrack(cur.left, path, result);
            path.removeLast();
        }
        if (cur.right != null) {
            backtrack(cur.right, path, result);
            path.removeLast();
        }
    }

    private TreeNode createTree() {
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_5 = new TreeNode(5);
        node_1.left = node_2;
        node_1.right = node_3;
        node_2.right = node_5;
        return node_1;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new Solution().binaryTreePaths(new Solution().createTree()).toArray()));
    }
}
