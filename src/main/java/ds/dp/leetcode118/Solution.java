package ds.dp.leetcode118;

import java.util.ArrayList;
import java.util.List;

/**
 * 杨辉三角
 * LeetCode 118 https://leetcode-cn.com/problems/pascals-triangle/
 *
 * @author yangyi 2021年05月02日00:56:26
 */
public class Solution {

    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < numRows; i++) {
            List<Integer> level = new ArrayList<>();
            for (int j = 0; j <= i; j++) {
                if (j == 0 || j == i) {
                    level.add(1);
                } else {
                    int num = result.get(i-1).get(j) + result.get(i-1).get(j-1);
                    level.add(num);
                }
            }
            result.add(level);
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().generate(5).toString());
    }
}
