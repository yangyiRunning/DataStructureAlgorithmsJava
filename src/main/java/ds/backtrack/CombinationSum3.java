package ds.backtrack;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 * 组合总和 III
 * <p>
 * LeetCode 216 https://leetcode-cn.com/problems/combination-sum-iii/
 *
 * @author yangyi 2020年12月27日14:17:03
 */
public class CombinationSum3 {

    private List<List<Integer>> result = new LinkedList<>();

    public List<List<Integer>> combinationSum3(int k, int n) {
        LinkedList<Integer> track = new LinkedList<>();
        backtrack(0, n, k, 1, track);
        return result;
    }

    private void backtrack(int sum, int targetSum, int k, int startIndex, LinkedList<Integer> track) {
        if (sum > targetSum) {
            return;
        }
        if (track.size() == k) {
            if (sum == targetSum) {
                result.add(new LinkedList<>(track));
            }
            return;
        }
        for (int i = startIndex; i <= 9; i++) {
            sum += i;
            track.add(i);
            backtrack(sum, targetSum, k, i + 1, track);
            track.removeLast();
            sum -= i;
        }
    }

    public static void main(String[] args) {
        CombinationSum3 combinationSum3 = new CombinationSum3();
        CombinationSum3 combinationSum4 = new CombinationSum3();
        System.out.println(Arrays.toString(combinationSum3.combinationSum3(3, 7).toArray()));
        System.out.println(Arrays.toString(combinationSum4.combinationSum3(3, 9).toArray()));
    }
}
