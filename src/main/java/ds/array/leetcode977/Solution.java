package ds.array.leetcode977;

import java.util.Arrays;

/**
 * 977. 有序数组的平方
 * https://leetcode.cn/problems/squares-of-a-sorted-array/
 *
 * @author yangyi 2023年09月04日16:37:38
 */
public class Solution {

    public int[] sortedSquares(int[] nums) {
        if (nums == null || nums.length == 0) {
            return new int[]{};
        }
        for (int i = 0; i < nums.length; i++) {
            nums[i] *= nums[i];
        }
        Arrays.sort(nums);
        return nums;
    }

    public static void main(String[] args) {
        int[] a = {-4, -1, 0, 3, 10};
        int[] b = {-7, -3, 2, 3, 11};
        Solution sortedSquares = new Solution();
        System.out.println(Arrays.toString(sortedSquares.sortedSquares(a)));
        System.out.println(Arrays.toString(sortedSquares.sortedSquares(b)));
    }
}
