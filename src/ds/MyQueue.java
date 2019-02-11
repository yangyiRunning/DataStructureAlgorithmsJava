package ds;

import java.util.Stack;

/**
 * 用两个栈实现一个队列
 * <p>
 * 使用栈实现队列的下列操作：
 * <p>
 * push(x) -- 将一个元素放入队列的尾部。
 * pop() -- 从队列首部移除元素。
 * peek() -- 返回队列首部的元素。
 * empty() -- 返回队列是否为空。
 * 示例:
 * <p>
 * MyQueue queue = new MyQueue();
 * <p>
 * queue.push(1);
 * queue.push(2);
 * queue.peek();  // 返回 1
 * queue.pop();   // 返回 1
 * queue.empty(); // 返回 false
 * 说明:
 * <p>
 * 你只能使用标准的栈操作 -- 也就是只有 push to top, peek/pop from top, size, 和 is empty 操作是合法的。
 * 你所使用的语言也许不支持栈。你可以使用 list 或者 deque（双端队列）来模拟一个栈，只要是标准的栈操作即可。
 * 假设所有操作都是有效的 （例如，一个空的队列不会调用 pop 或者 peek 操作）。
 *
 * @author yangyi 2019年02月11日16:11:01
 */
public class MyQueue {

    private Stack<Integer> stack1;
    private Stack<Integer> stack2;

    /**
     * 初始化队列
     */
    public MyQueue() {
        stack1 = new Stack<>();
        stack2 = new Stack<>();
    }

    /**
     * 入队
     */
    public void push(int x) {
        stack1.push(x);
    }

    /**
     * 出队
     */
    public int pop() {
        if (stack2.isEmpty()) {
            while (stack1.size() > 0) {
                Integer target = stack1.peek();
                stack2.push(target);
                stack1.pop();
            }
        }

        if (stack2.isEmpty()) {
            return 0;
        }

        Integer result = stack2.peek();
        stack2.pop();
        return result;
    }

    /**
     * 查看队头
     */
    public int peek() {
        if (stack2.isEmpty()) {
            while (stack1.size() > 0) {
                Integer target = stack1.peek();
                stack2.push(target);
                stack1.pop();
            }
        }

        if (stack2.isEmpty()) {
            return 0;
        }

        return stack2.peek();
    }

    /**
     * 返回是否为空
     */
    public boolean empty() {
        return stack1.isEmpty() && stack2.isEmpty();
    }

    public static void main(String[] args) {
        MyQueue queue = new MyQueue();
        queue.push(1);
        queue.push(2);
        //返回 1
        System.out.println(queue.peek());
        //返回 1
        System.out.println(queue.pop());
        //返回 false
        System.out.println(queue.empty());
    }

}
