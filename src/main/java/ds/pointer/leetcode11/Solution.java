package ds.pointer.leetcode11;

/**
 * 盛最多水的容器
 * LeetCode 11 https://leetcode-cn.com/problems/container-with-most-water/
 *
 * @author yangyi 2022年05月05日22:47:18
 */
public class Solution {

    public int maxArea(int[] height) {
        int result = 0, start = 0, end = height.length - 1;
        while (start < end) {
            int area = Math.min(height[start], height[end]) * (end - start);
            result = Math.max(result, area);
            //矮的边向内移动，因为整体的盛水面积是由矮的边所决定的
            if (height[start] < height[end]) {
                start++;
            } else {
                end--;
            }
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().maxArea(new int[]{1, 8, 6, 2, 5, 4, 8, 3, 7}));
        System.out.println(new Solution().maxArea(new int[]{1, 1}));
    }
}
