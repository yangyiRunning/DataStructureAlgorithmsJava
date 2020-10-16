package pat.pat1012;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Scanner;

/**
 * 1012 数字分类
 * <p>
 * 给定一系列正整数，请按要求对数字进行分类，并输出以下 5 个数字：
 * <p>
 * A
 * ​1
 * ​​  = 能被 5 整除的数字中所有偶数的和；
 * A
 * ​2
 * ​​  = 将被 5 除后余 1 的数字按给出顺序进行交错求和，即计算 n
 * ​1
 * ​​ −n
 * ​2
 * ​​ +n
 * ​3
 * ​​ −n
 * ​4
 * ​​ ⋯；
 * A
 * ​3
 * ​​  = 被 5 除后余 2 的数字的个数；
 * A
 * ​4
 * ​​  = 被 5 除后余 3 的数字的平均数，精确到小数点后 1 位；
 * A
 * ​5
 * ​​  = 被 5 除后余 4 的数字中最大数字。
 * 输入格式：
 * <p>
 * 每个输入包含 1 个测试用例。每个测试用例先给出一个不超过 1000 的正整数 N，随后给出 N 个不超过 1000 的待分类的正整数。数字间以空格分隔。
 * <p>
 * 输出格式：
 * <p>
 * 对给定的 N 个正整数，按题目要求计算 A
 * ​1
 * ​​ ~A
 * ​5
 * ​​  并在一行中顺序输出。数字间以空格分隔，但行末不得有多余空格。
 * <p>
 * 若其中某一类数字不存在，则在相应位置输出 N。
 * <p>
 * 输入样例 1：
 * <p>
 * 13 1 2 3 4 5 6 7 8 9 10 20 16 18
 * 输出样例 1：
 * <p>
 * 30 11 2 9.7 9
 * 输入样例 2：
 * <p>
 * 8 1 2 4 5 6 7 9 16
 * 输出样例 2：
 * <p>
 * N 11 2 N 9
 *
 * @author yangyi 2020年10月16日17:42:43
 */
public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Integer> data = new ArrayList<>(n);
        for (int i = 0; i < n; i++) {
            data.add(scanner.nextInt());
        }
        int a1 = 0, a2 = 0, a3 = 0, a5 = Integer.MIN_VALUE;
        List<Integer> a2_array = new LinkedList<>();
        List<Integer> a4_array = new LinkedList<>();
        boolean haveA2 = false;
        for (int target : data) {
            if ((target % 5 == 0) && (target % 2 == 0)) {
                a1 += target;
            } else if (target % 5 == 1) {
                a2_array.add(target);
                haveA2 = true;
            } else if (target % 5 == 2) {
                a3++;
            } else if (target % 5 == 3) {
                a4_array.add(target);
            } else if (target % 5 == 4) {
                if (target > a5) {
                    a5 = target;
                }
            }
        }
        //a2
        for (int i = 0; i < a2_array.size(); i++) {
            if (i % 2 != 0) {
                a2_array.set(i, -a2_array.get(i));
            }
            a2 += a2_array.get(i);
        }
        //a4
        double sum = 0;
        for (Integer integer : a4_array) {
            sum += integer;
        }
        //print
        System.out.print(a1 != 0 ? a1 + " " : "N ");
        System.out.print(haveA2 ? a2 + " " : "N ");
        System.out.print(a3 != 0 ? a3 + " " : "N ");
        System.out.print(a4_array.size() != 0 ? String.format("%.1f", sum / a4_array.size()) + " " : "N ");
        System.out.print(a5 != Integer.MIN_VALUE ? a5 : "N");
    }

}
