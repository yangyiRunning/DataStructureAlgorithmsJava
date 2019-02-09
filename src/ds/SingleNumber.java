package ds;

import java.util.Arrays;

/**
 * 只出现一次的数字
 * <p>
 * 给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。
 * <p>
 * 说明：
 * <p>
 * 你的算法应该具有线性时间复杂度。 你可以不使用额外空间来实现吗？
 * <p>
 * 示例 1:
 * <p>
 * 输入: [2,2,1]
 * 输出: 1
 * 示例 2:
 * <p>
 * 输入: [4,1,2,1,2]
 * 输出: 4
 *
 * @author yangyi 2019年02月09日16:32:02
 */
public class SingleNumber {

    /**
     * 异或的特性：
     * <p>
     * 1.恒定律：A ^ 0 = A
     * 2.归零率：A ^ A = 0
     * 3.交换律：A ^ B = B ^ A
     * 4.结合律：(A ^ B) ^ C = A ^ (B ^ C)
     */
    public int singleNumber(int[] nums) {
        int result = 0;
        for (int i = 0; i < nums.length; i++) {
            result ^= nums[i];
        }
        return result;
    }

    public static void main(String[] args) {
        int[] a = {2, 2, 1};
        int[] b = {4, 1, 2, 1, 2};
        SingleNumber singleNumber = new SingleNumber();
        int res = singleNumber.singleNumber(a);
        int res2 = singleNumber.singleNumber(b);
        System.out.println(Arrays.toString(a) + "中只出现一次的数字为:" + res);
        System.out.println(Arrays.toString(b) + "中只出现一次的数字为:" + res2);
    }
}
