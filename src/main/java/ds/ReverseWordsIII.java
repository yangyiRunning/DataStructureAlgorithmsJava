package ds;

/**
 * 反转字符串中的单词 III
 * <p>
 * 给定一个字符串，你需要反转字符串中每个单词的字符顺序，同时仍保留空格和单词的初始顺序。
 * <p>
 * 示例 1:
 * <p>
 * 输入: "Let's take LeetCode contest"
 * 输出: "s'teL ekat edoCteeL tsetnoc"
 * 注意：在字符串中，每个单词由单个空格分隔，并且字符串中不会有任何额外的空格。
 *
 * @author yangyi 2019年02月10日23:15:01
 */
public class ReverseWordsIII {

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
        ReverseWordsIII reverseWordsIII = new ReverseWordsIII();
        String result = reverseWordsIII.reverseWords(s);
        System.out.println(result);
    }
}
