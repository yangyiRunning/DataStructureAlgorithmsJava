package ds.sort;

/**
 * 计数排序
 * <p>
 * 总共分4步:
 * <p>
 * 1. 先遍历待排序数组找出数组中的最大值
 * 2. 以此最大值为依据开辟一个新的数组空间
 * 3. 遍历待排序数组，其中的每一个值放在新数组的相同值的下标当中
 * 4. 遍历新数组，输出结果
 *
 * @author yangyi 2019年02月12日11:14:44
 */
public class CountSort {

    public int[] countSort(int[] array) {
        int max = Integer.MIN_VALUE;
        for (int i = 0; i < array.length; i++) {
            if (array[i] > max) {
                max = array[i];
            }
        }
        int[] countArray = new int[max + 1];
        for (int i = 0; i < array.length; i++) {
            countArray[array[i]]++;
        }
        int index = 0;
        int[] sortArray = new int[array.length];
        for (int i = 0; i < countArray.length; i++) {
            for (int j = 0; j < countArray[i]; j++) {
                sortArray[index] = i;
                index++;
            }
        }
        return sortArray;
    }

    public static void main(String[] args) {
        int[] a = {4, 4, 6, 5, 3, 2, 8, 1, 7, 5, 6, 0, 10};
        CountSort countSort = new CountSort();
        int[] res = countSort.countSort(a);
        System.out.println("排序后输出一下:");
        for (int re : res) {
            System.out.println(re);
        }
    }
}
