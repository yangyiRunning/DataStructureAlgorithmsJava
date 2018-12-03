package ds;

/**
 * 线性表的创建（基于链式存储的物理结构）头插法和尾插法
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
     * @param data    即将被插的线性表
     * @param objects 插入的一排数据
     * @return
     */
    private LinkTable headCreate(LinkTable data, Object[] objects) {
        Node p = data.node;

        for (int i = 0; i < objects.length; i++) {
            Node node = new Node();
            node.object = objects[i];
            node.next = p.next;
            p.next = node;
        }

        //返回加入新节点的线性表
        return data;
    }

    /**
     * 尾插法插入数据元素
     *
     * @param data    即将被插的线性表
     * @param objects 插入的一排数据
     * @return
     */
    private LinkTable tailCreate(LinkTable data, Object[] objects) {
        //p指向线性表的头节点
        Node p = data.node;

        for (int i = 0; i < objects.length; i++) {
            Node node = new Node();
            node.object = objects[i];
            p.next = node;
            p = node;
        }

        p.next = null;
        //被插完后返回
        return data;
    }

    /**
     * 整表清空
     *
     * @param data 要清空的线性表
     * @return
     */
    private LinkTable clearLink(LinkTable data) {
        for (Node p = data.node; p != null; p = p.next) {
            Node q = p.next;
            //释放p
            p.object = null;
            p.next = null;
            //这个干掉了再接着去干下一个
            p = q;
        }
        return data;
    }

    public static void main(String[] args) {
        LinkCreate linkCreate = new LinkCreate();

        System.out.println("头插法插入数据后打印出来看看：");
        LinkTable linkTable = new LinkTable();
        LinkTable linkTable2 = linkCreate.headCreate(linkTable, new String[]{"我", "上", "楼", "复", "习"});
        for (Node node = linkTable2.node.next; node != null; node = node.next) {
            System.out.println(node.object);
        }

        System.out.println();
        System.out.println("尾插法插入数据后打印出来看看：");
        LinkTable linkTableTail = new LinkTable();
        LinkTable linkTableTail2 = linkCreate.tailCreate(linkTableTail, new String[]{"我", "上", "楼", "复", "习"});
        for (Node node = linkTableTail2.node.next; node != null; node = node.next) {
            System.out.println(node.object);
        }

        System.out.println();
        System.out.println("清除头插法构造的线性表将其输出：");
        linkCreate.clearLink(linkTable2);
        for (Node node = linkTable2.node.next; node != null; node = node.next) {
            System.out.println(node.object);
        }

        System.out.println("清除尾插法构造的线性表将其输出：");
        linkCreate.clearLink(linkTableTail2);
        for (Node node = linkTableTail2.node.next; node != null; node = node.next) {
            System.out.println(node.object);
        }
    }
}
