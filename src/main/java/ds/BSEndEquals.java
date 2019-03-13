package ds;

/**
 * 查找最后一个值等于给定值的元素
 *
 * @author yangyi 2019年01月03日21:52:16
 */
public class BSEndEquals {

    private int bsEndEquals(int[] ints, int value) {
        int start = 0;
        int end = ints.length;
        while (start <= end) {
            int mid = start + ((end - start) >> 2);
            if (value < ints[mid]) {
                end = mid - 1;
            } else if (value > ints[mid]) {
                start = mid + 1;
            } else {
                //在已经找到的所有的相同值中做判断
                //如果mid==ints.length - 1，说明此时已经是全部数组元素当中的最后一个了，必然符合"查找最后一个值等于给定值的元素"
                //或者 在mid位置的后一个位置的元素不等于所要查找的元素，也能说明此时在mid处的这个元素必然符合"查找最后一个值等于给定值的元素"
                if (mid == ints.length - 1 || ints[mid + 1] != value) {
                    return mid;
                } else {
                    start = mid + 1;
                }
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] ints = new int[100];
        System.out.println("构造100个0~100的随机数并输出:");
        for (int i = 0; i < ints.length; i++) {
            ints[i] = (int) (Math.random() * 100);
            System.out.println(ints[i]);
        }
        InsertSort insertSort = new InsertSort();
        insertSort.insertSort(ints);
        System.out.println("从小到大排序:");
        for (int i = 0; i < ints.length; i++) {
            System.out.println("位置:" + i + ", 值:" + ints[i]);
        }
        System.out.println("查找元素为:66");
        BSEndEquals bsEndEquals = new BSEndEquals();
        int result = bsEndEquals.bsEndEquals(ints, 66);
        if (result != -1) {
            System.out.println("找到了，最后一个值等于给定值的元素的位置为:" + result);
        } else {
            System.out.println("没找到");
        }
    }
}
