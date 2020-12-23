package ds.backtrack;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 * 全排列
 * LeetCode 46 https://leetcode-cn.com/problems/permutations/
 *
 * @author yangyi 2020年12月17日11:13:47
 */
public class Permute {

    private List<List<Integer>> result = new LinkedList<>();

    public List<List<Integer>> permute(int[] nums) {
        LinkedList<Integer> track = new LinkedList<>();
        backtrack(track, nums);
        return result;
    }

    public void backtrack(LinkedList<Integer> track, int[] nums) {
        if (track.size() == nums.length) {
            result.add(new LinkedList<>(track));
            return;
        }
        for (int num : nums) {
            if (track.contains(num)) {
                continue;
            }
            track.add(num);
            backtrack(track, nums);
            track.removeLast();
        }
    }

    public static void main(String[] args) {
        Permute permute = new Permute();
        System.out.println(Arrays.toString(permute.permute(new int[]{1, 2, 3}).toArray()));
    }
}
