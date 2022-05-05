package ds.pointer.leetcode80;

/**
 * 删除有序数组中的重复项 II
 * LeetCode 80 https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array-ii/
 *
 * @author yangyi 2022年05月06日00:23:37
 */
public class Solution {

    /**
     * 起始位置相当于一个最多出现几次的【游标卡尺】
     */
    public int removeDuplicates(int[] nums) {
        if (nums.length <= 2) {
            return nums.length;
        }
        int fast = 2, slow = 2;
        while (fast < nums.length) {
            if (nums[slow - 2] != nums[fast]) {
                nums[slow] = nums[fast];
                slow++;
            }
            fast++;
        }
        return slow;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().removeDuplicates(new int[]{1, 1, 1, 2, 2, 3}));
        System.out.println(new Solution().removeDuplicates(new int[]{0, 0, 1, 1, 1, 1, 2, 3, 3}));
    }
}
