package ds.binary.leetcode33;

/**
 * 搜索旋转排序数组
 * LeetCode 33. https://leetcode.cn/problems/search-in-rotated-sorted-array/
 *
 * @author yangyi 2022年07月12日15:29:12
 */
public class Solution {

    public int search(int[] nums, int target) {
        int start = 0, end = nums.length - 1;
        if (end == 0) {
            return nums[end] == target ? end : -1;
        }
        while (start <= end) {
            int middle = start + (end - start) / 2;
            if (nums[middle] == target) {
                return middle;
            }
            if (nums[start] <= nums[middle]) {
                if (nums[start] <= target && target < nums[middle]) {
                    end = middle - 1;
                } else {
                    start = middle + 1;
                }
            } else if (nums[start] > nums[middle]) {
                if (nums[middle] < target && target <= nums[end]) {
                    start = middle + 1;
                } else {
                    end = middle - 1;
                }
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().search(new int[]{4, 5, 6, 7, 0, 1, 2}, 0));
        System.out.println(new Solution().search(new int[]{4, 5, 6, 7, 0, 1, 2}, 3));
        System.out.println(new Solution().search(new int[]{1}, 0));
        System.out.println(new Solution().search(new int[]{1}, 1));
        System.out.println(new Solution().search(new int[]{1, 3}, 2));
        System.out.println(new Solution().search(new int[]{3, 1}, 0));
        System.out.println(new Solution().search(new int[]{5, 1, 3}, 3));
    }
}
