package ds.sliding;

import java.util.HashMap;
import java.util.Map;

/**
 * 字符串的排列
 * LeetCode 567 https://leetcode-cn.com/problems/permutation-in-string/
 *
 * @author yangyi 2020年12月15日18:01:04
 */
public class CheckInclusion {

    public boolean checkInclusion(String s1, String s2) {
        Map<Character, Integer> window = new HashMap<>();
        Map<Character, Integer> need = new HashMap<>();
        for (char c : s1.toCharArray()) {
            need.put(c, need.getOrDefault(c, 0) + 1);
        }
        int left = 0, right = 0;
        int valid = 0;
        char[] s2Array = s2.toCharArray();
        while (right < s2.length()) {
            char c = s2Array[right];
            right++;
            if (need.containsKey(c)) {
                window.put(c, window.getOrDefault(c, 0) + 1);
                if (window.getOrDefault(c, 0).equals(need.getOrDefault(c, 0))) {
                    valid++;
                }
            }

            while (right - left >= s1.length()) {
                if (valid == need.size()) {
                    return true;
                }
                char d = s2Array[left];
                left++;
                if (need.containsKey(d)) {
                    if (window.getOrDefault(d, 0).equals(need.getOrDefault(d, 0))) {
                        valid--;
                    }
                    window.put(d, window.getOrDefault(d, 0) - 1);
                }
            }
        }
        return false;
    }

    public static void main(String[] args) {
        String s1 = "ab";
        String s2 = "eidbaooo";
        CheckInclusion checkInclusion = new CheckInclusion();
        System.out.println("s1是否是s2的子串: " + checkInclusion.checkInclusion(s1, s2));
        String s3 = "ab";
        String s4 = "eidboaoo";
        System.out.println("s1是否是s2的子串: " + checkInclusion.checkInclusion(s3, s4));
    }
}
