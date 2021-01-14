package ds.pointer.leetcode141;

import java.util.HashSet;
import java.util.Set;

/**
 * 环形链表
 * LeetCode 141 https://leetcode-cn.com/problems/linked-list-cycle/
 *
 * @author yangyi 2020年12月10日22:35:31
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
     * 构建一个2->4->5->6->7->10->5的有环链表
     */
    private ListNode getCycleLink() {
        ListNode two = new ListNode(2);
        ListNode four = new ListNode(4);
        ListNode five = new ListNode(5);
        ListNode six = new ListNode(6);
        ListNode seven = new ListNode(7);
        ListNode ten = new ListNode(10);

        two.next = four;
        four.next = five;
        five.next = six;
        six.next = seven;
        seven.next = ten;
        ten.next = five;

        return two;
    }

    /**
     * 构建一个2->4->5->6->7->10的普通链表
     */
    private ListNode getNormalLink() {
        ListNode two = new ListNode(2);
        ListNode four = new ListNode(4);
        ListNode five = new ListNode(5);
        ListNode six = new ListNode(6);
        ListNode seven = new ListNode(7);
        ListNode ten = new ListNode(10);

        two.next = four;
        four.next = five;
        five.next = six;
        six.next = seven;
        seven.next = ten;

        return two;
    }

    /**
     * 利用散列表判断链表是否有环
     * 时间复杂度为O(n)
     * 空间复杂度为O(n)
     */
    private boolean hasCycleSet(ListNode head) {
        Set<Integer> integerSet = new HashSet<>();
        for (ListNode node = head; node != null; node = node.next) {
            if (integerSet.contains(node.val)) {
                return true;
            } else {
                integerSet.add(node.val);
            }
        }
        return false;
    }

    /**
     * 利用快慢指针判断链表是否有环
     */
    public boolean hasCycle(ListNode head) {
        ListNode fast = head;
        ListNode slow = head;
        while (fast != null && fast.next != null) {
            fast = fast.next.next;
            slow = slow.next;
            if (fast == slow) {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        System.out.println("———————————————————利用散列表判断—————————————————————");
        Solution cycleLink = new Solution();
        ListNode node = cycleLink.getCycleLink();
        System.out.println("判断链表是否有环?");
        boolean isHas = cycleLink.hasCycleSet(node);
        if (isHas) {
            System.out.println("链表有环");
        } else {
            System.out.println("链表无环");
        }

        System.out.println();
        System.out.println("判断链表是否有环?");
        ListNode node2 = cycleLink.getNormalLink();
        boolean isHas2 = cycleLink.hasCycle(node2);
        if (isHas2) {
            System.out.println("链表有环");
        } else {
            System.out.println("链表无环");
        }

        System.out.println("———————————————————利用快慢指针判断—————————————————————");
        Solution cycleLink_ = new Solution();
        ListNode node_ = cycleLink_.getCycleLink();
        System.out.println("判断链表是否有环?");
        boolean isHas_ = cycleLink.hasCycleSet(node_);
        if (isHas_) {
            System.out.println("链表有环");
        } else {
            System.out.println("链表无环");
        }

        System.out.println();
        System.out.println("判断链表是否有环?");
        ListNode node2_ = cycleLink_.getNormalLink();
        boolean isHas2_ = cycleLink_.hasCycle(node2_);
        if (isHas2_) {
            System.out.println("链表有环");
        } else {
            System.out.println("链表无环");
        }
    }
}
