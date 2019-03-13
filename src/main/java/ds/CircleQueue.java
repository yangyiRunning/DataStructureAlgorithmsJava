package ds;

/**
 * 循环队列（基于数组成环）
 *
 * @author yangyi 2018年12月03日21:52:30
 */
public class CircleQueue {

    private Object[] objects;
    private int count;
    private int capacity;
    private int head;
    private int tail;

    public CircleQueue(int capacity) {
        this.capacity = capacity;
        this.count = 0;
        objects = new Object[capacity];
    }

    public int getSize() {
        return count;
    }

    /**
     * 这种入队方式所围成的环始终有一个位置（也就是tail所指向的位置）是没有数据的，也就是说会浪费一个空间单元
     */
    public boolean enqueue(Object object) {
        if (count == capacity) {
            return false;
        }
        if (object == null) {
            return false;
        }
        //head和tail挨着时代表队列已满
        if ((tail + 1) % capacity == head) {
            return false;
        }
        objects[tail] = object;
        //重新计算tail
        tail = (tail + 1) % capacity;
        count++;
        return true;
    }

    public Object dequeue() {
        if (count <= 0) {
            return null;
        }
        if (head == tail) {
            return null;
        }
        Object object = objects[head];
        head = (head + 1) % capacity;
        count--;
        return object;
    }

    public void printlnAll() {
        for (Object object : objects) {
            System.out.println(object);
        }
    }

    public static void main(String[] args) {
        //先准备80个数
        int[] ints = new int[80];
        for (int i = 0; i < 80; i++) {
            ints[i] = i;
        }

        System.out.println("————————————入队后的队列数据——————————————");

        //放入循环队列中
        CircleQueue circleQueue = new CircleQueue(80);
        for (int anInt : ints) {
            circleQueue.enqueue(anInt);
        }

        //输出队列来看一下
        circleQueue.printlnAll();

        System.out.println("————————————朴素的分割线——————————————");

        //出队50个
        for (int i = 0; i < 50; i++) {
            System.out.println("出队的元素为：" + circleQueue.dequeue());
        }

        System.out.println("————————————朴素的分割线——————————————");

        //新入队50个
        for (int i = 0; i < 50; i++) {
            System.out.println("新入队的元素为：" + "new" + i);
            circleQueue.enqueue("new" + i);
        }

        //输出来看一下
        System.out.println("————————————新元素入队后的数据——————————————");
        circleQueue.printlnAll();

        System.out.println("————————————朴素的分割线——————————————");
        System.out.println("此时的个数为：" + circleQueue.getSize());

    }
}
