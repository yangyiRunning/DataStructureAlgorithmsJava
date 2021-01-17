package ds.link.leetcode203;

/**
 * 移除链表元素
 * LeetCode 203 https://leetcode-cn.com/problems/remove-linked-list-elements/
 *
 * @author yangyi 2021年01月17日17:05:53
 */
public class Solution {

    public class ListNode {
        int val;
        ListNode next;

        ListNode(int x) {
            val = x;
        }
    }

    public ListNode removeElements(ListNode head, int val) {
        ListNode extra = new ListNode(999);
        extra.next = head;
        ListNode cur = extra;
        while (cur.next != null) {
            if (cur.next.val == val) {
                cur.next = cur.next.next;
            } else {
                cur = cur.next;
            }
        }
        return extra.next;
    }

    private ListNode createListNode() {
        ListNode one = new ListNode(1);
        ListNode two = new ListNode(2);
        ListNode six = new ListNode(6);
        ListNode three = new ListNode(3);
        ListNode four = new ListNode(4);
        ListNode five = new ListNode(5);
        ListNode six2 = new ListNode(6);
        one.next = two;
        two.next = six;
        six.next = three;
        three.next = four;
        four.next = five;
        five.next = six2;
        return one;
    }

    public static void main(String[] args) {
        System.out.println("看一下等待删除的链表:");
        Solution removeElements = new Solution();
        ListNode node = removeElements.createListNode();
        for (ListNode n = node; n != null; n = n.next) {
            System.out.print(n.val + "——>");
        }
        ListNode newNode = removeElements.removeElements(node, 6);
        System.out.println();
        System.out.println("删除完之后的链表:");
        for (ListNode n = newNode; n != null; n = n.next) {
            System.out.print(n.val + "——>");
        }
    }
}
