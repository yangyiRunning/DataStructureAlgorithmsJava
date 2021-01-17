package ds.link.leetcode234;

import ds.LinkCreate;

/**
 * 回文链表
 * LeetCode 234 https://leetcode-cn.com/problems/palindrome-linked-list/
 * 剑指offer 02.06 https://leetcode-cn.com/problems/palindrome-linked-list-lcci/
 *
 * @author yangyi 2021年01月17日20:52:03
 */
public class Solution {

    /**
     * 用头插法构造一个链表出来，用于后续的反转操作
     */
    private LinkCreate.LinkTable createLink() {
        LinkCreate linkCreate = new LinkCreate();
        System.out.println("头插法插入数据后打印出来看看：");
        LinkCreate.LinkTable linkTable = new LinkCreate.LinkTable();
        LinkCreate.LinkTable linkTable2 = linkCreate.headCreate(linkTable, new String[]
                {"我", "上", "楼", "复", "习", "你", "别", "打", "扰", "我"});
        for (LinkCreate.Node node = linkTable2.node.next; node != null; node = node.next) {
            System.out.println(node.object);
        }
        return linkTable2;
    }

    private LinkCreate.LinkTable createPalindromeLink() {
        LinkCreate linkCreate = new LinkCreate();
        System.out.println("头插法插入数据后打印出来看看：");
        LinkCreate.LinkTable linkTable = new LinkCreate.LinkTable();
        LinkCreate.LinkTable linkTable2 = linkCreate.headCreate(linkTable, new String[]
                {"我", "上", "楼", "复", "习", "复", "楼", "上", "我"});
        for (LinkCreate.Node node = linkTable2.node.next; node != null; node = node.next) {
            System.out.println(node.object);
        }
        return linkTable2;
    }

    private LinkCreate.LinkTable createPalindromeLink2() {
        LinkCreate linkCreate = new LinkCreate();
        System.out.println("头插法插入数据后打印出来看看：");
        LinkCreate.LinkTable linkTable = new LinkCreate.LinkTable();
        LinkCreate.LinkTable linkTable2 = linkCreate.headCreate(linkTable, new String[]
                {"我", "上", "楼", "复", "习", "习", "复", "楼", "上", "我"});
        for (LinkCreate.Node node = linkTable2.node.next; node != null; node = node.next) {
            System.out.println(node.object);
        }
        return linkTable2;
    }

    /**
     * 正序遍历链表
     */
    private void printLink(LinkCreate.Node head) {
        if (head == null) {
            return;
        }
        System.out.print(head.object + " ");
        printLink(head.next);
    }

    /**
     * 倒序遍历链表
     */
    private void printLinkReverse(LinkCreate.Node head) {
        if (head == null) {
            return;
        }
        printLinkReverse(head.next);
        System.out.print(head.object + " ");
    }

    /**
     * 采用双指针的办法判断一个链表是否为回文链表
     */
    private boolean isPalindromeLink(LinkCreate.Node head) {
        //用两倍的快慢指针先找寻中点
        LinkCreate.Node slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        //反转slow后的部分
        LinkCreate.Node left = head;
        LinkCreate.Node right = reverseLink(slow);

        while (left != null && right != null) {
            if (!left.object.equals(right.object)) {
                return false;
            }
            left = left.next;
            right = right.next;
        }
        return true;
    }

    private LinkCreate.Node reverseLink(LinkCreate.Node head) {
        if (head == null) {
            return null;
        }
        if (head.next == null) {
            return head;
        }
        LinkCreate.Node pre = null, cur = head, nxt = head;
        while (cur != null) {
            nxt = cur.next;
            cur.next = pre;
            pre = cur;
            cur = nxt;
        }
        return pre;
    }

    public static void main(String[] args) {
        Solution palindromeLink = new Solution();
        LinkCreate.LinkTable linkTable = palindromeLink.createLink();
        System.out.println();
        System.out.println("正序遍历链表↓");
        palindromeLink.printLink(linkTable.node.next);
        System.out.println();
        System.out.println("倒序遍历链表↓");
        palindromeLink.printLinkReverse(linkTable.node.next);

        System.out.println();
        System.out.println();
        System.out.println("构建一个回文链表");
        LinkCreate.LinkTable linkTable2 = palindromeLink.createPalindromeLink();
        boolean is = palindromeLink.isPalindromeLink(linkTable2.node.next);
        System.out.println("是否为一个回文链表↓");
        System.out.println(is ? "是" : "否");

        System.out.println();
        System.out.println("构建一个普通链表");
        LinkCreate.LinkTable linkTable3 = palindromeLink.createLink();
        boolean iss = palindromeLink.isPalindromeLink(linkTable3.node.next);
        System.out.println("是否为一个回文链表↓");
        System.out.println(iss ? "是" : "否");

        System.out.println();
        System.out.println("构建一个回文链表");
        LinkCreate.LinkTable linkTable4 = palindromeLink.createPalindromeLink2();
        boolean isss = palindromeLink.isPalindromeLink(linkTable4.node.next);
        System.out.println("是否为一个回文链表↓");
        System.out.println(isss ? "是" : "否");
    }
}
