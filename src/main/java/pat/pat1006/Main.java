package pat.pat1006;

import java.util.Scanner;

/**
 * 1006 换个格式输出整数 (15分)
 * <p>
 * 题目描述: https://pintia.cn/problem-sets/994805260223102976/problems/994805318855278592
 *
 * @author yangyi
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
