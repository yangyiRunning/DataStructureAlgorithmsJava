package ds.tree.leetcode100;

/**
 * 相同的树
 * LeetCode 100 https://leetcode-cn.com/problems/same-tree/
 *
 * @author yangyi 2021年01月31日23:02:44
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

    public boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) {
            return true;
        } else if (p == null && q != null) {
            return false;
        } else if (p != null && q == null) {
            return false;
        } else if (p.val != q.val) {
            return false;
        }
        boolean leftSame = isSameTree(p.left, q.left);
        boolean rightSame = isSameTree(p.right, q.right);
        return leftSame && rightSame;
    }

    public TreeNode[] createTreeNode() {
        TreeNode[] treeNodes = new TreeNode[3];

        TreeNode val_1 = new TreeNode(1);
        TreeNode val_2 = new TreeNode(2);
        TreeNode val_3 = new TreeNode(3);
        val_1.left = val_2;
        val_1.right = val_3;
        treeNodes[0] = val_1;

        TreeNode val_4 = new TreeNode(4);
        TreeNode val_5 = new TreeNode(5);
        TreeNode val_6 = new TreeNode(6);
        val_4.left = val_5;
        val_4.right = val_6;
        treeNodes[1] = val_4;

        TreeNode val_1_1 = new TreeNode(1);
        TreeNode val_2_2 = new TreeNode(2);
        TreeNode val_3_3 = new TreeNode(3);
        val_1_1.left = val_2_2;
        val_1_1.right = val_3_3;
        treeNodes[2] = val_1_1;

        return treeNodes;
    }

    public static void main(String[] args) {
        Solution sameTree = new Solution();
        TreeNode[] treeNodes = sameTree.createTreeNode();
        System.out.println("两个树是否相同:" + sameTree.isSameTree(treeNodes[0], treeNodes[1]));
        System.out.println("两个树是否相同:" + sameTree.isSameTree(treeNodes[0], treeNodes[2]));
    }

}
