package ds.pointer.leetcode287;

/**
 * 寻找重复数
 * LeetCode 287 https://leetcode-cn.com/problems/find-the-duplicate-number/
 *
 * @author yangyi 2020年12月16日17:20:37
 */
public class Solution {

    public int findDuplicate(int[] nums) {
        int slow = 0;
        int fast = 0;
        slow = nums[slow];
        fast = nums[nums[fast]];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[nums[fast]];
        }
        int pre1 = 0;
        int pre2 = slow;
        while (pre1 != pre2) {
            pre1 = nums[pre1];
            pre2 = nums[pre2];
        }
        return pre1;
    }

    public static void main(String[] args) {
        int[] res1 = new int[]{1, 3, 4, 2, 2};
        int[] res2 = new int[]{3, 1, 3, 4, 2};
        Solution findDuplicate = new Solution();
        System.out.println(findDuplicate.findDuplicate(res1));
        System.out.println(findDuplicate.findDuplicate(res2));
    }
}
