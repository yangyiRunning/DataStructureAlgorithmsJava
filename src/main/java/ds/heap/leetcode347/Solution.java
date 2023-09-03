package ds.heap.leetcode347;

import java.util.*;

/**
 * 前 K 个高频元素
 * LeetCode 347 https://leetcode-cn.com/problems/top-k-frequent-elements/
 *
 * @author yangyi 2007月12日16:00:48git
 */
public class Solution {

    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> map = new LinkedHashMap<>();
        for (int i = 0; i < nums.length; i++) {
            if (map.containsKey(nums[i])) {
                map.put(nums[i], map.getOrDefault(nums[i], -1) + 1);
            } else {
                map.put(nums[i], 1);
            }
        }
        PriorityQueue<Integer> priorityQueue = new PriorityQueue<>(
                k, Comparator.comparing(o -> map.getOrDefault(o, -1)));
        for (Map.Entry<Integer, Integer> kv : map.entrySet()) {
            if (priorityQueue.size() < k) {
                priorityQueue.offer(kv.getKey());
            } else if (kv.getValue() > map.getOrDefault(priorityQueue.peek(), -1)) {
                priorityQueue.poll();
                priorityQueue.offer(kv.getKey());
            }
        }
        return priorityQueue.stream().mapToInt(value -> value).toArray();
    }

    public static void main(String[] args) {
        int[] a = {1, 1, 1, 2, 2, 3};
        int[] b = {1};
        int[] c = {4, 1, -1, 2, -1, 2, 3};
        Solution solution = new Solution();
        System.out.println(Arrays.toString(solution.topKFrequent(a, 2)));
        System.out.println(Arrays.toString(solution.topKFrequent(b, 1)));
        System.out.println(Arrays.toString(solution.topKFrequent(c, 2)));
    }
}
