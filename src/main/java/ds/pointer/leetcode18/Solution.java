package ds.pointer.leetcode18;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 * 四数之和
 * LeetCode 18 https://leetcode-cn.com/problems/4sum/
 *
 * @author yangyi 2021年01月14日00:30:22
 */
public class Solution {

    public List<List<Integer>> fourSum(int[] nums, int target) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }
            for (int j = i + 1; j < nums.length; j++) {
                if (j > i + 1 && nums[j] == nums[j - 1]) {
                    continue;
                }
                int left = j + 1;
                int right = nums.length - 1;
                while (left < right) {
                    int fourSum = nums[i] + nums[j] + nums[left] + nums[right];
                    if (fourSum < target) {
                        left++;
                    } else if (fourSum > target) {
                        right--;
                    } else {
                        result.add(new LinkedList<>(Arrays.asList(nums[i], nums[j], nums[left], nums[right])));
                        while (left < right && nums[left] == nums[left + 1]) {
                            left++;
                        }
                        while (left < right && nums[right] == nums[right - 1]) {
                            right--;
                        }
                        left++;
                        right--;
                    }
                }
            }
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new Solution().fourSum(new int[]{1, 0, -1, 0, -2, 2}, 0).toArray()));
    }
}
