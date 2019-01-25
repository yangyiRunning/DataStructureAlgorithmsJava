package ds;

import java.util.Arrays;

/**
 * 有效的异位词
 * <p>
 * 给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的一个字母异位词。
 * <p>
 * 示例 1:
 * <p>
 * 输入: s = "anagram", t = "nagaram"
 * 输出: true
 * 示例 2:
 * <p>
 * 输入: s = "rat", t = "car"
 * 输出: false
 * 说明:
 * 你可以假设字符串只包含小写字母。
 *
 * @author yangyi 2019年01月25日14:29:20
 */
public class ValidAnagram {

    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }
        char[] sArray = s.toCharArray();
        char[] tArray = t.toCharArray();
        Arrays.sort(sArray);
        Arrays.sort(tArray);
        return Arrays.equals(sArray, tArray);
    }

    public static void main(String[] args) {
        ValidAnagram validAnagram = new ValidAnagram();
        if (validAnagram.isAnagram("anagram", "nagaram")) {
            System.out.println("有效的异位词");
        } else {
            System.out.println("无效");
        }
        if (validAnagram.isAnagram("rat", "car")) {
            System.out.println("有效的异位词");
        } else {
            System.out.println("无效");
        }
    }
}
