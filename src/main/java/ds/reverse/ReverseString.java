package ds.reverse;

import java.util.Arrays;

/**
 * 反转字符串
 * <p>
 * 编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 char[] 的形式给出。
 * <p>
 * 不要给另外的数组分配额外的空间，你必须原地修改输入数组、使用 O(1) 的额外空间解决这一问题。
 * <p>
 * 你可以假设数组中的所有字符都是 ASCII 码表中的可打印字符。
 * <p>
 * <p>
 * <p>
 * 示例 1：
 * <p>
 * 输入：['h','e','l','l','o']
 * 输出：['o','l','l','e','h']
 * 示例 2：
 * <p>
 * 输入：['H','a','n','n','a','h']
 * 输出：['h','a','n','n','a','H']
 *
 * @author yangyi 2019年02月10日22:12:46
 */
public class ReverseString {

    private char[] a;
    private char[] b;

    public void reverseString(char[] s) {
        if (s == null) {
            return;
        }
        int mid = s.length >> 1;
        int end = s.length - 1;
        for (int i = 0; i < mid; i++) {
            char temp = s[i];
            s[i] = s[end - i];
            s[end - i] = temp;
        }
    }

    public static void main(String[] args) {
        ReverseString reverseString = new ReverseString();
        reverseString.a = new char[]{'h', 'e', 'l', 'l', 'o'};
        reverseString.b = new char[]{'H', 'a', 'n', 'n', 'a', 'h'};
        reverseString.reverseString(reverseString.a);
        reverseString.reverseString(reverseString.b);
        System.out.println(Arrays.toString(reverseString.a));
        System.out.println(Arrays.toString(reverseString.b));
    }

}
