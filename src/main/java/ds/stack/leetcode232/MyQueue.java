package ds.stack.leetcode232;

import java.util.Stack;

/**
 * 用栈实现队列
 * LeetCode 232 https://leetcode-cn.com/problems/implement-queue-using-stacks/
 *
 * @author yangyi 2021年07月09日17:53:18
 */
public class MyQueue {

    private Stack<Integer> input;
    private Stack<Integer> output;

    /**
     * Initialize your data structure here.
     */
    public MyQueue() {
        input = new Stack<>();
        output = new Stack<>();
    }

    /**
     * Push element x to the back of queue.
     */
    public void push(int x) {
        input.push(x);
    }

    /**
     * Removes the element from in front of queue and returns that element.
     */
    public int pop() {
        if (output.isEmpty()) {
            while (!input.isEmpty()) {
                int cur = input.pop();
                output.push(cur);
            }
        }
        return output.pop();
    }

    /**
     * Get the front element.
     */
    public int peek() {
        int res = pop();
        output.push(res);
        return res;
    }

    /**
     * Returns whether the queue is empty.
     */
    public boolean empty() {
        return input.isEmpty() && output.isEmpty();
    }

    /**
     * Your MyQueue object will be instantiated and called as such:
     * MyQueue obj = new MyQueue();
     * obj.push(x);
     * int param_2 = obj.pop();
     * int param_3 = obj.peek();
     * boolean param_4 = obj.empty();
     */

    public static void main(String[] args) {
        MyQueue myQueue = new MyQueue();
        myQueue.push(1); // queue is: [1]
        myQueue.push(2); // queue is: [1, 2] (leftmost is front of the queue)
        //return 1
        System.out.println(myQueue.peek());
        //return 1, queue is [2]
        System.out.println(myQueue.pop());
        //return false
        System.out.println(myQueue.empty());
    }

}
