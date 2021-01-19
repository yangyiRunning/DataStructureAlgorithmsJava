package ds.reverse.leetcode206;

/**
 * 反转链表
 * LeetCode 206 https://leetcode-cn.com/problems/reverse-linked-list/
 *
 * @author yangyi 2021年01月19日11:02:03
 */
public class Solution {

    public class ListNode {
        int val;
        ListNode next;

        ListNode(int x) {
            val = x;
        }
    }

    private ListNode createLink() {
        ListNode node_1 = new ListNode(1);
        ListNode node_2 = new ListNode(2);
        ListNode node_3 = new ListNode(3);
        ListNode node_4 = new ListNode(4);
        ListNode node_5 = new ListNode(5);
        node_1.next = node_2;
        node_2.next = node_3;
        node_3.next = node_4;
        node_4.next = node_5;
        return node_1;
    }

    private void printLink(ListNode head) {
        for (ListNode cur = head; cur != null; cur = cur.next) {
            System.out.print(cur.val + " ——> ");
        }
    }

    /**
     * 用迭代实现反转链表
     */
    public ListNode reverseList(ListNode head) {
        if (head == null) {
            return null;
        }
        if (head.next == null) {
            return head;
        }
        ListNode pre = null, cur = head, next;
        while (cur != null) {
            next = cur.next;
            cur.next = pre;
            pre = cur;
            cur = next;
        }
        return pre;
    }

    /**
     * 用递归实现反转链表
     */
    public ListNode reverseListRecursive(ListNode head) {
        if (head == null) {
            return null;
        }
        if (head.next == null) {
            return head;
        }
        ListNode last = reverseListRecursive(head.next);
        head.next.next = head;
        head.next = null;
        return last;
    }

    public static void main(String[] args) {
        Solution reverseLink = new Solution();
        ListNode head = reverseLink.createLink();
        System.out.println("遍历输出创建好的链表:");
        reverseLink.printLink(head);
        System.out.println();
        System.out.println("采用迭代方法反转后的单链表:");
        ListNode result = reverseLink.reverseList(head);
        reverseLink.printLink(result);
        System.out.println();
        System.out.println("采用递归方法反转后的单链表");
        ListNode result2 = reverseLink.reverseListRecursive(result);
        reverseLink.printLink(result2);
    }
}
