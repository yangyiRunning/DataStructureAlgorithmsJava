package ds.pointer;

import java.util.Arrays;

/**
 * 两数之和 II - 输入有序数组
 * LeetCode 167 https://leetcode-cn.com/problems/two-sum-ii-input-array-is-sorted/
 *
 * @author yangyi 2020年12月14日11:52:36
 */
public class TwoSumII {

    public int[] twoSum(int[] numbers, int target) {
        int start = 0;
        int end = numbers.length - 1;
        while (start < end) {
            int sum = numbers[start] + numbers[end];
            if (sum == target) {
                return new int[]{start + 1, end + 1};
            } else if (sum < target) {
                start++;
            } else if (sum > target) {
                end--;
            }
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        int[] a = {2, 7, 11, 15};
        TwoSumII twoSumII = new TwoSumII();
        System.out.println(Arrays.toString(a) + "数组中和为9对应的数的索引为:" + Arrays.toString(twoSumII.twoSum(a, 9)));
    }
}
