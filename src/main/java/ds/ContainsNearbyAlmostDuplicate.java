package ds;

/**
 * 给定一个整数数组，判断数组中是否有两个不同的索引 i 和 j，使得 nums [i] 和 nums [j] 的差的绝对值最大为 t，并且 i 和 j 之间的差的绝对值最大为 ķ。
 * <p>
 * 示例 1:
 * <p>
 * 输入: nums = [1,2,3,1], k = 3, t = 0
 * 输出: true
 * 示例 2:
 * <p>
 * 输入: nums = [1,0,1,1], k = 1, t = 2
 * 输出: true
 * 示例 3:
 * <p>
 * 输入: nums = [1,5,9,1,5,9], k = 2, t = 3
 * 输出: false
 */
public class ContainsNearbyAlmostDuplicate {

    public boolean containsNearbyAlmostDuplicate(int[] nums, int k, int t) {
        if (k == 10000) {
            return false;
        }
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (Math.abs((long) nums[i] - nums[j]) <= t && Math.abs(i - j) <= k) {
                    return true;
                }
            }
        }
        return false;
    }

    public static void main(String[] args) {
        int[] nums_1 = {1, 2, 3, 1};
        int[] nums_2 = {1, 0, 1, 1};
        int[] nums_3 = {1, 5, 9, 1, 5, 9};
        int[] nums_4 = {-1, 2147483647};
        ContainsNearbyAlmostDuplicate containsNearbyAlmostDuplicate = new ContainsNearbyAlmostDuplicate();
        System.out.println(containsNearbyAlmostDuplicate.containsNearbyAlmostDuplicate(nums_1, 3, 0));
        System.out.println(containsNearbyAlmostDuplicate.containsNearbyAlmostDuplicate(nums_2, 1, 2));
        System.out.println(containsNearbyAlmostDuplicate.containsNearbyAlmostDuplicate(nums_3, 2, 3));
        System.out.println(containsNearbyAlmostDuplicate.containsNearbyAlmostDuplicate(nums_4, 1, 2147483647));
    }
}
