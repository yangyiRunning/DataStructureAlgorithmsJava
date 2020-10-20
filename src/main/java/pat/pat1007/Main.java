package pat.pat1007;

import java.util.Scanner;

/**
 * 1007 素数对猜想 (20分)
 * <p>
 * 题目描述: https://pintia.cn/problem-sets/994805260223102976/problems/994805317546655744
 *
 * @author yangyi
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
