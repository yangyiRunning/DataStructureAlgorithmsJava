package ds.bit;

/**
 * 2的幂
 * LeetCode 231 https://leetcode-cn.com/problems/power-of-two/
 *
 * @author yangyi 2020年12月08日11:52:03
 */
public class IsPowerOfTwo {

    public boolean isPowerOfTwo(int n) {
        if (n <= 0) {
            return false;
        }
        return (n & (n - 1)) == 0;
    }

    public static void main(String[] args) {
        int a = 0b00000000000000000000000000001011;
        int b = 0b00000000000000000000000010000000;
        int c = 0b11111111111111111111111111111101;
        IsPowerOfTwo isPowerOfTwo = new IsPowerOfTwo();
        System.out.println(a + "是否为2的幂次" + isPowerOfTwo.isPowerOfTwo(a));
        System.out.println(b + "是否为2的幂次:" + isPowerOfTwo.isPowerOfTwo(b));
        System.out.println(c + "是否为2的幂次:" + isPowerOfTwo.isPowerOfTwo(c));
    }
}
