package ds.backtrack;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 * 子集II
 * LeetCode 90 https://leetcode-cn.com/problems/subsets-ii/
 *
 * @author yangyi 2020年12月21日15:17:05
 */
public class SubsetsWithDup {

    private List<List<Integer>> result = new LinkedList<>();

    public List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums);
        LinkedList<Integer> track = new LinkedList<>();
        backtrack(nums, 0, track);
        return result;
    }

    private void backtrack(int[] nums, int index, LinkedList<Integer> track) {
        result.add(new LinkedList<>(track));
        for (int i = index; i < nums.length; i++) {
            if (i > index && nums[i] == nums[i - 1]) {
                continue;
            }
            track.add(nums[i]);
            backtrack(nums, i + 1, track);
            track.removeLast();
        }
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new SubsetsWithDup().subsetsWithDup(new int[]{1, 2, 2}).toArray()));
    }
}
