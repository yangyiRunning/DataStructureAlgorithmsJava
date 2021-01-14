package ds.hashmap.leetcode1;

import ds.InsertSort;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * 两数之和
 * LeetCode 1 https://leetcode-cn.com/problems/two-sum/
 *
 * @author yangyi 2021年01月11日23:58:48
 */
public class Solution {

    /**
     * 解法1:
     * 散列表解法
     * <p>
     * k为具体的值
     * v为值对应的index
     * <p>
     * 关键数据结构就是散列表，用来存储target与目标元素的差，做配对用。
     * 时间复杂度为O(n),空间复杂度为O(n),因为new了额外的散列表，显然不是最优解
     */
    private int[] twoSumByMap(int[] array, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        int[] index = new int[2];
        for (int i = 0; i < array.length; i++) {
            if (map.containsKey(array[i])) {
                //返回之前配对的index
                index[0] = map.get(array[i]);
                //返回当前的index
                index[1] = i;
            } else {
                map.put(target - array[i], i);
            }
        }
        return index;
    }

    /**
     * 解法2:
     * 暴力穷举解法
     * 时间复杂度为O(n^2),空间复杂度为O(1),平方阶恐怖的时间复杂度，显然也不是最优解
     */
    private int[] twoSumByEnum(int[] array, int target) {
        for (int i = 0; i < array.length; i++) {
            for (int j = i + 1; j < array.length; j++) {
                if (array[i] + array[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{-1, -1};
    }

    /**
     * 解法3:
     * 二分查找变种
     * 时间复杂度O(n),空间复杂度O(1),采用双指针的思维实现,为最优解。
     * 但是因为采用的是二分查找,所以有个前提,数据源的数组,必须有序
     */
    private int[] twoSumByTwoPointer(int[] array, int target) {
        int start = 0;
        int end = array.length - 1;
        while (start < end) {
            if (array[start] + array[end] > target) {
                end--;
            } else if (array[start] + array[end] < target) {
                start++;
            } else {
                return new int[]{start, end};
            }
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        int[] ints = {2, 7, 11, 15};
        Solution twoSum = new Solution();
        int target = 9;
        int[] indexs = twoSum.twoSumByMap(ints, target);
        System.out.println("两数之和为" + target + "的索引为:" + Arrays.toString(indexs));
        System.out.println();
        int[] indexs2 = twoSum.twoSumByEnum(ints, target);
        System.out.println("两数之和为" + target + "的索引为:" + Arrays.toString(indexs2));
        System.out.println();
        //采用二分查找的方法时，保证输入的数据有序，所以得先排一下序
        InsertSort insertSort = new InsertSort();
        insertSort.insertSort(ints);
        int[] indexs3 = twoSum.twoSumByTwoPointer(ints, target);
        System.out.println("两数之和为" + target + "的索引为:" + Arrays.toString(indexs3));
    }
}
