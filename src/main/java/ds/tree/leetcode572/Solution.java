package ds.tree.leetcode572;

/**
 * 另一个树的子树
 * LeetCode 572 https://leetcode-cn.com/problems/subtree-of-another-tree/
 *
 * @author yangyi 2021年01月31日23:09:16
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

    public boolean isSubtree(TreeNode s, TreeNode t) {
        if (t == null) {
            return true;
        }
        if (s == null) {
            return false;
        }
        return isSubtree(s.left, t) || isSubtree(s.right, t) || isSameTree(s, t);
    }

    private boolean isSameTree(TreeNode s, TreeNode t) {
        if (s == null && t == null) {
            return true;
        } else if (s != null && t == null) {
            return false;
        } else if (s == null && t != null) {
            return false;
        } else if (s.val != t.val) {
            return false;
        }
        boolean leftSame = isSameTree(s.left, t.left);
        boolean rightSame = isSameTree(s.right, t.right);
        return leftSame && rightSame;
    }

    private TreeNode createTree() {
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_5 = new TreeNode(5);
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(2);
        node_3.left = node_4;
        node_3.right = node_5;
        node_4.left = node_1;
        node_4.right = node_2;
        return node_3;
    }

    private TreeNode createTree2() {
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_5 = new TreeNode(5);
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_0 = new TreeNode(0);
        node_3.left = node_4;
        node_3.right = node_5;
        node_4.left = node_1;
        node_4.right = node_2;
        node_2.left = node_0;
        return node_3;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        System.out.println(solution.isSubtree(solution.createTree(), solution.createTree2()));
    }
}
