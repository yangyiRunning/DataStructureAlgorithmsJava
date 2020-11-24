package ds;

import ds.bst.BinarySearchTree;

import java.util.ArrayDeque;
import java.util.HashSet;
import java.util.Queue;
import java.util.Set;

/**
 * 树的层级遍历就是典型的广度优先搜索
 *
 * @author yangyi 2019年01月27日22:01:42
 */
public class LevelPrint {

    public void levelPrint(BinarySearchTree.TreeNode node) {
        if (node == null) {
            return;
        }

        //队列就像一把尺，保证层级遍历时的顺序
        Queue<BinarySearchTree.TreeNode> queue = new ArrayDeque<>();
        //set记录遍历到的节点是否已经被标记过(由于树这种结构都是无闭环的，这一步也可以省略)
        Set<BinarySearchTree.TreeNode> set = new HashSet<>();
        BinarySearchTree.TreeNode current;
        //根先进队列
        queue.offer(node);
        //根收进集合，表示其已经能被遍历过了
        set.add(node);
        while (!queue.isEmpty()) {
            current = queue.poll();
            System.out.println(current.value);
            if (current.left != null) {
                if (!set.contains(current.left)) {
                    queue.offer(current.left);
                    set.add(current.left);
                }
            }
            if (current.right != null) {
                if (!set.contains(current.right)) {
                    queue.offer(current.right);
                    set.add(current.right);
                }
            }
        }
    }

    public static void main(String[] args) {
        BinarySearchTree binarySearchTree = new BinarySearchTree();
        BinarySearchTree.TreeNode treeNode = null;
        int[] a = {1, 2, 3, 4, 5, 6, 7, 8, 9};
        for (int i : a) {
            treeNode = binarySearchTree.insert(i);
        }
        LevelPrint levelPrint = new LevelPrint();
        if (treeNode == null) {
            return;
        }
        levelPrint.levelPrint(treeNode);
    }
}
