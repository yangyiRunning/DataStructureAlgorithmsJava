package ds.backtrack;

import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;

/**
 * 递增子序列
 * 491. LeetCode https://leetcode-cn.com/problems/increasing-subsequences/
 *
 * @author yangyi 2021年01月05日01:05:35
 */
public class FindSubsequences {

    private List<List<Integer>> result = new LinkedList<>();

    public List<List<Integer>> findSubsequences(int[] nums) {
        backtrack(nums, 0, new LinkedList<>());
        return result;
    }

    private void backtrack(int[] nums, int startIndex, LinkedList<Integer> track) {
        if (track.size() >= 2) {
            result.add(new LinkedList<>(track));
        }
        HashSet<Integer> set = new HashSet<>();
        for (int i = startIndex; i < nums.length; i++) {
            if (!track.isEmpty() && nums[i] < track.getLast() || set.contains(nums[i])) {
                continue;
            }
            set.add(nums[i]);
            track.add(nums[i]);
            backtrack(nums, i + 1, track);
            track.removeLast();
        }
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new FindSubsequences().findSubsequences(new int[]{4, 6, 7, 7}).toArray()));

    }
}
