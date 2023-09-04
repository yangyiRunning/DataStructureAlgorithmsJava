package ds.array.leetcode350;

import java.util.*;

/**
 * 350. 两个数组的交集 II
 * https://leetcode.cn/problems/intersection-of-two-arrays-ii/description/
 *
 * @author yangyi 2023年09月04日17:17:39
 */
public class Solution {

    public int[] intersect(int[] nums1, int[] nums2) {
        //key为数字，value为次数
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums1.length; i++) {
            if (map.containsKey(nums1[i])) {
                map.put(nums1[i], map.get(nums1[i]) + 1);
            } else {
                map.put(nums1[i], 1);
            }
        }
        List<Integer> results = new ArrayList<>();
        for (int i = 0; i < nums2.length; i++) {
            if (map.containsKey(nums2[i]) && map.get(nums2[i]) > 0) {
                map.put(nums2[i], map.get(nums2[i]) - 1);
                results.add(nums2[i]);
            }
        }
        int[] arrays = new int[results.size()];
        for (int i = 0; i < arrays.length; i++) {
            arrays[i] = results.get(i);
        }
        return arrays;
    }

    public static void main(String[] args) {
        Solution intersect = new Solution();
        int[] a = {1, 2, 2, 1};
        int[] b = {2, 2};
        int[] a2 = {4, 9, 5};
        int[] b2 = {9, 4, 9, 8, 4};
        System.out.println(Arrays.toString(intersect.intersect(a, b)));
        System.out.println(Arrays.toString(intersect.intersect(a2, b2)));
    }
}
