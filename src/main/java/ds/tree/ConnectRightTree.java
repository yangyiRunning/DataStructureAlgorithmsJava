package ds.tree;

/**
 * 填充每个节点的下一个右侧节点指针
 * LeetCode 116 https://leetcode-cn.com/problems/populating-next-right-pointers-in-each-node/
 *
 * @author yangyi 2020年11月25日11:10:04
 */
public class ConnectRightTree {

    public static class TreeNode {
        public int val;
        public TreeNode left;
        public TreeNode right;
        public TreeNode next;

        public TreeNode() {
        }

        public TreeNode(int val) {
            this.val = val;
        }

        public TreeNode(int val, TreeNode left, TreeNode right, TreeNode next) {
            this.val = val;
            this.left = left;
            this.right = right;
            this.next = next;
        }
    }

    /**
     * 1
     * /   \
     * 2     3
     * / \   / \
     * 4   5 6   7
     */
    private TreeNode createTree() {
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_5 = new TreeNode(5);
        TreeNode node_6 = new TreeNode(6);
        TreeNode node_7 = new TreeNode(7);
        node_1.left = node_2;
        node_1.right = node_3;
        node_2.left = node_4;
        node_2.right = node_5;
        node_3.left = node_6;
        node_3.right = node_7;
        return node_1;
    }

    private void inOrder(TreeNode root) {
        if (root == null) {
            return;
        }
        inOrder(root.left);
        System.out.println(root.val);
        inOrder(root.right);
    }

    private TreeNode connect(TreeNode root) {
        if (root == null) {
            return null;
        }
        connectTwoNode(root.left, root.right);
        return root;
    }

    private void connectTwoNode(TreeNode node1, TreeNode node2) {
        if (node1 == null || node2 == null) {
            return;
        }
        node1.next = node2;
        connectTwoNode(node1.left, node1.right);
        connectTwoNode(node2.left, node2.right);
        connectTwoNode(node1.right, node2.left);
    }

    private void preOrderLink(TreeNode node) {
        if (node == null) {
            return;
        }
        System.out.print(node.val + " ");
        preOrderLink(node.next);
    }

    public static void main(String[] args) {
        ConnectRightTree connectRightTree = new ConnectRightTree();
        TreeNode root = connectRightTree.createTree();
        System.out.println("中序遍历创建完成的树并打印:");
        connectRightTree.inOrder(root);
        System.out.println("填充每个节点的下一个右侧节点指针");
        System.out.println("填充完后验证一下结果，手动输出每一层，注意此处并不是层序遍历二叉树，而是利用连接后的链表特性正序输出该层的链表");
        TreeNode node = connectRightTree.connect(root);
        connectRightTree.preOrderLink(node);
        System.out.println();
        connectRightTree.preOrderLink(node.left);
        System.out.println();
        connectRightTree.preOrderLink(node.left.left);
    }

}
