package ds.reverse;

import ds.LinkCreate;

/**
 * 反转一个链表的前N个节点
 *
 * @author yangyi 2020年11月17日18:18:19
 */
public class ReverseLinkN {

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

    /**
     * 递归方式遍历单链表
     */
    private void printLink(LinkCreate.Node head) {
        if (head == null) {
            return;
        }
        printLink(head.next);
        System.out.println(head.object + "");
    }

    /**
     * 递归方式整体反转单链表
     */
    private LinkCreate.Node reverseLink(LinkCreate.Node head) {
        if (head.next == null) {
            return head;
        }
        LinkCreate.Node last = reverseLink(head.next);
        head.next.next = head;
        head.next = null;
        return last;
    }

    LinkCreate.Node after;

    /**
     * 反转单链表中的前n个节点
     */
    private LinkCreate.Node reverseLinkN(LinkCreate.Node head, int n) {
        if (n == 1) {
            after = head.next;
            return head;
        }
        LinkCreate.Node last = reverseLinkN(head.next, n - 1);
        head.next.next = head;
        head.next = after;
        return last;
    }

    /**
     * 反转单链表的一部分区间
     */
    private LinkCreate.Node reverseLinkBetween(LinkCreate.Node head, int m, int n) {
        if (m == 1) {
            return reverseLinkN(head, n);
        }
        head.next = reverseLinkBetween(head.next, m - 1, n - 1);
        return head;
    }

    /**
     * 采用迭代的方式反转整个单链表
     */
    private LinkCreate.Node reverseLinkFor(LinkCreate.Node head) {
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

    /**
     * 采用迭代的方式反转单链表当中a到b的节点
     */
    private LinkCreate.Node reverseLinkFor(LinkCreate.Node a, LinkCreate.Node b) {
        if (a.next == null) {
            return a;
        }
        LinkCreate.Node pre = null, cur = a, nxt = a;
        while (cur != b) {
            nxt = cur.next;
            cur.next = pre;
            pre = cur;
            cur = nxt;
        }
        return pre;
    }

    public static void main(String[] args) {
        ReverseLinkN reverseLinkN = new ReverseLinkN();
        System.out.println("创建一个带头结点的单链表↓");
        LinkCreate.LinkTable linkTable = reverseLinkN.createLink();
        System.out.println("用递归方式遍历此单链表↓");
        reverseLinkN.printLink(linkTable.node.next);
        System.out.println("整体反转此单链表↓");
        LinkCreate.Node reversedLink = reverseLinkN.reverseLink(linkTable.node.next);
        reverseLinkN.printLink(reversedLink);
        System.out.println("反转此单链表的前5个元素↓");
        LinkCreate.Node reversedLinkN = reverseLinkN.reverseLinkN(reversedLink, 5);
        reverseLinkN.printLink(reversedLinkN);
        System.out.println("反转此单链表的第2个到第6个元素↓");
        LinkCreate.Node reverseLinkBetween = reverseLinkN.reverseLinkBetween(reversedLinkN, 2, 6);
        reverseLinkN.printLink(reverseLinkBetween);
        LinkCreate.Node reverseLinkFor = reverseLinkN.reverseLinkFor(reverseLinkBetween);
        System.out.println("将上述第2到第6反转过的链表再整体反转一遍↓");
        reverseLinkN.printLink(reverseLinkFor);
        LinkCreate.Node reverseLinkFor2 = reverseLinkN.reverseLinkFor(reverseLinkFor,null);
        System.out.println("采用迭代的方式反转单链表当中a到b的节点，其中b节点为null↓");
        reverseLinkN.printLink(reverseLinkFor2);
    }
}
