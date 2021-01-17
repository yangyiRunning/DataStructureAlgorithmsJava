package ds.link.leetcode707;

/**
 * 设计链表
 * LeetCode 707 https://leetcode-cn.com/problems/design-linked-list/
 *
 * @author yangyi 2021年01月17日17:27:29
 */
public class MyLinkedList {

    public class ListNode {
        int val;
        ListNode next;

        ListNode(int x) {
            val = x;
        }
    }

    private ListNode extra;
    private int size;

    /**
     * Initialize your data structure here.
     */
    public MyLinkedList() {
        extra = new ListNode(999);
        size = 0;
    }

    /**
     * Get the value of the index-th node in the linked list. If the index is invalid, return -1.
     */
    public int get(int index) {
        if (index >= size || index < 0) {
            return -1;
        }
        ListNode cur = extra.next;
        while (index > 0) {
            cur = cur.next;
            index--;
        }
        return cur.val;
    }

    /**
     * Add a node of value val before the first element of the linked list. After the insertion, the new node will be the first node of the linked list.
     */
    public void addAtHead(int val) {
        ListNode newHead = new ListNode(val);
        newHead.next = extra.next;
        extra.next = newHead;
        size++;
    }

    /**
     * Append a node of value val to the last element of the linked list.
     */
    public void addAtTail(int val) {
        ListNode newTail = new ListNode(val);
        ListNode cur = extra;
        while (cur.next != null) {
            cur = cur.next;
        }
        cur.next = newTail;
        size++;
    }

    /**
     * Add a node of value val before the index-th node in the linked list. If index equals to the length of linked list, the node will be appended to the end of linked list. If index is greater than the length, the node will not be inserted.
     */
    public void addAtIndex(int index, int val) {
        if (index > size || index < 0) {
            return;
        }
        ListNode cur = extra;
        while (index > 0) {
            cur = cur.next;
            index--;
        }
        ListNode newNode = new ListNode(val);
        newNode.next = cur.next;
        cur.next = newNode;
        size++;
    }

    /**
     * Delete the index-th node in the linked list, if the index is valid.
     */
    public void deleteAtIndex(int index) {
        if (index >= size || index < 0) {
            return;
        }
        ListNode cur = extra;
        while (index > 0) {
            cur = cur.next;
            index--;
        }
        if (cur.next != null && cur.next.next != null) {
            cur.next = cur.next.next;
        } else {
            cur.next = null;
        }
        size--;
    }

    private void printLink() {
        for (ListNode node = extra.next; node != null; node = node.next) {
            System.out.print(node.val + "——> ");
        }
    }

    public static void main(String[] args) {
        MyLinkedList linkedList = new MyLinkedList();
        System.out.println("头插4");
        linkedList.addAtHead(4);
        linkedList.printLink();
        System.out.println();
        System.out.println("现时的长度为: " + linkedList.size);

        System.out.println();

        System.out.println("查找索引为1的节点");
        System.out.println(linkedList.get(1));
        System.out.println("现时的长度为: " + linkedList.size);

        System.out.println();

        System.out.println("头插1");
        linkedList.addAtHead(1);
        linkedList.printLink();
        System.out.println();
        System.out.println("现时的长度为: " + linkedList.size);

        System.out.println();

        System.out.println("头插5");
        linkedList.addAtHead(5);
        linkedList.printLink();
        System.out.println();
        System.out.println("现时的长度为: " + linkedList.size);

        System.out.println();

        System.out.println("删除索引为3的节点");
        linkedList.deleteAtIndex(3);
        linkedList.printLink();
        System.out.println();
        System.out.println("现时的长度为: " + linkedList.size);

        System.out.println();

        System.out.println("头插7");
        linkedList.addAtHead(7);
        linkedList.printLink();
        System.out.println();
        System.out.println("现时的长度为: " + linkedList.size);

        System.out.println();

        System.out.println("查找索引为3的节点");
        linkedList.printLink();
        System.out.println();
        System.out.println(linkedList.get(3));
        System.out.println("现时的长度为: " + linkedList.size);

        System.out.println();

        System.out.println("查找索引为3的节点");
        linkedList.printLink();
        System.out.println();
        System.out.println(linkedList.get(3));
        System.out.println("现时的长度为: " + linkedList.size);

        System.out.println();

        System.out.println("查找索引为3的节点");
        linkedList.printLink();
        System.out.println();
        System.out.println(linkedList.get(3));
        System.out.println("现时的长度为: " + linkedList.size);


        System.out.println();

        System.out.println("头插1");
        linkedList.addAtHead(1);
        linkedList.printLink();
        System.out.println();
        System.out.println("现时的长度为: " + linkedList.size);

        System.out.println();

        System.out.println("删除索引为4的节点");
        linkedList.deleteAtIndex(4);
        linkedList.printLink();
        System.out.println();
        System.out.println("现时的长度为: " + linkedList.size);

    }

}
