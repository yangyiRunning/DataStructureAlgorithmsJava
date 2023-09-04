package ds.array.leetcode238;

import java.util.Arrays;

/**
 * 238. 除自身以外数组的乘积
 * https://leetcode.cn/problems/product-of-array-except-self/
 *
 * @author yangyi 2023年09月04日17:31:30
 */
public class Solution {

    public int[] productExceptSelf(int[] nums) {
        int left = 1;
        int right = 1;
        int len = nums.length;
        int[] output = new int[len];
        for (int i = 0; i < len; i++) {
            output[i] = left;
            left *= nums[i];
        }
        for (int j = len - 1; j >= 0; j--) {
            output[j] *= right;
            right *= nums[j];
        }
        return output;
    }

    public static void main(String[] args) {
        int[] a = {1,2,3,4};
        Solution productExceptSelf = new Solution();
        System.out.println(Arrays.toString(productExceptSelf.productExceptSelf(a)));
    }
}
