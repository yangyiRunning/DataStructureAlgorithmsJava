package ds.bit.leetcode136;

import java.util.Arrays;

/**
 * 只出现一次的数字
 *
 * LeetCode 136 https://leetcode-cn.com/problems/single-number/
 *
 * @author yangyi 2022年02月07日16:23:46
 */
public class Solution {

    /**
     * 异或的特性：
     * <p>
     * 1.恒定律：A ^ 0 = A
     * 2.归零率：A ^ A = 0
     * 3.交换律：A ^ B = B ^ A
     * 4.结合律：(A ^ B) ^ C = A ^ (B ^ C)
     */
    public int singleNumber(int[] nums) {
        int result = 0;
        for (int i = 0; i < nums.length; i++) {
            result ^= nums[i];
        }
        return result;
    }

    public static void main(String[] args) {
        int[] a = {2, 2, 1};
        int[] b = {4, 1, 2, 1, 2};
        Solution solution = new Solution();
        int res = solution.singleNumber(a);
        int res2 = solution.singleNumber(b);
        System.out.println(Arrays.toString(a) + "中只出现一次的数字为:" + res);
        System.out.println(Arrays.toString(b) + "中只出现一次的数字为:" + res2);
    }
}
