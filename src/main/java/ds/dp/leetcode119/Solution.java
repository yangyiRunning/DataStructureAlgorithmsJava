package ds.dp.leetcode119;

import java.util.ArrayList;
import java.util.List;

/**
 * 杨辉三角 II
 * LeetCode 119 https://leetcode-cn.com/problems/pascals-triangle-ii/
 *
 * @author yangyi 2021年05月02日01:17:50
 */
public class Solution {

    public List<Integer> getRow(int rowIndex) {
        List<Integer> pre = new ArrayList<>();
        for (int i = 0; i <= rowIndex; i++) {
            List<Integer> cur = new ArrayList<>();
            for (int j = 0; j <= i; j++) {
                if (j == 0 || j == i) {
                    cur.add(1);
                } else {
                    int num = pre.get(j-1) + pre.get(j);
                    cur.add(num);
                }
            }
            pre = cur;
        }
        return pre;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().getRow(3).toString());
    }
}
