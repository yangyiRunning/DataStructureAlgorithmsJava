package pat.pat1011;

import java.util.Scanner;

/**
 * 1011 A+B 和 C
 * <p>
 * 给定区间 [−2
 * ​31
 * ​​ ,2
 * ​31
 * ​​ ] 内的 3 个整数 A、B 和 C，请判断 A+B 是否大于 C。
 * <p>
 * 输入格式：
 * <p>
 * 输入第 1 行给出正整数 T (≤10)，是测试用例的个数。随后给出 T 组测试用例，每组占一行，顺序给出 A、B 和 C。整数间以空格分隔。
 * <p>
 * 输出格式：
 * <p>
 * 对每组测试用例，在一行中输出 Case #X: true 如果 A+B>C，否则输出 Case #X: false，其中 X 是测试用例的编号（从 1 开始）。
 * <p>
 * 输入样例：
 * <p>
 * 4
 * 1 2 3
 * 2 3 4
 * 2147483647 0 2147483646
 * 0 -2147483648 -2147483647
 * 输出样例：
 * <p>
 * Case #1: false
 * Case #2: true
 * Case #3: true
 * Case #4: false
 *
 * @author yangyi 2020年10月16日16:32:56
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
