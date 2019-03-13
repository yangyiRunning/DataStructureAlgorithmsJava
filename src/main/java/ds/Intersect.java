package ds;

import java.util.*;

/**
 * 两个数组的交集 II
 * <p>
 * <p>
 * 给定两个数组，编写一个函数来计算它们的交集。
 * <p>
 * 示例 1:
 * <p>
 * 输入: nums1 = [1,2,2,1], nums2 = [2,2]
 * 输出: [2,2]
 * 示例 2:
 * <p>
 * 输入: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
 * 输出: [4,9]
 * <p>
 * <p>
 * -------------------------------------------------
 * <p>
 * <p>
 * 说明：
 * <p>
 * 输出结果中每个元素出现的次数，应与元素在两个数组中出现的次数一致。
 * 我们可以不考虑输出结果的顺序。
 * 进阶:
 * <p>
 * 如果给定的数组已经排好序呢？你将如何优化你的算法？
 * 如果 nums1 的大小比 nums2 小很多，哪种方法更优？
 * 如果 nums2 的元素存储在磁盘上，磁盘内存是有限的，并且你不能一次加载所有的元素到内存中，你该怎么办？
 *
 * @author yangyi 2019年03月02日22:00:51
 */
public class Intersect {

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
        Intersect intersect = new Intersect();
        int[] a = {1, 2, 2, 1};
        int[] b = {2, 2};
        int[] a2 = {4, 9, 5};
        int[] b2 = {9, 4, 9, 8, 4};
        System.out.println(Arrays.toString(intersect.intersect(a, b)));
        System.out.println(Arrays.toString(intersect.intersect(a2, b2)));
    }
}
