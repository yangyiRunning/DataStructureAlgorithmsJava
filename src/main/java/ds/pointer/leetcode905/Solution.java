package ds.pointer.leetcode905;

import java.util.Arrays;

/**
 * 按奇偶排序数组
 * LeetCode 905 https://leetcode-cn.com/problems/sort-array-by-parity/
 *
 * @author yangyi 2020年12月15日14:12:15
 */
public class Solution {

    public int[] sortArrayByParity(int[] A) {
        if (A == null) {
            return new int[]{};
        }
        if (A.length == 0) {
            return A;
        }
        int start = 0;
        int end = A.length - 1;
        while (start < end) {
            if (A[start] % 2 == 0) {
                start++;
                continue;
            }
            if (A[end] % 2 != 0) {
                end--;
                continue;
            }
            int temp = A[start];
            A[start] = A[end];
            A[end] = temp;
        }
        return A;
    }

    public static void main(String[] args) {
        int[] nums = {3, 1, 2, 4};
        Solution sortArrayByParity = new Solution();
        System.out.println(Arrays.toString(sortArrayByParity.sortArrayByParity(nums)));
    }
}
