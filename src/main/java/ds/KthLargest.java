package ds;

import java.util.PriorityQueue;

/**
 * TopK问题: 返回数据流中的第K大元素
 * <p>
 * 思路:
 * <p>
 * 1. 用一个小顶堆来保存TopK中的这K个值
 * 2. 堆没满时，每次新来的元素压入小顶堆中
 * 3. 新进来的元素如果比小顶堆的堆顶的元素还要小的话，说明根本不具有实力竞争这前K大的数
 * 4. 新进来的元素如果比小顶堆的堆顶的元素要大的话，说明堆顶最小的那个元素被竞争淘汰了，取而代之的新压入堆的元素
 * 5. 调整堆结构让其重新成为一个小顶堆
 * 6. 需要时只需要遍历这个堆，输出的所有元素即为TopK
 * <p>
 * 分析:
 * 时间复杂度: O(logk)
 * 空间复杂度: O(1)  为原地不占用额外内存的数据结构
 *
 * @author yangyi 2019年01月22日17:22:30
 */
public class KthLargest {

    /**
     * 优先队列(默认为一个小顶堆)
     */
    private PriorityQueue<Integer> priorityQueue;

    /**
     * topK中的K
     */
    private int k;

    public KthLargest(int k, int[] nums) {
        this.k = k;
        priorityQueue = new PriorityQueue<>(k);
        for (int num : nums) {
            add(num);
        }
    }

    /**
     * 动态插入的方法
     */
    public int add(int value) {
        //还没满就进
        if (priorityQueue.size() < k) {
            priorityQueue.offer(value);
        } else if (value > priorityQueue.peek()) {
            //比小顶堆堆顶大就换(淘汰小的换大的)，小就别管
            priorityQueue.poll();
            priorityQueue.offer(value);
        }

        return priorityQueue.peek();
    }

    public void print() {
        for (Integer integer : priorityQueue) {
            System.out.println(integer);
        }
    }

    public static void main(String[] args) {
        int k = 10;
        int[] ints = new int[k * 2];
        System.out.println("构造一个随机的数组:");
        for (int i = 0; i < ints.length; i++) {
            ints[i] = (int) (Math.random() * 10);
            System.out.println(ints[i]);
        }
        System.out.println("放入优先队列:");
        KthLargest kthLargest = new KthLargest(k, ints);
        System.out.println("输出最终的TopK:");
        kthLargest.print();
    }
}
