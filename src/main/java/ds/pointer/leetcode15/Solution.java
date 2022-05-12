package ds.pointer.leetcode15;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 * 三数之和
 * LeetCode 15 https://leetcode-cn.com/problems/3sum/
 *
 * @author yangyi 2021年01月12日18:38:30
 */
public class Solution {

    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new LinkedList<>();
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] > 0) {
                break;
            }
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }
            int start = i + 1;
            int end = nums.length - 1;
            while (start < end) {
                int sum = nums[i] + nums[start] + nums[end];
                if (sum < 0) {
                    start++;
                } else if (sum > 0) {
                    end--;
                } else {
                    List<Integer> num = new LinkedList<>();
                    num.add(nums[i]);
                    num.add(nums[start]);
                    num.add(nums[end]);
                    result.add(num);
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
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new Solution().threeSum(new int[]{-1, 0, 1, 2, -1, -4}).toArray()));
        System.out.println(Arrays.toString(new Solution().threeSum(new int[]{}).toArray()));
        System.out.println(Arrays.toString(new Solution().threeSum(new int[]{0}).toArray()));
        System.out.println(Arrays.toString(new Solution().threeSum(new int[]{-4, -2, 1, -5, -4, -4, 4, -2, 0, 4, 0, -2, 3, 1, -5, 0}).toArray()));
    }
}
