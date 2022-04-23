package ds.bst.leetcode501;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 * 二叉搜索树中的众数
 * LeetCode 501 https://leetcode-cn.com/problems/find-mode-in-binary-search-tree/
 *
 * @author yangyi 2021年02月13日21:57:18
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
    private TreeNode pre;
    private int count = 0;
    private int maxCount = 0;

    public int[] findMode(TreeNode root) {
        if (root == null) {
            return new int[]{};
        }
        search(root);
        //        int[] res = new int[result.size()];
//        for (int i = 0; i < result.size(); i++) {
//            res[i] = result.get(i);
//        }
        return result.stream().mapToInt(value -> value).toArray();
    }

    private void search(TreeNode cur) {
        if (cur == null) {
            return;
        }
        search(cur.left);
        if (pre == null) {
            count = 1;
        } else if (pre != null && pre.val == cur.val) {
            count++;
        } else {
            count = 1;
        }
        pre = cur;
        if (count == maxCount) {
            result.add(cur.val);
        }
        if (count > maxCount) {
            result.clear();
            maxCount = count;
            result.add(cur.val);
        }
        search(cur.right);
    }

    private TreeNode createTree() {
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_22 = new TreeNode(2);
        node_1.right = node_2;
        node_2.left = node_22;
        return node_1;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new Solution().findMode(new Solution().createTree())));
    }
}
