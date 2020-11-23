package ds.link;

import ds.LinkCreate;

/**
 * 回文链表
 *
 * @author yangyi 2020年11月23日15:04:10
 */
public class PalindromeLink {

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

    public static void main(String[] args) {
        PalindromeLink palindromeLink = new PalindromeLink();
        LinkCreate.LinkTable linkTable = palindromeLink.createLink();
        System.out.println("正序遍历链表↓");
        palindromeLink.printLink(linkTable.node.next);
        System.out.println();
        System.out.println("倒序遍历链表↓");
        palindromeLink.printLinkReverse(linkTable.node.next);
    }
}
