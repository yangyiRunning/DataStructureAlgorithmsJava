package ds;

import java.util.Arrays;

/**
 * 删除排序数组中的重复项
 * LeetCode 26 https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array/
 *
 * @author yangyi 2020年12月16日15:35:00
 */
public class RemoveDuplicates {

    public int removeDuplicates(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        int slow = 0, fast = 0;
        while (fast < nums.length) {
            if (nums[slow] != nums[fast]) {
                slow++;
                nums[slow] = nums[fast];
            }
            fast++;
        }
        return slow + 1;
    }

    public static void main(String[] args) {
        int[] a = {0, 0, 1, 1, 1, 2, 2, 3, 3, 4};
        RemoveDuplicates removeDuplicates = new RemoveDuplicates();
        System.out.println(Arrays.toString(a) + "去掉重复元素的长度为:" + removeDuplicates.removeDuplicates(a));
    }
}
