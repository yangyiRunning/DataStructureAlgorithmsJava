package ds;

/**
 * 查找第一个大于等于给定值的元素
 *
 * @author yangyi 2019年01月03日22:13:03
 */
public class BSFirstMore {

    private int bsFirstMore(int[] ints, int value) {
        int start = 0;
        int end = ints.length;
        while (start <= end) {
            int mid = start + ((end - start) >> 2);
            if (value <= ints[mid]) {
                //如果索引mid处的元素已经是第一个，那它一定是第一个大于等于给定元素的值(因为没有元素比它更靠前了)
                //如果索引mid处的前一个元素小于给定的值，那索引mid处所对应的元素一定是第一个大于等于给定值的元素(因为与其紧临的前一个元素比它本身小)
                if (mid == 0 || ints[mid - 1] < value) {
                    return mid;
                } else {
                    end = mid - 1;
                }
            } else if (value > ints[mid]) {
                start = mid + 1;
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
        BSFirstMore bsFirstMore = new BSFirstMore();
        int result = bsFirstMore.bsFirstMore(ints, 66);
        if (result != -1) {
            System.out.println("找到了，第一个大于等于给定值的元素的位置为:" + result);
        } else {
            System.out.println("没找到");
        }
    }
}
