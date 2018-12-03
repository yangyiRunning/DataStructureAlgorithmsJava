package ds;

/**
 * 线性表的插入操作（基于链式存储的物理结构实现）
 *
 * @author yangyi 2018年05月05日21:17:09
 */
public class LinkInsert {

    /**
     * 定义一个节点
     */
    static class Node {
        public Object object;
        public Node next;
    }

    /**
     * 定义一个线性表（基于链式存储的逻辑结构）
     */
    static class LinkTable {
        public Node node;

        /**
         * 初始化的时候装点数据方便测试
         */
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

    /**
     * 向线性表当中插入数据
     */
    private void insertLink(LinkTable data, int index, Object object) throws Exception {
        if (index < 1) {
            throw new IndexOutOfBoundsException("线性表的index是从1开始的");
        }

        //记录当前的位置
        int j = 1;
        Node p = data.node;

        //用来标记当前所在的位置，如果j==index就说明已经到达了参数预定的位置，可以进行插入操作了
        for (; j < index && p != null; p = p.next) {
            j++;
        }

        if (p == null || j > index) {
            throw new Exception("并没有找到对应的位置或者对应的位置上没有节点");
        }

        //新建一个节点
        Node node = new Node();
        node.object = object;
        node.next = null;

        node.next = p.next;
        p.next = node;
    }

    public static void main(String[] args) {
        LinkInsert linkInsert = new LinkInsert();
        LinkTable linkTable = new LinkTable();
        System.out.println("插入元素之前的链表：");
        for (Node node = linkTable.node.next; node != null; node = node.next) {
            System.out.println(node.object);
        }

        try {
            linkInsert.insertLink(linkTable, 1, 88);
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("插入元素之后的链表：");
        for (Node node = linkTable.node.next; node != null; node = node.next) {
            System.out.println(node.object);
        }
    }
}
