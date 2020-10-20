package pat.pat1010;

import java.util.Scanner;

/**
 * 1010 一元多项式求导 (25分)
 * <p>
 * 题目描述: https://pintia.cn/problem-sets/994805260223102976/problems/994805313708867584
 *
 * @author yangyi
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
