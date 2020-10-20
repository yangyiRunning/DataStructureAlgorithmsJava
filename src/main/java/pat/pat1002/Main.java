package pat.pat1002;

import java.util.Scanner;

/**
 * 1002 写出这个数 (20分)
 * <p>
 * 题目描述: https://pintia.cn/problem-sets/994805260223102976/problems/994805324509200384
 *
 * @author yangyi
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
