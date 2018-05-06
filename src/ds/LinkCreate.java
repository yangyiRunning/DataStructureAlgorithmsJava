package ds;

/**
 * 线性表的创建（基于链式存储的逻辑结构）
 *
 * @author yangyi 2018年05月06日15:07:45
 */
public class LinkCreate {

    /**
     * 这是节点
     */
    static class Node {
        public Object object;
        public Node next;
    }

    /**
     * 这是线性表
     */
    static class LinkTable {
        public Node node;

        /**
         * 创建一个带头结点的链表
         */
        public LinkTable() {
            node = new Node();
            node.object = "我是一个头结点";
            node.next = null;
        }
    }

    /**
     * 头插法插入数据元素
     *
     * @param data   即将被插的线性表
     * @param object 插入的一排数据
     * @return
     */
    private LinkTable headCreate(LinkTable data, Object[] object) {
        Node p = data.node;

        for (int i = 0; i < object.length; i++) {
            Node node = new Node();
            node.object = object[i];
            node.next = p.next;
            p.next = node;
        }

        //返回加入新节点的线性表
        return data;
    }

    public static void main(String[] args) {
        LinkCreate linkCreate = new LinkCreate();
        LinkTable linkTable = new LinkTable();
        LinkTable linkTable1 = linkCreate.headCreate(linkTable, new String[]{"我", "上", "楼", "复", "习"});

        for (Node node = linkTable1.node.next; node != null; node = node.next) {
            System.out.println(node.object);
        }
    }
}
