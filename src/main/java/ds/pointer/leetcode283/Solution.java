package ds.pointer.leetcode283;

import java.util.Arrays;

/**
 * 移动零
 * LeetCode 283 https://leetcode-cn.com/problems/move-zeroes/
 *
 * @author yangyi 2019年03月02日19:04:14
 */
public class Solution {

    public void moveZeroes(int[] nums) {
        if (nums == null || nums.length == 0) {
            return;
        }
        int slow = 0, fast = 0;
        //0出现的次数
        int shows = 0;
        while (fast < nums.length) {
            if (nums[fast] != 0) {
                nums[slow] = nums[fast];
                slow++;
            } else {
                shows++;
            }
            fast++;
        }
        for (int i = 0; i < shows; i++) {
            nums[slow++] = 0;
        }
    }

    public static void main(String[] args) {
        Solution moveZeroes = new Solution();
        int[] res = new int[]{0, 1, 0, 3, 12};
        moveZeroes.moveZeroes(res);
        System.out.println(Arrays.toString(res));
    }

}
