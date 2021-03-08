package ds.dp.leetcode746;

/**
 * 使用最小花费爬楼梯
 * LeetCode 746 https://leetcode-cn.com/problems/min-cost-climbing-stairs/
 *
 * @author yangyi 2021年03月08日17:48:17
 */
public class Solution {

    public int minCostClimbingStairs(int[] cost) {
        int[] dp = new int[cost.length];
        dp[0] = cost[0];
        dp[1] = cost[1];
        for (int i = 2; i < cost.length; i++) {
            //地推公式: 每次走一步或者每次都两步中的最小花费 + 当前这一步的花费
            dp[i] = Math.min(dp[i - 1], dp[i - 2]) + cost[i];
        }
        //最后登顶的一步不用花费，直接从倒数第一步和倒数第二步中选取花费最小的值
        return Math.min(dp[cost.length - 1], dp[cost.length - 2]);
    }

    public static void main(String[] args) {
        System.out.println(new Solution().minCostClimbingStairs(new int[]{10, 15, 20}));
        System.out.println(new Solution().minCostClimbingStairs(new int[]{1, 100, 1, 1, 1, 100, 1, 1, 100, 1}));
    }

}
