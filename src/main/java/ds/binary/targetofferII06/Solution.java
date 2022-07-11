package ds.binary.targetofferII06;

import java.util.Arrays;

/**
 * 排序数组中两个数字之和
 * 剑指 Offer II 006 https://leetcode.cn/problems/kLl5u1/
 *
 * @author yangyi 2022年07月11日22:55:07
 */
public class Solution {

    public int[] twoSum(int[] numbers, int target) {
        int start = 0, end = numbers.length - 1;
        while (start < end) {
            if (numbers[start] + numbers[end] < target) {
                start++;
            } else if (numbers[start] + numbers[end] > target) {
                end--;
            } else {
                return new int[]{start, end};
            }
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new Solution().twoSum(new int[]{1, 2, 4, 6, 10}, 8)));
        System.out.println(Arrays.toString(new Solution().twoSum(new int[]{2, 3, 4}, 6)));
        System.out.println(Arrays.toString(new Solution().twoSum(new int[]{-1, 0}, -1)));
    }
}
