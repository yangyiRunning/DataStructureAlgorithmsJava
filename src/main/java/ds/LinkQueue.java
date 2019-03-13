package ds;

/**
 * 链式队列（基于链表实现的队列）
 * <p>
 * 注：可以向队列里面无限添加元素
 *
 * @author yangyi 2018年12月02日16:03:12
 */
public class LinkQueue {

    private int count;

    static class Node {
        Node next;
        Object object;
    }

    private Node head;
    private Node tail;

    public boolean enqueue(Node newNode) {
        if (newNode == null) {
            return false;
        }
        //tail==null表示这个队列内目前还一无所有
        if (tail == null) {
            head = newNode;
            tail = newNode;
        } else {
            tail.next = newNode;
            tail = tail.next;
        }
        count++;
        return true;
    }

    public Object dequeue() {
        if (count == 0) {
            return null;
        }
        if (head == null) {
            return null;
        }
        Object object = head.object;
        head = head.next;
        //出队完如果head==null了就说明此时队列中已经没有东西了
        if (head == null) {
            tail = null;
        }
        count--;
        return object;
    }

    public int getSize() {
        return count;
    }

    public void printlnAll() {
        for (Node p = head; p != null; p = p.next) {
            System.out.println(p.object);
        }
    }

    public static void main(String[] args) {
        LinkQueue linkQueue = new LinkQueue();
        //先准备50个节点塞到这个链式队列当中
        for (int i = 0; i < 50; i++) {
            Node node = new Node();
            node.object = i;
            linkQueue.enqueue(node);
        }

        linkQueue.printlnAll();

        System.out.println("————————————朴素的分割线——————————————");

        //先出队20个看看结果
        for (int i = 0; i < 20; i++) {
            System.out.println("出队的元素为：" + linkQueue.dequeue());
        }

        System.out.println("————————————朴素的分割线——————————————");

        linkQueue.printlnAll();

        //再往队列里塞30个新元素
        for (int i = 0; i < 30; i++) {
            Node node = new Node();
            node.object = "new" + i;
            linkQueue.enqueue(node);
        }

        System.out.println("————————————朴素的分割线——————————————");

        linkQueue.printlnAll();
    }
}
