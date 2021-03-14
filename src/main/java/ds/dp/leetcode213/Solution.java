package ds.dp.leetcode213;

/**
 * 打家劫舍II
 * LeetCode 213 https://leetcode-cn.com/problems/house-robber-ii/
 *
 * @author yangyi 2021年03月10日12:21:09
 */
public class Solution {

    public int rob(int[] nums) {
        if (nums.length == 0) {
            return 0;
        }
        if (nums.length == 1) {
            return nums[0];
        }
        int result1 = robRange(nums, 0, nums.length - 2);
        int result2 = robRange(nums, 1, nums.length - 1);
        return Math.max(result1, result2);
    }

    public int robRange(int[] nums, int start, int end) {
        if (nums.length == 0) {
            return 0;
        }
        if (nums.length == 1) {
            return nums[0];
        }
        if (start == end) {
            return nums[start];
        }
        int[] dp = new int[nums.length];
        dp[start] = nums[start];
        dp[start + 1] = Math.max(nums[start], nums[start + 1]);
        for (int i = start + 2; i <= end; i++) {
            dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1]);
        }
        return dp[end];
    }

    public static void main(String[] args) {
        System.out.println(new Solution().rob(new int[]{2, 3, 2}));
        System.out.println(new Solution().rob(new int[]{1, 2, 3, 1}));
        System.out.println(new Solution().rob(new int[]{0}));
        System.out.println(new Solution().rob(new int[]{0, 0}));
        System.out.println(new Solution().rob(new int[]{1, 2, 3, 4, 5, 1, 2, 3, 4, 5}));
    }
}
