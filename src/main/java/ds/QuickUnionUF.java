package ds;

/**
 * 并查集
 *
 * @author yangyi 2019年01月31日10:36:52
 */
public class QuickUnionUF {

    private int[] roots;

    public QuickUnionUF(int capacity) {
        roots = new int[capacity];
        //初始化，各自为政
        for (int i = 0; i < capacity; i++) {
            roots[i] = i;
        }
    }

    public int findRoot(int i) {
        int root = i;
        //循环找自己大boss
        while (root != roots[root]) {
            root = roots[root];
        }
        //压缩路径
        while (i != roots[i]) {
            int temp = roots[i];
            //指向刚才找到的大boss完成路径压缩
            roots[i] = root;
            i = temp;
        }
        return root;
    }

    public boolean connected(int p, int q) {
        return findRoot(p) == findRoot(q);
    }

    public void union(int p, int q) {
        int qroot = findRoot(q);
        int proot = findRoot(p);
        roots[proot] = qroot;
    }

    public static void main(String[] args) {
        int find = 6;
        QuickUnionUF quickUnionUF = new QuickUnionUF(10);
        System.out.println(find + "对应的集为:" + quickUnionUF.findRoot(find));
        boolean isConnection = quickUnionUF.connected(4, 9);
        System.out.println("是否连通:" + isConnection);
        if (!isConnection) {
            quickUnionUF.union(4,9);
        }
        System.out.println("再判断是否连通:" + quickUnionUF.connected(4, 9));
        System.out.println(find + "对应的集为:" + quickUnionUF.findRoot(find));
    }
}
