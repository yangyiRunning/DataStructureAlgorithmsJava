package ds.hashmap.targetofferII012;

/**
 * 左右两边子数组的和相等
 * 剑指 Offer II 012 https://leetcode-cn.com/problems/tvdfij/
 *
 * @author yangyi 2022年02月25日16:27:59
 */
public class Solution {

    public int pivotIndex(int[] nums) {
        int total = 0;
        for (int num : nums) {
            total += num;
        }
        //前i-1个数字之和
        int sum = 0;
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i];
            if (sum - nums[i] == total - sum) {
                return i;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().pivotIndex(new int[]{1, 7, 3, 6, 5, 6}));
        System.out.println(new Solution().pivotIndex(new int[]{1, 2, 3}));
        System.out.println(new Solution().pivotIndex(new int[]{2, 1, -1}));
    }
}
