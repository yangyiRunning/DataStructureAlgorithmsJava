package ds.pointer.targetofferII015;

import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * 字符串中的所有变位词
 * 剑指 Offer II 015  https://leetcode-cn.com/problems/VabMRr/
 *
 * @author yangyi 2022年02月25日19:06:17
 */
public class Solution {

    public List<Integer> findAnagrams(String s, String p) {
        if (s.length() < p.length()) {
            return new LinkedList<>();
        }
        List<Integer> result = new LinkedList<>();
        Map<Character, Integer> charToNums = new HashMap<>();
        for (int i = 0; i < p.length(); i++) {
            charToNums.put(p.charAt(i), charToNums.getOrDefault(p.charAt(i), 0) + 1);
            charToNums.put(s.charAt(i), charToNums.getOrDefault(s.charAt(i), 0) - 1);
        }
        if (allZero(charToNums)) {
            result.add(0);
        }
        for (int i = p.length(); i < s.length(); i++) {
            charToNums.put(s.charAt(i), charToNums.getOrDefault(s.charAt(i), 0) - 1);
            charToNums.put(s.charAt(i - p.length()), charToNums.getOrDefault(s.charAt(i - p.length()), 0) + 1);
            if (allZero(charToNums)) {
                result.add(i - p.length() + 1);
            }
        }
        return result;
    }

    private boolean allZero(Map<Character, Integer> charToNums) {
        for (Map.Entry<Character, Integer> characterIntegerEntry : charToNums.entrySet()) {
            if (characterIntegerEntry.getValue() != 0) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new Solution().findAnagrams("cbaebabacd", "abc").toArray()));
        System.out.println(Arrays.toString(new Solution().findAnagrams("abab", "ab").toArray()));
    }
}
