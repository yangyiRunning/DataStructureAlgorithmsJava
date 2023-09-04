package ds.array.leetcode74;

/**
 * 74. 搜索二维矩阵
 * https://leetcode.cn/problems/search-a-2d-matrix/
 *
 * @author yangyi 2023年09月04日11:14:35
 */
public class Solution {

    /**
     * @param matrix 待查找的目标二维数组
     * @param target 所要查找的元素
     * @return 返回是否查找到
     */
    public boolean searchMatrix(int[][] matrix, int target) {
        boolean isFind = false;
        // 二维数组当中的行数
        int rows = matrix.length;
        if (rows == 0) {
            return isFind;
        }
        // 二维数组当中的列数
        int columns = matrix[0].length;
        if (matrix != null && rows > 0 && columns > 0) {
            int row = 0;
            int column = columns - 1;
            //如果行列数都在范围内，则循环
            while (row < rows && column >= 0) {
                if (target < matrix[row][column]) {
                    column--;
                } else if (target > matrix[row][column]) {
                    row++;
                } else {
                    //找到了就直接跳出循环
                    isFind = true;
                    break;
                }
            }
        }
        return isFind;
    }

    public static void main(String[] args) {
        int[][] matrix = new int[10][10];
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                matrix[i][j] = j;
            }
        }
        System.out.println("把构造好的二维数组输出来看一下:");
        for (int[] ints : matrix) {
            for (int anInt : ints) {
                System.out.println(anInt);
            }
            System.out.println();
        }
        Solution findInDoubleArray = new Solution();
        int target1 = 6;
        int target2 = 8;
        int target3 = 0;
        int target4 = 66;
        int target5 = -1;
        System.out.println("查找" + target1 + "的结果为:" + findInDoubleArray.searchMatrix(matrix, target1));
        System.out.println("查找" + target2 + "的结果为:" + findInDoubleArray.searchMatrix(matrix, target2));
        System.out.println("查找" + target3 + "的结果为:" + findInDoubleArray.searchMatrix(matrix, target3));
        System.out.println("查找" + target4 + "的结果为:" + findInDoubleArray.searchMatrix(matrix, target4));
        System.out.println("查找" + target5 + "的结果为:" + findInDoubleArray.searchMatrix(matrix, target5));
    }
}
