package ds;

/**
 * 实现 int sqrt(int x) 函数。
 * <p>
 * 计算并返回 x 的平方根，其中 x 是非负整数。
 * <p>
 * 由于返回类型是整数，结果只保留整数的部分，小数部分将被舍去。
 * <p>
 * 示例 1:
 * <p>
 * 输入: 4
 * 输出: 2
 * 示例 2:
 * <p>
 * 输入: 8
 * 输出: 2
 * 说明: 8 的平方根是 2.82842...,
 * 由于返回类型是整数，小数部分将被舍去。
 *
 * @author yangyi 2019年01月29日22:12:30
 */
public class MySqrt {

    public int mySqrt(int x) {
        if (x == 0 || x == 1) {
            return x;
        }
        int start = 0;
        int end = x;
        int result = 0;
        while (start <= end) {
            int m = start + ((end - start) >> 1);
            if (m < x / m) {
                start = m + 1;
                //因为了开平方根取整数，有可能真正的结果比实际的算术结果小，所以要及时记录且返回
                result = m;
            } else if (m > x / m) {
                end = m - 1;
            } else {
                return m;
            }
        }
        return result;
    }

    public static void main(String[] args) {
        MySqrt mySqrt = new MySqrt();
        int x = 8;
        System.out.println(x + "的二次根号为:" + mySqrt.mySqrt(x));
    }

}
