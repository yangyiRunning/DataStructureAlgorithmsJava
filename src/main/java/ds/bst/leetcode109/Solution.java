package ds.bst.leetcode109;

/**
 * 有序链表转换二叉搜索树
 * LeetCode 109 https://leetcode-cn.com/problems/convert-sorted-list-to-binary-search-tree/
 *
 * @author yangyi 2021年05月02日14:50:14
 */
public class Solution {

    public class ListNode {
        int val;
        ListNode next;

        ListNode() {
        }

        ListNode(int val) {
            this.val = val;
        }

        ListNode(int val, ListNode next) {
            this.val = val;
            this.next = next;
        }
    }

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode() {
        }

        TreeNode(int val) {
            this.val = val;
        }

        TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val;
            this.left = left;
            this.right = right;
        }
    }

    public TreeNode sortedListToBST(ListNode head) {
        return buildTree(head, null);
    }

    private TreeNode buildTree(ListNode start, ListNode end) {
        if (start == end) {
            return null;
        }
        ListNode mNode = getLinkMiddle(start, end);
        TreeNode root = new TreeNode(mNode.val);
        root.left = buildTree(start, mNode);
        root.right = buildTree(mNode.next, end);
        return root;
    }

    private ListNode getLinkMiddle(ListNode start, ListNode end) {
        ListNode fast = start;
        ListNode slow = start;
        while (fast != end && fast.next != end) {
            fast = fast.next.next;
            slow = slow.next;
        }
        return slow;
    }

}
