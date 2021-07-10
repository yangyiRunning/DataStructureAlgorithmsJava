package ds.queue.leetcode225;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * 用队列实现栈
 * LeetCode 225 https://leetcode-cn.com/problems/implement-stack-using-queues/
 *
 * @author yangyi 2021年07月09日18:32:47
 */
public class MyStack {

    private Deque<Integer> deque;

    /**
     * Initialize your data structure here.
     */
    public MyStack() {
        deque = new ArrayDeque<>();
    }

    /**
     * Push element x onto stack.
     */
    public void push(int x) {
        deque.offer(x);
    }

    /**
     * Removes the element on top of the stack and returns that element.
     */
    public int pop() {
        for (int i = 0; i < deque.size() - 1; i++) {
            int first = deque.pollFirst();
            deque.offerLast(first);
        }
        return deque.pollFirst();
    }

    /**
     * Get the top element.
     */
    public int top() {
        return deque.peekLast();
    }

    /**
     * Returns whether the stack is empty.
     */
    public boolean empty() {
        return deque.isEmpty();
    }

    public static void main(String[] args) {
        MyStack myStack = new MyStack();
        myStack.push(1);
        myStack.push(2);
        // 返回 2
        System.out.println(myStack.top());
        // 返回 2
        System.out.println(myStack.pop());
        // 返回 False
        System.out.println(myStack.empty());
    }
}
