package ds.hashmap.targetofferII011;

import java.util.HashMap;
import java.util.Map;

/**
 * 0和1个数相同的子数组
 * 剑指Offer II 011 https://leetcode-cn.com/problems/A1NYOS/
 *
 * @author yangyi 2022年02月25日16:01:52
 */
public class Solution {

    public int findMaxLength(int[] nums) {
        Map<Integer, Integer> sumsToIndex = new HashMap<>();
        sumsToIndex.put(0, -1);
        int sums = 0;
        int maxLength = 0;
        for (int i = 0; i < nums.length; i++) {
            sums += nums[i] == 0 ? -1 : 1;
            //哈希表的键是从第1个数字开始累加到当前扫描到的数字之和，而值是当前扫描的数字的下标
            if (sumsToIndex.containsKey(sums)) {
                maxLength = Math.max(maxLength, i - sumsToIndex.getOrDefault(sums, 0));
            } else {
                sumsToIndex.put(sums, i);
            }
        }
        return maxLength;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().findMaxLength(new int[]{0, 1}));
        System.out.println(new Solution().findMaxLength(new int[]{0, 1, 0}));
    }
}
