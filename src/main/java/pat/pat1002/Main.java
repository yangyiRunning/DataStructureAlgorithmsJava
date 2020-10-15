package pat.pat1002;

import java.util.Scanner;

/**
 * 读入一个正整数 n，计算其各位数字之和，用汉语拼音写出和的每一位数字。
 * <p>
 * 输入格式：
 * <p>
 * 每个测试输入包含 1 个测试用例，即给出自然数 n 的值。这里保证 n 小于 10
 * ​100
 * ​​ 。
 * <p>
 * 输出格式：
 * <p>
 * 在一行内输出 n 的各位数字之和的每一位，拼音数字间有 1 空格，但一行中最后一个拼音数字后没有空格。
 * <p>
 * 输入样例：
 * <p>
 * 1234567890987654321123456789
 * 输出样例：
 * <p>
 * yi san wu
 */
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String n = scanner.nextLine();
        int sum = 0;
        for (int i = 0; i < n.toCharArray().length; i++) {
            sum += Integer.parseInt(String.valueOf(n.charAt(i)));
        }
        String[] str = {"ling", "yi", "er", "san", "si", "wu", "liu", "qi", "ba", "jiu"};
        char[] chars = String.valueOf(sum).toCharArray();
        for (int i = 0; i < chars.length; i++) {
            int index = chars[i] - '0';
            if (i == chars.length - 1) {
                System.out.println(str[index]);
            } else {
                System.out.print(str[index] + " ");
            }
        }
    }
}
