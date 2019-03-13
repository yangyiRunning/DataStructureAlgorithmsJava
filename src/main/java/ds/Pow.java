package ds;

import java.util.Arrays;

/**
 * 实现 pow(x, n) ，即计算 x 的 n 次幂函数。
 * <p>
 * 示例 1:
 * <p>
 * 输入: 2.00000, 10
 * 输出: 1024.00000
 * 示例 2:
 * <p>
 * 输入: 2.10000, 3
 * 输出: 9.26100
 * 示例 3:
 * <p>
 * 输入: 2.00000, -2
 * 输出: 0.25000
 * 解释: 2-2 = 1/22 = 1/4 = 0.25
 * 说明:
 * <p>
 * -100.0 < x < 100.0
 * n 是 32 位有符号整数，其数值范围是 [−231, 231 − 1] 。
 *
 * @author yangyi 2019年01月26日17:52:03
 */
public class Pow {

    /**
     * 求x的n平方 (手动实现，不允许调用Math类库中的平方API)
     */
    public double myPow(double x, int n) {
        //注意边界和特殊用例，参看d和e数组
        if (n < 0) {
            if (n == Integer.MIN_VALUE) {
                return myPow(x, n + 1) / x;
            }
            return 1 / pow(x, -n);
        } else if (n > 0) {
            return pow(x, n);
        } else {
            return 1;
        }
    }

    public double pow(double x, int n) {
        double result;
        double half = myPow(x, n / 2);
        if (n % 2 == 0) {
            //如果为偶数次方，一半乘以另一半就是结果
            result = half * half;
        } else {
            //如果是奇数次方，中点前的一半乘以中点后的一半乘以中间留下的值
            result = half * half * x;
        }
        return result;
    }

    public static void main(String[] args) {
        double[] a = {2.00000, 10};
        double[] b = {2.10000, 3};
        double[] c = {2.00000, -2};
        double[] d = {2.00000, -2147483648};
        double[] e = {1.00000, -2147483648};
        Pow pow = new Pow();
        System.out.println(Arrays.toString(a) + "的计算结果为:" + pow.myPow(a[0], (int) a[1]));
        System.out.println(Arrays.toString(b) + "的计算结果为:" + pow.myPow(b[0], (int) b[1]));
        System.out.println(Arrays.toString(c) + "的计算结果为:" + pow.myPow(c[0], (int) c[1]));
        System.out.println(Arrays.toString(d) + "的计算结果为:" + pow.myPow(d[0], (int) d[1]));
        System.out.println(Arrays.toString(e) + "的计算结果为:" + pow.myPow(e[0], (int) e[1]));
    }
}
