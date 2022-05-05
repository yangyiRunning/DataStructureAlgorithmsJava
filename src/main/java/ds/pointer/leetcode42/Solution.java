package ds.pointer.leetcode42;

/**
 * 接雨水
 * LeetCode 42 https://leetcode-cn.com/problems/trapping-rain-water/
 *
 * @author yangyi 2022年05月05日23:31:02
 */
public class Solution {

    /**
     * 左右指针两边高度的最大值中的较小的那个 - 当前高度 = 当前接水量
     */
    public int trap(int[] height) {
        int result = 0, start = 0, end = height.length - 1;
        int startMax = 0, endMax = 0;
        while (start < end) {
            startMax = Math.max(startMax, height[start]);
            endMax = Math.max(endMax, height[end]);
            if (height[start] < height[end]) {
                result += Math.min(startMax, endMax) - height[start];
                start++;
            } else {
                result += Math.min(startMax, endMax) - height[end];
                end--;
            }
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().trap(new int[]{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}));
        System.out.println(new Solution().trap(new int[]{4, 2, 0, 3, 2, 5}));
    }
}
