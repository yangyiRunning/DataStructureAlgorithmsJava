package ds.sliding;

import java.util.HashMap;
import java.util.Map;

/**
 * 最小覆盖子串
 * LeetCode https://leetcode-cn.com/problems/minimum-window-substring/
 *
 * @author yangyi 2020年12月14日16:16:55
 */
public class MinWindow {

    public String minWindow(String s, String t) {
        Map<Character, Integer> window = new HashMap<>();
        Map<Character, Integer> need = new HashMap<>();
        for (char c : t.toCharArray()) {
            need.put(c, need.getOrDefault(c, 0) + 1);
        }
        //valid变量表示窗口中满足need条件的字符个数
        int left = 0, right = 0, valid = 0;
        int start = 0, length = Integer.MAX_VALUE;
        char[] chars = s.toCharArray();
        while (right < chars.length) {
            char c = chars[right];
            right++;
            if (need.containsKey(c)) {
                window.put(c, window.getOrDefault(c, 0) + 1);
                if (window.get(c).equals(need.get(c))) {
                    valid++;
                }
            }

            while (valid == need.size()) {
                if (right - left < length) {
                    start = left;
                    length = right - left;
                }
                char deleted = chars[left];
                left++;
                if (need.containsKey(deleted)) {
                    if (window.get(deleted).equals(need.get(deleted))) {
                        valid--;
                    }
                    window.put(deleted, window.getOrDefault(deleted, 0) - 1);
                }
            }
        }
        return length == Integer.MAX_VALUE ? "" : s.substring(start, start + length);
    }

    public static void main(String[] args) {
        MinWindow minWindow = new MinWindow();
        System.out.println(minWindow.minWindow("ADOBECODEBANC", "ABC"));
        System.out.println(minWindow.minWindow("EBBANCF", "ABC"));
    }

}
