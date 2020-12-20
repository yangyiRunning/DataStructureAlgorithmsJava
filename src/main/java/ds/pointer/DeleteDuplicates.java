package ds.pointer;

/**
 * 删除排序链表中的重复元素
 * LeetCode 83 https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list/
 *
 * @author yangyi 2020年12月16日15:45:23
 */
public class DeleteDuplicates {

    public class ListNode {
        int val;
        ListNode next;

        ListNode(int x) {
            val = x;
        }
    }

    public ListNode deleteDuplicates(ListNode head) {
        if (head == null) {
            return null;
        }
        ListNode slow = head, fast = head;
        while (fast != null) {
            if (slow.val != fast.val) {
                slow.next = fast;
                slow = slow.next;
            }
            fast = fast.next;
        }
        slow.next = null;
        return head;
    }

    public ListNode createListNode() {
        ListNode val_1 = new ListNode(1);
        ListNode val_1_1 = new ListNode(1);
        ListNode val_2 = new ListNode(2);
        ListNode val_3 = new ListNode(3);
        ListNode val_3_3 = new ListNode(3);
        val_1.next = val_1_1;
        val_1_1.next = val_2;
        val_2.next = val_3;
        val_3.next = val_3_3;
        return val_1;
    }

    public static void main(String[] args) {
        DeleteDuplicates deleteDuplicates = new DeleteDuplicates();
        ListNode node = deleteDuplicates.createListNode();
        System.out.println("打印创建好的链表:");
        for (ListNode p = node; p != null; p = p.next) {
            System.out.print(p.val + "——>");
        }
        System.out.println();
        System.out.println("打印创建好的链表:");
        ListNode res = deleteDuplicates.deleteDuplicates(node);
        for (ListNode p = res; p != null; p = p.next) {
            System.out.print(p.val + "——>");
        }
    }
}
