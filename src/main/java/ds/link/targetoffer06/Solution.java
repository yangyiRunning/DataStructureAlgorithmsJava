package ds.link.targetoffer06;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Stack;

/**
 * 从尾到头打印链表
 * 剑指 Offer 06 https://leetcode-cn.com/problems/cong-wei-dao-tou-da-yin-lian-biao-lcof/
 * 方法1: 先把链表反转，然后在遍历输出。 但是因为反转了一遍，所以会改变链表的结构，并不是每一个场景都允许。
 * 方法2: 正常遍历链表，用一个栈收集链表中的元素，然后遍历输出该栈。
 * 方法3: 递归输出链表的下一个节点，然后再输出当前节点。
 *
 * @author yangyi 2021年01月17日19:20:44
 */
public class Solution {

    public class ListNode {
        int val;
        ListNode next;

        ListNode(int x) {
            val = x;
        }
    }

    private List<Integer> result = new LinkedList<>();

    /**
     * 递归实现
     */
    public int[] reversePrint(ListNode head) {
        recursionLink(head);
        int[] res = new int[result.size()];
        for (int i = 0; i < result.size(); i++) {
            res[i] = result.get(i);
        }
        return res;
    }

    private void recursionLink(ListNode head) {
        if (head != null) {
            if (head.next != null) {
                recursionLink(head.next);
            }
            result.add(head.val);
        }
    }

    private ListNode createLink() {
        ListNode node_1 = new ListNode(1);
        ListNode node_3 = new ListNode(3);
        ListNode node_2 = new ListNode(2);
        node_1.next = node_3;
        node_3.next = node_2;
        return node_1;
    }

    private void printLink(ListNode head) {
        for (ListNode cur = head; cur != null; cur = cur.next) {
            System.out.print(cur.val + " ");
        }
    }

    /**
     * 借助栈实现
     */
    public int[] reversePrintLink(ListNode head) {
        if (head == null) {
            return new int[]{};
        }
        Stack<ListNode> nodeStack = new Stack<>();
        for (ListNode node = head; node != null; node = node.next) {
            nodeStack.push(node);
        }
        int size = nodeStack.size();
        int[] result = new int[size];
        for (int i = 0; i < size; i++) {
            result[i] = nodeStack.pop().val;
        }
        return result;
    }

    public static void main(String[] args) {
        Solution reversePrintLink = new Solution();
        System.out.println("先构造一个测试用的链表:");
        ListNode head = reversePrintLink.createLink();
        reversePrintLink.printLink(head);

        System.out.println();
        System.out.println("采用栈逆序输出:");
        System.out.println(Arrays.toString(reversePrintLink.reversePrintLink(head)));
        System.out.println("采用递归逆序输出:");
        System.out.println(Arrays.toString(reversePrintLink.reversePrint(reversePrintLink.createLink())));

    }
}
