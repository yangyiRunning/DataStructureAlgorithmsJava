package ds.reverse;

import java.util.ArrayDeque;
import java.util.Queue;

/**
 * 反转一颗二叉树
 * <p>
 * 示例：
 * <p>
 * 输入：
 * <p>
 * 4
 * /   \
 * 2     7
 * / \   / \
 * 1   3 6   9
 * 输出：
 * <p>
 * 4
 * /   \
 * 7     2
 * / \   / \
 * 9   6 3   1
 *
 * @author yangyi 2019年02月10日16:57:38
 */
public class InvertTree {

    public static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode(int x) {
            val = x;
        }
    }

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

    public TreeNode invertTreeByQueue(TreeNode tree) {
        if (tree == null) {
            return null;
        }
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(tree);
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
        return tree;
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
        InvertTree invertTree = new InvertTree();
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
    }

}
