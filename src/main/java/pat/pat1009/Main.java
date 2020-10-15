package pat.pat1009;

import java.util.Scanner;

/**
 * 1009 说反话
 * <p>
 * 给定一句英语，要求你编写程序，将句中所有单词的顺序颠倒输出。
 * <p>
 * 输入格式：
 * <p>
 * 测试输入包含一个测试用例，在一行内给出总长度不超过 80 的字符串。字符串由若干单词和若干空格组成，其中单词是由英文字母（大小写有区分）组成的字符串，单词之间用 1 个空格分开，输入保证句子末尾没有多余的空格。
 * <p>
 * 输出格式：
 * <p>
 * 每个测试用例的输出占一行，输出倒序后的句子。
 * <p>
 * 输入样例：
 * <p>
 * Hello World Here I Come
 * 输出样例：
 * <p>
 * Come I Here World Hello
 *
 * @author yangyi 2020年10月16日01:35:11
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
