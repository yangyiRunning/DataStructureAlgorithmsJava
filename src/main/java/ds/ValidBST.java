package ds;

import java.util.Arrays;

/**
 * 给定一个二叉树，判断其是否是一个有效的二叉搜索树。
 * <p>
 * 假设一个二叉搜索树具有如下特征：
 * <p>
 * 节点的左子树只包含小于当前节点的数。
 * 节点的右子树只包含大于当前节点的数。
 * 所有左子树和右子树自身必须也是二叉搜索树。
 * 示例 1:
 * <p>
 * 输入:
 * 2
 * / \
 * 1   3
 * 输出: true
 * 示例 2:
 * <p>
 * 输入:
 * 5
 * / \
 * 1   4
 * / \
 * 3   6
 * 输出: false
 * 解释: 输入为: [5,1,4,null,null,3,6]。
 * 根节点的值为 5 ，但是其右子节点值为 4 。
 *
 * @author yangyi 2019年01月25日19:54:47
 */
public class ValidBST {

    private int[] array = {5, 1, 4, 0, 0, 3, 6};
    private int[] arrayBST = {1, 2, 3, 5, 6, 9, 10};

    /**
     * 保存前继节点的指针
     */
    private BinarySearchTree.TreeNode pre;

    /**
     * 方法1:
     * 1. 中序遍历这个树，看最终的结果是否是有序的。
     * 2. 判断有序与否，注意不用排序，只需要判断当前节点是否比前继节点大即可。
     */
    public boolean isValidBST(BinarySearchTree.TreeNode root) {
        pre = null;
        return inPrint(root);
    }

    private boolean inPrint(BinarySearchTree.TreeNode root) {
        //为null时约定为是一个二叉查找树
        if (root == null) {
            return true;
        }
        //开始前序遍历
        if (!inPrint(root.left)) {
            return false;
        }
        //关键就是在于这行判断，如果前继节点不为null且后继节点不大于前继节点，则说明此时已经无序了
        if (pre != null && pre.value >= root.value) {
            return false;
        }
        //判断完之后更新前继节点继续判断
        pre = root;
        return inPrint(root.right);
    }

    /**
     * 方法2:
     * 1. 遍历左子树，找到左子树中的最大值。
     * 2. 遍历右子树，找到右子树中的最小值。
     * 3. 左边的max < root < 右边的min。
     * 4. 继续递归直到满足3中的条件为止。
     */
    public boolean isValidBSTRecursion(BinarySearchTree.TreeNode root, int min, int max) {
        //为null时约定为是一个二叉查找树
        if (root == null) {
            return true;
        }
        //小于min和大于max，均非法
        if (min != Integer.MIN_VALUE && root.value <= min) {
            return false;
        }
        if (max != Integer.MAX_VALUE && root.value >= max) {
            return false;
        }
        return isValidBSTRecursion(root.left, min, root.value)
                && isValidBSTRecursion(root.right, root.value, max);
    }

    private BinarySearchTree.TreeNode createTree(int[] array) {
        BinarySearchTree binarySearchTree = new BinarySearchTree();
        BinarySearchTree.TreeNode node = null;
        for (int i : array) {
            node = binarySearchTree.insert(i);
        }
        return node;
    }

    public static void main(String[] args) {
        ValidBST validBST = new ValidBST();
        System.out.println("方法一验证:");
        System.out.println(Arrays.toString(validBST.array)
                + (validBST.isValidBST(validBST.createTree(validBST.array)) ? "是一个二叉搜索树" : "不是一个二叉搜索树"));
        System.out.println(Arrays.toString(validBST.arrayBST)
                + (validBST.isValidBST(validBST.createTree(validBST.arrayBST)) ? "是一个二叉搜索树" : "不是一个二叉搜索树"));
        System.out.println("方法二验证:");
        System.out.println(Arrays.toString(validBST.array)
                + (validBST.isValidBSTRecursion(validBST.createTree(validBST.array), Integer.MIN_VALUE, Integer.MAX_VALUE) ? "是一个二叉搜索树" : "不是一个二叉搜索树"));
        System.out.println(Arrays.toString(validBST.arrayBST)
                + (validBST.isValidBSTRecursion(validBST.createTree(validBST.arrayBST), Integer.MIN_VALUE, Integer.MAX_VALUE) ? "是一个二叉搜索树" : "不是一个二叉搜索树"));

    }
}
