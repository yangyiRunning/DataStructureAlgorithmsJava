package ds;

import java.util.Arrays;

/**
 * 比特位计数
 * <p>
 * 给定一个非负整数 num。对于 0 ≤ i ≤ num 范围中的每个数字 i ，计算其二进制数中的 1 的数目并将它们作为数组返回。
 * <p>
 * 示例 1:
 * <p>
 * 输入: 2
 * 输出: [0,1,1]
 * 示例 2:
 * <p>
 * 输入: 5
 * 输出: [0,1,1,2,1,2]
 *
 * @author yangyi 2019年02月01日18:25:38
 */
public class CountBits {

    public int[] countBits(int num) {
        int[] bits = new int[num + 1];
        for (int i = 1; i <= num; i++) {
            bits[i] += bits[i & (i - 1)] + 1;
        }
        return bits;
    }

    public static void main(String[] args) {
        CountBits countBits = new CountBits();
        System.out.println(Arrays.toString(countBits.countBits(2)));
        System.out.println(Arrays.toString(countBits.countBits(5)));
    }

}
