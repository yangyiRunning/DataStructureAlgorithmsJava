package ds;

import java.util.HashSet;
import java.util.Set;
import java.util.Stack;

/**
 * 还是以一棵树为例，深度优先遍历一遍看结果
 *
 * @author yangyi 2019年01月27日22:28:39
 */
public class DepthPrint {

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
    }

    public void depthPrint(TreeNode node) {
        if (node == null) {
            return;
        }
        Stack<TreeNode> stack = new Stack<>();
        Set<TreeNode> set = new HashSet<>();
        TreeNode current;
        stack.push(node);
        set.add(node);
        while (!stack.isEmpty()) {
            current = stack.pop();
            System.out.println(current.val);
            if (current.right != null) {
                if (!set.contains(current.right)) {
                    stack.push(current.right);
                    set.add(current.right);
                }
            }
            if (current.left != null) {
                if (!set.contains(current.left)) {
                    stack.push(current.left);
                    set.add(current.left);
                }
            }
        }
    }

    public TreeNode createTree() {
        TreeNode one = new TreeNode();
        one.val = 1;
        TreeNode two = new TreeNode();
        two.val = 2;
        TreeNode three = new TreeNode();
        three.val = 3;
        TreeNode four = new TreeNode();
        four.val = 4;
        TreeNode five = new TreeNode();
        five.val = 5;
        TreeNode six = new TreeNode();
        six.val = 6;
        TreeNode seven = new TreeNode();
        seven.val = 7;
        TreeNode eight = new TreeNode();
        eight.val = 8;

        one.left = two;
        one.right = five;
        two.left = three;
        three.left = four;
        one.right = five;
        five.left = six;
        six.left = seven;
        five.right = eight;

        return one;

    }

    public static void main(String[] args) {
        DepthPrint depthPrint = new DepthPrint();
        TreeNode node = depthPrint.createTree();
        depthPrint.depthPrint(node);
    }
}
