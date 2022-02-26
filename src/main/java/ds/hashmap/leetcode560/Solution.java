package ds.hashmap.leetcode560;

import java.util.HashMap;
import java.util.Map;

/**
 * 和为 K 的子数组
 * LeetCode 560 https://leetcode-cn.com/problems/subarray-sum-equals-k/
 * 剑指 Offer II 010 https://leetcode-cn.com/problems/QTMn0o/
 *
 * @author yangyi 2022年02月25日15:23:05
 */
public class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> sumToCount = new HashMap<>();
        sumToCount.put(0, 1);
        int sums = 0;
        int count = 0;
        for (int i = 0; i < nums.length; i++) {
            sums += nums[i];
            //哈希表的键是前i个数字之和，值为每个和出现的次数
            //sums - k为前i个数字之和
            count += sumToCount.getOrDefault(sums - k, 0);
            sumToCount.put(sums, sumToCount.getOrDefault(sums, 0) + 1);
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().subarraySum(new int[]{1, 2, 3}, 3));
        System.out.println(new Solution().subarraySum(new int[]{1, 1, 1}, 2));
    }
}
