package ds;

/**
 * 查找线性表中的某一个元素（基于链式存储的逻辑结构实现）
 *
 * @author yangyi on 2018/5/5.
 */
public class LinkGet {

    /**
     * 节点定义
     */
    static class Node {
        public Object object;
        public Node next;
    }

    /**
     * 定义一个线性表（基于链式存储的方式实现）
     */
    static class LinkTable {
        public Node node;

        /**
         * 构造一个有数据的链表1->2->3->4->5，方便我们进行查找测试
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
     * 查找线性表中的第index个元素并将其返回
     */
    private Object getLink(LinkTable data, int index) throws Exception {
        //用来标记查找到哪了
        int j = 1;
        Node p;

        if (index < 1) {
            throw new IndexOutOfBoundsException("线性表的index请从1开始");
        }

        for (p = data.node.next; j < index && p != null; p = p.next) {
            j++;
        }

        return p == null ? null : p.object;
    }

    public static void main(String[] args) {
        LinkGet linkGet = new LinkGet();
        LinkTable data = new LinkTable();
        int number = 3;
        try {
            System.out.println("输出线性表中的第" + number + "个元素为：" + linkGet.getLink(data, number));
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("遍历所有的链表中的元素如下：");
        for (Node node = data.node.next; node != null; node = node.next) {
            System.out.println(node.object);
        }
    }
}
