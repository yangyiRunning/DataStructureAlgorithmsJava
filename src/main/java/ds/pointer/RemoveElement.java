package ds.pointer;

/**
 * 移除元素
 * LeetCode 27 https://leetcode-cn.com/problems/remove-element/
 *
 * @author yangyi 2020年12月16日16:23:42
 */
public class RemoveElement {

    public int removeElement(int[] nums, int val) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        int slow = 0, fast = 0;
        while (fast < nums.length) {
            if (nums[fast] != val) {
                nums[slow] = nums[fast];
                slow++;
            }
            fast++;
        }
        return slow;
    }

    public static void main(String[] args) {
        int[] res1 = new int[]{3, 2, 2, 3};
        int[] res2 = new int[]{0, 1, 2, 2, 3, 0, 4, 2};
        RemoveElement removeElement = new RemoveElement();
        System.out.println(removeElement.removeElement(res1, 3));
        System.out.println(removeElement.removeElement(res2, 2));
    }
}
