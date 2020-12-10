package ds.pointer;

/**
 * 链表中倒数第k个节点
 * LeetCode 剑指offer 22 https://leetcode-cn.com/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/
 *
 * @author yangyi 2020年12月11日00:26:01
 */
public class GetKthFromEnd {

    public class ListNode {
        int val;
        ListNode next;

        ListNode(int x) {
            val = x;
        }
    }

    /**
     * 1->2->3->4->5, 和 k = 2.
     */
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

    public ListNode getKthFromEnd(ListNode head, int k) {
        ListNode fast = head;
        ListNode slow = head;
        while (k-- > 0) {
            fast = fast.next;
        }
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }
        return slow;
    }

    public static void main(String[] args) {
        GetKthFromEnd getKthFromEnd = new GetKthFromEnd();
        ListNode link = getKthFromEnd.createLink();
        int k = 2;
        ListNode result = getKthFromEnd.getKthFromEnd(link, k);
        System.out.println("1->2->3->4->5链表中的倒数第" + k + "个节点为: " + result.val);
    }
}
