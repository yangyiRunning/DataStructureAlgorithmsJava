package ds.dp.leetcode64;

/**
 * 64. 最小路径和
 * https://leetcode.cn/problems/minimum-path-sum/description/?envType=study-plan-v2&envId=xiaohongshu-2023-fall-sprint
 *
 * @author yangyi 2023年09月03日21:36:30
 */
class Solution {

    public int minPathSum(int[][] grid) {
        int[][] dp = new int[grid.length][grid[0].length];
        for (int i = grid.length - 1; i >= 0; i--) {
            for (int j = grid[0].length - 1; j >= 0; j--) {
                if (i == grid.length - 1 && j != grid[0].length - 1) {
                    dp[i][j] = grid[i][j] + dp[i][j + 1];
                } else if (i != grid.length - 1 && j == grid[0].length - 1) {
                    dp[i][j] = grid[i][j] + dp[i + 1][j];
                } else if (i != grid.length - 1 && j != grid[0].length - 1) {
                    dp[i][j] = grid[i][j] + Math.min(dp[i][j + 1], dp[i + 1][j]);
                } else {
                    dp[i][j] = grid[i][j];
                }
            }
        }
        return dp[0][0];
    }

    public static void main(String[] args) {
        int[][] origin = {{1, 3, 1}, {1, 5, 1}, {4, 2, 1}};
        System.out.println(new Solution().minPathSum(origin));
    }
}
