package ds.binary.leetcode34;

import java.util.Arrays;

/**
 * 在排序数组中查找元素的第一个和最后一个位置
 * LeetCode 34. https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/
 *
 * @author yangyi 2022年07月12日18:50:04
 */
public class Solution {

    public int[] searchRange(int[] nums, int target) {
        if (nums == null || nums.length == 0) {
            return new int[]{-1, -1};
        }
        int left = 0, right = nums.length - 1;
        while (left + 1 < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) {
                if (nums[left] == nums[right]) {
                    return new int[]{left, right};
                } else if (nums[left] != target) {
                    left++;
                } else if (nums[right] != target) {
                    right--;
                }
            } else if (nums[mid] < target) {
                left = mid;
            } else {
                right = mid;
            }
        }
        if (nums[left] == target && nums[right] == target) {
            return new int[]{left, right};
        }
        if (nums[right] == target) {
            return new int[]{right, right};
        }
        if (nums[left] == target) {
            return new int[]{left, left};
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new Solution().searchRange(new int[]{5, 7, 7, 8, 8, 10}, 8)));
        System.out.println(Arrays.toString(new Solution().searchRange(new int[]{5, 7, 7, 8, 8, 10}, 6)));
        System.out.println(Arrays.toString(new Solution().searchRange(new int[]{}, 0)));
    }
}
