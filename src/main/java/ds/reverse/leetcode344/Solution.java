package ds.reverse.leetcode344;

import java.util.Arrays;

/**
 * 反转字符串
 * LeetCode 344 https://leetcode-cn.com/problems/reverse-string/
 *
 * @author yangyi 2019年02月10日22:12:46
 */
public class Solution {

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
        Solution reverseString = new Solution();
        reverseString.a = new char[]{'h', 'e', 'l', 'l', 'o'};
        reverseString.b = new char[]{'H', 'a', 'n', 'n', 'a', 'h'};
        reverseString.reverseString(reverseString.a);
        reverseString.reverseString(reverseString.b);
        System.out.println(Arrays.toString(reverseString.a));
        System.out.println(Arrays.toString(reverseString.b));
    }

}
