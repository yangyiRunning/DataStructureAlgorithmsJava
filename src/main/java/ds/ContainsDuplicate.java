package ds;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * 存在重复元素
 * <p>
 * 给定一个整数数组，判断是否存在重复元素。
 * <p>
 * 如果任何值在数组中出现至少两次，函数返回 true。如果数组中每个元素都不相同，则返回 false。
 * <p>
 * 示例 1:
 * <p>
 * 输入: [1,2,3,1]
 * 输出: true
 * 示例 2:
 * <p>
 * 输入: [1,2,3,4]
 * 输出: false
 * 示例 3:
 * <p>
 * 输入: [1,1,1,3,3,4,3,2,4,2]
 * 输出: true
 * <p>
 *
 * @author yangyi 2019年02月10日21:45:00
 */
public class ContainsDuplicate {

    public boolean containsDuplicate(int[] nums) {
        if (nums == null || nums.length == 0) {
            return false;
        }
        boolean isContains = false;
        Set<Integer> set = new HashSet<>();
        for (int i = 0; i < nums.length; i++) {
            if (!set.contains(nums[i])) {
                set.add(nums[i]);
            }else{
                isContains = true;
                break;
            }
        }
        return isContains;
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 3, 1};
        int[] b = {1, 2, 3, 4};
        int[] c = {1, 1, 1, 3, 3, 4, 3, 2, 4, 2};
        ContainsDuplicate containsDuplicate = new ContainsDuplicate();
        System.out.println(Arrays.toString(a) + "中是否有重复元素:" + containsDuplicate.containsDuplicate(a));
        System.out.println(Arrays.toString(b) + "中是否有重复元素:" + containsDuplicate.containsDuplicate(b));
        System.out.println(Arrays.toString(c) + "中是否有重复元素:" + containsDuplicate.containsDuplicate(c));
    }
}