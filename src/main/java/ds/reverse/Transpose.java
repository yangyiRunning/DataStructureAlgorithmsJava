package ds.reverse;

import java.util.Arrays;

/**
 * 转置矩阵
 *
 * @author yangyi 2019年02月16日23:27:58
 */
public class Transpose {

    public int[][] transpose(int[][] A) {
        if (A == null || A.length == 0 || A[0].length == 0) {
            return new int[][]{};
        }
        int[][] res = new int[A[0].length][A.length];
        for (int i = 0; i < A[0].length; i++) {
            for (int j = 0; j < A.length; j++) {
                res[i][j] = A[j][i];
            }
        }
        return res;
    }

    public static void main(String[] args) {
        int[][] a = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        int[][] b = {{1, 2, 3}, {4, 5, 6}};
        Transpose transpose = new Transpose();
        System.out.println(Arrays.deepToString(transpose.transpose(a)));
        System.out.println(Arrays.deepToString(transpose.transpose(b)));
    }
}
