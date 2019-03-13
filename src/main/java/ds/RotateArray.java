package ds;

import java.util.Arrays;

/**
 * 旋转数组
 * <p>
 * <p>
 * <p>
 * 给定一个数组，将数组中的元素向右移动 k 个位置，其中 k 是非负数。
 * <p>
 * 示例 1:
 * <p>
 * 输入: [1,2,3,4,5,6,7] 和 k = 3
 * 输出: [5,6,7,1,2,3,4]
 * 解释:
 * 向右旋转 1 步: [7,1,2,3,4,5,6]
 * 向右旋转 2 步: [6,7,1,2,3,4,5]
 * 向右旋转 3 步: [5,6,7,1,2,3,4]
 * 示例 2:
 * <p>
 * 输入: [-1,-100,3,99] 和 k = 2
 * 输出: [3,99,-1,-100]
 * 解释:
 * 向右旋转 1 步: [99,-1,-100,3]
 * 向右旋转 2 步: [3,99,-1,-100]
 * 说明:
 * <p>
 * 尽可能想出更多的解决方案，至少有三种不同的方法可以解决这个问题。
 * 要求使用空间复杂度为 O(1) 的原地算法。
 * <p>
 * <p>
 * <p>
 * 总共分为3步:
 * <p>
 * 1. 数组整个旋转一遍
 * 2. 以k为界，k之前的元素旋转
 * 3. 以k为界，k后面的元素旋转
 *
 * @author yangyi 2019年02月12日11:56:52
 */
public class RotateArray {

    private static int[] a = {1, 2, 3, 4, 5, 6, 7};
    private static int[] b = {-1, -100, 3, 99};

    public void rotate(int[] nums, int k) {
        int len = nums.length;
        k %= len;
        reserve(nums, 0, len - 1);
        reserve(nums, 0, k - 1);
        reserve(nums, k, len - 1);
    }

    public void reserve(int[] nums, int start, int end) {
        while (start < end) {
            int temp = nums[start];
            nums[start++] = nums[end];
            nums[end--] = temp;
        }
    }

    public static void main(String[] args) {
        RotateArray rotateArray = new RotateArray();
        rotateArray.rotate(a,3);
        rotateArray.rotate(b,2);
        System.out.println(Arrays.toString(a));
        System.out.println(Arrays.toString(b));
    }
}
