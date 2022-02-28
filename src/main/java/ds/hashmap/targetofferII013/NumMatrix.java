package ds.hashmap.targetofferII013;

/**
 * 二维子矩阵的和
 * 剑指 Offer II 013 https://leetcode-cn.com/problems/O4NDxx/
 *
 * @author yangyi 2022年02月25日17:04:09
 */
public class NumMatrix {

    private int[][] sums;

    public NumMatrix(int[][] matrix) {
        if (matrix.length == 0 || matrix[0].length == 0) {
            return;
        }
        sums = new int[matrix.length + 1][matrix[0].length + 1];
        for (int i = 0; i < matrix.length; i++) {
            int rowSums = 0;
            for (int j = 0; j < matrix[0].length; j++) {
                //rowSums为最后一行的和
                //此处为二维矩阵的求和方式
                rowSums += matrix[i][j];
                sums[i + 1][j + 1] = sums[i][j + 1] + rowSums;
            }
        }
    }

    public int sumRegion(int row1, int col1, int row2, int col2) {
        //此处为二维矩阵的特定范围中的矩阵的求和方式
        return sums[row2 + 1][col2 + 1] - sums[row2 + 1][col1] - sums[row1][col2 + 1] + sums[row1][col1];
    }

    public static void main(String[] args) {
        int[][] matrix = {
                {3, 0, 1, 4, 2},
                {5, 6, 3, 2, 1},
                {1, 2, 0, 1, 5},
                {4, 1, 0, 1, 7},
                {1, 0, 3, 0, 5}};
        NumMatrix numMatrix = new NumMatrix(matrix);
        System.out.println(numMatrix.sumRegion(2, 1, 4, 3));
        System.out.println(numMatrix.sumRegion(1, 1, 2, 2));
        System.out.println(numMatrix.sumRegion(1, 2, 2, 4));
    }

}
