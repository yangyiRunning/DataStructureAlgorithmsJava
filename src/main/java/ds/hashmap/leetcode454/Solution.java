package ds.hashmap.leetcode454;

import java.util.HashMap;

/**
 * 四数相加II
 * LeetCode 454 https://leetcode-cn.com/problems/4sum-ii/
 *
 * @author yangyi 2021年01月12日00:28:36
 */
public class Solution {

    public int fourSumCount(int[] A, int[] B, int[] C, int[] D) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < A.length; i++) {
            for (int j = 0; j < B.length; j++) {
                int sumAB = A[i] + B[j];
                if (map.containsKey(sumAB)) {
                    map.put(sumAB, map.getOrDefault(sumAB, 0) + 1);
                } else {
                    map.put(sumAB, 1);
                }
            }
        }
        int count = 0;
        for (int i = 0; i < C.length; i++) {
            for (int j = 0; j < D.length; j++) {
                int sumCD = 0 - (C[i] + D[j]);
                if (map.containsKey(sumCD)) {
                    count += map.getOrDefault(sumCD, 0);
                }
            }
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().fourSumCount(new int[]{1, 2}, new int[]{-2, -1}, new int[]{-1, 2}, new int[]{0, 2}));
        System.out.println(new Solution().fourSumCount(new int[]{0}, new int[]{0}, new int[]{0}, new int[]{0}));
    }
}
