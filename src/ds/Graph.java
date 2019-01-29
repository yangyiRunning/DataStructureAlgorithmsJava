package ds;

import java.util.LinkedList;

/**
 * 图的表示(以无向图为例子)
 *
 * @author yangyi 2019年01月29日13:14:38
 */
public class Graph {

    private int count;
    private LinkedList<Integer>[] adj;

    public Graph(int count) {
        this.count = count;

        adj = new LinkedList[count];
        for (int i = 0; i < count; i++) {
            adj[i] = new LinkedList<>();
        }
    }

    public void addEdge(int s, int t) {
        adj[s].add(t);
        adj[t].add(s);
    }

}
