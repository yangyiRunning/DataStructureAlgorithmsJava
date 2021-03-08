package ds.dp.leetcode509;

/**
 * 斐波那契数
 * LeetCode 509 https://leetcode-cn.com/problems/fibonacci-number/
 *
 * @author yangyi 2021年03月08日16:45:49
 */
public class Solution {
    public int fib(int n) {
        if (n <= 1) {
            return n;
        }
        int[] dp = new int[2];
        dp[0] = 0;
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            int sum = dp[0] + dp[1];
            dp[0] = dp[1];
            dp[1] = sum;
        }
        return dp[1];
    }

    public static void main(String[] args) {
        System.out.println(new Solution().fib(10));
    }
}
