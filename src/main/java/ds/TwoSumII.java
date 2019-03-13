package ds;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * 两数之和 II - 输入有序数组
 * <p>
 * 给定一个已按照升序排列 的有序数组，找到两个数使得它们相加之和等于目标数。
 * <p>
 * 函数应该返回这两个下标值 index1 和 index2，其中 index1 必须小于 index2。
 * <p>
 * 说明:
 * <p>
 * 返回的下标值（index1 和 index2）不是从零开始的。
 * 你可以假设每个输入只对应唯一的答案，而且你不可以重复使用相同的元素。
 * 示例:
 * <p>
 * 输入: numbers = [2, 7, 11, 15], target = 9
 * 输出: [1,2]
 * 解释: 2 与 7 之和等于目标数 9 。因此 index1 = 1, index2 = 2 。
 *
 * @author yangyi 2019年02月17日01:09:14
 */
public class TwoSumII {

    public int[] twoSum(int[] numbers, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        int index[] = new int[2];
        for (int i = 0; i < numbers.length; i++) {
            if (map.containsKey(numbers[i])) {
                //返回之前配对的index
                index[0] = map.get(numbers[i]);
                //返回当前的index
                index[1] = i + 1;
            } else {
                map.put(target - numbers[i], i + 1);
            }
        }
        return index;
    }

    public static void main(String[] args) {
        int[] a = {2, 7, 11, 15};
        TwoSumII twoSumII = new TwoSumII();
        System.out.println(Arrays.toString(a) + "数组对应的结果为:" + Arrays.toString(twoSumII.twoSum(a, 9)));
    }
}
