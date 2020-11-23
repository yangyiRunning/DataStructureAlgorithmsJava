package ds.string;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 字符串中的第一个唯一字符
 * <p>
 * 给定一个字符串，找到它的第一个不重复的字符，并返回它的索引。如果不存在，则返回 -1。
 * <p>
 * 案例:
 * <p>
 * s = "leetcode"
 * 返回 0.
 * <p>
 * s = "loveleetcode",
 * 返回 2.
 * <p>
 * <p>
 * 注意事项：您可以假定该字符串只包含小写字母。
 *
 * @author yangyi 2019年02月17日21:32:44
 */
public class FirstUniqChar {

    public int firstUniqChar(String s) {
        Map<Character, Integer> map = new LinkedHashMap<>();
        for (int i = 0; i < s.length(); i++) {
            if (!map.containsKey(s.charAt(i))) {
                map.put(s.charAt(i), 1);
            } else {
                map.put(s.charAt(i), map.get(s.charAt(i)) + 1);
            }
        }
        for (int i = 0; i < s.length(); i++) {
            if (map.get(s.charAt(i)) == 1) {
                return i;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        String a = "leetcode";
        String b = "loveleetcode";
        FirstUniqChar firstUniqChar = new FirstUniqChar();
        System.out.println(firstUniqChar.firstUniqChar(a));
        System.out.println(firstUniqChar.firstUniqChar(b));
    }
}
