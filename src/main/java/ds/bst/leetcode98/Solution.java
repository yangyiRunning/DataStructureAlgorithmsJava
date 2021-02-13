package ds.bst.leetcode98;

import java.util.ArrayList;
import java.util.List;

/**
 * 验证二叉搜索树
 * LeetCode 98 https://leetcode-cn.com/problems/validate-binary-search-tree/
 *
 * @author yangyi 2021年02月12日21:48:49
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

    private List<Integer> result = new ArrayList<>();

    /**
     * 方法1:
     * 1. 中序遍历这个树，看最终的结果是否是有序的。
     * 2. 判断有序与否，注意不用排序，只需要判断当前节点是否比前继节点大即可。
     */
    public boolean isValidBST(TreeNode root) {
        inOrder(root);
        for (int i = 1; i < result.size(); i++) {
            if (result.get(i) <= result.get(i - 1)) {
                return false;
            }
        }
        return true;
    }

    private void inOrder(TreeNode root) {
        if (root == null) {
            return;
        }
        inOrder(root.left);
        result.add(root.val);
        inOrder(root.right);
    }

    /**
     * 方法2中记录前一个节点
     */
    private TreeNode pre;

    /**
     * 方法2:
     * 1. 递归形式参数和返回值，形式参数: 树本身。返回值: 是否为二叉查找树
     * 2. 终止条件: 当树为空时，当做二叉查找树处理。 前一个节点不为空且现在的节点小于前一个节点时，违反了二叉查找树的规则
     * 3. 单层递归逻辑: 采用中序遍历，左跟右，判断左子树是否为二叉查找树，判断右子树是否为二叉查找树，最终两者都是则整棵树为二叉查找树
     */
    public boolean isValidBST2(TreeNode root) {
        if (root == null) {
            return true;
        }
        boolean left = isValidBST2(root.left);
        if (pre != null && pre.val >= root.val) {
            return false;
        }
        pre = root;
        boolean right = isValidBST2(root.right);
        return left && right;
    }

    private TreeNode createTree1() {
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_3 = new TreeNode(3);
        node_2.left = node_1;
        node_2.right = node_3;
        return node_2;
    }

    private TreeNode createTree2() {
        TreeNode node_5 = new TreeNode(5);
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_6 = new TreeNode(6);
        node_5.left = node_1;
        node_5.right = node_4;
        node_4.left = node_3;
        node_4.right = node_6;
        return node_5;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        System.out.println("方法一验证:");
        System.out.println(solution.isValidBST(solution.createTree1()));
        System.out.println(solution.isValidBST(solution.createTree2()));
        System.out.println("方法二验证:");
        System.out.println(solution.isValidBST2(solution.createTree1()));
        System.out.println(solution.isValidBST2(solution.createTree2()));
    }
}
