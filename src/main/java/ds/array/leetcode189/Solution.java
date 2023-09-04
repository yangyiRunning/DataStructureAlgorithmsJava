package ds.array.leetcode189;

import java.util.Arrays;

/**
 * 189. 轮转数组
 * https://leetcode.cn/problems/rotate-array/
 * 总共分为3步:
 * 1. 数组整个旋转一遍
 * 2. 以k为界，k之前的元素旋转
 * 3. 以k为界，k后面的元素旋转
 *
 * @author yangyi 2023年09月04日15:53:56
 */
public class Solution {

    private static int[] a = {1, 2, 3, 4, 5, 6, 7};
    private static int[] b = {-1, -100, 3, 99};

    public void rotate(int[] nums, int k) {
        int len = nums.length;
        k %= len;
        reserve(nums, 0, len - 1);
        reserve(nums, 0, k - 1);
        reserve(nums, k, len - 1);
    }

    public void reserve(int[] nums, int start, int end) {
        while (start < end) {
            int temp = nums[start];
            nums[start++] = nums[end];
            nums[end--] = temp;
        }
    }

    public static void main(String[] args) {
        Solution rotateArray = new Solution();
        rotateArray.rotate(a, 3);
        rotateArray.rotate(b, 2);
        System.out.println(Arrays.toString(a));
        System.out.println(Arrays.toString(b));
    }
}
