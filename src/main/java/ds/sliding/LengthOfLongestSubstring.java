package ds.sliding;

import java.util.HashMap;
import java.util.Map;

/**
 * 无重复字符的最长子串
 * LeetCode 3 https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/
 *
 * @author yangyi 2020年12月16日11:57:47
 */
public class LengthOfLongestSubstring {

    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> window = new HashMap<>();
        int left = 0, right = 0;
        int result = 0;
        char[] sArray = s.toCharArray();
        while (right < s.length()) {
            char c = sArray[right];
            right++;
            window.put(c, window.getOrDefault(c, 0) + 1);
            while (window.getOrDefault(c, 0) > 1) {
                char d = sArray[left];
                left++;
                window.put(d, window.getOrDefault(d, 0) - 1);
            }
            result = Math.max(result, right - left);
        }
        return result;
    }

    public static void main(String[] args) {
        LengthOfLongestSubstring lengthOfLongestSubstring = new LengthOfLongestSubstring();
        System.out.println("abcabcbb的无重复字符的最长子串的长度: " + lengthOfLongestSubstring.lengthOfLongestSubstring("abcabcbb"));
        System.out.println("bbbbb的无重复字符的最长子串的长度: " + lengthOfLongestSubstring.lengthOfLongestSubstring("bbbbb"));
        System.out.println("pwwkew的无重复字符的最长子串的长度: " + lengthOfLongestSubstring.lengthOfLongestSubstring("pwwkew"));
    }
}
