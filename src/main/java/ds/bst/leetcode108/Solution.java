package ds.bst.leetcode108;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

/**
 * 将有序数组转换为二叉搜索树
 * LeetCode 108 https://leetcode-cn.com/problems/convert-sorted-array-to-binary-search-tree/
 *
 * @author yangyi 2021年05月02日01:38:39
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

    public TreeNode sortedArrayToBST(int[] nums) {
        if (nums == null) {
            return null;
        }
        return bst(nums, 0, nums.length - 1);
    }

    private TreeNode bst(int[] nums, int start, int end) {
        if (start > end) {
            return null;
        }
        int mid = start + (end - start) / 2;
        TreeNode cur = new TreeNode(nums[mid]);
        cur.left = bst(nums, start, mid - 1);
        cur.right = bst(nums, mid + 1, end);
        return cur;
    }

    private List<TreeNode> levelOrder(TreeNode root) {
        if (root == null) {
            return new LinkedList<>();
        }
        List<TreeNode> result = new LinkedList<>();
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            for (int i = 0; i < queue.size(); i++) {
                TreeNode cur = queue.poll();
                if (cur != null) {
                    result.add(cur);
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
        List<TreeNode> result = new Solution().levelOrder(new Solution().sortedArrayToBST(new int[]{-10, -3, 0, 5, 9}));
        System.out.println(Arrays.toString(result.stream().mapToInt(value -> value.val).toArray()));
    }
}
