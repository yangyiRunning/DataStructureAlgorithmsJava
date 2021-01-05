package ds.backtrack;

import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

/**
 * 全排列II
 * LeetCode 47 https://leetcode-cn.com/problems/permutations-ii/
 *
 * @author yangyi 2021年01月05日14:58:34
 */
public class PermuteUnique {

    private final List<List<Integer>> result = new LinkedList<>();

    public List<List<Integer>> permuteUnique(int[] nums) {
        Arrays.sort(nums);
        backtrack(nums, new LinkedList<>(), new HashMap<>());
        return result;
    }

    private void backtrack(int[] nums, LinkedList<Integer> track, HashMap<Integer, Boolean> used) {
        if (nums.length == track.size()) {
            result.add(new LinkedList<>(track));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (i > 0 && nums[i - 1] == nums[i] && !used.getOrDefault(i - 1, false)) {
                continue;
            }
            if (!used.getOrDefault(i, false)) {
                used.put(i, true);
                track.add(nums[i]);
                backtrack(nums, track, used);
                track.removeLast();
                used.put(i, false);
            }
        }
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new PermuteUnique().permuteUnique(new int[]{1, 1, 2}).toArray()));
        System.out.println(Arrays.toString(new PermuteUnique().permuteUnique(new int[]{1, 2, 3}).toArray()));
    }
}
