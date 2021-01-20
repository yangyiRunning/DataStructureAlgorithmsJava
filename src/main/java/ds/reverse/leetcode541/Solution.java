package ds.reverse.leetcode541;

/**
 * 反转字符串II
 * LeetCode 541 https://leetcode-cn.com/problems/reverse-string-ii/
 *
 * @author yangyi 2021年01月19日16:01:41
 */
public class Solution {

    public String reverseStr(String s, int k) {
        char[] chars = s.toCharArray();
        for (int i = 0; i < chars.length; i += (2 * k)) {
            if (i + k < chars.length) {
                reverseString(chars, i, i + k - 1);
                continue;
            }
            reverseString(chars, i, chars.length - 1);
        }
        return new String(chars);
    }

    public char[] reverseString(char[] s, int start, int end) {
        if (s == null) {
            return new char[]{};
        }
        while (start < end) {
            char temp = s[start];
            s[start] = s[end];
            s[end] = temp;
            start++;
            end--;
        }
        return s;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().reverseStr("abcdefg", 2));
        System.out.println(new Solution().reverseString("abcdefg".toCharArray(), 0, "abcdefg".length() - 1));
    }
}
