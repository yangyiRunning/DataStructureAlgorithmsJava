package ds.array.leetcode334;

/**
 * 334. 递增的三元子序列
 * https://leetcode.cn/problems/increasing-triplet-subsequence/
 *
 * @author yangyi 2019年03月02日22:45:15
 */
public class Solution {

    public boolean increasingTriplet(int[] nums) {
        int min = Integer.MAX_VALUE;
        int middle = Integer.MAX_VALUE;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] <= min) {
                min = nums[i];
            } else if (nums[i] <= middle) {
                middle = nums[i];
            } else {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        int[] a = {1,2,3,4,5};
        int[] b = {5,4,3,2,1};
        Solution increasingTriplet = new Solution();
        System.out.println(increasingTriplet.increasingTriplet(a));
        System.out.println(increasingTriplet.increasingTriplet(b));
    }
}
