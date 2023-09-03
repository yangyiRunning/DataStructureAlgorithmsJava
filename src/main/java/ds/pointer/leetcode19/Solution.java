package ds.pointer.leetcode19;

/**
 * 19.删除链表的倒数第N个节点
 * https://leetcode.cn/problems/remove-nth-node-from-end-of-list/solutions/450350/shan-chu-lian-biao-de-dao-shu-di-nge-jie-dian-b-61/?envType=study-plan-v2&envId=xiaohongshu-2023-fall-sprint
 *
 * @author yangyi 2023年09月03日23:04:36
 */
class Solution {

    public static class ListNode {
        int val;
        ListNode next;

        ListNode() {
        }

        ListNode(int val) {
            this.val = val;
        }

        ListNode(int val, ListNode next) {
            this.val = val;
            this.next = next;
        }
    }

    public ListNode removeNthFromEnd(ListNode head, int n) {
        if (head == null) {
            return null;
        }
        ListNode soldier = new ListNode(0);
        soldier.next = head;
        ListNode slow = soldier;
        ListNode fast = soldier;
        while (fast.next != null) {
            n--;
            fast = fast.next;
            if (n == 0) {
                break;
            }
        }
        while (fast.next != null) {
            slow = slow.next;
            fast = fast.next;
        }
        slow.next = slow.next.next;
        return soldier.next;
    }

    public static void main(String[] args) {
        ListNode one = new ListNode(1);
        ListNode two = new ListNode(2);
        ListNode three = new ListNode(3);
        ListNode four = new ListNode(4);
        ListNode five = new ListNode(5);
        one.next = two;
        two.next = three;
        three.next = four;
        four.next = five;
        ListNode res = new Solution().removeNthFromEnd(one, 2);
        for (ListNode cur = res; cur != null; cur = cur.next) {
            System.out.println(cur.val);
        }
    }
}
