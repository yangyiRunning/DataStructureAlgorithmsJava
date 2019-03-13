package ds;

/**
 * 链式栈（基于链表实现的栈）
 *
 * @author yangyi 2018年12月02日13:50:17
 */
public class LinkStack {

    private int count;
    private int capacity;
    /**
     * 创建一个哨兵
     */
    private Node node;

    public LinkStack(int capacity) {
        this.capacity = capacity;
        this.count = 0;
        //初始化哨兵
        this.node = new Node();
    }

    static class Node {
        Object object;
        Node next;
    }

    /**
     * 入栈
     */
    public boolean push(Node newNode) {
        if (newNode == null) {
            return false;
        }
        if (count == capacity) {
            return false;
        }
        newNode.next = node.next;
        node.next = newNode;
        count++;
        return true;
    }

    /**
     * 出栈
     */
    public Object pop() {
        if (count == 0) {
            return null;
        }
        //哨兵的下一个节点，作为返回值返回
        Node popNode = node.next;
        //哨兵本人指向其下一个的下一个
        node.next = node.next.next;
        count--;
        return popNode.object;
    }

    public int getSize(){
        return count;
    }

    public static void main(String[] args) {
        //准备好大于100个节点数据（具体来说是101个）数用于测试
        Node[] nodes = new Node[101];
        for (int i = 0; i < nodes.length; i++) {
            Node node = new Node();
            node.object = i;
            nodes[i] = node;
        }

        LinkStack linkStack = new LinkStack(100);
        //将准备的好的数组顺序输出看下结果，顺便将准备好的数据依次压入栈中
        for (Node node : nodes) {
            System.out.println(node.object);
            linkStack.push(node);
        }

        System.out.println("————————————朴素的分割线——————————————");

        int count = linkStack.getSize();
        //依次输出栈内元素看看顺序
        for (int i = 0; i < count; i++) {
            System.out.println(linkStack.pop());
        }
    }
}
