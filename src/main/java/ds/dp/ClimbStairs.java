package ds.dp;

/**
 * 爬楼梯
 * <p>
 * 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
 * <p>
 * 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
 * <p>
 * 注意：给定 n 是一个正整数。
 * <p>
 * 示例 1：
 * <p>
 * 输入： 2
 * 输出： 2
 * 解释： 有两种方法可以爬到楼顶。
 * 1.  1 阶 + 1 阶
 * 2.  2 阶
 * 示例 2：
 * <p>
 * 输入： 3
 * 输出： 3
 * 解释： 有三种方法可以爬到楼顶。
 * 1.  1 阶 + 1 阶 + 1 阶
 * 2.  1 阶 + 2 阶
 * 3.  2 阶 + 1 阶
 *
 * @author yangyi 2019年01月31日23:18:22
 */
public class ClimbStairs {

    public int climbStairs(int n) {
        if (n == 0 || n == 1 || n == 2) {
            return n;
        }
        int all = 0;
        int oneStep = 2;
        int twoStep = 1;
        for (int i = 2; i <= n; i++) {
            all = oneStep + twoStep;
            twoStep = oneStep;
            oneStep = all;
        }
        return all;
    }

    public int climbStairs2(int n) {
        if (n == 0 || n == 1 || n == 2) {
            return n;
        }
        int[] res = new int[n + 1];
        res[0] = 1;
        res[1] = 1;
        for (int i = 2; i <= n; i++) {
            res[i] = res[i - 1] + res[i - 2];
        }
        return res[n];
    }

    public static void main(String[] args) {
        ClimbStairs climbStairs = new ClimbStairs();
        int input2 = 2;
        int input3 = 3;
        System.out.println("输入" + input2 + "的结果为:" + climbStairs.climbStairs(input2));
        System.out.println("输入" + input3 + "的结果为:" + climbStairs.climbStairs2(input3));
    }

}
