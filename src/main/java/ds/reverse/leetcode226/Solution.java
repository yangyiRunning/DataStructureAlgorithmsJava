package ds.reverse.leetcode226;

import java.util.ArrayDeque;
import java.util.Queue;
import java.util.Stack;

/**
 * 翻转二叉树
 * LeetCode 226 https://leetcode-cn.com/problems/invert-binary-tree/
 *
 * @author yangyi 2019年02月10日16:57:38
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

    /**
     * 递归方式遍历反转
     */
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return null;
        }

        TreeNode temp = root.left;
        root.left = root.right;
        root.right = temp;

        invertTree(root.left);
        invertTree(root.right);
        return root;
    }

    /**
     * 层序遍历方式反转
     */
    public TreeNode invertTreeByQueue(TreeNode root) {
        if (root == null) {
            return null;
        }
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            TreeNode temp = node.left;
            node.left = node.right;
            node.right = temp;
            if (node.left != null) {
                queue.offer(node.left);
            }
            if (node.right != null) {
                queue.offer(node.right);
            }
        }
        return root;
    }

    /**
     * 深度优先遍历的方式反转
     */
    private TreeNode invertTreeByStack(TreeNode root) {
        if (root == null) {
            return null;
        }
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            int size = stack.size();
            for (int i = 0; i < size; i++) {
                TreeNode cur = stack.pop();
                TreeNode temp = cur.left;
                cur.left = cur.right;
                cur.right = temp;
                if (cur.right != null) {
                    stack.push(cur.right);
                }
                if (cur.left != null) {
                    stack.push(cur.left);
                }
            }
        }
        return root;
    }

    public TreeNode createTree() {
        TreeNode val_4 = new TreeNode(4);
        TreeNode val_2 = new TreeNode(2);
        TreeNode val_7 = new TreeNode(7);
        TreeNode val_1 = new TreeNode(1);
        TreeNode val_3 = new TreeNode(3);
        TreeNode val_6 = new TreeNode(6);
        TreeNode val_9 = new TreeNode(9);
        val_4.left = val_2;
        val_4.right = val_7;
        val_2.left = val_1;
        val_2.right = val_3;
        val_7.left = val_6;
        val_7.right = val_9;
        return val_4;
    }

    public void inOrder(TreeNode node) {
        if (node == null) {
            return;
        }
        inOrder(node.left);
        System.out.print(node.val + "——>");
        inOrder(node.right);
    }

    public static void main(String[] args) {
        Solution invertTree = new Solution();
        TreeNode node = invertTree.createTree();
        System.out.println("先中序遍历打印一遍反转前的结果:");
        invertTree.inOrder(node);
        System.out.println();
        System.out.println("再中序遍历打印一遍反转后的结果:");
        TreeNode newNode = invertTree.invertTree(node);
        invertTree.inOrder(newNode);
        System.out.println();
        System.out.println("再中序遍历打印一遍反转后的结果:");
        TreeNode newNode2 = invertTree.invertTreeByQueue(node);
        invertTree.inOrder(newNode2);
        System.out.println();
        System.out.println("再中序遍历打印一遍反转后的结果:");
        TreeNode newNode3= invertTree.invertTreeByStack(node);
        invertTree.inOrder(newNode3);
    }

}
