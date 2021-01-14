package ds.pointer.leetcode142;

/**
 * 环形链表 II (已知链表当中有环，返回这个环的起始位置)
 * LeetCode 142 https://leetcode-cn.com/problems/linked-list-cycle-ii/
 *
 * @author yangyi 2020年12月10日23:22:47
 */
public class Solution {

    class ListNode {
        int val;
        ListNode next;

        ListNode(int x) {
            val = x;
            next = null;
        }
    }

    /**
     * head = [3,2,0,-4], pos = 1
     */
    private ListNode createLink() {
        ListNode node_3 = new ListNode(3);
        ListNode node_2 = new ListNode(2);
        ListNode node_0 = new ListNode(0);
        ListNode node_4 = new ListNode(-4);
        node_3.next = node_2;
        node_2.next = node_0;
        node_0.next = node_4;
        node_4.next = node_2;
        return node_3;
    }

    /**
     * head = [1,2], pos = 0
     */
    private ListNode createLink2() {
        ListNode node_1 = new ListNode(1);
        ListNode node_2 = new ListNode(2);
        node_1.next = node_2;
        node_2.next = node_1;
        return node_1;
    }

    /**
     * head = [1], pos = -1
     */
    private ListNode createLink3() {
        ListNode node_1 = new ListNode(1);
        return node_1;
    }

    public ListNode detectCycle(ListNode head) {
        ListNode fast = head;
        ListNode slow = head;
        while (true) {
            if (fast == null || fast.next == null) {
                return null;
            }
            fast = fast.next.next;
            slow = slow.next;
            if (slow == fast) {
                break;
            }
        }
        slow = head;
        while (slow != fast) {
            slow = slow.next;
            fast = fast.next;
        }
        return slow;
    }

    public static void main(String[] args) {
        Solution detectCycleLink = new Solution();
        ListNode link1 = detectCycleLink.createLink();
        ListNode link2 = detectCycleLink.createLink2();
        ListNode link3 = detectCycleLink.createLink3();
        ListNode start1 = detectCycleLink.detectCycle(link1);
        ListNode start2 = detectCycleLink.detectCycle(link2);
        ListNode start3 = detectCycleLink.detectCycle(link3);
        System.out.println("head = [3,2,0,-4], pos = 1链表中的环的起始位置的值为: " + (start1 == null ? null : start1.val));
        System.out.println("head = [1,2], pos = 0链表中的环的起始位置的值为: " + (start2 == null ? null : start2.val));
        System.out.println("head = [1], pos = -1链表中的环的起始位置的值为: " + (start3 == null ? null : start3.val));
    }
}
