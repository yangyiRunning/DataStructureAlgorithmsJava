package ds;

import java.util.HashSet;
import java.util.Set;

/**
 * 判断链表是否有环
 *
 * @author yangyi 2019年01月18日22:39:27
 */
public class CycleLink {

    class Node {
        int value;
        Node next;
    }

    /**
     * 构建一个2->4->5->6->7->10->5的有环链表
     */
    private Node getCycleLink() {
        Node two = new Node();
        two.value = 2;
        Node four = new Node();
        four.value = 4;
        Node five = new Node();
        five.value = 5;
        Node six = new Node();
        six.value = 6;
        Node seven = new Node();
        seven.value = 7;
        Node ten = new Node();
        ten.value = 10;

        two.next = four;
        four.next = five;
        five.next = six;
        six.next = seven;
        seven.next = ten;
        ten.next = five;

        return two;
    }

    /**
     * 构建一个2->4->5->6->7->10的普通链表
     */
    private Node getNormalLink() {
        Node two = new Node();
        two.value = 2;
        Node four = new Node();
        four.value = 4;
        Node five = new Node();
        five.value = 5;
        Node six = new Node();
        six.value = 6;
        Node seven = new Node();
        seven.value = 7;
        Node ten = new Node();
        ten.value = 10;

        two.next = four;
        four.next = five;
        five.next = six;
        six.next = seven;
        seven.next = ten;

        return two;
    }

    private boolean hasCycle(Node head) {
        Set<Integer> integerSet = new HashSet<>();
        for (Node node = head; node != null; node = node.next) {
            if (integerSet.contains(node.value)) {
                return true;
            } else {
                integerSet.add(node.value);
            }
        }
        return false;
    }

    public static void main(String[] args) {
        CycleLink cycleLink = new CycleLink();
        Node node = cycleLink.getCycleLink();
        System.out.println("判断链表是否有环?");
        boolean isHas = cycleLink.hasCycle(node);
        if (isHas) {
            System.out.println("链表有环");
        } else {
            System.out.println("链表无环");
        }

        System.out.println();
        System.out.println("判断链表是否有环?");
        Node node2 = cycleLink.getNormalLink();
        boolean isHas2 = cycleLink.hasCycle(node2);
        if (isHas2) {
            System.out.println("链表有环");
        } else {
            System.out.println("链表无环");
        }
    }
}
