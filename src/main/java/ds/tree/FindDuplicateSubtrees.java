package ds.tree;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * 寻找重复的子树
 * LeetCode 652 https://leetcode-cn.com/problems/find-duplicate-subtrees/
 *
 * @author yangyi 2020年11月29日23:05:13
 */
public class FindDuplicateSubtrees {

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

    /**
     * 1
     * / \
     * 2   3
     * /   / \
     * 4   2   4
     * /
     * 4
     */
    private TreeNode createTreeNode() {
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_22 = new TreeNode(2);
        TreeNode node_44 = new TreeNode(4);
        TreeNode node_444 = new TreeNode(4);
        node_1.left = node_2;
        node_1.right = node_3;
        node_2.left = node_4;
        node_3.left = node_22;
        node_3.right = node_44;
        node_22.left = node_444;
        return node_1;
    }

    private void inOrder(TreeNode root) {
        if (root == null) {
            return;
        }
        inOrder(root.left);
        System.out.print(root.val + " ");
        inOrder(root.right);
    }

    public List<TreeNode> results = new ArrayList<>();
    public HashMap<String, Integer> counts = new HashMap<>();

    public List<TreeNode> findDuplicateSubtrees(TreeNode root) {
        find(root);
        return results;
    }

    private String find(TreeNode root) {
        if (root == null) {
            return "#";
        }
        String left = find(root.left);
        String right = find(root.right);
        //本身节点子树的样子
        String result = left + ", " + right + ", " + root.val;
        //记录子树出现的次数
        int count = counts.getOrDefault(result, 0);
        //多次重复只加入一次
        if (count == 1) {
            results.add(root);
        }
        counts.put(result, count + 1);
        return result;
    }

    public static void main(String[] args) {
        FindDuplicateSubtrees findDuplicateSubtrees = new FindDuplicateSubtrees();
        TreeNode root = findDuplicateSubtrees.createTreeNode();
        System.out.println("中序遍历构建好的二叉树: ");
        findDuplicateSubtrees.inOrder(root);
        findDuplicateSubtrees.findDuplicateSubtrees(root);
        System.out.println();
        System.out.print("重复的子树: ");
        for (TreeNode result : findDuplicateSubtrees.results) {
            System.out.println();
            findDuplicateSubtrees.inOrder(result);
            System.out.println();
        }
    }
}
