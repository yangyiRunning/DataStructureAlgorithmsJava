package ds;

/**
 * 插入排序
 * <p>
 * 含义：
 * 1. 整个数组数据分为两部分，已排序部分和未排序部分，其中已排序部分在前，未排序部分在后。
 * 2. 从未排序部分的第一个元素开始，倒序与已排序部分元素相比。
 * 3. 如果和当前比较的元素相比小的话，则说明找到了自己的位置，插入比较元素的后面一位。
 * <p>
 * 核心：
 * 最好时间复杂度 O(n)
 * 最坏时间复杂度 O(n^2)
 * 平均时间复杂度 O(n^2)
 * 空间复杂度 O(1)
 * 稳定排序
 *
 * @author yangyi 2018年12月04日22:58:30
 */
public class InsertSort {

    /**
     * 从小到大排序
     */
    public void insertSort(int[] ints) {
        if (ints.length == 1) {
            return;
        }

        //未排序部分
        for (int i = 1; i < ints.length; i++) {
            int value = ints[i];
            int j = i - 1;
            //已排序部分
            for (; j > 0; j--) {
                if (value < ints[j]) {
                    ints[j + 1] = ints[j];
                } else {
                    break;
                }
            }
            ints[j + 1] = value;
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
        InsertSort bubbleSort = new InsertSort();
        bubbleSort.insertSort(nums);
        System.out.println();
        System.out.println("排序后：");
        for (int num : nums) {
            System.out.println(num);
        }
    }
}
