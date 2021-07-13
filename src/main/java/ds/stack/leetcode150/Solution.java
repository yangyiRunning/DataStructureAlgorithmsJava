package ds.stack.leetcode150;

import java.util.Stack;

/**
 * 逆波兰表达式求值
 * LeetCode 150 https://leetcode-cn.com/problems/evaluate-reverse-polish-notation/
 *
 * @author yangyi 2021年07月12日14:19:21
 */
public class Solution {

    public int evalRPN(String[] tokens) {
        Stack<String> stack = new Stack<>();
        for (int i = 0; i < tokens.length; i++) {
            if ("+".equals(tokens[i]) || "-".equals(tokens[i]) || "*".equals(tokens[i]) || "/".equals(tokens[i])) {
                String num1 = stack.pop();
                String num2 = stack.pop();
                if ("+".equals(tokens[i])) {
                    int result = Integer.parseInt(num2) + Integer.parseInt(num1);
                    stack.push(String.valueOf(result));
                } else if ("-".equals(tokens[i])) {
                    int result = Integer.parseInt(num2) - Integer.parseInt(num1);
                    stack.push(String.valueOf(result));
                } else if ("*".equals(tokens[i])) {
                    int result = Integer.parseInt(num2) * Integer.parseInt(num1);
                    stack.push(String.valueOf(result));
                } else if ("/".equals(tokens[i])) {
                    int result = Integer.parseInt(num2) / Integer.parseInt(num1);
                    stack.push(String.valueOf(result));
                }
            } else {
                stack.push(tokens[i]);
            }
        }
        return Integer.parseInt(stack.pop());
    }

    public static void main(String[] args) {
        System.out.println(new Solution().evalRPN(new String[]{"2", "1", "+", "3", "*"}));
        System.out.println(new Solution().evalRPN(new String[]{"4", "13", "5", "/", "+"}));
        System.out.println(new Solution().evalRPN(new String[]{"10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"}));
    }
}
