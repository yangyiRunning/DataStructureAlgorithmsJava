package ds;

/**
 * 二叉搜索树中第K小的元素
 * <p>
 * 给定一个二叉搜索树，编写一个函数 kthSmallest 来查找其中第 k 个最小的元素。
 * <p>
 * 说明：
 * 你可以假设 k 总是有效的，1 ≤ k ≤ 二叉搜索树元素个数。
 * <p>
 * 示例 1:
 * <p>
 * 输入: root = [3,1,4,null,2], k = 1
 * 3
 * / \
 * 1   4
 * \
 * 2
 * 输出: 1
 * 示例 2:
 * <p>
 * 输入: root = [5,3,6,2,4,null,null,1], k = 3
 * 5
 * / \
 * 3   6
 * / \
 * 2   4
 * /
 * 1
 * 输出: 3
 * 进阶：
 * 如果二叉搜索树经常被修改（插入/删除操作）并且你需要频繁地查找第 k 小的值，你将如何优化 kthSmallest 函数？
 *
 * @author yangyi 2019年02月10日10:34:52
 */
public class KthSmallestInBST {

    /**
     * 用于统计中序遍历走到前几个节点处了
     */
    private int index;

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode(int x) {
            val = x;
        }
    }

    public int kthSmallest(TreeNode root, int k) {
        int result = -1;
        if (root == null) {
            return result;
        }
        result = kthSmallest(root.left, k);
        if (index == k) {
            return result;
        }
        index++;
        if (index == k) {
            return root.val;
        }
        return kthSmallest(root.right, k);
    }

    public TreeNode createTreeNode() {
        TreeNode tree_3 = new TreeNode(3);
        TreeNode tree_1 = new TreeNode(1);
        TreeNode tree_4 = new TreeNode(4);
        TreeNode tree_2 = new TreeNode(2);
        tree_3.left = tree_1;
        tree_3.right = tree_4;
        tree_1.right = tree_2;
        return tree_3;
    }

    public static void main(String[] args) {
        KthSmallestInBST kthSmallestInBST = new KthSmallestInBST();
        TreeNode node = kthSmallestInBST.createTreeNode();
        System.out.println(kthSmallestInBST.kthSmallest(node, 1));
    }
}
