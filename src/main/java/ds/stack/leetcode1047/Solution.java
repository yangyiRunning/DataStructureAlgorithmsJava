package ds.stack.leetcode1047;

import java.util.Stack;

/**
 * 删除字符串中的所有相邻重复项
 * LeetCode 1047 https://leetcode-cn.com/problems/remove-all-adjacent-duplicates-in-string/
 *
 * @author yangyi 2021年07月12日11:57:00
 */
public class Solution {

    public String removeDuplicates(String s) {
        Stack<Character> stack = new Stack<>();
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            if (stack.isEmpty() || stack.peek() != s.charAt(i)) {
                stack.push(s.charAt(i));
            } else {
                stack.pop();
            }
        }
        while (!stack.isEmpty()) {
            result.append(stack.pop());
        }
        return result.reverse().toString();
    }

    public static void main(String[] args) {
        System.out.println(new Solution().removeDuplicates("abbaca"));
    }
}
