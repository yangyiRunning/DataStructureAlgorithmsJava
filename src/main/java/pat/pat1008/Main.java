package pat.pat1008;

import java.util.Scanner;

/**
 * 1008 数组元素循环右移问题
 * <p>
 * 一个数组A中存有N（>0）个整数，在不允许使用另外数组的前提下，将每个整数循环向右移M（≥0）个位置，即将A中的数据由（A
 * ​0
 * ​​ A
 * ​1
 * ​​ ⋯A
 * ​N−1
 * ​​ ）变换为（A
 * ​N−M
 * ​​ ⋯A
 * ​N−1
 * ​​ A
 * ​0
 * ​​ A
 * ​1
 * ​​ ⋯A
 * ​N−M−1
 * ​​ ）（最后M个数循环移至最前面的M个位置）。如果需要考虑程序移动数据的次数尽量少，要如何设计移动的方法？
 * <p>
 * 输入格式:
 * <p>
 * 每个输入包含一个测试用例，第1行输入N（1≤N≤100）和M（≥0）；第2行输入N个整数，之间用空格分隔。
 * <p>
 * 输出格式:
 * <p>
 * 在一行中输出循环右移M位以后的整数序列，之间用空格分隔，序列结尾不能有多余空格。
 * <p>
 * 输入样例:
 * <p>
 * 6 2
 * 1 2 3 4 5 6
 * 输出样例:
 * <p>
 * 5 6 1 2 3 4
 *
 * @author yangyi 2020年10月16日01:13:22
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
