package ds.bfs.targetoffer323;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

/**
 * 从上到下打印二叉树 III
 * 剑指 Offer 32 - III. https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-iii-lcof/
 *
 * @author yangyi 2021年04月30日18:19:54
 */
public class Solution {

    public class TreeNode {
        int val;
        Solution.TreeNode left;
        Solution.TreeNode right;

        TreeNode(int x) {
            val = x;
        }
    }

    private Solution.TreeNode createTree() {
        Solution.TreeNode node_3 = new Solution.TreeNode(3);
        Solution.TreeNode node_9 = new Solution.TreeNode(9);
        Solution.TreeNode node_20 = new Solution.TreeNode(20);
        Solution.TreeNode node_15 = new Solution.TreeNode(15);
        Solution.TreeNode node_7 = new Solution.TreeNode(7);
        node_3.left = node_9;
        node_3.right = node_20;
        node_20.left = node_15;
        node_20.right = node_7;
        return node_3;
    }

    public List<List<Integer>> levelOrder(Solution.TreeNode root) {
        if (root == null) {
            return new LinkedList<>();
        }
        List<List<Integer>> result = new LinkedList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int level = 0;
        while (!queue.isEmpty()) {
            int size = queue.size();
            LinkedList<Integer> levelList = new LinkedList<>();
            for (int i = 0; i < size; i++) {
                TreeNode cur = queue.poll();
                if (cur != null) {
                    if (level % 2 == 0) {
                        levelList.addLast(cur.val);
                    } else {
                        levelList.addFirst(cur.val);
                    }
                }
                if (cur.left != null) {
                    queue.offer(cur.left);
                }
                if (cur.right != null) {
                    queue.offer(cur.right);
                }
            }
            result.add(levelList);
            level++;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new Solution().levelOrder(new Solution().createTree()).toArray()));
    }
}
