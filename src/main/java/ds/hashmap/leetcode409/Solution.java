package ds.hashmap.leetcode409;

import java.util.HashSet;

/**
 * 409. 最长回文串
 * https://leetcode.cn/problems/longest-palindrome/description/
 *
 * @author yangyi 2023年09月03日22:38:14
 */
class Solution {

    public int longestPalindrome(String s) {
        HashSet<Character> set = new HashSet<>();
        for (int i = 0; i < s.length(); i++) {
            if (set.contains(s.charAt(i))) {
                set.remove(s.charAt(i));
            } else {
                set.add(s.charAt(i));
            }
        }
        // 先全部减掉然后再挑一个构成回文串最中间的对称轴
        return set.size() == 0 ? s.length() : s.length() - set.size() + 1;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().longestPalindrome("abccccdd"));
        System.out.println(new Solution().longestPalindrome("a"));
        System.out.println(new Solution().longestPalindrome("aaaaaccc"));
    }
}
