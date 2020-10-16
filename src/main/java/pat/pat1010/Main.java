package pat.pat1010;

import java.util.Scanner;

/**
 * 1010 一元多项式求导
 * <p>
 * 设计函数求一元多项式的导数。（注：x
 * ​n
 * ​​ （n为整数）的一阶导数为nx
 * ​n−1
 * ​​ 。）
 * <p>
 * 输入格式:
 * <p>
 * 以指数递降方式输入多项式非零项系数和指数（绝对值均为不超过 1000 的整数）。数字间以空格分隔。
 * <p>
 * 输出格式:
 * <p>
 * 以与输入相同的格式输出导数多项式非零项的系数和指数。数字间以空格分隔，但结尾不能有多余空格。注意“零多项式”的指数和系数都是 0，但是表示为 0 0。
 * <p>
 * 输入样例:
 * <p>
 * 3 4 -5 2 6 1 -2 0
 * 输出样例:
 * <p>
 * 12 3 -10 1 6 0
 *
 * @author yangyi 2020年10月16日11:25:38
 */

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);

        boolean isHaveOutput = false;
        while (in.hasNext()) {
            int coef = in.nextInt();
            int expon = in.nextInt();

            if (coef * expon != 0) {
                if (isHaveOutput) {
                    System.out.print(" ");
                } else {
                    isHaveOutput = true;
                }

                System.out.print(coef * expon + " " + (expon - 1));
            }
        }
        in.close();

        if (!isHaveOutput) {
            System.out.print("0 0");
        }
    }
}
