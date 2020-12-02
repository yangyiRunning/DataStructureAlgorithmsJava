package ds.bst;

/**
 * 把二叉搜索树转换为累加树
 * LeetCode 1038 https://leetcode-cn.com/problems/binary-search-tree-to-greater-sum-tree/
 * LeetCode 538 https://leetcode-cn.com/problems/convert-bst-to-greater-tree/
 *
 * @author yangyi 2020年12月02日09:08:55
 */
public class BstToGst {

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

    public TreeNode bstToGst(TreeNode root) {

        return root;
    }


}
