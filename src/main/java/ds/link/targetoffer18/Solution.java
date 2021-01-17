package ds.link.targetoffer18;

/**
 * 删除链表中的节点
 * 剑指offer 18 https://leetcode-cn.com/problems/shan-chu-lian-biao-de-jie-dian-lcof/
 *
 * @author yangyi 2021年01月17日20:17:56
 */
public class Solution {

    public static class ListNode {
        int val;
        ListNode next;

        ListNode(int x) {
            val = x;
        }
    }

    public ListNode deleteNode(ListNode head, int val) {
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

    private ListNode createLink() {
        ListNode node_4 = new ListNode(4);
        ListNode node_5 = new ListNode(5);
        ListNode node_1 = new ListNode(1);
        ListNode node_9 = new ListNode(9);
        node_4.next = node_5;
        node_5.next = node_1;
        node_1.next = node_9;
        return node_4;
    }

    private void printLink(ListNode head) {
        for (ListNode cur = head; cur != null; cur = cur.next) {
            System.out.print(cur.val + " ");
        }
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        solution.printLink(solution.createLink());
        System.out.println();
        ListNode result = solution.deleteNode(solution.createLink(), 5);
        solution.printLink(result);
        System.out.println();
        ListNode result2 = solution.deleteNode(solution.createLink(), 1);
        solution.printLink(result2);
        System.out.println();
        ListNode result3 = solution.deleteNode(solution.createLink(), 4);
        solution.printLink(result3);
        System.out.println();
        ListNode result4 = solution.deleteNode(solution.createLink(), 9);
        solution.printLink(result4);
    }
}
