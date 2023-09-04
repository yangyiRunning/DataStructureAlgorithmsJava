package ds.array.leetcode442;

import java.util.ArrayList;
import java.util.List;

/**
 * 442. 数组中重复的数据
 * https://leetcode.cn/problems/find-all-duplicates-in-an-array/
 * 思路:
 * 1. 不能用额外空间，开辟散列表装数据的方法没戏。
 * 2. 时间复杂度为O(n)，排序没戏。
 *
 * @author yangyi 2023年09月04日11:30:43
 */
public class Solution {

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
        Solution repeatInArray = new Solution();
        List<Integer> result = repeatInArray.findDuplicates(ints);
        for (Integer integer : result) {
            System.out.println(integer);
        }
    }
}
