package ds.stack.leetcode739;

import java.util.Arrays;
import java.util.Stack;

/**
 * 每日温度
 * LeetCode 739 https://leetcode-cn.com/problems/daily-temperatures/
 *
 * @author yangyi 2021年07月09日15:50:24
 */
public class Solution {

    public int[] dailyTemperatures(int[] temperatures) {
        int[] result = new int[temperatures.length];
        Stack<Integer> stack = new Stack<>();
        stack.push(0);
        for (int i = 1; i < temperatures.length; i++) {
            if (temperatures[i] < temperatures[stack.peek()]) {
                stack.push(i);
            } else if (temperatures[i] == temperatures[stack.peek()]) {
                stack.push(i);
            } else {
                while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
                    int top = stack.peek();
                    result[top] = i - top;
                    stack.pop();
                }
                stack.push(i);
            }
        }
        return result;
    }

    public static void main(String[] args) {
        int[] tem = new int[]{73, 74, 75, 71, 69, 72, 76, 73};
        System.out.println(Arrays.toString(new Solution().dailyTemperatures(tem)));
    }
}
