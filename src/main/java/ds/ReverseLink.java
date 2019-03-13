package ds;

/**
 * 反转一个链表
 *
 * @author yangyi 2019年01月03日23:10:20
 */
public class ReverseLink {

    /**
     * 用头插法构造一个链表出来，用于后续的反转操作
     */
    private LinkCreate.LinkTable createLink() {
        LinkCreate linkCreate = new LinkCreate();
        System.out.println("头插法插入数据后打印出来看看：");
        LinkCreate.LinkTable linkTable = new LinkCreate.LinkTable();
        LinkCreate.LinkTable linkTable2 = linkCreate.headCreate(linkTable, new String[]{"我", "上", "楼", "复", "习"});
        for (LinkCreate.Node node = linkTable2.node.next; node != null; node = node.next) {
            System.out.println(node.object);
        }
        return linkTable2;
    }

    /**
     * 正式开启反转操作
     */
    private LinkCreate.Node reverseLink(LinkCreate.LinkTable linkTable) {
        //链表为null你还反转个P啊
        if (linkTable.node == null) {
            return null;
        }
        //链表就一个节点你觉得还有必要反转么
        if (linkTable.node.next == null) {
            return linkTable.node;
        }
        //因为这个单链表是一个有哨兵的单链表，所以在初始化的时候p要指向哨兵的下一个元素，即linkTable.node.next
        LinkCreate.Node p = linkTable.node.next;
        LinkCreate.Node q = p.next;
        //r非常关键，是标识剩余的链表的指示器
        LinkCreate.Node r;
        //第一个节点的next指向null，也就意味着这个节点是反转后的最后一个节点
        p.next = null;
        //q不为null说明还有没被反转的数据，接着循环
        while (q != null) {
            r = q.next;
            q.next = p;
            p = q;
            q = r;
        }
        return p;
    }

    public static void main(String[] args) {
        ReverseLink reverseLink = new ReverseLink();
        LinkCreate.LinkTable linkTable = reverseLink.createLink();
        System.out.println("反转后的单链表:");
        LinkCreate.Node result = reverseLink.reverseLink(linkTable);
        for (LinkCreate.Node node = result; node != null; node = node.next) {
            System.out.println(node.object + " ");
        }
    }
}
