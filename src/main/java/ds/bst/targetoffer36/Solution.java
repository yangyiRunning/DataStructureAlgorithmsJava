package ds.bst.targetoffer36;

/**
 * 二叉搜索树与双向链表
 * 剑指 Offer 36. https://leetcode-cn.com/problems/er-cha-sou-suo-shu-yu-shuang-xiang-lian-biao-lcof/
 * 426. 将二叉搜索树转化为排序的双向链表
 *
 * @author yangyi 2021年05月01日00:41:51
 */
public class Solution {

    class Node {
        public int val;
        public Node left;
        public Node right;

        public Node() {
        }

        public Node(int _val) {
            val = _val;
        }

        public Node(int _val, Node _left, Node _right) {
            val = _val;
            left = _left;
            right = _right;
        }
    }

    private Node pre = null, head = null;

    public Node treeToDoublyList(Node root) {
        if (root == null) {
            return null;
        }
        inOrder(root);
        head.left = pre;
        pre.right = head;
        return head;
    }

    private void inOrder(Node cur) {
        if (cur == null) {
            return;
        }
        inOrder(cur.left);
        if (pre == null) {
            head = cur;
        } else {
            pre.right = cur;
        }
        cur.left = pre;
        pre = cur;
        inOrder(cur.right);
    }

    public static void main(String[] args) {

    }

}
