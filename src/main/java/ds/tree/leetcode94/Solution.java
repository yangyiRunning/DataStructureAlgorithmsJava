package ds.tree.leetcode94;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 * 二叉树的中序遍历
 * LeetCode 94 https://leetcode-cn.com/problems/binary-tree-inorder-traversal/
 *
 * @author yangyi 2021年01月21日16:28:15
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

    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new LinkedList<>();
        traversal(root, result);
        return result;
    }

    private void traversal(TreeNode root, List<Integer> result) {
        if (root == null) {
            return;
        }
        traversal(root.left, result);
        result.add(root.val);
        traversal(root.right, result);
    }

    private TreeNode createTree() {
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_3 = new TreeNode(3);
        node_1.right = node_2;
        node_2.left = node_3;
        return node_1;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        List<Integer> result = solution.inorderTraversal(solution.createTree());
        System.out.println(Arrays.toString(result.toArray()));
    }
}
