package pat.pat1006;

import java.util.Scanner;

/**
 * 1006 换个格式输出整数
 * <p>
 * 让我们用字母 B 来表示“百”、字母 S 表示“十”，用 12...n 来表示不为零的个位数字 n（<10），换个格式来输出任一个不超过 3 位的正整数。例如 234 应该被输出为 BBSSS1234，因为它有 2 个“百”、3 个“十”、以及个位的 4。
 * <p>
 * 输入格式：
 * <p>
 * 每个测试输入包含 1 个测试用例，给出正整数 n（<1000）。
 * <p>
 * 输出格式：
 * <p>
 * 每个测试用例的输出占一行，用规定的格式输出 n。
 * <p>
 * 输入样例 1：
 * <p>
 * 234
 * 输出样例 1：
 * <p>
 * BBSSS1234
 * 输入样例 2：
 * <p>
 * 23
 * 输出样例 2：
 * <p>
 * SS123
 *
 * @author yangyi 2020年10月16日00:22:45
 */
public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        //题设约定输出的正整数 n < 1000，即为一个三位数
        int n = scanner.nextInt();
        int b = n / 100;
        int s = n / 10 % 10;
        int g = n % 10;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < b; i++) {
            sb.append("B");
        }
        for (int i = 0; i < s; i++) {
            sb.append("S");
        }
        for (int i = 0; i < g; i++) {
            sb.append(i + 1);
        }
        System.out.println(sb.toString());
    }
}
