package ds;

import java.util.Arrays;

/**
 * 有序数组的平方
 * <p>
 * <p>
 * 给定一个按非递减顺序排序的整数数组 A，返回每个数字的平方组成的新数组，要求也按非递减顺序排序。
 * <p>
 * <p>
 * <p>
 * 示例 1：
 * <p>
 * 输入：[-4,-1,0,3,10]
 * 输出：[0,1,9,16,100]
 * 示例 2：
 * <p>
 * 输入：[-7,-3,2,3,11]
 * 输出：[4,9,9,49,121]
 * <p>
 * <p>
 * 提示：
 * <p>
 * 1 <= A.length <= 10000
 * -10000 <= A[i] <= 10000
 * A 已按非递减顺序排序。
 *
 * @author yangyi 2019年02月16日23:17:48
 */
public class SortedSquares {

    public int[] sortedSquares(int[] A) {
        if (A == null || A.length == 0) {
            return new int[]{};
        }
        for (int i = 0; i < A.length; i++) {
            A[i] *= A[i];
        }
        Arrays.sort(A);
        return A;
    }

    public static void main(String[] args) {
        int[] a = {-4, -1, 0, 3, 10};
        int[] b = {-7, -3, 2, 3, 11};
        SortedSquares sortedSquares = new SortedSquares();
        System.out.println(Arrays.toString(sortedSquares.sortedSquares(a)));
        System.out.println(Arrays.toString(sortedSquares.sortedSquares(b)));
    }
}
