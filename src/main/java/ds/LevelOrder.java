package ds;

import java.util.*;

/**
 * 给定一个二叉树，返回其按层次遍历的节点值。 （即逐层地，从左到右访问所有节点）。
 * <p>
 * 例如:
 * 给定二叉树: [3,9,20,null,null,15,7],
 * <p>
 * 3
 * / \
 * 9  20
 * /  \
 * 15   7
 * 返回其层次遍历结果：
 * <p>
 * [
 * [3],
 * [9,20],
 * [15,7]
 * ]
 *
 * @author yangyi 2019年01月28日11:10:18
 */
public class LevelOrder {

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
    }

    public List<List<Integer>> levelOrder(TreeNode root) {
        if (root == null) {
            return new LinkedList<>();
        }
        List<List<Integer>> result = new LinkedList<>();
        Queue<TreeNode> queue = new ArrayDeque<>();
        Set<TreeNode> set = new HashSet<>();
        queue.offer(root);
        set.add(root);

        while (!queue.isEmpty()) {
            //标尺队列的长度，这里一定要用一个指针指针指向一下，否则就会出错
            int levelSize = queue.size();
            List<Integer> integerList = new ArrayList<>();
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                integerList.add(node.val);
                if (node.left != null) {
                    if (!set.contains(node.left)) {
                        queue.offer(node.left);
                        set.add(node.left);
                    }
                }
                if (node.right != null) {
                    if (!set.contains(node.right)) {
                        queue.offer(node.right);
                        set.add(node.right);
                    }
                }
            }
            result.add(integerList);
        }
        return result;
    }

    public TreeNode createTree() {
        TreeNode node_3 = new TreeNode();
        node_3.val = 3;
        TreeNode node_9 = new TreeNode();
        node_9.val = 9;
        TreeNode node_20 = new TreeNode();
        node_20.val = 20;
        TreeNode node_15 = new TreeNode();
        node_15.val = 15;
        TreeNode node_7 = new TreeNode();
        node_7.val = 7;
        node_3.left = node_9;
        node_3.right = node_20;
        node_9.left = node_15;
        node_20.right = node_7;
        return node_3;
    }

    public static void main(String[] args) {
        LevelOrder levelOrder = new LevelOrder();
        List<List<Integer>> result = levelOrder.levelOrder(levelOrder.createTree());
        System.out.println("遍历结果出来看看:");
        for (List<Integer> integerList : result) {
            for (Integer integer : integerList) {
                System.out.println(integer);
            }
        }
    }
}
