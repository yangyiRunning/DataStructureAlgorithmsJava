package ds.pointer.leetcode167;

import java.util.Arrays;

/**
 * 两数之和 II - 输入有序数组
 * LeetCode 167 https://leetcode-cn.com/problems/two-sum-ii-input-array-is-sorted/
 *
 * @author yangyi 2022年04月24日18:47:00
 */
public class Solution {

    public int[] twoSum(int[] numbers, int target) {
        int start = 0;
        int end = numbers.length - 1;
        while (start < end) {
            int sum = numbers[start] + numbers[end];
            if (sum < target) {
                start++;
            } else if (sum > target) {
                end--;
            } else if (sum == target) {
                return new int[]{start + 1, end + 1};
            }
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        int[] a = {2, 7, 11, 15};
        Solution twoSum2 = new Solution();
        System.out.println(Arrays.toString(a) + "数组中和为9对应的数的索引为:" + Arrays.toString(twoSum2.twoSum(a, 9)));
    }
}
