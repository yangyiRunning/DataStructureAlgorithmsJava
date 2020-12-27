package ds.backtrack;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 * 组合
 * LeetCode 77 https://leetcode-cn.com/problems/combinations/
 *
 * @author yangyi 2020年12月21日16:01:07
 */
public class Combine {

    private List<List<Integer>> result = new LinkedList<>();

    public List<List<Integer>> combine(int n, int k) {
        if (n <= 0 || k <= 0) {
            return result;
        }
        LinkedList<Integer> track = new LinkedList<>();
        backtrack(n, k, 1, track);
        return result;
    }

    private void backtrack(int n, int k, int index, LinkedList<Integer> track) {
        if (track.size() == k) {
            result.add(new LinkedList<>(track));
            return;
        }
        for (int i = index; i <= n; i++) {
            track.add(i);
            backtrack(n, k, i + 1, track);
            track.removeLast();
        }
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new Combine().combine(4, 2).toArray()));
    }
}
