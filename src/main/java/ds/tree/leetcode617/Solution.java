package ds.tree.leetcode617;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

/**
 * 合并二叉树(二叉树相加)
 * LeetCode 617 https://leetcode-cn.com/problems/merge-two-binary-trees/
 *
 * @author yangyi 2021年02月12日20:38:40
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

    public TreeNode mergeTrees(TreeNode root1, TreeNode root2) {
        if (root1 == null) {
            return root2;
        }
        if (root2 == null) {
            return root1;
        }
        root1.val += root2.val;
        root1.left = mergeTrees(root1.left, root2.left);
        root1.right = mergeTrees(root1.right, root2.right);
        return root1;
    }

    private TreeNode createTree1() {
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_5 = new TreeNode(5);
        node_1.left = node_3;
        node_1.right = node_2;
        node_3.left = node_5;
        return node_1;
    }

    private TreeNode createTree2() {
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_7 = new TreeNode(7);
        node_2.left = node_1;
        node_2.right = node_3;
        node_1.right = node_4;
        node_3.right = node_7;
        return node_2;
    }

    private List<Integer> levelOrder(TreeNode root) {
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

    public static void main(String[] args) {
        System.out.println(
                Arrays.toString(
                        new Solution().levelOrder(
                                new Solution().mergeTrees(
                                        new Solution().createTree1(),
                                        new Solution().createTree2())).toArray()));
    }
}
