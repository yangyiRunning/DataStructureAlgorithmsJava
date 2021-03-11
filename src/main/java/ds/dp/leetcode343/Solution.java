package ds.dp.leetcode343;

/**
 * 整数拆分
 * LeetCode 343 https://leetcode-cn.com/problems/integer-break/
 *
 * @author yangyi 2021年03月10日10:45:09
 */
public class Solution {

    /**
     * 解释:
     * 定义: 当前正整数i，对应的最大乘积为dp[i]
     * j和i-j正好为针对正整数i的拆分，因为两者相加正好为i
     */
    public int integerBreak(int n) {
        int[] dp = new int[n + 1];
        dp[2] = 1;
        for (int i = 3; i <= n; i++) {
            for (int j = 1; j <= i - 1; j++) {
                dp[i] = Math.max(dp[i], Math.max(j * (i - j), j * dp[i - j]));
            }
        }
        return dp[n];
    }

    public static void main(String[] args) {
        System.out.println(new Solution().integerBreak(2));
        System.out.println(new Solution().integerBreak(10));
    }
}
