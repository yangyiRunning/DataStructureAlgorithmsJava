package ds;

/**
 * 移除链表元素
 * <p>
 * 删除链表中等于给定值 val 的所有节点。
 * <p>
 * 示例:
 * <p>
 * 输入: 1->2->6->3->4->5->6, val = 6
 * 输出: 1->2->3->4->5
 *
 * @author yangyi 2019年02月09日15:20:52
 */
public class RemoveElements {

    public class ListNode {
        int val;
        ListNode next;

        ListNode(int x) {
            val = x;
        }
    }

    public ListNode removeElements(ListNode head, int val) {
        if (head == null) {
            return null;
        }
        ListNode bing = new ListNode(999);
        bing.next = head;
        //循环的条件判断一定要判断p.next是否为null
        ListNode p = bing;
        //这里一定要判断当前指针的下一个节点是否为null
        while (p.next != null) {
            //当前指向的下一个节点的val等于所要删除的val，删除指向的下一个节点
            if (p.next.val == val) {
                p.next = p.next.next;
            } else {
                p = p.next;
            }
        }
        return bing.next;
    }

    private ListNode createListNode() {
        ListNode one = new ListNode(1);
        ListNode two = new ListNode(2);
        ListNode six = new ListNode(6);
        ListNode three = new ListNode(3);
        ListNode four = new ListNode(4);
        ListNode five = new ListNode(5);
        ListNode six2 = new ListNode(6);
        one.next = two;
        two.next = six;
        six.next = three;
        three.next = four;
        four.next = five;
        five.next = six2;
        return one;
    }

    public static void main(String[] args) {
        System.out.println("看一下等待删除的链表:");
        RemoveElements removeElements = new RemoveElements();
        ListNode node = removeElements.createListNode();
        for (ListNode n = node; n != null; n = n.next) {
            System.out.print(n.val + "——>");
        }
        ListNode newNode = removeElements.removeElements(node, 6);
        System.out.println();
        System.out.println("删除完之后的链表:");
        for (ListNode n = newNode; n != null; n = n.next) {
            System.out.print(n.val + "——>");
        }
    }
}
