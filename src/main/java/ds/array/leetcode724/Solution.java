package ds.array.leetcode724;

import java.util.Arrays;

/**
 * 724. 寻找数组的中心下标
 * https://leetcode.cn/problems/find-pivot-index/
 *
 * @author yangyi 2023年09月04日16:43:00
 */
public class Solution {

    public int pivotIndex(int[] nums) {
        int sum = 0;
        int leftSum = 0;
        int rightSum = 0;
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i];
        }
        for (int i = 0; i < nums.length; i++) {
            rightSum = sum - leftSum - nums[i];
            if (leftSum == rightSum) {
                return i;
            }
            leftSum += nums[i];
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] a = {1, 7, 3, 6, 5, 6};
        int[] b = {1, 2, 3};
        int[] c = {-1, -1, 0, 1, 0, -1};
        int[] d = {-1, -1, 0, 1, 1, 0};
        Solution pivotIndex = new Solution();
        System.out.println(Arrays.toString(a) + "的中心索引是:" + pivotIndex.pivotIndex(a));
        System.out.println(Arrays.toString(b) + "的中心索引是:" + pivotIndex.pivotIndex(b));
        System.out.println(Arrays.toString(c) + "的中心索引是:" + pivotIndex.pivotIndex(c));
        System.out.println(Arrays.toString(d) + "的中心索引是:" + pivotIndex.pivotIndex(d));
    }
}
