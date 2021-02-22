package ds.greedy.leetcode455;

import java.util.Arrays;

/**
 * 分发饼干
 * 455 https://leetcode-cn.com/problems/assign-cookies/
 *
 * @author yangyi 2021年02月22日09:02:42
 */
public class Solution {

    public int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        Arrays.sort(s);
        int index = s.length - 1;
        int result = 0;
        for (int i = g.length - 1; i >= 0; i--) {
            if (index >= 0 && s[index] >= g[i]) {
                result++;
                index--;
            }
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().findContentChildren(new int[]{1, 2, 3}, new int[]{1, 1}));
        System.out.println(new Solution().findContentChildren(new int[]{1, 2}, new int[]{1, 2, 3}));
    }
}
