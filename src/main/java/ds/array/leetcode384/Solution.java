package ds.array.leetcode384;

import java.util.Arrays;

/**
 * 打乱数组
 * LeetCode 384 https://leetcode-cn.com/problems/shuffle-an-array/
 *
 * @author yangyi 2021年01月18日18:08:28
 */
public class Solution {

    private int[] origin;
    private int[] result;

    public Solution(int[] nums) {
        this.origin = nums;
        this.result = Arrays.copyOf(nums, nums.length);
    }

    public int[] reset() {
        return origin;
    }

    /**
     * 交换数组，数组长度随机
     */
    public int[] shuffle() {
        int len = (int) (Math.random() * result.length);
        for (int i = 0; i < result.length / 2; i++) {
            int temp = result[i];
            result[i] = result[len];
            result[len] = temp;
        }
        return result;
    }

    public static void main(String[] args) {
        // 以数字集合 1, 2 和 3 初始化数组。
        int[] nums = {1, 2, 3};
        Solution solution = new Solution(nums);

        // 打乱数组 [1,2,3] 并返回结果。任何 [1,2,3]的排列返回的概率应该相同。
        System.out.println(Arrays.toString(solution.shuffle()));

        // 重设数组到它的初始状态[1,2,3]。
        System.out.println(Arrays.toString(solution.reset()));

        // 随机返回数组[1,2,3]打乱后的结果。
        System.out.println(Arrays.toString(solution.shuffle()));
    }
}
