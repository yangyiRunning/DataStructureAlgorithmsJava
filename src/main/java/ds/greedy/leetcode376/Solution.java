package ds.greedy.leetcode376;

/**
 * 摆动序列
 * LeetCode 376 https://leetcode-cn.com/problems/wiggle-subsequence/
 *
 * @author yangyi 2021年02月22日12:38:34
 */
public class Solution {

    /**
     * 统计上坡时的峰和下坡时的谷
     * cur为斜率，不是上坡就是下坡，不可能等于0
     * pre为前后两个数的差值，可能等于0
     */
    public int wiggleMaxLength(int[] nums) {
        if (nums == null) {
            return 0;
        }
        if (nums.length <= 0) {
            return nums.length;
        }
        int pre = 0;
        int cur = 0;
        int result = 1;
        for (int i = 1; i < nums.length; i++) {
            cur = nums[i] - nums[i - 1];
            if ((cur > 0 && pre <= 0) || (cur < 0 && pre >= 0)) {
                result++;
                pre = cur;
            }
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().wiggleMaxLength(
                new int[]{1, 7, 4, 9, 2, 5}));
        System.out.println(new Solution().wiggleMaxLength(
                new int[]{1, 17, 5, 10, 13, 15, 10, 5, 16, 8}));
        System.out.println(new Solution().wiggleMaxLength(
                new int[]{1, 2, 3, 4, 5, 6, 7, 8, 9}));
    }
}
