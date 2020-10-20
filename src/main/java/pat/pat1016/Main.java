package pat.pat1016;

import java.util.Scanner;

/**
 * 1016 部分A+B (15分)
 * <p>
 * 题目描述: https://pintia.cn/problem-sets/994805260223102976/problems/994805306310115328
 * <p>
 * 注意: 使用字符串作为中间变量时会间歇性出现运行超时
 *
 * @author yangyi
 */
public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String a = scanner.next();
        String d_a = scanner.next();
        String b = scanner.next();
        String d_b = scanner.next();

        String sb = "";
        for (int i = 0; i < a.length(); i++) {
            if (a.charAt(i) == d_a.charAt(0)) {
                sb += a.charAt(i);
            }
        }
        String sbb = "";
        for (int i = 0; i < b.length(); i++) {
            if (b.charAt(i) == d_b.charAt(0)) {
                sbb += b.charAt(i);
            }
        }

        long one = "".equals(sb) ? 0 : Long.parseLong(sb);
        long two = "".equals(sbb) ? 0 : Long.parseLong(sbb);
        long result = one + two;
        System.out.print(result);
    }
}
