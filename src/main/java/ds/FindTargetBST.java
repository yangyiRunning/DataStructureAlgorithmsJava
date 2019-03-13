package ds;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

/**
 * 两数之和 IV - 输入 BST
 * <p>
 * 给定一个二叉搜索树和一个目标结果，如果 BST 中存在两个元素且它们的和等于给定的目标结果，则返回 true。
 * <p>
 * 案例 1:
 * <p>
 * 输入:
 * 5
 * / \
 * 3   6
 * / \   \
 * 2   4   7
 * <p>
 * Target = 9
 * <p>
 * 输出: True
 * <p>
 * <p>
 * 案例 2:
 * <p>
 * 输入:
 * 5
 * / \
 * 3   6
 * / \   \
 * 2   4   7
 * <p>
 * Target = 28
 * <p>
 * 输出: False
 *
 * @author yangyi 2019年02月17日01:23:16
 */
public class FindTargetBST {

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode(int x) {
            val = x;
        }
    }

    private List<Integer> integerList = new LinkedList<>();

    public boolean findTarget(TreeNode root, int k) {
        Set<Integer> set = new HashSet<>();
        print(root);
        for (int i = 0; i < integerList.size(); i++) {
            if (set.contains(integerList.get(i))) {
                return true;
            } else {
                set.add(k - integerList.get(i));
            }
        }
        return false;
    }

    public void print(TreeNode root) {
        if (root == null) {
            return;
        }
        print(root.left);
        integerList.add(root.val);
        print(root.right);
    }

    public TreeNode createList() {
        TreeNode node_5 = new TreeNode(5);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_6 = new TreeNode(6);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_7 = new TreeNode(7);
        node_5.left = node_3;
        node_5.right = node_6;
        node_3.left = node_2;
        node_3.right = node_4;
        node_6.right = node_7;
        return node_5;
    }

    public static void main(String[] args) {
        FindTargetBST findTargetBST = new FindTargetBST();
        TreeNode node = findTargetBST.createList();
        System.out.println(findTargetBST.findTarget(node, 9));
        System.out.println(findTargetBST.findTarget(node, 28));
    }
}
