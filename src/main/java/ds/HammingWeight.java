package ds;

/**
 * 位1的个数
 * LeetCode 191 https://leetcode-cn.com/problems/number-of-1-bits/
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
        System.out.println(a + "中1的个数为:" + hammingWeight.hammingWeight(a));
        System.out.println(b + "中1的个数为:" + hammingWeight.hammingWeight(b));
        System.out.println(c + "中1的个数为:" + hammingWeight.hammingWeight(c));
    }
}
