package ds.sliding.leetcode209;

/**
 * 长度最小的子数组
 * LeetCode 209 https://leetcode-cn.com/problems/minimum-size-subarray-sum/
 *
 * @author yangyi 2021年01月17日10:23:06
 */
public class Solution {

    public int minSubArrayLen(int s, int[] nums) {
        int left = 0, right = 0;
        int sum = 0;
        int result = Integer.MAX_VALUE;
        while (right < nums.length) {
            sum += nums[right];
            while (sum >= s) {
                result = Math.min(result, right - left + 1);
                sum -= nums[left++];
            }
            right++;
        }
        return result == Integer.MAX_VALUE ? 0 : result;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().minSubArrayLen(7, new int[]{2, 3, 1, 2, 4, 3}));
    }
}
