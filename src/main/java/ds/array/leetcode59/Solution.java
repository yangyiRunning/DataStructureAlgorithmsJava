package ds.array.leetcode59;

import java.util.Arrays;

/**
 * 螺旋矩阵 II
 * LeetCode 59 https://leetcode-cn.com/problems/spiral-matrix-ii/
 *
 * @author yangyi 2021年01月17日12:27:33
 */
public class Solution {

    public int[][] generateMatrix(int n) {
        int startx = 0, starty = 0;
        int loop = n / 2;
        int i, j;
        //每一层要遍历的长度
        int offset = 1;
        int value = 1;
        int[][] result = new int[n][n];
        int mid = n / 2;
        while (loop > 0) {
            i = startx;
            j = starty;
            //上行从左到右，左闭右开区间
            for (j = starty; j < starty + n - offset; j++) {
                result[startx][j] = value++;
            }
            //右行从上到下，左闭右开区间
            for (i = startx; i < startx + n - offset; i++) {
                result[i][j] = value++;
            }
            //低行从右到左，左闭右开区间
            for (; j > starty; j--) {
                result[i][j] = value++;
            }
            //左行从下到上，左闭右开区间
            for (; i > startx; i--) {
                result[i][j] = value++;
            }

            //一圈已经走完，接着走下一圈
            loop--;
            startx++;
            starty++;
            offset += 2;
        }

        //如果n为奇数的话，需要单独给最中间的位置赋值
        if (n % 2 != 0) {
            result[mid][mid] = value;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.deepToString(new Solution().generateMatrix(3)));
    }
}
