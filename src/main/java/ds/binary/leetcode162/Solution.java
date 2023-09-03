package ds.binary.leetcode162;

/**
 * 寻找峰值
 * 山脉数组的峰顶索引
 * 山峰数组的顶部
 * LeetCode 162. https://leetcode.cn/problems/find-peak-element/
 * LeetCode 852. https://leetcode.cn/problems/peak-index-in-a-mountain-array/
 * 剑指 Offer II 069.  https://leetcode.cn/problems/B1IidL/
 *
 * @author yangyi 2022年07月12日17:59:02
 */
public class Solution {

    public int findPeakElement(int[] nums) {
        int start = 0, end = nums.length - 1;
        while (start < end) {
            int middle = start + (end - start) / 2;
            if (nums[middle] > nums[middle + 1]) {
                end = middle;
            } else {
                start = middle + 1;
            }
        }
        if (start == end) {
            return start;
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().findPeakElement(new int[]{1, 2, 3, 1}));
        System.out.println(new Solution().findPeakElement(new int[]{1, 2, 1, 3, 5, 6, 4}));
    }
}
