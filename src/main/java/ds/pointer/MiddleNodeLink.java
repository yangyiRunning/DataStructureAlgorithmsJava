package ds.pointer;

/**
 * 链表的中间节点
 * LeetCode 876 https://leetcode-cn.com/problems/middle-of-the-linked-list/
 *
 * @author yangyi 2020年12月11日00:06:32
 */
public class MiddleNodeLink {

    public class ListNode {
        int val;
        ListNode next;

        ListNode(int x) {
            val = x;
        }
    }

    /**
     * @return [1, 2, 3, 4, 5]
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

    /**
     * @return [1, 2, 3, 4, 5, 6]
     */
    private ListNode createLink2() {
        ListNode node_1 = new ListNode(1);
        ListNode node_2 = new ListNode(2);
        ListNode node_3 = new ListNode(3);
        ListNode node_4 = new ListNode(4);
        ListNode node_5 = new ListNode(5);
        ListNode node_6 = new ListNode(6);
        node_1.next = node_2;
        node_2.next = node_3;
        node_3.next = node_4;
        node_4.next = node_5;
        node_5.next = node_6;
        return node_1;
    }

    public ListNode middleNode(ListNode head) {
        ListNode fast = head;
        ListNode slow = head;
        while (fast != null && fast.next != null) {
            fast = fast.next.next;
            slow = slow.next;
        }
        return slow;
    }

    public static void main(String[] args) {
        MiddleNodeLink middleNodeLink = new MiddleNodeLink();
        ListNode link = middleNodeLink.createLink();
        ListNode link2 = middleNodeLink.createLink2();
        ListNode middle = middleNodeLink.middleNode(link);
        ListNode middle2 = middleNodeLink.middleNode(link2);
        System.out.println("[1, 2, 3, 4, 5]的中点为: " + middle.val);
        System.out.println("[1, 2, 3, 4, 5, 6]的中点为: " + middle2.val);
    }
}
