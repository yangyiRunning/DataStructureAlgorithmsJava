package ds;

import java.util.Arrays;

/**
 * 加一
 * <p>
 * 给定一个由整数组成的非空数组所表示的非负整数，在该数的基础上加一。
 * <p>
 * 最高位数字存放在数组的首位， 数组中每个元素只存储一个数字。
 * <p>
 * 你可以假设除了整数 0 之外，这个整数不会以零开头。
 * <p>
 * 示例 1:
 * <p>
 * 输入: [1,2,3]
 * 输出: [1,2,4]
 * 解释: 输入数组表示数字 123。
 * 示例 2:
 * <p>
 * 输入: [4,3,2,1]
 * 输出: [4,3,2,2]
 * 解释: 输入数组表示数字 4321。
 *
 * @author yangyi 2019年02月09日14:40:23
 */
public class PlusOne {

    /**
     * 核心为反向迭代器
     */
    public int[] plusOne(int[] digits) {
        if (digits == null || digits.length == 0) {
            return new int[]{1};
        }

        for (int i = digits.length - 1; i >= 0; i--) {
            if (digits[i] + 1 == 10) {
                digits[i] = 0;
            } else {
                digits[i]++;
                //如果+1后不满10，一定要记得跳出循环，否则每一位都会加1了
                break;
            }
        }

        //最高位是0，说明最高位原来是9，现在为0说明进了1位
        if (digits[0] == 0) {
            int[] result = new int[digits.length + 1];
            result[0] = 1;
            System.arraycopy(digits, 0, result, 1, digits.length);
            return result;
        }

        return digits;
    }

    public static void main(String[] args) {
        int[] input = new int[]{1, 2, 3, 4};
        PlusOne plusOne = new PlusOne();
        int[] result = plusOne.plusOne(input);
        System.out.println(Arrays.toString(result));
    }
}
