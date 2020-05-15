package ds.binary;

import ds.InsertSort;

/**
 * 二分查找（递归和非递归）
 * <p>
 * 含义：
 * <p>
 * 折半查找，每次打对折，让需要被查找的元素与数组中间的元素相比较。
 * 如果相等就说明找到了，如果大于就往右半部分继续折半查找，如果小于就往左半部分继续折半查找。
 * 直到找到元素或者元素只有一个仍然未找到时，结束这一切查找过程。
 * <p>
 * 核心：
 * 最好时间复杂度：O(1)
 * 最坏时间复杂度： O(logn)
 * 平均时间复杂度：O(logn)
 * 空间复杂度：O(1) 因为数组的长度时间是一个固定值，并不随着数据规模的增大而增大，增长趋势是不变的。
 * <p>
 * 使用条件：
 * 1. 有序数组
 * 2. 不频繁的增删，一次排序多次查找
 * 3. 数据不宜过大也不宜过小
 *
 * @author yangyi 2018年12月09日23:12:08
 */
public class BinarySearch {

    /**
     * 递归方式实现
     */
    private int binarySearchRecursion(int[] ints, int start, int end, int value) {
        int mid = start + ((end - start) >> 1);

        if (start > end) {
            return -1;
        }

        if (value < ints[mid]) {
            return binarySearchRecursion(ints, start, mid - 1, value);
        } else if (value > ints[mid]) {
            return binarySearchRecursion(ints, mid + 1, end, value);
        } else {
            return mid;
        }
    }

    /**
     * 非递归方式实现
     */
    private int binarySearchNonRecursion(int[] ints, int value) {
        int start = 0;
        int end = ints.length - 1;

        while (start <= end) {
            int mid = start + ((end - start) >> 1);
            if (value < ints[mid]) {
                end = mid - 1;
            } else if (value > ints[mid]) {
                start = mid + 1;
            } else {
                return mid;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        //准备10000个随机数
        int[] ints = new int[10000];
        for (int i = 0; i < ints.length; i++) {
            ints[i] = (int) (Math.random() * 10000);
        }

        //利用之前已经书写好的排序方法排一遍序，以保证数组是有序数组
        InsertSort insertSort = new InsertSort();
        insertSort.insertSort(ints);

        System.out.println("排序后的数组：");
        for (int i = 0; i < ints.length; i++) {
            System.out.println("索引为：" + i + ", 值为：" + ints[i]);
        }

        //保证是有序数组之后利用二分查找查找一个数值为0到9999的数
        System.out.println("递归方式输出的结果：");
        BinarySearch binarySearch = new BinarySearch();
        int index = binarySearch.binarySearchRecursion(ints, 0, ints.length - 1, 3928);
        if (index == -1) {
            System.out.println("没找到！");
        } else {
            System.out.println("要查找的数在数组中的索引为：" + index);
        }

        System.out.println("非递归方式输出的结果：");
        int index2 = binarySearch.binarySearchNonRecursion(ints, 3928);
        if (index2 == -1) {
            System.out.println("没找到！");
        } else {
            System.out.println("要查找的数在数组中的索引为：" + index2);
        }

        if (index == index2) {
            System.out.println("递归方式和非递归方式查找出来的位置是一样的");
        } else {
            System.out.println("递归和非递归结果不同，错了！");
        }
    }

}
