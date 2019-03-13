package ds;

/**
 * 线性表的删除操作（基于链式存储的物理结构实现）
 *
 * @author yangyi 2018年05月05日22:49:33
 */
public class LinkDelete {

    static class Node {
        public Node next;
        public Object object;
    }

    static class LinkTable {
        public Node node;

        public LinkTable() {
            node = new Node();
            Node node1 = new Node();
            Node node2 = new Node();
            Node node3 = new Node();
            Node node4 = new Node();
            Node node5 = new Node();
            node.object = "我是一个头节点";
            node.next = node1;
            node1.object = 1;
            node1.next = node2;
            node2.object = 2;
            node2.next = node3;
            node3.object = 3;
            node3.next = node4;
            node4.object = 4;
            node4.next = node5;
            node5.object = 5;
            node5.next = null;
        }
    }

    private Object deleteLink(LinkTable data, int index) throws Exception {
        if (index < 1) {
            throw new IndexOutOfBoundsException("线性表的索引是从1开始的");
        }

        int j = 1;
        Node p = data.node;
        //j==index时就不循环了，j终止累加
        for (; j < index && p != null; p = p.next) {
            j++;
        }

        if (j > index || p == null) {
            throw new Exception("没有找到index处所对应的节点");
        }

        //保存一份即将删除的元素作为返回
        Node q = p.next;
        p.next = q.next;
        return q.object;
    }

    public static void main(String[] args) {
        LinkDelete linkDelete = new LinkDelete();
        LinkTable linkTable = new LinkTable();
        System.out.println("删除前链表中的元素：");
        for (Node node = linkTable.node.next; node != null; node = node.next) {
            System.out.println(node.object);
        }

        try {
            System.out.println("删除的元素为：" + linkDelete.deleteLink(linkTable, 3));
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("删除后链表中的元素");
        for (Node node = linkTable.node.next; node != null; node = node.next) {
            System.out.println(node.object);
        }
    }
}
