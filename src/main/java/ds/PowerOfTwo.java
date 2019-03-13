package ds;

/**
 * 2的幂
 * <p>
 * 给定一个整数，编写一个函数来判断它是否是 2 的幂次方。
 * <p>
 * 示例 1:
 * <p>
 * 输入: 1
 * 输出: true
 * 解释: 20 = 1
 * 示例 2:
 * <p>
 * 输入: 16
 * 输出: true
 * 解释: 24 = 16
 * 示例 3:
 * <p>
 * 输入: 218
 * 输出: false
 *
 * @author yangyi 2019年02月01日18:04:15
 */
public class PowerOfTwo {

    public boolean isPowerOfTwo(int n) {
        boolean isPowerOfTwo = false;
        if (n < 0) {
            return false;
        }
        if (n != 0) {
            isPowerOfTwo = (n & (n - 1)) == 0;
        }
        return isPowerOfTwo;
    }

    public static void main(String[] args) {
        PowerOfTwo powerOfTwo = new PowerOfTwo();
        System.out.println(powerOfTwo.isPowerOfTwo(1));
        System.out.println(powerOfTwo.isPowerOfTwo(16));
        System.out.println(powerOfTwo.isPowerOfTwo(218));
    }
}
