package ds.array.leetcode219;

/**
 * 219. 存在重复元素 II
 * https://leetcode.cn/problems/contains-duplicate-ii/description/
 *
 * @author yangyi 2023年09月04日18:03:26
 */
public class Solution {

    public boolean containsNearbyDuplicate(int[] nums, int k) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] == nums[j] && Math.abs(j - i) <= k) {
                    return true;
                }
            }
        }
        return false;
    }

    public static void main(String[] args) {
        int[] nums_1 = {1, 2, 3, 1};
        int[] nums_2 = {1, 0, 1, 1};
        int[] nums_3 = {1, 2, 3, 1, 2, 3};
        Solution containsNearbyDuplicate = new Solution();
        System.out.println(containsNearbyDuplicate.containsNearbyDuplicate(nums_1, 3));
        System.out.println(containsNearbyDuplicate.containsNearbyDuplicate(nums_2, 1));
        System.out.println(containsNearbyDuplicate.containsNearbyDuplicate(nums_3, 2));
    }
}
