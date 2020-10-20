package pat.pat1001;

import java.util.Scanner;

/**
 * 1001 害死人不偿命的(3n+1)猜想 (15分)
 * <p>
 * 题目描述: https://pintia.cn/problem-sets/994805260223102976/problems/994805325918486528
 *
 * @author yangyi
 */
public class Main {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (sc.hasNext()) {
            double n = sc.nextDouble();
            int count = 0;
            while (n != 1) {
                if (n % 2 == 0) {
                    n /= 2;
                } else {
                    n = (3 * n + 1) / 2;
                }
                count++;
            }
            System.out.println(count);
        }
    }
}
