package ds.string;

/**
 * 最后一个单词的长度
 * <p>
 * 给定一个仅包含大小写字母和空格 ' ' 的字符串，返回其最后一个单词的长度。
 * <p>
 * 如果不存在最后一个单词，请返回 0 。
 * <p>
 * 说明：一个单词是指由字母组成，但不包含任何空格的字符串。
 * <p>
 * 示例:
 * <p>
 * 输入: "Hello World"
 * 输出: 5
 *
 * @author yangyi 2019年02月16日22:58:41
 */
public class LengthOfLastWord {

    public int lengthOfLastWord(String s) {
        String[] strings = s.split(" ");
        if (strings.length == 0) {
            return 0;
        }
        return strings[strings.length - 1].length();
    }

    public static void main(String[] args) {
        String a = "Hello World";
        String b = "";
        String c = " ";
        LengthOfLastWord lengthOfLastWord = new LengthOfLastWord();
        System.out.println(lengthOfLastWord.lengthOfLastWord(a));
        System.out.println(lengthOfLastWord.lengthOfLastWord(b));
        System.out.println(lengthOfLastWord.lengthOfLastWord(c));
    }
}
