package ds.pointer.targetofferII014;

import java.util.HashMap;
import java.util.Map;

/**
 * 字符串中的变位词
 * 剑指 Offer II 014  https://leetcode-cn.com/problems/MPnaiL/
 *
 * @author yangyi 2022年02月25日17:53:03
 */
public class Solution {

    public boolean checkInclusion(String s1, String s2) {
        if (s2.length() < s1.length()) {
            return false;
        }
        Map<Character, Integer> charToNums = new HashMap<>();
        for (int i = 0; i < s1.length(); i++) {
            charToNums.put(s1.charAt(i), charToNums.getOrDefault(s1.charAt(i), 0) + 1);
            charToNums.put(s2.charAt(i), charToNums.getOrDefault(s2.charAt(i), 0) - 1);
        }
        if (allZero(charToNums)) {
            return true;
        }
        //第2个for循环中的下标i相当于第2个指针，指向子字符串的最后一个字符。第1个指针指向下标为i-s1.length()的位置。
        // 两个指针之间的子字符串的长度一直是字符串s1的长度
        for (int i = s1.length(); i < s2.length(); i++) {
            if (charToNums.containsKey(s2.charAt(i))) {
                charToNums.put(s2.charAt(i), charToNums.getOrDefault(s2.charAt(i), 0) - 1);
            }
            if (charToNums.containsKey(s2.charAt(i - s1.length()))) {
                charToNums.put(s2.charAt(i - s1.length()), charToNums.getOrDefault(s2.charAt(i - s1.length()), 0) + 1);
            }
            if (allZero(charToNums)) {
                return true;
            }
        }
        return false;
    }

    private boolean allZero(Map<Character, Integer> charToNums) {
        for (Map.Entry<Character, Integer> kv : charToNums.entrySet()) {
            if (kv.getValue() != 0) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().checkInclusion("ab", "eidbaooo"));
        System.out.println(new Solution().checkInclusion("ab", "eidboaoo"));
        System.out.println(new Solution().checkInclusion("ab", "a"));
    }
}
