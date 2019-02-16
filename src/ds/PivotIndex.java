package ds;

import java.util.Arrays;

/**
 * 寻找数组的中心索引
 * <p>
 * <p>
 * 给定一个整数类型的数组 nums，请编写一个能够返回数组“中心索引”的方法。
 * <p>
 * 我们是这样定义数组中心索引的：数组中心索引的左侧所有元素相加的和等于右侧所有元素相加的和。
 * <p>
 * 如果数组不存在中心索引，那么我们应该返回 -1。如果数组有多个中心索引，那么我们应该返回最靠近左边的那一个。
 * <p>
 * 示例    1:
 * <p>
 * 输入:
 * nums = [1, 7, 3, 6, 5, 6]
 * 输出: 3
 * 解释:
 * 索引3 (nums[3] = 6) 的左侧数之和(1 + 7 + 3 = 11)，与右侧数之和(5 + 6 = 11)相等。
 * 同时, 3 也是第一个符合要求的中心索引。
 * 示例 2:
 * <p>
 * 输入:
 * nums = [1, 2, 3]
 * 输出: -1
 * 解释:
 * 数组中不存在满足此条件的中心索引。
 * 说明:
 * <p>
 * nums 的长度范围为 [0, 10000]。
 * 任何一个 nums[i] 将会是一个范围在 [-1000, 1000]的整数。
 *
 * @author yangyi 2019年02月16日23:46:58
 */
public class PivotIndex {

    public int pivotIndex(int[] nums) {
        if (nums.length < 3) {
            return -1;
        }
        int sum = 0;
        int leftSum = 0;
        int rightSum = 0;
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i];
        }
        for (int i = 0; i < nums.length; i++) {
            rightSum = sum - leftSum - nums[i];
            if (leftSum == rightSum) {
                return i;
            }
            leftSum += nums[i];
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] a = {1, 7, 3, 6, 5, 6};
        int[] b = {1, 2, 3};
        int[] c = {-1, -1, 0, 1, 0, -1};
        int[] d = {-1, -1, 0, 1, 1, 0};
        PivotIndex pivotIndex = new PivotIndex();
        System.out.println(Arrays.toString(a) + "的中心索引是:" + pivotIndex.pivotIndex(a));
        System.out.println(Arrays.toString(b) + "的中心索引是:" + pivotIndex.pivotIndex(b));
        System.out.println(Arrays.toString(c) + "的中心索引是:" + pivotIndex.pivotIndex(c));
        System.out.println(Arrays.toString(d) + "的中心索引是:" + pivotIndex.pivotIndex(d));
    }
}
