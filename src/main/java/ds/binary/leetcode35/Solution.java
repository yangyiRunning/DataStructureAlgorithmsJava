package ds.binary.leetcode35;

/**
 * 搜索插入位置
 * LeetCode 35 https://leetcode-cn.com/problems/search-insert-position/
 *
 * @author yangyi 2021年01月15日16:35:55
 */
public class Solution {

    /**
     * 左右闭区间解法1
     */
    public int searchInsert(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;
        while (left <= right) {
            int middle = left + ((right - left) >> 1);
            if (nums[middle] > target) {
                right = middle - 1;
            } else if (nums[middle] < target) {
                left = middle + 1;
            } else {
                return middle;
            }
        }
        return right + 1;
    }

    /**
     * 左闭右开区间解法2
     */
    public int searchInsert2(int[] nums, int target) {
        int left = 0;
        int right = nums.length;
        while (left < right) {
            int middle = left + ((right - left) >> 1);
            if (nums[middle] > target) {
                right = middle;
            } else if (nums[middle] < target) {
                left = middle + 1;
            } else {
                return middle;
            }
        }
        return right;
    }

    public static void main(String[] args) {
        //左右闭区间解法1
        System.out.println(new Solution().searchInsert(new int[]{1, 3, 5, 6}, 5));
        System.out.println(new Solution().searchInsert(new int[]{1, 3, 5, 6}, 2));
        System.out.println(new Solution().searchInsert(new int[]{1, 3, 5, 6}, 7));
        System.out.println(new Solution().searchInsert(new int[]{1, 3, 5, 6}, 0));

        System.out.println();

        //左闭右开区间解法2
        System.out.println(new Solution().searchInsert2(new int[]{1, 3, 5, 6}, 5));
        System.out.println(new Solution().searchInsert2(new int[]{1, 3, 5, 6}, 2));
        System.out.println(new Solution().searchInsert2(new int[]{1, 3, 5, 6}, 7));
        System.out.println(new Solution().searchInsert2(new int[]{1, 3, 5, 6}, 0));
    }

}
