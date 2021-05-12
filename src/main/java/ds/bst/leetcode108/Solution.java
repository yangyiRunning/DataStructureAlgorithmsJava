package ds.bst.leetcode108;

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

    public static void main(String[] args) {
        System.out.println(new Solution().sortedArrayToBST(new int[]{-10, -3, 0, 5, 9}).val);
    }
}
