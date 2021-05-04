package ds.tree.leetcode993;

import java.util.LinkedList;
import java.util.Queue;

/**
 * 二叉树的堂兄弟节点
 * LeetCode 993 https://leetcode-cn.com/problems/cousins-in-binary-tree/
 *
 * @author yangyi 2021年05月01日01:07:28
 */
public class Solution {

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

    public boolean isCousins(TreeNode root, int x, int y) {
        if (root == null) {
            return false;
        }
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int parentx, parenty;
        int deepx = 0, deepy = 0;
        while (!queue.isEmpty()) {
            int size = queue.size();
            parentx = -1;
            parenty = -1;
            for (int i = 0; i < size; i++) {
                TreeNode cur = queue.poll();
                if (cur.left != null) {
                    queue.offer(cur.left);
                    if (cur.left.val == x) {
                        parentx = cur.val;
                    } else if (cur.left.val == y) {
                        parenty = cur.val;
                    }
                }
                if (cur.right != null) {
                    queue.offer(cur.right);
                    if (cur.right.val == x) {
                        parentx = cur.val;
                    } else if (cur.right.val == y) {
                        parenty = cur.val;
                    }
                }
                if (parentx != -1 && parenty != -1 && parentx != parenty && deepx == deepy) {
                    return true;
                }
            }
            deepx++;
            deepy++;
        }
        return false;
    }

    private TreeNode createTree1() {
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_4 = new TreeNode(4);
        node_1.left = node_2;
        node_1.right = node_3;
        node_2.left = node_4;
        return node_1;
    }

    private TreeNode createTree2() {
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_5 = new TreeNode(5);
        node_1.left = node_2;
        node_1.right = node_3;
        node_2.right = node_4;
        node_3.right = node_5;
        return node_1;
    }

    private TreeNode createTree3() {
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_4 = new TreeNode(4);
        node_1.left = node_2;
        node_1.right = node_3;
        node_2.right = node_4;
        return node_1;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().isCousins(new Solution().createTree1(), 4, 3));
        System.out.println(new Solution().isCousins(new Solution().createTree2(), 5, 4));
        System.out.println(new Solution().isCousins(new Solution().createTree3(), 2, 3));
    }


}
