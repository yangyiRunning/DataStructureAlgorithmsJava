package ds.greedy.leetcode53;

import org.omg.CORBA.INTERNAL;

/**
 * 最大子序和
 * LeetCode 53 https://leetcode-cn.com/problems/maximum-subarray/
 *
 * @author yangyi 2021年02月22日14:37:28
 */
public class Solution {

    public int maxSubArray(int[] nums) {
        int max = Integer.MIN_VALUE;
        int result = 0;
        for (int i = 0; i < nums.length; i++) {
            result += nums[i];
            if (result > max) {
                max = result;
            }
            if (result <= 0) {
                result = 0;
            }
        }
        return max;
    }

    public static void main(String[] args) {
        System.out.println(
                new Solution().maxSubArray(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4}));
        System.out.println(new Solution().maxSubArray(new int[]{1}));
        System.out.println(new Solution().maxSubArray(new int[]{0}));
        System.out.println(new Solution().maxSubArray(new int[]{-1}));
        System.out.println(new Solution().maxSubArray(new int[]{-100000}));
    }
}
