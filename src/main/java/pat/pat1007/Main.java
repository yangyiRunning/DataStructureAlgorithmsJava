package pat.pat1007;

import java.util.Scanner;

/**
 * 1007 素数对猜想
 * <p>
 * 让我们定义d
 * ​n
 * ​​ 为：d
 * ​n
 * ​​ =p
 * ​n+1
 * ​​ −p
 * ​n
 * ​​ ，其中p
 * ​i
 * ​​ 是第i个素数。显然有d
 * ​1
 * ​​ =1，且对于n>1有d
 * ​n
 * ​​ 是偶数。“素数对猜想”认为“存在无穷多对相邻且差为2的素数”。
 * <p>
 * 现给定任意正整数N(<10
 * ​5
 * ​​ )，请计算不超过N的满足猜想的素数对的个数。
 * <p>
 * 输入格式:
 * <p>
 * 输入在一行给出正整数N。
 * <p>
 * 输出格式:
 * <p>
 * 在一行中输出不超过N的满足猜想的素数对的个数。
 * <p>
 * 输入样例:
 * <p>
 * 20
 * 输出样例:
 * <p>
 * 4
 *
 * @author yangyi 2020年10月16日00:43:41
 */
public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int temp = Integer.MIN_VALUE;
        int count = 0;
        for (int i = 1; i <= n; i++) {
            if (isPrime(i)) {
                if (i - temp == 2) {
                    count++;
                }
                temp = i;
            }
        }
        System.out.println(count);
    }

    /**
     * 只有1和它本身可以整除的数为素数
     */
    static boolean isPrime(int a) {
        if (a == 1) {
            return false;
        }
        if (a % 2 == 0 && a != 2) {
            return false;
        }
        for (int i = 3; i <= Math.sqrt(a); i += 2) {
            if (a % i == 0) {
                return false;
            }
        }
        return true;
    }

}
