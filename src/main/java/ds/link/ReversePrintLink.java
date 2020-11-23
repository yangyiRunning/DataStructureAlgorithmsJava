package ds.link;

import ds.LinkCreate;

import java.util.Stack;

/**
 * 从尾到头打印链表
 * <p>
 * 方法1: 先把链表反转，然后在遍历输出。 但是因为反转了一遍，所以会改变链表的结构，并不是每一个场景都允许。
 * <p>
 * 方法2: 正常遍历链表，用一个栈收集链表中的元素，然后遍历输出该栈。
 * <p>
 * 方法3: 递归输出链表的下一个节点，然后再输出当前节点。
 *
 * @author yangyi 2019年02月08日08:42:45
 */
public class ReversePrintLink {

    /**
     * 借助栈实现
     */
    public void reversePrintLink(LinkCreate.Node head) {
        if (head == null) {
            return;
        }
        Stack<LinkCreate.Node> nodeStack = new Stack<>();
        for (LinkCreate.Node node = head; node != null; node = node.next) {
            nodeStack.push(node);
        }
        while (!nodeStack.isEmpty()) {
            System.out.println(nodeStack.peek().object);
            nodeStack.pop();
        }
    }

    /**
     * 递归实现
     */
    public void reversePrintLinkRecursion(LinkCreate.Node head) {
        if (head != null) {
            if (head.next != null) {
                reversePrintLinkRecursion(head.next);
            }
            System.out.println(head.object);
        }
    }

    public static void main(String[] args) {
        LinkCreate linkCreate = new LinkCreate();
        LinkCreate.LinkTable linkTable = new LinkCreate.LinkTable();
        Object[] ints = new Object[10];
        for (int i = 0; i < 10; i++) {
            ints[i] = (int) (Math.random() * 10);
        }
        LinkCreate.LinkTable linkTableResult = linkCreate.headCreate(linkTable, ints);
        System.out.println("构造好的待输出链表打印出来看看:");
        for (LinkCreate.Node result = linkTableResult.node; result != null; result = result.next) {
            System.out.println(result.object);
        }
        ReversePrintLink reversePrintLink = new ReversePrintLink();
        System.out.println("采用栈逆序输出:");
        reversePrintLink.reversePrintLink(linkTableResult.node);
        System.out.println("采用递归逆序输出:");
        reversePrintLink.reversePrintLinkRecursion(linkTableResult.node);
    }
}
