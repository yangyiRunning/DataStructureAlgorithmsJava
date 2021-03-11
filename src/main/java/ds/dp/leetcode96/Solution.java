package ds.dp.leetcode96;

/**
 * 不同的二叉搜索树
 * LeetCode 96 https://leetcode-cn.com/problems/unique-binary-search-trees/
 *
 * @author yangyi 2021年03月08日22:38:36
 */
public class Solution {

    public int numTrees(int n) {
        int[] dp = new int[n + 1];
        dp[0] = 1;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                dp[i] += dp[j - 1] * dp[i - j];
            }
        }
        return dp[n];
    }

    public static void main(String[] args) {
        System.out.println(new Solution().numTrees(3));
    }
}
