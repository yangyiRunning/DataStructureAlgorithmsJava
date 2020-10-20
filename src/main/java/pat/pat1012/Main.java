package pat.pat1012;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Scanner;

/**
 * 1012 数字分类 (20分)
 * <p>
 * 题目描述: https://pintia.cn/problem-sets/994805260223102976/problems/994805311146147840
 *
 * @author yangyi
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
