package ds;

import java.util.*;

/**
 * 前K个高频元素
 * <p>
 * 给定一个非空的整数数组，返回其中出现频率前 k 高的元素。
 * <p>
 * 示例 1:
 * <p>
 * 输入: nums = [1,1,1,2,2,3], k = 2
 * 输出: [1,2]
 * 示例 2:
 * <p>
 * 输入: nums = [1], k = 1
 * 输出: [1]
 * 说明：
 * <p>
 * 你可以假设给定的 k 总是合理的，且 1 ≤ k ≤ 数组中不相同的元素的个数。
 * 你的算法的时间复杂度必须优于 O(n log n) , n 是数组的大小。
 *
 * @author yangyi 2019年02月17日23:40:36
 */
public class TopKFrequent {

    public List<Integer> topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            if (!map.containsKey(nums[i])) {
                map.put(nums[i], 1);
            } else {
                map.put(nums[i], map.get(nums[i]) + 1);
            }
        }
        //按照get出来的元素对应的次数排序
        PriorityQueue<Integer> priorityQueue = new PriorityQueue<>(k,
                new Comparator<Integer>() {
                    @Override
                    public int compare(Integer o1, Integer o2) {
                        return map.get(o1).compareTo(map.get(o2));
                    }
                });
        //将元素加入小顶堆
        for (Map.Entry<Integer, Integer> integerIntegerEntry : map.entrySet()) {
            if (priorityQueue.size() < k) {
                priorityQueue.offer(integerIntegerEntry.getKey());
            } else if (integerIntegerEntry.getValue() > map.get(priorityQueue.peek())) {
                //比较元素出现的次数，如果次数比小顶堆的堆顶大，则取而代之，自己做堆顶
                priorityQueue.poll();
                priorityQueue.offer(integerIntegerEntry.getKey());
            }
        }
        List<Integer> list = new ArrayList<>(k);
        list.addAll(priorityQueue);
        return list;
    }

    public static void main(String[] args) {
        int[] a = {1, 1, 1, 2, 2, 3};
        int[] b = {1};
        int[] c = {4, 1, -1, 2, -1, 2, 3};
        TopKFrequent topKFrequent = new TopKFrequent();
        System.out.println(Arrays.toString(topKFrequent.topKFrequent(a, 2).toArray()));
        System.out.println(Arrays.toString(topKFrequent.topKFrequent(b, 1).toArray()));
        System.out.println(Arrays.toString(topKFrequent.topKFrequent(c, 2).toArray()));
    }
}
