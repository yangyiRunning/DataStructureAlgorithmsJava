package ds.dp.leetcode60;

/**
 * 不同路径
 * LeetCode 60 https://leetcode-cn.com/problems/unique-paths/
 *
 * @author yangyi 2021年03月08日18:40:34
 */
public class Solution {

    public int uniquePaths(int m, int n) {
        int[][] dp = new int[m][n];
        for (int i = 0; i < m; i++) {
            dp[i][0] = 1;
        }
        for (int j = 0; j < n; j++) {
            dp[0][j] = 1;
        }
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = dp[i][j - 1] + dp[i - 1][j];
            }
        }
        return dp[m - 1][n - 1];
    }

    public static void main(String[] args) {
        System.out.println(new Solution().uniquePaths(3, 7));
        System.out.println(new Solution().uniquePaths(3, 2));
        System.out.println(new Solution().uniquePaths(7, 3));
        System.out.println(new Solution().uniquePaths(3, 3));
    }
}
