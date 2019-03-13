package ds;

/**
 * n的阶乘
 *
 * @author yangyi 2019年01月26日16:46:04
 */
public class Factorial {

    public int factorial(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        Factorial factorial = new Factorial();
        int n = 10;
        System.out.println(n + "的阶乘为:" + factorial.factorial(n));
    }
}
