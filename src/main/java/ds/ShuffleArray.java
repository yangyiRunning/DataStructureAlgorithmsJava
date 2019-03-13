package ds;

import java.util.Arrays;

/**
 * 打乱数组
 * <p>
 * <p>
 * <p>
 * <p>
 * 打乱一个没有重复元素的数组。
 * <p>
 * 示例:
 * <p>
 * // 以数字集合 1, 2 和 3 初始化数组。
 * int[] nums = {1,2,3};
 * Solution solution = new Solution(nums);
 * <p>
 * // 打乱数组 [1,2,3] 并返回结果。任何 [1,2,3]的排列返回的概率应该相同。
 * solution.shuffle();
 * <p>
 * // 重设数组到它的初始状态[1,2,3]。
 * solution.reset();
 * <p>
 * // 随机返回数组[1,2,3]打乱后的结果。
 * solution.shuffle();
 *
 * @author yangyi 2019年03月02日19:50:44
 */
public class ShuffleArray {

    private int[] origin;
    private int[] result;

    public ShuffleArray(int[] nums) {
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
        ShuffleArray solution = new ShuffleArray(nums);

        // 打乱数组 [1,2,3] 并返回结果。任何 [1,2,3]的排列返回的概率应该相同。
        System.out.println(Arrays.toString(solution.shuffle()));

        // 重设数组到它的初始状态[1,2,3]。
        System.out.println(Arrays.toString(solution.reset()));

        // 随机返回数组[1,2,3]打乱后的结果。
        System.out.println(Arrays.toString(solution.shuffle()));
    }
}
