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
        List<List<Integer>> result = new LinkedList<>();
        for (int i = 0; i < nums.length; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }
            for (int j = i + 1; j < nums.length; j++) {
                if (j > i + 1 && nums[j] == nums[j - 1]) {
                    continue;
                }
                int start = j + 1;
                int end = nums.length - 1;
                while (start < end) {
                    int fourSum = nums[i] + nums[j] + nums[start] + nums[end];
                    if (fourSum < target) {
                        start++;
                    } else if (fourSum > target) {
                        end--;
                    } else {
                        List<Integer> four = new LinkedList<>();
                        four.add(nums[i]);
                        four.add(nums[j]);
                        four.add(nums[start]);
                        four.add(nums[end]);
                        result.add(four);
                        while (start < end && nums[start] == nums[start + 1]) {
                            start++;
                        }
                        while (start < end && nums[end] == nums[end - 1]) {
                            end--;
                        }
                        start++;
                        end--;
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
