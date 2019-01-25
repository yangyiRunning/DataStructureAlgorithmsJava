package ds;

import java.util.HashMap;
import java.util.Map;

/**
 * 两数之和
 * <p>
 * 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。
 * <p>
 * 你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。
 * <p>
 * 示例:
 * <p>
 * 给定 nums = [2, 7, 11, 15], target = 9
 * <p>
 * 因为 nums[0] + nums[1] = 2 + 7 = 9
 * 所以返回 [0, 1]
 * <p>
 *
 * @author yangyi 2019年01月25日11:02:56
 */
public class TwoSum {

    /**
     * k为具体的值
     * v为值对应的index
     * <p>
     * 关键数据结构就是散列表，用来存储target与目标元素的差，做配对用。
     */
    private Map<Integer, Integer> map = new HashMap<>();

    public int[] twoSum(int[] nums, int target) {
        int index[] = new int[2];
        for (int i = 0; i < nums.length; i++) {
            if (map.containsKey(nums[i])) {
                //返回之前配对的index
                index[0] = map.get(nums[i]);
                //返回当前的index
                index[1] = i;
            } else {
                map.put(target - nums[i], i);
            }
        }
        return index;
    }

    public static void main(String[] args) {
        int[] ints = {2, 7, 11, 15};
        TwoSum twoSum = new TwoSum();
        int target = 9;
        int[] indexs = twoSum.twoSum(ints, target);
        System.out.println("两数之和为" + target + "的索引为:");
        for (int index : indexs) {
            System.out.println(index);
        }
    }
}
