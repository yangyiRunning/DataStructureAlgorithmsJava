package ds.bst;

/**
 * 二叉查找树的插入、遍历、查找、删除
 *
 * @author yangyi 2019年01月05日00:15:27
 */
public class BinarySearchTree {

    /**
     * 二叉查找树的根
     */
    private TreeNode root;

    public static class TreeNode {
        public int value;
        public TreeNode left;
        public TreeNode right;

        public TreeNode(int value) {
            this.value = value;
        }
    }

    /**
     * 二叉查找树的插入操作
     *
     * @param value 插入的对象
     * @return 返回这颗树
     */
    public TreeNode insert(int value) {
        //如果这个二叉查找树是null，就说明进来的value是第一个元素，即将作为此棵树的根
        if (root == null) {
            root = new TreeNode(value);
            return root;
        }
        //这里的p起一个指示作用，用来标记你现在走到整棵树的哪个节点了
        TreeNode p = root;
        //死循环去找地方，直到成功找到属于自己的位置后return
        while (true) {
            //如果被插的是一棵已经存在的树，判断value的大小，小往左找插入的地方，大往右找插入的地方
            if (p.value > value) {
                //为null时说明找到地方了，开插
                if (p.left == null) {
                    p.left = new TreeNode(value);
                    //warning:这里返回千万不能是p，p只是你当前节点的位置，此处应该返回整棵树，即root
                    return root;
                }
                p = p.left;
            } else {
                //为null时说明找到地方了，开插
                if (p.right == null) {
                    p.right = new TreeNode(value);
                    //warning:这里返回千万不能是p，p只是你当前节点的位置，此处应该返回整棵树，即root
                    return root;
                }
                p = p.right;
            }
        }
    }

    /**
     * 前序遍历
     *
     * @param root 要遍历的对象
     */
    public void prePrintTree(TreeNode root) {
        if (root == null) {
            return;
        }
        System.out.println(root.value);
        prePrintTree(root.left);
        prePrintTree(root.right);
    }

    /**
     * 中序遍历
     *
     * @param root 要遍历的对象
     */
    public void inPrintTree(TreeNode root) {
        if (root == null) {
            return;
        }
        inPrintTree(root.left);
        System.out.println(root.value);
        inPrintTree(root.right);
    }

    /**
     * 后序遍历
     *
     * @param root 要遍历的对象
     */
    public void postPrintTree(TreeNode root) {
        if (root == null) {
            return;
        }
        postPrintTree(root.left);
        postPrintTree(root.right);
        System.out.println(root.value);
    }

    /**
     * 查找节点
     *
     * @param value 要查找的值
     * @return 所在的节点
     */
    public TreeNode find(int value) {
        TreeNode p = root;
        while (p != null) {
            if (value < p.value) {
                p = p.left;
            } else if (value > p.value) {
                p = p.right;
            } else {
                return p;
            }
        }
        return null;
    }

    /**
     * 删除节点：(分3种情况)
     * 情况1: 如果要删除的节点没有子节点，只需要将被删除的节点的父节点指向被删除节点自己的指针置为null
     * 情况2: 如果要删除的节点只有一个子节点(只有左子节点或者右子节点)，只需要令被删除节点的父节点指向被删除节点的子节点
     * 情况3: 如果要删除的节点有两个子节点，需要找到这个被删除节点的右子树中的最小节点，将这个最小节点替换到要删除的节点上，然后删除掉这个最小节点(即令最小节点的父节点指向null)
     *
     * @param value 要删除的值
     */
    public void delete(int value) {
        //初始化两个指示器，p指示删除的节点，从根部开始，pp是指示器p的父节点
        TreeNode p = root;
        TreeNode pp = null;

        //如果没有遇到要删除的节点的值value，继续往下走
        while (p != null && p.value != value) {
            pp = p;
            if (p.value > value) {
                p = p.left;
            } else {
                p = p.right;
            }
        }
        //不存在可以删除的东西，直接返回
        if (p == null) {
            return;
        }
        //情况1:删除有两个子节点的节点，即左右子节点都不为null
        if (p.left != null && p.right != null) {
            //需要找到被删除节点p的右子树中的最小节点
            //初始化最小的节点
            TreeNode minp = p.right;
            //初始化最小节点的父节点
            TreeNode minpp = p;
            //提到了最小节点，肯定是往左子树中找，如果左子节点不为null就往下继续找
            while (minp.left != null) {
                minpp = minp;
                minp = minp.left;
            }
            //循环结束说明找到要删除的节点了，开始着手删除
            //目前已经找到了要删除的节点p和p的右子树的最小节点minp
            p.value = minp.value;
            //删除的节点p用最小节点minp填补
            p = minp;
            pp = minpp;
        }

        //情况2:删除的是叶子节点 或者 删除的是一条腿的节点，即只有一个左子树或者右子树
        //删除节点p的子节点
        TreeNode child;
        if (p.left != null) {
            child = p.left;
        } else if (p.right != null) {
            child = p.right;
        } else {
            //左右节点都为null，意味着子节点也为null，也就是所谓的叶子节点
            child = null;
        }

        if (pp == null) {
            root = child;
        } else if (pp.left == p) {
            pp.left = child;
        } else {
            pp.right = child;
        }
    }

    /**
     * 反转一颗二叉树
     */
    private TreeNode reverseTree(TreeNode tree) {
        if (tree == null) {
            return null;
        }
        tree.left = reverseTree(tree.left);
        tree.right = reverseTree(tree.right);
        TreeNode temp = tree.left;
        tree.left = tree.right;
        tree.right = temp;
        return tree;
    }

    public static void main(String[] args) {
        int[] ints = new int[10];
        System.out.println("准备一个数组用来构建树，并且输出来看看:");
        for (int i = 0; i < ints.length; i++) {
            int num = (int) (Math.random() * 10);
            ints[i] = num;
            System.out.println(ints[i]);

        }
        BinarySearchTree binarySearchTree = new BinarySearchTree();
        System.out.println("用这个数组来构建树↓");
        TreeNode tree = null;
        for (int anInt : ints) {
            tree = binarySearchTree.insert(anInt);
        }
        if (tree == null) {
            return;
        }
        System.out.println("前序遍历这个树:");
        binarySearchTree.prePrintTree(tree);
        System.out.println("中序遍历这个树:");
        binarySearchTree.inPrintTree(tree);
        System.out.println("后续遍历这个树:");
        binarySearchTree.postPrintTree(tree);

        System.out.println("反转这颗树↓");
        binarySearchTree.reverseTree(tree);
        System.out.println("前序遍历这个树:");
        binarySearchTree.prePrintTree(tree);
        System.out.println("中序遍历这个树:");
        binarySearchTree.inPrintTree(tree);
        System.out.println("后续遍历这个树:");
        binarySearchTree.postPrintTree(tree);

        int target = 6;
        TreeNode result = binarySearchTree.find(target);
        if (result != null) {
            System.out.println("找到了！这个树中包含有" + target + "元素");
        } else {
            System.out.println("没找到！这个树中不包含" + target + "元素");
        }

        int deleteTarget = 5;
        System.out.println("删除值为" + deleteTarget + "的元素");
        binarySearchTree.delete(deleteTarget);
        System.out.println();
        System.out.println("删除完后再遍历一波看看结果");
        System.out.println("前序遍历这个树:");
        binarySearchTree.prePrintTree(tree);
        System.out.println("中序遍历这个树:");
        binarySearchTree.inPrintTree(tree);
        System.out.println("后续遍历这个树:");
        binarySearchTree.postPrintTree(tree);
    }

}
