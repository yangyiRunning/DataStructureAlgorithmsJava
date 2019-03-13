package ds;

import java.util.Arrays;
import java.util.PriorityQueue;

/**
 * 数组中的第K个最大元素
 * <p>
 * <p>
 * <p>
 * 在未排序的数组中找到第 k 个最大的元素。请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。
 * <p>
 * 示例 1:
 * <p>
 * 输入: [3,2,1,5,6,4] 和 k = 2
 * 输出: 5
 * 示例 2:
 * <p>
 * 输入: [3,2,3,1,2,4,5,5,6] 和 k = 4
 * 输出: 4
 *
 * @author yangyi 2019年02月10日22:28:51
 */
public class FindKthLargest {

    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> priorityQueue = new PriorityQueue<>(k);
        for (int i = 0; i < nums.length; i++) {
            if (priorityQueue.size() < k) {
                priorityQueue.offer(nums[i]);
            } else if (nums[i] > priorityQueue.peek()) {
                priorityQueue.poll();
                priorityQueue.offer(nums[i]);
            }
        }
        return priorityQueue.peek();
    }

    public static void main(String[] args) {
        int[] a = {3, 2, 1, 5, 6, 4};
        int[] b = {3, 2, 3, 1, 2, 4, 5, 5, 6};
        FindKthLargest findKthLargest = new FindKthLargest();
        int k = 2;
        int o = 4;
        System.out.println(Arrays.toString(a) + "中的top" + k + "的元素为:" + findKthLargest.findKthLargest(a, k));
        System.out.println(Arrays.toString(b) + "中的top" + o + "的元素为:" + findKthLargest.findKthLargest(b, o));
    }
}
