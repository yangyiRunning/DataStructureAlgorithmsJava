package ds.sliding;

import java.util.*;

/**
 * 找到字符串中所有字母异位词
 * LeetCode 438 https://leetcode-cn.com/problems/find-all-anagrams-in-a-string/
 *
 * @author yangyi 2020年12月15日18:29:09
 */
public class FindAnagrams {

    public List<Integer> findAnagrams(String s, String p) {
        Map<Character, Integer> window = new HashMap<>();
        Map<Character, Integer> need = new HashMap<>();
        char[] pArray = p.toCharArray();
        for (char c : pArray) {
            need.put(c, need.getOrDefault(c, 0) + 1);
        }
        int left = 0, right = 0;
        int valid = 0;
        List<Integer> result = new LinkedList<>();
        char[] sArray = s.toCharArray();
        while (right < s.length()) {
            char c = sArray[right];
            right++;
            if (need.containsKey(c)) {
                window.put(c, window.getOrDefault(c, 0) + 1);
                if (window.getOrDefault(c, 0).equals(need.getOrDefault(c, 0))) {
                    valid++;
                }
            }

            while (right - left >= p.length()) {
                if (valid == need.size()) {
                    result.add(left);
                }
                char d = sArray[left];
                left++;
                if (need.containsKey(d)) {
                    if (window.getOrDefault(d, 0).equals(need.getOrDefault(d, 0))) {
                        valid--;
                    }
                    window.put(d, window.getOrDefault(d, 0) - 1);
                }
            }
        }
        return result;
    }

    public static void main(String[] args) {
        FindAnagrams findAnagrams = new FindAnagrams();
        String s = "cbaebabacd";
        String p = "abc";
        List<Integer> result = findAnagrams.findAnagrams(s, p);
        System.out.println(Arrays.toString(result.toArray()));
        String s1 = "abab";
        String p1 = "ab";
        List<Integer> result2 = findAnagrams.findAnagrams(s1, p1);
        System.out.println(Arrays.toString(result2.toArray()));
    }
}
