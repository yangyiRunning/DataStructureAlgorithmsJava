package ds.hashmap.leetcode349;

import java.util.Arrays;
import java.util.HashSet;

/**
 * 两个数组的交集
 * LeetCode 349  https://leetcode-cn.com/problems/intersection-of-two-arrays/
 *
 * @author yangyi 2021年01月06日01:33:56
 */
public class Solution {

    public int[] intersection(int[] nums1, int[] nums2) {
        HashSet<Integer> record = new HashSet<>();
        HashSet<Integer> result = new HashSet<>();
        for (int i = 0; i < nums1.length; i++) {
            record.add(nums1[i]);
        }
        for (int i = 0; i < nums2.length; i++) {
            if (record.contains(nums2[i])) {
                result.add(nums2[i]);
            }
        }
        Integer[] integers = result.toArray(new Integer[0]);
        int[] array = new int[integers.length];
        for (int i = 0; i < integers.length; i++) {
            array[i] = integers[i];
        }
        return array;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(new Solution().intersection(new int[]{1, 2, 2, 1}, new int[]{2, 2})));
        System.out.println(Arrays.toString(new Solution().intersection(new int[]{4, 9, 5}, new int[]{9, 4, 9, 8, 4})));
    }
}
