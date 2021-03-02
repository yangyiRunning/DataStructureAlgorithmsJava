package ds.reverse.leetcode557;

/**
 * 反转字符串中的单词 III
 * LeetCode 557 https://leetcode-cn.com/problems/reverse-words-in-a-string-iii/
 *
 * @author yangyi 2021年03月02日23:40:21
 */
public class Solution {

    public String reverseWords(String s) {
        String[] strings = s.split(" ");
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < strings.length; i++) {
            char[] chars = reverse(strings[i].toCharArray());
            stringBuilder.append(chars).append(" ");
        }
        return stringBuilder.substring(0, stringBuilder.length() - 1);
    }

    public char[] reverse(char[] chars) {
        if (chars == null) {
            return new char[]{};
        }
        int mid = chars.length >> 1;
        int end = chars.length - 1;
        for (int i = 0; i < mid; i++) {
            char temp = chars[i];
            chars[i] = chars[end - i];
            chars[end - i] = temp;
        }
        return chars;
    }

    public static void main(String[] args) {
        String s = "Let's take LeetCode contest";
        Solution reverseWordsIII = new Solution();
        String result = reverseWordsIII.reverseWords(s);
        System.out.println(result);
    }
}
