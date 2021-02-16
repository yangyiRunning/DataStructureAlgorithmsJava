package ds.binary;

import ds.sort.InsertSort;

/**
 * 查找最后一个小于等于给定值的元素
 *
 * @author yangyi 2019年01月03日22:30:55
 */
public class BSEndLess {

    private int bsEndLess(int[] ints, int value) {
        int start = 0;
        int end = ints.length;
        while (start <= end) {
            int mid = start + ((end - start) >> 2);
            if (value < ints[mid]) {
                end = mid - 1;
            } else if (value >= ints[mid]) {
                //
                if (mid == ints.length - 1 || ints[mid + 1] > value) {
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
        BSEndLess bsEndLess = new BSEndLess();
        int result = bsEndLess.bsEndLess(ints, 66);
        if (result != -1) {
            System.out.println("找到了，最后一个小于等于给定值的元素的位置为:" + result);
        } else {
            System.out.println("没找到");
        }
    }
}
