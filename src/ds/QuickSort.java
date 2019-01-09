package ds;

/**
 * 快速排序
 * <p>
 * 核心:
 * 1. 最好时间复杂度: O(nlogn)
 * 1. 最坏时间复杂度: O(n^2
 * 3. 平均时间复杂度: O(nlogn)
 * 4. 空间复杂度 O(1)  为原地排序
 * <p>
 * 不稳定排序
 *
 * @author yangyi 2019年01月09日21:24:54
 */
public class QuickSort {

    private void quickSort(int[] ints, int start, int end) {

        //递归的终止条件:起始元素的index都大于了终止元素index，必然终止
        if (start > end) {
            return;
        }

        //快速排序的核心:计算基准点的位置
        int pivot = getPivotIndex(ints, start, end);

        //用计算出来的基准点pivot，以pivot为界，将数组一分为二，分而治之，前半部分递归，后半部分也递归
        quickSort(ints, pivot + 1, end);
        quickSort(ints, start, pivot - 1);
    }

    /**
     * 计算基准点的位置
     *
     * @return 计算出来的基准点的index
     */
    private int getPivotIndex(int[] ints, int start, int end) {
        //选取第一个元素为基准点的元素
        int pivot = ints[start];
        //左右指针分别指向开头和结尾
        int left = start;
        int right = end;

        //如果左边的指针不等于右边的指针，说明还有的比，比较还没完
        while (left != right) {
            //如果左边的指针大于右边的指针 且 右指针的元素大于基准点元素
            while (left < right && ints[right] > pivot) {
                //因为右指针对应的元素本来就应该大于基准点元素，所以不管了，继续向左移动
                right--;
            }

            //如果左边的指针大于右边的指针 且 左指针的元素小于等于基准点元素
            while (left < right && ints[left] <= pivot) {
                //因为在基准点元素左边的元素本来就应该比其小，所以不管了，继续向右走
                left++;
            }

            //如果不满足以上条件就说明该交换左右指针所对应的元素了
            if (left < right) {
                int temp = ints[left];
                ints[left] = ints[right];
                ints[right] = temp;
            }
        }

        //上述的循环都折腾完，说明此时的条件已经是left==right了，说明一轮比较已经完成，该交换基准点对应的元素和left(right)对应的元素了
        int temp = ints[left];
        ints[left] = ints[start];
        ints[start] = temp;

        //返回新的基准点index继续战斗
        return left;
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
        QuickSort quickSort = new QuickSort();
        quickSort.quickSort(nums, 0, nums.length - 1);
        System.out.println();
        System.out.println("排序后：");
        for (int num : nums) {
            System.out.println(num);
        }
    }
}
