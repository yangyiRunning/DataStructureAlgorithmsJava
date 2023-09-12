package ds.dp.leetcode322;

/**
 * 322. 零钱兑换
 * https://leetcode.cn/problems/coin-change/description/
 *
 * @author yangyi 2023年09月13日00:54:39
 */
class Solution {

    public int coinChange(int[] coins, int amount) {
        if (amount == 0) {
            return 0;
        }
        int[] dp = new int[amount + 1];
        for (int i = 1; i <= amount; i++) {
            dp[i] = 999999;
            for (int coin : coins) {
                if (i - coin < 0) {
                    continue;
                }
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
        return dp[amount] == 999999 ? -1 : dp[amount];
    }

    public static void main(String[] args) {
        System.out.println(new Solution().coinChange(new int[]{1, 2, 5}, 11));
        System.out.println(new Solution().coinChange(new int[]{2}, 3));
        System.out.println(new Solution().coinChange(new int[]{1}, 0));
    }


}
