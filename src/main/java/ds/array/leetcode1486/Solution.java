package ds.array.leetcode1486;

/**
 * 数组异或操作
 * LeetCode 1486 https://leetcode-cn.com/problems/xor-operation-in-an-array/
 *
 * @author yangyi 2021年05月07日14:20:37
 */
public class Solution {

    public int xorOperation(int n, int start) {
        int result = 0;
        for (int i = 0; i < n; i++) {
            result ^= start + 2 * i;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().xorOperation(5, 0));
        System.out.println(new Solution().xorOperation(4, 3));
        System.out.println(new Solution().xorOperation(1, 7));
        System.out.println(new Solution().xorOperation(10, 5));
    }
}
