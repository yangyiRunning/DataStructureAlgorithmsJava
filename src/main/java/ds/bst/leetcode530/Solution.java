package ds.bst.leetcode530;

import java.util.LinkedList;
import java.util.List;

/**
 * 二叉搜索树的最小绝对差
 * LeetCode 530 https://leetcode-cn.com/problems/minimum-absolute-difference-in-bst/
 *
 * @author yangyi 2021年02月13日15:58:20
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

    private List<Integer> result = new LinkedList<>();

    /**
     * 1. 用额外的数组空间接收二叉搜索树中序遍历的结果
     * 2. 因为此时的数组已经是有序的，再查找数组中的最小绝对差即可
     */
    public int getMinimumDifference(TreeNode root) {
        inOrder(root);
        if (result.size() <= 1) {
            return 0;
        }
        int min = Integer.MAX_VALUE;
        for (int i = 1; i < result.size(); i++) {
            min = Math.min(min, result.get(i) - result.get(i - 1));
        }
        return min;
    }

    private void inOrder(TreeNode root) {
        if (root == null) {
            return;
        }
        inOrder(root.left);
        result.add(root.val);
        inOrder(root.right);
    }

    private TreeNode pre;
    private int res = Integer.MAX_VALUE;

    /**
     * 递归内部记录当前节点和前一个节点，不借助额外的数组空间，在递归内部计算最小绝对差
     */
    public int getMinimumDifference2(TreeNode root) {
        recursive(root);
        return res;
    }

    private void recursive(TreeNode cur) {
        if (cur == null) {
            return;
        }
        recursive(cur.left);
        if (pre != null) {
            res = Math.min(res, cur.val - pre.val);
        }
        pre = cur;
        recursive(cur.right);
    }

    private TreeNode createTree() {
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_2 = new TreeNode(2);
        node_1.right = node_3;
        node_3.left = node_2;
        return node_1;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().getMinimumDifference(new Solution().createTree()));
        System.out.println(new Solution().getMinimumDifference2(new Solution().createTree()));
    }
}
