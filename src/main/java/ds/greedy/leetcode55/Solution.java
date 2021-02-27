package ds.greedy.leetcode55;

/**
 * 跳跃游戏
 * LeetCode 55 https://leetcode-cn.com/problems/jump-game/
 *
 * @author yangyi 2021年02月27日23:40:48
 */
public class Solution {

    public boolean canJump(int[] nums) {
        if (nums.length == 1) {
            return true;
        }
        int cover = 0;
        for (int i = 0; i <= cover; i++) {
            cover = Math.max(cover, i + nums[i]);
            if (cover >= nums.length - 1) {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().canJump(new int[]{2, 3, 1, 1, 4}));
        System.out.println(new Solution().canJump(new int[]{3, 2, 1, 0, 4}));
        System.out.println(new Solution().canJump(new int[]{2, 0, 0}));
    }

}
