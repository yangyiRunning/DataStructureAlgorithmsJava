package ds;

/**
 * 冒泡排序
 * <p>
 * 含义：先遍历一遍，相邻的两个元素比较，两两交换，然后……一遍完了再遍历一遍
 * <p>
 * 核心：
 * <p>
 * 最好时间复杂度为：O(n)
 * 最坏时间复杂度为：O(n^2)
 * 平均时间复杂度为：O(n^2)
 * 空间复杂度为：O(1)
 * 稳定排序
 *
 * @author yangyi 2018年12月04日00:28:34
 */
public class BubbleSort {

    /**
     * 从小到大排序
     */
    public void bubbleSort(int[] ints) {
        //就一个数就别排了
        if (ints.length == 1) {
            return;
        }

        for (int i = 0; i < ints.length; i++) {
            boolean isSwap = false;
            for (int j = 0; j < ints.length - 1 - i; j++) {
                if (ints[j] > ints[j + 1]) {
                    int temp = ints[j];
                    ints[j] = ints[j + 1];
                    ints[j + 1] = temp;
                    isSwap = true;
                }
            }
            if (!isSwap) {
                break;
            }
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
        BubbleSort bubbleSort = new BubbleSort();
        bubbleSort.bubbleSort(nums);
        System.out.println();
        System.out.println("排序后：");
        for (int num : nums) {
            System.out.println(num);
        }
    }
}
