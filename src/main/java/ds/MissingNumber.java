package ds;

import java.util.Arrays;

/**
 * 缺失数字
 * <p>
 * 给定一个包含 0, 1, 2, ..., n 中 n 个数的序列，找出 0 .. n 中没有出现在序列中的那个数。
 * <p>
 * 示例 1:
 * <p>
 * 输入: [3,0,1]
 * 输出: 2
 * 示例 2:
 * <p>
 * 输入: [9,6,4,2,3,5,7,0,1]
 * 输出: 8
 * 说明:
 * 你的算法应具有线性时间复杂度。你能否仅使用额外常数空间来实现?
 * <p>
 *
 * @author yangyi 2019年02月09日16:49:29
 */
public class MissingNumber {

    /**
     * 输入[3,0,1] 就相当于求 {3,3,0,1,0,1,2}的总异或值
     * 输入[9,6,4,2,3,5,7,0,1]相当于求{9,9,6,4,2,3,5,7,0,1,0,1,2,3,4,5,6,7,8}
     */
    public int missingNumber(int[] nums) {
        //n个数
        int result = nums.length;
        for (int i = 0; i < nums.length; i++) {
            result ^= nums[i];
            result ^= i;
        }
        return result;
    }

    public static void main(String[] args) {
        int[] a = {3, 0, 1};
        int[] b = {9, 6, 4, 2, 3, 5, 7, 0, 1};
        MissingNumber missingNumber = new MissingNumber();
        System.out.println(Arrays.toString(a) + "中缺失的数字" + missingNumber.missingNumber(a));
        System.out.println(Arrays.toString(b) + "中缺失的数字" + missingNumber.missingNumber(b));
    }
}
