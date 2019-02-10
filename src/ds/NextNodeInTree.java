package ds;

/**
 * 二叉树的下一个节点
 *
 * @author yangyi 2019年02月10日17:18:23
 */
public class NextNodeInTree {

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
        //此处除了左右节点之外，得多定义一个父节点
        TreeNode parent;

        TreeNode(int x) {
            val = x;
        }
    }

    public TreeNode getNext(TreeNode node) {
        if (node == null) {
            return null;
        }
        TreeNode next = null;
        if (node.right != null) {
            //如果有右子树，则找右子树的最左节点
            TreeNode right = node.right;
            while (right.left != null) {
                right = right.left;
            }
            next = right;
        } else if (node.parent != null) {
            TreeNode cur = node;
            TreeNode parent = node.parent;
            while (parent != null && cur == parent.right) {
                cur = parent;
                parent = parent.parent;
            }
            next = parent;
        }
        return next;
    }

    /**
     * 4
     * /   \
     * 2     7
     * / \   / \
     * 1   3 6   9
     */
    public TreeNode createTree() {
        TreeNode val_4 = new TreeNode(4);
        TreeNode val_2 = new TreeNode(2);
        TreeNode val_7 = new TreeNode(7);
        TreeNode val_1 = new TreeNode(1);
        TreeNode val_3 = new TreeNode(3);
        TreeNode val_6 = new TreeNode(6);
        TreeNode val_9 = new TreeNode(9);
        val_4.left = val_2;
        val_4.right = val_7;
        val_2.left = val_1;
        val_2.right = val_3;
        val_7.left = val_6;
        val_7.right = val_9;
        return val_4;
    }

    public void inOrder(TreeNode node) {
        if (node == null) {
            return;
        }
        inOrder(node.left);
        System.out.print(node.val + "——>");
        inOrder(node.right);
    }

    public static void main(String[] args) {
        NextNodeInTree invertTree = new NextNodeInTree();
        TreeNode node = invertTree.createTree();
        System.out.println("先中序遍历打印一遍反转前的结果:");
        invertTree.inOrder(node);
        System.out.println();
        TreeNode next = invertTree.getNext(node);
        System.out.println("输出二叉树的下一个节点:");
        System.out.println(next.val);
    }
}
