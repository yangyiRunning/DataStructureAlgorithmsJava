package ds.backtrack;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 * 组合总和
 * LeetCode 39 https://leetcode-cn.com/problems/combination-sum/
 *
 * @author yangyi 2020年12月27日23:10:02
 */
public class CombinationSum {

    private List<List<Integer>> result = new LinkedList<>();

    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        LinkedList<Integer> track = new LinkedList<>();
        Arrays.sort(candidates);
        backtrack(candidates, target, 0, 0, track);
        return result;
    }

    private void backtrack(int[] candidates, int target, int sum, int startIndex, LinkedList<Integer> track) {
        if (sum > target) {
            return;
        }
        if (sum == target) {
            result.add(new LinkedList<>(track));
            return;
        }
        //在for循环前直接判断并剪枝
        for (int i = startIndex; i < candidates.length && sum + candidates[i] <= target; i++) {
            sum += candidates[i];
            track.add(candidates[i]);
            backtrack(candidates, target, sum, i, track);
            track.removeLast();
            sum -= candidates[i];
        }
    }

    public static void main(String[] args) {
        CombinationSum combinationSum = new CombinationSum();
        CombinationSum combinationSum2 = new CombinationSum();
        System.out.println(Arrays.toString(combinationSum.combinationSum(new int[]{2, 3, 6, 7}, 7).toArray()));
        System.out.println(Arrays.toString(combinationSum2.combinationSum(new int[]{2, 3, 5}, 8).toArray()));
    }
}
