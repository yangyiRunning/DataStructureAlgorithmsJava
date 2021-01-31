package ds.tree.leetcode222;

import java.util.LinkedList;
import java.util.Queue;

/**
 * 二叉树的节点个数
 *
 * @author yangyi 2020年11月25日10:28:19
 */
public class TreeNodeCount {

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode(int x) {
            val = x;
        }
    }

    /**
     * 4
     * /   \
     * 2     7
     * / \   / \
     * 1   3 6   9
     */
    private TreeNode createTree() {
        TreeNode root = new TreeNode(4);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_7 = new TreeNode(7);
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_6 = new TreeNode(6);
        TreeNode node_9 = new TreeNode(9);
        root.left = node_2;
        root.right = node_7;
        node_2.left = node_1;
        node_2.right = node_3;
        node_7.left = node_6;
        node_7.right = node_9;
        return root;
    }

    /**
     * 递归方式解决
     */
    private int countTree(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int leftCount = countTree(root.left);
        int rightCount = countTree(root.right);
        return 1 + leftCount + rightCount;
    }

    /**
     * 层序遍历方式解决
     */
    public int countTree2(TreeNode root) {
        if (root == null) {
            return 0;
        }
        Queue<TreeNode> queue = new LinkedList<>();
        int count = 0;
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode cur = queue.poll();
                count++;
                if (cur.left != null) {
                    queue.offer(cur.left);
                }
                if (cur.right != null) {
                    queue.offer(cur.right);
                }
            }
        }
        return count;
    }

    public static void main(String[] args) {
        TreeNodeCount treeNodeCount = new TreeNodeCount();
        TreeNode root = treeNodeCount.createTree();
        int count = treeNodeCount.countTree(root);
        System.out.println("此二叉树的节点个数为: " + count);
        int count2 = treeNodeCount.countTree2(root);
        System.out.println("此二叉树的节点个数为: " + count2);
    }

}
