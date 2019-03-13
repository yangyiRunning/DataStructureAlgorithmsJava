package ds;

import java.util.Arrays;

/**
 * 移动零
 * <p>
 * <p>
 * <p>
 * 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
 * <p>
 * 示例:
 * <p>
 * 输入: [0,1,0,3,12]
 * 输出: [1,3,12,0,0]
 * 说明:
 * <p>
 * 必须在原数组上操作，不能拷贝额外的数组。
 * 尽量减少操作次数。
 *
 * @author yangyi 2019年03月02日19:04:14
 */
public class MoveZeroes {

    private int[] nums;

    public void moveZeroes(int[] nums) {
        int temp = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) {
                nums[temp++] = nums[i];
            }
        }
        while (temp < nums.length) {
            nums[temp++] = 0;
        }
    }

    public static void main(String[] args) {
        MoveZeroes moveZeroes = new MoveZeroes();
        moveZeroes.nums = new int[]{0, 1, 0, 3, 12};
        moveZeroes.moveZeroes(moveZeroes.nums);
        System.out.println(Arrays.toString(moveZeroes.nums));
    }

}
