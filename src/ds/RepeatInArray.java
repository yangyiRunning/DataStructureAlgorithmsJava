package ds;

import java.util.ArrayList;
import java.util.List;

/**
 * 给定一个整数数组 a，其中1 ≤ a[i] ≤ n （n为数组长度）, 其中有些元素出现两次而其他元素出现一次。
 * <p>
 * 找到所有出现两次的元素。
 * <p>
 * 你可以不用到任何额外空间并在O(n)时间复杂度内解决这个问题吗？
 * <p>
 * <p>
 * <p>
 * 思路:
 * 1. 不能用额外空间，开辟散列表装数据的方法没戏。
 * 2. 时间复杂度为O(n)，排序没戏。
 *
 * @author yangyi 2019年02月08日10:13:40
 */
public class RepeatInArray {

//    public List<Integer> findDuplicates(int[] nums) {
//        List<Integer> targets = new ArrayList<>();
//        if (nums == null || nums.length == 0) {
//            return new ArrayList<>();
//        }
//        for (int i = 0; i < nums.length; i++) {
//            if (nums[i] < 0 || nums[i] > nums.length - 1) {
//                return new ArrayList<>();
//            }
//        }
//        for (int i = 0; i < nums.length; i++) {
//            //如果当前元素不等于其索引，则交换
//            while (nums[i] != i) {
//
//                //此处为结果的收集，异常重要，不能为了交换而交换
//                //如果当前元素等于当前元素作为索引值对应你的元素
//                if (nums[i] == nums[nums[i]]) {
//                    targets.add(nums[i]);
//                }
//
//                int temp = nums[i];
//                nums[i] = nums[temp];
//                nums[temp] = temp;
//            }
//        }
//        return targets;
//    }

    /**
     * 时间复杂度:O(n)
     * 空间复杂度:O(1)
     * <p>
     * 虽然效率爆表，但是也有弊端，因为改变了数组的顺序，如果题目不要求效率转而要求数组的结构不变，则此方法不适用。
     */
    public List<Integer> findDuplicates(int[] nums) {
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            int index = Math.abs(nums[i]) - 1;
            nums[index] = -nums[index];
            if (nums[index] > 0) {
                result.add(index + 1);
            }
        }
        return result;
    }

    public static void main(String[] args) {
        int[] ints = {4, 3, 2, 7, 8, 2, 3, 1};
        RepeatInArray repeatInArray = new RepeatInArray();
        List<Integer> result = repeatInArray.findDuplicates(ints);
        for (Integer integer : result) {
            System.out.println(integer);
        }
    }
}
