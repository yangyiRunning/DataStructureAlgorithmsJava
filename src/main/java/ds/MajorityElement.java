package ds;

import java.util.Arrays;

/**
 * 求众数
 * <p>
 * 给定一个大小为 n 的数组，找到其中的众数。众数是指在数组中出现次数大于 ⌊ n/2 ⌋ 的元素。
 * <p>
 * 你可以假设数组是非空的，并且给定的数组总是存在众数。
 * <p>
 * 示例 1:
 * <p>
 * 输入: [3,2,3]
 * 输出: 3
 * 示例 2:
 * <p>
 * 输入: [2,2,1,1,1,2,2]
 * 输出: 2
 *
 * @author yangyi 2019年01月26日20:48:43
 */
public class MajorityElement {

    public int majorityElement(int[] nums) {
        //初始化第一个数的值和其对应出现的次数
        int majority = nums[0];
        int count = 1;
        for (int i = 1; i < nums.length; i++) {
            if (majority == nums[i]) {
                count++;
            } else {
                count--;
                if (count == 0) {
                    majority = nums[i + 1];
                }
            }
        }
        return majority;
    }

    public static void main(String[] args) {
        int[] source = {3, 2, 3};
        int[] source2 = {2, 2, 1, 1, 1, 2, 2};
        MajorityElement majorityElement = new MajorityElement();
        System.out.println(Arrays.toString(source) + "这组数中对应的众数为:" + majorityElement.majorityElement(source));
        System.out.println(Arrays.toString(source2) + "这组数中对应的众数为:" + majorityElement.majorityElement(source2));
    }

}
