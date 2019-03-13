package ds;

/**
 * 位1的个数
 * <p>
 * 编写一个函数，输入是一个无符号整数，返回其二进制表达式中数字位数为 ‘1’ 的个数（也被称为汉明重量）。
 * <p>
 * <p>
 * <p>
 * 示例 1：
 * <p>
 * 输入：00000000000000000000000000001011
 * 输出：3
 * 解释：输入的二进制串 00000000000000000000000000001011 中，共有三位为 '1'。
 * 示例 2：
 * <p>
 * 输入：00000000000000000000000010000000
 * 输出：1
 * 解释：输入的二进制串 00000000000000000000000010000000 中，共有一位为 '1'。
 * 示例 3：
 * <p>
 * 输入：11111111111111111111111111111101
 * 输出：31
 * 解释：输入的二进制串 11111111111111111111111111111101 中，共有 31 位为 '1'。
 * <p>
 * <p>
 * 提示：
 * <p>
 * 请注意，在某些语言（如 Java）中，没有无符号整数类型。在这种情况下，输入和输出都将被指定为有符号整数类型，并且不应影响您的实现，因为无论整数是有符号的还是无符号的，其内部的二进制表示形式都是相同的。
 * 在 Java 中，编译器使用二进制补码记法来表示有符号整数。因此，在上面的 示例 3 中，输入表示有符号整数 -3。
 *
 * @author yangyi 2019年02月01日17:47:47
 */
public class HammingWeight {

    public int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            count++;
            //不断打掉最后一位的1，直到打成0为止，每打掉一位，计一个数，最后统计出来的就是二进制数中1的个数
            n = n & (n - 1);
        }
        return count;
    }

    public static void main(String[] args) {
        int a = 0b00000000000000000000000000001011;
        int b = 0b00000000000000000000000010000000;
        int c = 0b11111111111111111111111111111101;
        HammingWeight hammingWeight = new HammingWeight();
        System.out.println(String.valueOf(a) + "中1的个数为:" + hammingWeight.hammingWeight(a));
        System.out.println(String.valueOf(b) + "中1的个数为:" + hammingWeight.hammingWeight(b));
        System.out.println(String.valueOf(c) + "中1的个数为:" + hammingWeight.hammingWeight(c));
    }
}
