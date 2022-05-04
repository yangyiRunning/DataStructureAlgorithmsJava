package ds.bst.leetcode109;

import java.util.ArrayDeque;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

/**
 * 有序链表转换二叉搜索树
 * LeetCode 109 https://leetcode-cn.com/problems/convert-sorted-list-to-binary-search-tree/
 *
 * @author yangyi 2022年04月22日11:49:00
 */
public class Solution {

    public static class ListNode {
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

    private List<List<TreeNode>> levelOrder(TreeNode root) {
        if (root == null) {
            return new LinkedList<>();
        }
        List<List<TreeNode>> result = new LinkedList<>();
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            List<TreeNode> level = new LinkedList<>();
            for (int i = 0; i < size; i++) {
                TreeNode cur = queue.poll();
                if (cur != null) {
                    level.add(cur);
                }
                if (cur.left != null) {
                    queue.offer(cur.left);
                }
                if (cur.right != null) {
                    queue.offer(cur.right);
                }
            }
            result.add(level);
        }
        return result;
    }

    private ListNode createListNode() {
        ListNode val_10 = new ListNode(-10);
        ListNode val_3 = new ListNode(-3);
        ListNode val_0 = new ListNode(0);
        ListNode val_5 = new ListNode(5);
        ListNode val_9 = new ListNode(9);
        val_10.next = val_3;
        val_3.next = val_0;
        val_0.next = val_5;
        val_5.next = val_9;
        return val_10;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        ListNode link = solution.createListNode();
        TreeNode tree = solution.sortedListToBST(link);
        List<List<TreeNode>> result = solution.levelOrder(tree);
        for (List<TreeNode> treeNodes : result) {
            for (TreeNode treeNode : treeNodes) {
                System.out.print(treeNode.val + " ");
            }
            System.out.println();
        }
    }

}
