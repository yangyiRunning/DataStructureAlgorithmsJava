package pat.pat1011;

import java.util.Scanner;

/**
 * 1011 A+B 和 C (15分)
 * <p>
 * 题目描述: https://pintia.cn/problem-sets/994805260223102976/problems/994805312417021952
 *
 * @author yangyi
 */
public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        long[] A = new long[n];
        long[] B = new long[n];
        long[] C = new long[n];
        for (int i = 0; i < n; i++) {
            A[i] = scanner.nextLong();
            B[i] = scanner.nextLong();
            C[i] = scanner.nextLong();
        }
        for (int i = 0; i < n; i++) {
            System.out.println("Case #" + (i + 1) + ": " + (A[i] + B[i] > C[i]));
        }
    }
}
