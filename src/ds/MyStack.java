package ds;

import java.util.ArrayDeque;
import java.util.Queue;

/**
 * 用两个队列实现一个栈
 * <p>
 * <p>
 * 使用队列实现栈的下列操作：
 * <p>
 * push(x) -- 元素 x 入栈
 * pop() -- 移除栈顶元素
 * top() -- 获取栈顶元素
 * empty() -- 返回栈是否为空
 * 注意:
 * <p>
 * 你只能使用队列的基本操作-- 也就是 push to back, peek/pop from front, size, 和 is empty 这些操作是合法的。
 * 你所使用的语言也许不支持队列。 你可以使用 list 或者 deque（双端队列）来模拟一个队列 , 只要是标准的队列操作即可。
 * 你可以假设所有操作都是有效的（例如, 对一个空的栈不会调用 pop 或者 top 操作）。
 *
 * @author yangyi 2019年02月11日16:56:09
 */
public class MyStack {

    private Queue<Integer> queue1;
    private Queue<Integer> queue2;

    /**
     * 初始化两个队列
     */
    public MyStack() {
        queue1 = new ArrayDeque<>();
        queue2 = new ArrayDeque<>();
    }

    /**
     * 进栈
     */
    public void push(int x) {
        //两个队列，哪个不为空进哪个
        if (!queue1.isEmpty()) {
            queue1.offer(x);
        } else {
            queue2.offer(x);
        }
    }

    /**
     * 出栈
     */
    public int pop() {
        //最后一个进队的元素留下，其余的换到另一个队列中去
        if (!queue1.isEmpty()) {
            while (queue1.size() > 1) {
                queue2.offer(queue1.poll());
            }
            //最后一个剩在了队列中，出队
            return queue1.poll();
        } else {
            while (queue2.size() > 1) {
                queue1.offer(queue2.poll());
            }
            return queue2.poll();
        }
    }

    /**
     * 查询栈顶元素
     */
    public int top() {
        if (!queue1.isEmpty()) {
            while (queue1.size() > 1) {
                queue2.offer(queue1.poll());
            }
            int result = queue1.peek();
            queue1.poll();
            queue2.offer(result);
            return result;
        } else {
            while (queue2.size() > 1) {
                queue1.offer(queue2.poll());
            }
            int result = queue2.peek();
            queue2.poll();
            queue1.offer(result);
            return result;
        }
    }

    public boolean empty() {
        return queue1.isEmpty() && queue2.isEmpty();
    }

    public static void main(String[] args) {
        MyStack obj = new MyStack();
        obj.push(1);
        obj.push(2);
        int param_2 = obj.pop();
        int param_3 = obj.top();
        boolean param_4 = obj.empty();
        System.out.println(param_2);
        System.out.println(param_3);
        System.out.println(param_4);
    }
}
