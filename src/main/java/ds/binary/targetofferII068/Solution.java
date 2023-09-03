package ds.binary.targetofferII068;

/**
 * 查找插入位置
 * 剑指 Offer II 068. https://leetcode.cn/problems/N6YdxV/
 *
 * @author yangyi 2021年01月15日16:35:55
 */
public class Solution {

    public int searchInsert(int[] nums, int target) {
        int start = 0, end = nums.length - 1;
        while (start <= end) {
            int middle = start + (end - start) / 2;
            if (nums[middle] < target) {
                start = middle + 1;
            } else if (nums[middle] > target) {
                end = middle - 1;
            } else {
                return middle;
            }
        }
        return end + 1;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().searchInsert(new int[]{1, 3, 5, 6}, 5));
        System.out.println(new Solution().searchInsert(new int[]{1, 3, 5, 6}, 2));
        System.out.println(new Solution().searchInsert(new int[]{1, 3, 5, 6}, 7));
        System.out.println(new Solution().searchInsert(new int[]{1, 3, 5, 6}, 0));
    }
}
