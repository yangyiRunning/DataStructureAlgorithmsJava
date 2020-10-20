package pat.pat1014;

import java.util.Scanner;

/**
 * 1014 福尔摩斯的约会 (20分)
 * <p>
 * 题目描述: https://pintia.cn/problem-sets/994805260223102976/problems/994805308755394560
 *
 * @author yangyi
 */
public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String str1 = scanner.nextLine();
        String str2 = scanner.nextLine();
        String str3 = scanner.nextLine();
        String str4 = scanner.nextLine();
        String[] week = new String[]{"MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"};
        int size = Math.min(str1.length(), str2.length());
        //是否为第一个相等的字符
        boolean isFirst = false;
        for (int i = 0; i < size; i++) {
            boolean isSame = str1.charAt(i) == str2.charAt(i);
            if (!isFirst) {
                //第 1 对相同的大写英文字母
                if (isSame && !Character.isDigit(str1.charAt(i)) && str1.charAt(i) >= 'A' && str1.charAt(i) <= 'G') {
                    String weekOutput = week[str1.charAt(i) - 'A'];
                    System.out.print(weekOutput);
                    isFirst = true;
                }
            } else {
                //第 2 对相同的字符
                if (isSame) {
                    if (Character.isDigit(str1.charAt(i))) {
                        System.out.print(" 0" + str1.charAt(i) + ":");
                        break;
                    } else if (str1.charAt(i) >= 'A' && str1.charAt(i) <= 'N') {
                        int index = str1.charAt(i) - 'A' + 9 + 1;
                        System.out.print(" " + index + ":");
                        break;
                    }
                }
            }
        }

        int size2 = Math.min(str3.length(), str4.length());
        for (int i = 0; i < size2; i++) {
            boolean isSame3 = str3.charAt(i) == str4.charAt(i);
            //第 1 对相同的英文字母
            if (isSame3) {
                if (!Character.isDigit(str3.charAt(i))
                        && (str3.charAt(i) >= 'A' && str3.charAt(i) <= 'Z'
                        || str3.charAt(i) >= 'a' && str3.charAt(i) <= 'z')) {
                    if (i < 10) {
                        System.out.println("0" + i);
                    } else {
                        System.out.println(i);
                    }
                    break;
                }
            }
        }
    }
}
