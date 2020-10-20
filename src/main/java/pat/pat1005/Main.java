package pat.pat1005;

import java.util.*;

/**
 * 1005 继续(3n+1)猜想 (25分)
 * <p>
 * 题目描述: https://pintia.cn/problem-sets/994805260223102976/problems/994805320306507776
 *
 * @author yangyi
 */
public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        //第一行第 1 行给出一个正整数 K (<100)
        int k = scanner.nextInt();
        //第 2 行给出 K 个互不相同的待验证的正整数 n (1<n≤100)的值
        List<Integer> targetNumbers = new LinkedList<>();
        for (int i = 0; i < k; i++) {
            //3 5 6 7 8 11
            targetNumbers.add(scanner.nextInt());
        }

        //对K进行计算并保存结果
        Set<Integer> temps = new LinkedHashSet<>();
        for (Integer targetNumber : targetNumbers) {
            while (targetNumber != 1) {
                if (targetNumber % 2 == 0) {
                    targetNumber /= 2;
                } else {
                    targetNumber = (3 * targetNumber + 1) / 2;
                }
                //暴力穷举罗列所有可能
                temps.add(targetNumber);
            }
        }

        List<Integer> result = new ArrayList<>();
        for (Integer targetNumber : targetNumbers) {
            if (temps.contains(targetNumber)) {
                continue;
            }
            result.add(targetNumber);
        }

        result.sort((o1, o2) -> {
            if (o1 < o2) {
                return 1;
            } else if (o1 > o2) {
                return -1;
            }
            return 0;
        });

        for (int i = 0; i < result.size(); i++) {
            if (i != result.size() - 1) {
                System.out.print(result.get(i) + " ");
            } else {
                System.out.println(result.get(i));
            }
        }

    }
}
