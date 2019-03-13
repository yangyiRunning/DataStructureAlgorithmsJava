package ds;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * 在一个固定大小的滚动窗口(此处的滚动窗口可以理解为屏幕)中，输出每次滚动时屏幕当中的最大值。
 * <p>
 * 示例:
 * <p>
 * 输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3
 * 输出: [3,3,5,5,6,7]
 * 解释:
 * <p>
 * 滑动窗口的位置                最大值
 * ---------------               -----
 * [1  3  -1] -3  5  3  6  7       3
 * 1 [3  -1  -3] 5  3  6  7       3
 * 1  3 [-1  -3  5] 3  6  7       5
 * 1  3  -1 [-3  5  3] 6  7       5
 * 1  3  -1  -3 [5  3  6] 7       6
 * 1  3  -1  -3  5 [3  6  7]      7
 * <p>
 * Created by yangyi on 2019/1/24.
 */
public class MaxSlidingWindow {

    //关键1: 窗口中保存的元素的下标，window只有k大，i-k就代表着window的左边界
    private Deque<Integer> windows = new ArrayDeque<>();

    public int[] maxSlidingWindow(int[] nums, int k) {
        //有效性判断
        if (nums == null || nums.length <= 0) {
            return new int[]{};
        }
        //关键2: result保存的是最终输出的结果，即为一串数字
        int[] result = new int[nums.length - k + 1];
        for (int i = 0; i < nums.length; i++) {
            //由于window的移动使得有元素超出了左边界，超出部分就不管了，超出就直接移走
            if (i >= k && windows.peekFirst() <= i - k) {
                windows.pollFirst();
            }
            //新入队的元素nums[i]和window中下标对应的元素依次比较，如果比window下标对应的元素大，就将其踢走
            while (!windows.isEmpty() && nums[windows.peekLast()] <= nums[i]) {
                windows.pollLast();
            }
            //清理完比新加入的元素小的元素之后，将此时元素对应的下标保存到window中，注意window中保存的是下标
            windows.add(i);
            //i为window的右边界往后
            if (i >= k - 1) {
                //左边界保存的永远是最大的
                result[i - k + 1] = nums[windows.peekFirst()];
            }
        }
        //输出最终保存下来的结果
        return result;
    }

    public static void main(String[] args) {
        int[] arrays = new int[]{1, 3, -1, -3, 5, 3, 6, 7};
        MaxSlidingWindow maxSlidingWindow = new MaxSlidingWindow();
        int[] result = maxSlidingWindow.maxSlidingWindow(arrays, 3);
        for (int i : result) {
            System.out.println(i);
        }
    }
}
