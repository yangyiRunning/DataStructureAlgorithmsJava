package ds;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

/**
 * 给定一棵二叉树，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。
 * <p>
 * 示例:
 * <p>
 * 输入: [1,2,3,null,5,null,4]
 * 输出: [1, 3, 4]
 * 解释:
 * <p>
 * 1            <---
 * /   \
 * 2     3         <---
 * \     \
 * 5     4       <---
 */
public class RightSideView {

    public static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode(int x) {
            val = x;
        }
    }

    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) {
            return result;
        }
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            int index = 0;
            for (int i = 0; i < size; i++) {
                TreeNode current = queue.poll();
                if (current != null) {
                    if (index == size - 1) {
                        result.add(current.val);
                    }
                    if (current.left != null) {
                        queue.offer(current.left);
                    }
                    if (current.right != null) {
                        queue.offer(current.right);
                    }
                }
                index++;
            }
        }
        return result;
    }

    public static void main(String[] args) {
        TreeNode one = new TreeNode(1);
        TreeNode two = new TreeNode(2);
        TreeNode three = new TreeNode(3);
        TreeNode five = new TreeNode(5);
        TreeNode four = new TreeNode(4);

        one.left = two;
        one.right = three;
        two.right = five;
        three.right = four;

        RightSideView rightSideView = new RightSideView();
        List<Integer> integers = rightSideView.rightSideView(one);
        for (Integer integer : integers) {
            System.out.println(integer);
        }
    }
}
