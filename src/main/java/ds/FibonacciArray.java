package ds;

/**
 * 斐波拉切数列
 *
 * @author yangyi 2019年01月26日16:53:29
 */
public class FibonacciArray {

    public int fibonacciArray(int n) {
        if (n == 0 || n == 1) {
            return n;
        }
        return fibonacciArray(n - 1) + fibonacciArray(n - 2);
    }

    public int fibonacciArrayForeach(int n) {
        if (n <= 0) {
            return 0;
        }
        if (n == 1) {
            return 1;
        }
        int pre = 1;
        int prepre = 0;
        int sum = 0;
        for (int i = 2; i <= n; i++) {
            sum = pre + prepre;
            prepre = pre;
            pre = sum;
        }
        return sum;
    }

    public static void main(String[] args) {
        FibonacciArray fibonacciArray = new FibonacciArray();
        int n = 10;
        System.out.println("斐波拉切数列位置为" + n + "处所对应的结果为:" + fibonacciArray.fibonacciArray(n));
        System.out.println("斐波拉切数列位置为" + n + "处所对应的结果为:" + fibonacciArray.fibonacciArrayForeach(n));
    }
}
