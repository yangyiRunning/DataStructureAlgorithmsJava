package ds.hashmap.leetcode242;

import java.util.HashMap;
import java.util.Map;

/**
 * 有效的字母异位词
 * LeetCode 242 https://leetcode-cn.com/problems/valid-anagram/
 *
 * @author yangyi 2021年01月06日01:00:33
 */
public class Solution {

    public boolean isAnagram(String s, String t) {
        HashMap<Integer, Integer> record = new HashMap<>(26);
        char[] sChars = s.toCharArray();
        for (int i = 0; i < sChars.length; i++) {
            record.put(sChars[i] - 'a', record.getOrDefault(sChars[i] - 'a', 0) + 1);
        }
        char[] tChars = t.toCharArray();
        for (int i = 0; i < tChars.length; i++) {
            record.put(tChars[i] - 'a', record.getOrDefault(tChars[i] - 'a', 0) - 1);
        }
        for (Map.Entry<Integer, Integer> integerIntegerEntry : record.entrySet()) {
            if (integerIntegerEntry.getValue() != 0) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().isAnagram("anagram", "nagaram"));
        System.out.println(new Solution().isAnagram("rat", "car"));
    }
}
