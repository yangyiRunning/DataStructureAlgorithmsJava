package ds.hashmap.leetcode383;

import java.util.HashMap;

/**
 * 赎金信
 * LeetCode 383 https://leetcode-cn.com/problems/ransom-note/
 *
 * @author yangyi 2021年01月12日00:54:05
 */
public class Solution {

    public boolean canConstruct(String ransomNote, String magazine) {
        HashMap<Character, Integer> map = new HashMap<>();
        for (char c : magazine.toCharArray()) {
            map.put(c, map.getOrDefault(c, 0) + 1);
        }
        for (char c : ransomNote.toCharArray()) {
            map.put(c, map.getOrDefault(c, 0) - 1);
            if (map.getOrDefault(c, 0) < 0) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().canConstruct("a", "b"));
        System.out.println(new Solution().canConstruct("aa", "ab"));
        System.out.println(new Solution().canConstruct("aa", "aab"));
    }
}
