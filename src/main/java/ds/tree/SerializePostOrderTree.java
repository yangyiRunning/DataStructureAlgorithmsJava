package ds.tree;

import java.util.Arrays;
import java.util.LinkedList;

/**
 * 二叉树的序列化和反序列化(后序遍历的序列化方式实现)
 * LeetCode 297 https://leetcode-cn.com/problems/serialize-and-deserialize-binary-tree/
 *
 * @author yangyi 2020年12月07日15:28:43
 */
public class SerializePostOrderTree {

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode(int x) {
            val = x;
        }
    }

    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        serialize(root, sb);
        return sb.toString();
    }

    private void serialize(TreeNode root, StringBuilder sb) {
        if (root == null) {
            sb.append("null").append(",");
            return;
        }
        serialize(root.left, sb);
        serialize(root.right, sb);
        sb.append(root.val).append(",");
    }

    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {
        LinkedList<String> nodes = new LinkedList<>(Arrays.asList(data.split(",")));
        return deserialize(nodes);
    }

    public TreeNode deserialize(LinkedList<String> nodes) {
        if (nodes == null || nodes.size() == 0) {
            return null;
        }
        String node = nodes.removeLast();
        if ("null".equals(node)) {
            return null;
        }
        TreeNode root = new TreeNode(Integer.parseInt(node));
        root.right = deserialize(nodes);
        root.left = deserialize(nodes);
        return root;
    }

    private TreeNode createTree() {
        TreeNode node_1 = new TreeNode(1);
        TreeNode node_2 = new TreeNode(2);
        TreeNode node_3 = new TreeNode(3);
        TreeNode node_4 = new TreeNode(4);
        TreeNode node_5 = new TreeNode(5);
        node_1.left = node_2;
        node_1.right = node_3;
        node_3.left = node_4;
        node_3.right = node_5;
        return node_1;
    }

    private void inOrder(TreeNode root) {
        if (root == null) {
            return;
        }
        inOrder(root.left);
        System.out.print(root.val + " ");
        inOrder(root.right);
    }

    public static void main(String[] args) {
        //Your Codec object will be instantiated and called as such:
        SerializePostOrderTree create = new SerializePostOrderTree();
        TreeNode root = create.createTree();
        SerializePostOrderTree ser = new SerializePostOrderTree();
        SerializePostOrderTree deser = new SerializePostOrderTree();
        TreeNode ans = deser.deserialize(ser.serialize(root));
        System.out.println("中序遍历输出序列化和反序列化之后的结果: ");
        create.inOrder(ans);
    }
}
