package pat.pat1008;

import java.util.Scanner;

/**
 * 1008 数组元素循环右移问题 (20分)
 * <p>
 * 题目描述: https://pintia.cn/problem-sets/994805260223102976/problems/994805316250615808
 *
 * @author yangyi
 */
public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        //数组n
        int n = scanner.nextInt();
        //右移m位
        int m = scanner.nextInt();
        int[] targets = new int[n];
        for (int i = 0; i < targets.length; i++) {
            targets[i] = scanner.nextInt();
        }

        //数组右移算法
        //1. 反转前k部分
        reserve(targets, 0, n - 1 - m);
        //2. 反转后面部分
        reserve(targets, n - 1 - m + 1, n - 1);
        //3. 整体反转
        reserve(targets, 0, n - 1);

        for (int i = 0; i < targets.length; i++) {
            if (i == targets.length - 1) {
                System.out.println(targets[i]);
            } else {
                System.out.print(targets[i] + " ");
            }
        }
    }

    /**
     * 反转
     */
    static void reserve(int[] array, int p, int q) {
        while (p < q) {
            int temp = array[q];
            array[q] = array[p];
            array[p] = temp;
            p++;
            q--;
        }
    }
}
