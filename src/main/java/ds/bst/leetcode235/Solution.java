package ds.bst.leetcode235;

/**
 * 二叉搜索树的最近公共祖先
 * LeetCode 235 https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-search-tree/submissions/
 * 剑指 Offer 68 - I https://leetcode-cn.com/problems/er-cha-sou-suo-shu-de-zui-jin-gong-gong-zu-xian-lcof/
 *
 * @author yangyi 2019年01月25日19:15:29
 */
public class Solution {

    public static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode(int x) {
            val = x;
        }
    }

    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (p.val < root.val && q.val < root.val) {
            return lowestCommonAncestor(
                    root.left,
                    new TreeNode(p.val),
                    new TreeNode(q.val));
        } else if (p.val > root.val && q.val > root.val) {
            return lowestCommonAncestor(
                    root.right,
                    new TreeNode(p.val),
                    new TreeNode(q.val));
        } else {
            return root;
        }
    }

    private TreeNode createTree() {
        TreeNode node_6 = new TreeNode(6);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_8 = new TreeNode(8);
        TreeNode node_0 = new TreeNode(0);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_7 = new TreeNode(7);
        TreeNode node_9 = new TreeNode(9);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_5 = new TreeNode(5);
        node_6.left = node_2;
        node_6.right = node_8;
        node_2.left = node_0;
        node_2.right = node_4;
        node_4.left = node_3;
        node_4.right = node_5;
        node_8.left = node_7;
        node_8.right = node_9;
        return node_6;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        TreeNode resultNode = solution.lowestCommonAncestor(
                solution.createTree(),
                new TreeNode(2),
                new TreeNode(8));
        System.out.println("输出结果为:" + resultNode.val);
    }
}
