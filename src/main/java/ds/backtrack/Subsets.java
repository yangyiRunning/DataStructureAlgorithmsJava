package ds.backtrack;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 * 子集
 * LeetCode 78 https://leetcode-cn.com/problems/subsets/
 *
 * @author yangyi 2020年12月21日14:41:03
 */
public class Subsets {

    private List<List<Integer>> result = new LinkedList<>();

    public List<List<Integer>> subsets(int[] nums) {
        LinkedList<Integer> track = new LinkedList<>();
        backtrack(nums, 0, track);
        return result;
    }

    private void backtrack(int[] nums, int start, LinkedList<Integer> track) {
        result.add(new LinkedList<>(track));
        for (int i = start; i < nums.length; i++) {
            track.add(nums[i]);
            backtrack(nums, i + 1, track);
            track.removeLast();
        }
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new Subsets().subsets(new int[]{1, 2, 3}).toArray()));
    }
}
