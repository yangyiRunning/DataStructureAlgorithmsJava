package ds;

/**
 * 堆(大顶堆)
 *
 * @author yangyi 2019年01月22日18:05:48
 */
public class BigHeap {

    //堆因为是个完全二叉树，用数组来进行表示
    private int[] heapArray;
    private int capacity;
    private int count;

    public BigHeap(int capacity) {
        this.capacity = capacity;
        heapArray = new int[capacity + 1];
        count = 0;
    }

    private void insert(int value) {
        //满了，别插了
        if (count > capacity) {
            return;
        }
        heapArray[++count] = value;
        //记录当前的索引位置
        int i = count;
        //父节点索引大于0且父节点的元素小于子节点，交换父节点和子节点
        while (i / 2 > 0 && heapArray[i / 2] < heapArray[i]) {
            int temp = heapArray[i / 2];
            heapArray[i / 2] = heapArray[i];
            heapArray[i] = temp;
            i /= 2;
        }
    }

    private int deleteTop() {
        //没了，别删了
        if (count == 0) {
            return -1;
        }
        //大顶堆堆顶的元素是最大的
        int max = heapArray[1];
        //把最后一个移到堆顶，然后再进行调整
        heapArray[1] = heapArray[count];
        count--;
        heapify(heapArray, count, 1);
        return max;
    }

    private void heapify(int[] heapArray, int count, int i) {
        while (true) {
            //maxIndex和i分别代表最大的索引和起始值
            int maxIndex = i;
            //节点本身小于其左孩子，左孩子取而代之当老大
            if (i * 2 <= count && heapArray[maxIndex] < heapArray[i * 2]) {
                maxIndex = i * 2;
            }
            //节点本身小于其右孩子，右孩子取而代之当老大
            if (i * 2 + 1 <= count && heapArray[maxIndex] < heapArray[i * 2 + 1]) {
                maxIndex = i * 2 + 1;
            }
            if (maxIndex == i) {
                break;
            }
            int temp = heapArray[maxIndex];
            heapArray[maxIndex] = heapArray[i];
            heapArray[i] = temp;
            i = maxIndex;
        }
    }

    public static void main(String[] args) {
        int capacity = 10;
        int[] ints = new int[capacity];
        for (int i = 0; i < ints.length; i++) {
            ints[i] = (int) (Math.random() * 10);
        }

        BigHeap bigHeap = new BigHeap(capacity);
        System.out.println("遍历一下构造好的数组:");
        for (int anInt : ints) {
            System.out.println(anInt);
            bigHeap.insert(anInt);
        }

        System.out.println("遍历一下大顶堆:");
        for (int i : bigHeap.heapArray) {
            System.out.println(i);
        }

        int max = bigHeap.deleteTop();
        System.out.println("删除的堆顶元素为:"+max);

        System.out.println("删除完遍历一下:");
        for (int i : bigHeap.heapArray) {
            System.out.println(i);
        }
    }
}
