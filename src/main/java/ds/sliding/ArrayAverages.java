package ds.sliding;

import java.util.Arrays;

/**
 * 求一个数组所有连续K个元素构成的子集的平均数
 *
 * @author yangyi 2020年05月13日23:09:33
 */
public class ArrayAverages {

    private static double[] findAverages(int K, int[] array) {
        double[] averages = new double[array.length - K + 1];
        int windowStart = 0, windowEnd;
        double windowSum = 0;
        for (windowEnd = 0; windowEnd < array.length; windowEnd++) {
            windowSum += array[windowEnd];
            //如果K长度的范围到头了，就可以计算了
            if (windowEnd >= K - 1) {
                averages[windowStart] = windowSum / K;
                windowSum -= array[windowStart];
                windowStart++;
            }
        }
        return averages;
    }

    public static void main(String[] args) {
        int[] array = {1, 3, 2, 6, -1, 4, 1, 8, 2};
        double[] result = findAverages(5,array);
        System.out.println(Arrays.toString(result));
    }
}
