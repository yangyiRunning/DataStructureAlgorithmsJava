package ds.stack.leetcode20;

import java.util.Stack;

/**
 * 有效的括号
 * LeetCode 20 https://leetcode-cn.com/problems/valid-parentheses/
 *
 * @author yangyi 2021年07月09日19:20:06
 */
public class Solution {

    public boolean isValid(String s) {
        Stack<String> stack = new Stack<>();
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') {
                stack.push(")");
            } else if (s.charAt(i) == ('{')) {
                stack.push("}");
            } else if (s.charAt(i) == ('[')) {
                stack.push("]");
            } else if (stack.isEmpty()) {
                return false;
            } else if (!stack.peek().equals(String.valueOf(s.charAt(i)))) {
                return false;
            }else {
                stack.pop();
            }
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        String one = "()";
        String two = "()[]";
        String three = "([)]";
        String four = "(((([]))";
        String five = "]][[";

        Solution solution = new Solution();
        System.out.println(one + (solution.isValid(one) ? "有效" : "无效"));
        System.out.println(two + (solution.isValid(two) ? "有效" : "无效"));
        System.out.println(three + (solution.isValid(three) ? "有效" : "无效"));
        System.out.println(four + (solution.isValid(four) ? "有效" : "无效"));
        System.out.println(five + (solution.isValid(five) ? "有效" : "无效"));
    }
}
