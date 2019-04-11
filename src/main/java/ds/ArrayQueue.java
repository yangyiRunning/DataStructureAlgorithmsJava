package ds;

import java.util.ArrayList;

/**
 * 顺序队列（基于数组实现的队列）
 *
 * @author yangyi 2018年12月02日14:24:22
 */
public class ArrayQueue {

    private int capacity;
    private int count;
    private Object[] objects;

    /**
     * 头和尾初始时都指向索引为0处
     */
    private int head;
    private int tail;

    public ArrayQueue(int capacity) {
        this.capacity = capacity;
        this.count = 0;
    }

    /**
     * 入队
     */
    public boolean enqueue(Object object) {
        if (object == null) {
            return false;
        }
        //尾巴到头了
        if (tail == capacity) {
            if (head == 0) {
                //整个队列都满了，再也没有空间放进去了
                return false;
            }
            //如果不是整个队列都满了，但凡队列中有一点空间，就开始数据搬移，搬移到数据从第一个位置开始
            for (int i = head; i < objects.length; i++) {
                objects[i - head] = objects[i];
            }
            tail -= head;
            head = 0;
        }
        //放入尾巴指向的位置即可
        objects[tail] = object;
        tail++;
        count++;
        return true;
    }

    /**
     * 出队
     */
    public Object dequeue() {
        if (count == 0) {
            return null;
        }
        if (head == tail) {
            return null;
        }
        //返回头部指向的内容
        Object object = objects[head];
        head++;
        count--;
        return object;
    }

    public int getSize() {
        return count;
    }

    public static void main(String[] args) {
        //准备好大于100个（具体来说是101个）数用于测试
        int[] ints = new int[101];
        for (int i = 0; i < ints.length; i++) {
            ints[i] = i;
        }

        ArrayQueue arrayQueue = new ArrayQueue(100);
        for (int anInt : ints) {
            System.out.println(anInt);
            arrayQueue.enqueue(anInt);
        }

        //出队10个再入队10个，看空间是否充分利用
        System.out.println("————————————朴素的分割线——————————————");
        for (int i = 0; i < 10; i++) {
            System.out.println("出队的元素:" + arrayQueue.dequeue());
        }
        System.out.println("————————————朴素的分割线——————————————");
        for (int i = 0; i < 10; i++) {
            String string = "new" + i;
            System.out.println("入队的元素:" + string);
            arrayQueue.enqueue(string);
        }

        //看最终结果
        System.out.println("————————————朴素的分割线——————————————");
        int count = arrayQueue.getSize();
        for (int i = 0; i < count; i++) {
            System.out.println(arrayQueue.dequeue());
        }

    }
}
