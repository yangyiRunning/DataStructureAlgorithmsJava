package ds.binary.leetcode153;

/**
 * 寻找旋转排序数组中的最小值
 * LeetCode 153. https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/
 *
 * @author yangyi 2022年07月12日18:29:48
 */
public class Solution {

    public int findMin(int[] nums) {
        int start = 0, end = nums.length - 1;
        while (start < end) {
            int middle = start + (end - start) / 2;
            if (nums[middle] < nums[end]) {
                end = middle;
            } else if (nums[middle] > nums[end]) {
                start = middle + 1;
            }
        }
        if (start == end) {
            return nums[start];
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().findMin(new int[]{3, 4, 5, 1, 2}));
        System.out.println(new Solution().findMin(new int[]{4, 5, 6, 7, 0, 1, 2}));
        System.out.println(new Solution().findMin(new int[]{11, 13, 15, 17}));
    }
}
