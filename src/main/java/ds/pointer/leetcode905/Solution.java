package ds.pointer.leetcode905;

import java.util.Arrays;

/**
 * 按奇偶排序数组
 * LeetCode 905 https://leetcode-cn.com/problems/sort-array-by-parity/
 *
 * @author yangyi 2022年04月24日19:17:01
 */
public class Solution {

    public int[] sortArrayByParity(int[] nums) {
        if (nums == null || nums.length == 0) {
            return new int[]{0};
        }
        int start = 0;
        int end = nums.length - 1;
        while (start < end) {
            if (nums[start] % 2 == 0) {
                start++;
                continue;
            }
            if (nums[end] % 2 != 0) {
                end--;
                continue;
            }
            int temp = nums[start];
            nums[start] = nums[end];
            nums[end] = temp;
        }
        return nums;
    }

    public static void main(String[] args) {
        int[] nums = {3, 1, 2, 4};
        Solution sortArrayByParity = new Solution();
        System.out.println(Arrays.toString(sortArrayByParity.sortArrayByParity(nums)));
    }
}
