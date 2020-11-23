package ds.link;

/**
 * 删除排序链表中的重复元素
 * <p>
 * 给定一个排序链表，删除所有重复的元素，使得每个元素只出现一次。
 * <p>
 * 示例 1:
 * <p>
 * 输入: 1->1->2
 * 输出: 1->2
 * 示例 2:
 * <p>
 * 输入: 1->1->2->3->3
 * 输出: 1->2->3
 *
 * @author yangyi 2019年02月09日23:53:18
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
        ListNode p = head;
        while (p != null) {
            if (p.next == null) {
                break;
            }
            if (p.val == p.next.val) {
                p.next = p.next.next;
            } else {
                p = p.next;
            }
        }
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
