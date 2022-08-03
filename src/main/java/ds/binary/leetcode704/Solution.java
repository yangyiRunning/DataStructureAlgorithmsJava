package ds.binary.leetcode704;

/**
 * 二分查找
 * 二分查找的3个模板  https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/07/29/template_diagram.png
 * LeetCode 704. https://leetcode.cn/problems/binary-search/
 *
 * @author yangyi 2022年07月12日12:11:28
 */
public class Solution {

    public int search(int[] nums, int target) {
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
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().search(new int[]{-1, 0, 3, 5, 9, 12}, 9));
        System.out.println(new Solution().search(new int[]{-1, 0, 3, 5, 9, 12}, 2));
    }
}
