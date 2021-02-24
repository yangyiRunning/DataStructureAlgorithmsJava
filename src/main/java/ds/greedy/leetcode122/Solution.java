package ds.greedy.leetcode122;

/**
 * 买卖股票的最佳时机 II
 * LeetCode 122 https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/
 *
 * @author yangyi 2021年02月22日15:21:00
 */
public class Solution {

    public int maxProfit(int[] prices) {
        int max = 0;
        for (int i = 1; i < prices.length; i++) {
            max += Math.max(prices[i] - prices[i - 1], 0);
        }
        return max;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().maxProfit(new int[]{7, 1, 5, 3, 6, 4}));
        System.out.println(new Solution().maxProfit(new int[]{1, 2, 3, 4, 5}));
        System.out.println(new Solution().maxProfit(new int[]{7, 6, 4, 3, 1}));
    }
}
