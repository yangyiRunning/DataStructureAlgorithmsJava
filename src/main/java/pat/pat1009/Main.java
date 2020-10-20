package pat.pat1009;

import java.util.Scanner;

/**
 * 1009 说反话 (20分)
 * <p>
 * 题目描述: https://pintia.cn/problem-sets/994805260223102976/problems/994805314941992960
 *
 * @author yangyi
 */
public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String content = scanner.nextLine();
        String[] words = content.split(" ");
        for (int i = words.length - 1; i >= 0; i--) {
            if (i == 0) {
                System.out.println(words[i]);
            } else {
                System.out.print(words[i] + " ");
            }
        }
    }
}
