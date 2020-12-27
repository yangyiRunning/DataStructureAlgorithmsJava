package ds.backtrack;

import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

/**
 * 组合总和II
 * LeetCode 40 https://leetcode-cn.com/problems/combination-sum-ii/
 *
 * @author yangyi 2020年12月28日00:52:38
 */
public class CombinationSum2 {

    private List<List<Integer>> result = new LinkedList<>();

    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        LinkedList<Integer> track = new LinkedList<>();
        HashMap<Integer, Boolean> used = new HashMap<>();
        Arrays.sort(candidates);
        backtrack(candidates, target, 0, 0, track, used);
        return result;
    }

    private void backtrack(int[] candidates, int target, int sum, int startIndex, LinkedList<Integer> track, HashMap<Integer, Boolean> used) {
        if (sum > target) {
            return;
        }
        if (sum == target) {
            result.add(new LinkedList<>(track));
            return;
        }
        for (int i = startIndex; i < candidates.length && sum + candidates[i] <= target; i++) {
            if (i > 0 && candidates[i] == candidates[i - 1] && !used.getOrDefault(i - 1, false)) {
                continue;
            }
            sum += candidates[i];
            used.put(i, true);
            track.add(candidates[i]);
            backtrack(candidates, target, sum, i + 1, track, used);
            track.removeLast();
            used.put(i, false);
            sum -= candidates[i];
        }
    }

    public static void main(String[] args) {
        CombinationSum2 combinationSum2 = new CombinationSum2();
        CombinationSum2 combinationSum22 = new CombinationSum2();
        CombinationSum2 combinationSum222 = new CombinationSum2();
        System.out.println(Arrays.toString(combinationSum2.combinationSum2(new int[]{10, 1, 2, 7, 6, 1, 5}, 8).toArray()));
        System.out.println(Arrays.toString(combinationSum22.combinationSum2(new int[]{2, 5, 2, 1, 2}, 5).toArray()));
        System.out.println(Arrays.toString(combinationSum222.combinationSum2(new int[]{2, 2, 2}, 2).toArray()));
    }
}
