package ds;

/**
 * 选择排序
 * <p>
 * 含义：
 * 1. 整个排序的数据分为两个部分：已排序部分和未排序部分
 * 2. 遍历未排序部分，找出最小的元素
 * 3. 放在已排序部分的末尾
 * <p>
 * <p>
 * 核心：
 * 最好时间复杂度 O(n^2)
 * 最坏时间复杂度 O(n^2)
 * 平均时间复杂度 O(n^2)
 * 空间复杂度 O(1)
 * 不稳定排序
 *
 * @author yangyi 2018年12月04日23:47:37
 */
public class SelectionSort {

    public void selectionSort(int[] ints) {
        if (ints.length == 1) {
            return;
        }
        //已排序部分
        for (int i = 0; i < ints.length; i++) {
            int minIndex = i;
            //未排序部分
            for (int j = i + 1; j < ints.length; j++) {
                if (ints[j] < ints[minIndex]) {
                    minIndex = j;
                }
            }
            int temp = ints[i];
            ints[i] = ints[minIndex];
            ints[minIndex] = temp;
        }
    }

    public static void main(String[] args) {
        //准备30个0~100的随机数
        int[] nums = new int[300];
        for (int i = 0; i < 300; i++) {
            nums[i] = (int) (Math.random() * 100);
        }
        System.out.println("排序前：");
        for (int num : nums) {
            System.out.println(num);
        }
        SelectionSort bubbleSort = new SelectionSort();
        bubbleSort.selectionSort(nums);
        System.out.println();
        System.out.println("排序后：");
        for (int num : nums) {
            System.out.println(num);
        }
    }
}
