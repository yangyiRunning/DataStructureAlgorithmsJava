package ds.dp.leetcode63;

/**
 * 不同路径 II
 * LeetCode 63 https://leetcode-cn.com/problems/unique-paths-ii/
 *
 * @author yangyi 2021年03月08日22:04:16
 */
public class Solution {

    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        int m = obstacleGrid.length;
        int n = obstacleGrid[0].length;
        int[][] dp = new int[m][n];
        for (int i = 0; i < m && obstacleGrid[i][0] == 0; i++) {
            dp[i][0] = 1;
        }
        for (int j = 0; j < n && obstacleGrid[0][j] == 0; j++) {
            dp[0][j] = 1;
        }
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (obstacleGrid[i][j] == 1) {
                    continue;
                }
                dp[i][j] = dp[i][j - 1] + dp[i - 1][j];
            }
        }
        return dp[m - 1][n - 1];
    }

    public static void main(String[] args) {
        int[][] a1 = {{0, 0, 0}, {0, 1, 0}, {0, 0, 0}};
        int[][] a2 = {{0, 1}, {0, 0}};
        System.out.println(new Solution().uniquePathsWithObstacles(a1));
        System.out.println(new Solution().uniquePathsWithObstacles(a2));
    }
}
