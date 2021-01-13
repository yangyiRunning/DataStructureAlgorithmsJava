package ds.pointer;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 * 三数之和
 * LeetCode 15 https://leetcode-cn.com/problems/3sum/
 *
 * @author yangyi 2021年01月12日18:38:30
 */
public class ThreeSum {

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
            int left = i + 1;
            int right = nums.length - 1;
            while (left < right) {
                int threeSum = nums[i] + nums[left] + nums[right];
                if (threeSum < 0) {
                    left++;
                } else if (threeSum > 0) {
                    right--;
                } else {
                    LinkedList<Integer> res = new LinkedList<>();
                    res.add(nums[i]);
                    res.add(nums[left]);
                    res.add(nums[right]);
                    result.add(res);
                    while (left < right && nums[left] == nums[left + 1]) {
                        left++;
                    }
                    while (left < right && nums[right] == nums[right - 1]) {
                        right--;
                    }
                    right--;
                    left++;
                }
            }
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new ThreeSum().threeSum(new int[]{-1, 0, 1, 2, -1, -4}).toArray()));
        System.out.println(Arrays.toString(new ThreeSum().threeSum(new int[]{}).toArray()));
        System.out.println(Arrays.toString(new ThreeSum().threeSum(new int[]{0}).toArray()));
        System.out.println(Arrays.toString(new ThreeSum().threeSum(new int[]{-4, -2, 1, -5, -4, -4, 4, -2, 0, 4, 0, -2, 3, 1, -5, 0}).toArray()));
    }
}
