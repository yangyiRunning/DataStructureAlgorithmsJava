package ds.dp.leetcode70;

/**
 * 爬楼梯
 * LeetCode 70 https://leetcode-cn.com/problems/climbing-stairs/
 *
 * @author yangyi 2021年03月08日17:09:06
 */
public class Solution {

    /**
     * 提前准备好一个dp的数组来装所有结果，空间复杂度为O(n)
     */
    public int climbStairs(int n) {
        if (n <= 1) {
            return n;
        }
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }

    /**
     * 只记录其中的3个数，最后输出最后一个计算得到的结果，空间复杂度为O(1)
     */
    public int climbStairs2(int n) {
        if (n <= 1) {
            return n;
        }
        int[] dp = new int[3];
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            int sum = dp[1] + dp[2];
            dp[1] = dp[2];
            dp[2] = sum;
        }
        return dp[2];
    }

    public static void main(String[] args) {
        Solution climbStairs = new Solution();
        int input2 = 2;
        int input3 = 3;
        System.out.println("输入" + input2 + "的结果为:" + climbStairs.climbStairs(input2));
        System.out.println("输入" + input3 + "的结果为:" + climbStairs.climbStairs2(input3));
    }

}
